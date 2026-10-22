import fs from "node:fs/promises";
import path from "node:path";

/**
 * Tiny key-value layer behind the admin panel.
 *
 *  - Production: Upstash Redis over its REST API (add it from the Vercel dashboard, Storage tab).
 *  - Local development: a JSON file in `.data/` (git-ignored), so nothing needs to be set up.
 *  - Production without Redis: read-only. Visitors still see the built-in content, and the admin
 *    panel explains that saving needs a database.
 */
export interface Store {
  readonly kind: "redis" | "file" | "none";
  readonly writable: boolean;
  /** `cached` lets the public pages reuse the value for a minute (and be built ahead of time) instead of asking the database on every visit. */
  get(key: string, opts?: { cached?: boolean }): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, field: string, value: string): Promise<void>;
  hdel(key: string, field: string): Promise<void>;
  hgetall(key: string): Promise<Record<string, string>>;
  /** Pushes to the head of a list and keeps only the newest `keep` entries. */
  lpush(key: string, value: string, keep: number): Promise<void>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  /** Increments a counter that expires after `ttlSeconds` (set on first increment). */
  incr(key: string, ttlSeconds: number): Promise<number>;
  /** Saves a value that deletes itself after `ttlSeconds` (used for short-lived answer caches). */
  setex(key: string, value: string, ttlSeconds: number): Promise<void>;
  /** Reads a value saved with `setex`; null once it has expired. */
  getTemp(key: string): Promise<string | null>;
}

export class StoreUnavailableError extends Error {
  constructor() {
    super("No database is connected, so changes cannot be saved yet.");
    this.name = "StoreUnavailableError";
  }
}

/* ------------------------------------------------------------------ Upstash Redis (REST) */

/**
 * A server that sat idle can find the connection to the database already closed ("fetch failed", "write EPIPE" or
 * "ECONNRESET"). That is not a real failure, so the same request is simply sent once more on a fresh connection.
 */
async function retried<T>(run: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await run();
    } catch (error) {
      // "fetch failed" is a TypeError; a connection that hangs is cut by the time limit on each request.
      const hung = error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError");
      if ((!(error instanceof TypeError) && !hung) || attempt >= 3) throw error;
      await new Promise((r) => setTimeout(r, 120 * attempt));
    }
  }
}

function redisStore(url: string, token: string): Store {
  const base = url.replace(/\/$/, "");

  function request<T>(args: (string | number)[], init: { cache: "no-store" } | { next: { revalidate: number; tags: string[] } }): Promise<T> {
    return retried(() => send<T>(args, init));
  }

  async function send<T>(args: (string | number)[], init: { cache: "no-store" } | { next: { revalidate: number; tags: string[] } }): Promise<T> {
    const res = await fetch(base, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(5000),
      ...init,
    });
    const json = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
    if (!res.ok || json.error) throw new Error(json.error || `Redis request failed (${res.status})`);
    return json.result as T;
  }

  const cmd = <T = unknown>(...args: (string | number)[]): Promise<T> => request<T>(args, { cache: "no-store" });

  function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
    return retried(() => sendPipeline(commands));
  }

  async function sendPipeline(commands: (string | number)[][]): Promise<unknown[]> {
    const res = await fetch(`${base}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const json = (await res.json().catch(() => [])) as { result?: unknown; error?: string }[];
    if (!res.ok || !Array.isArray(json)) throw new Error(`Redis request failed (${res.status})`);
    const failed = json.find((r) => r.error);
    if (failed) throw new Error(failed.error);
    return json.map((r) => r.result);
  }

  return {
    kind: "redis",
    writable: true,
    get: (key, opts) =>
      opts?.cached
        ? request<string | null>(["GET", key], { next: { revalidate: 60, tags: ["site-content"] } })
        : cmd<string | null>("GET", key),
    set: async (key, value) => {
      await cmd("SET", key, value);
    },
    del: async (key) => {
      await cmd("DEL", key);
    },
    hget: (key, field) => cmd<string | null>("HGET", key, field),
    hset: async (key, field, value) => {
      await cmd("HSET", key, field, value);
    },
    hdel: async (key, field) => {
      await cmd("HDEL", key, field);
    },
    hgetall: async (key) => {
      const flat = (await cmd<string[] | null>("HGETALL", key)) ?? [];
      const out: Record<string, string> = {};
      for (let i = 0; i + 1 < flat.length; i += 2) out[flat[i]] = flat[i + 1];
      return out;
    },
    lpush: async (key, value, keep) => {
      await pipeline([
        ["LPUSH", key, value],
        ["LTRIM", key, 0, keep - 1],
      ]);
    },
    lrange: async (key, start, stop) => (await cmd<string[] | null>("LRANGE", key, start, stop)) ?? [],
    incr: async (key, ttlSeconds) => {
      const [count] = (await pipeline([
        ["INCR", key],
        ["EXPIRE", key, ttlSeconds, "NX"],
      ])) as number[];
      return Number(count);
    },
    setex: async (key, value, ttlSeconds) => {
      await cmd("SET", key, value, "EX", ttlSeconds);
    },
    getTemp: (key) => cmd<string | null>("GET", key),
  };
}

/* ------------------------------------------------------------------ local JSON file */

interface FileData {
  strings: Record<string, string>;
  hashes: Record<string, Record<string, string>>;
  lists: Record<string, string[]>;
  counters: Record<string, { n: number; exp: number }>;
  temp?: Record<string, { v: string; exp: number }>;
}

function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", "store.json");
  let cache: FileData | null = null;
  let queue: Promise<unknown> = Promise.resolve();

  // Read fresh every time: it is only used while developing, and it keeps the file the single source of truth.
  async function load(): Promise<FileData> {
    cache = null;
    try {
      cache = JSON.parse(await fs.readFile(file, "utf-8")) as FileData;
    } catch {
      cache = { strings: {}, hashes: {}, lists: {}, counters: {} };
    }
    cache.strings ??= {};
    cache.hashes ??= {};
    cache.lists ??= {};
    cache.counters ??= {};
    cache.temp ??= {};
    return cache;
  }

  async function persist(): Promise<void> {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(cache), "utf-8");
  }

  // Serialises read-modify-write so two requests cannot overwrite each other.
  function run<T>(fn: (d: FileData) => T | Promise<T>, write: boolean): Promise<T> {
    const next = queue.then(async () => {
      const d = await load();
      const result = await fn(d);
      if (write) await persist();
      return result;
    });
    queue = next.catch(() => undefined);
    return next;
  }

  return {
    kind: "file",
    writable: true,
    get: (key) => run((d) => d.strings[key] ?? null, false),
    set: (key, value) => run((d) => void (d.strings[key] = value), true),
    del: (key) =>
      run((d) => {
        delete d.strings[key];
        delete d.hashes[key];
        delete d.lists[key];
        delete d.counters[key];
      }, true),
    hget: (key, field) => run((d) => d.hashes[key]?.[field] ?? null, false),
    hset: (key, field, value) =>
      run((d) => {
        (d.hashes[key] ??= {})[field] = value;
      }, true),
    hdel: (key, field) =>
      run((d) => {
        if (d.hashes[key]) delete d.hashes[key][field];
      }, true),
    hgetall: (key) => run((d) => ({ ...(d.hashes[key] ?? {}) }), false),
    lpush: (key, value, keep) =>
      run((d) => {
        const l = (d.lists[key] ??= []);
        l.unshift(value);
        d.lists[key] = l.slice(0, keep);
      }, true),
    lrange: (key, start, stop) =>
      run((d) => {
        const l = d.lists[key] ?? [];
        return l.slice(start, stop < 0 ? undefined : stop + 1);
      }, false),
    incr: (key, ttlSeconds) =>
      run((d) => {
        const now = Date.now();
        const c = d.counters[key];
        if (!c || c.exp < now) {
          d.counters[key] = { n: 1, exp: now + ttlSeconds * 1000 };
          return 1;
        }
        c.n += 1;
        return c.n;
      }, true),

    setex: (key, value, ttlSeconds) =>
      run((d) => {
        d.temp ??= {};
        d.temp[key] = { v: value, exp: Date.now() + ttlSeconds * 1000 };
      }, true),

    getTemp: (key) =>
      run((d) => {
        const hit = d.temp?.[key];
        return hit && hit.exp > Date.now() ? hit.v : null;
      }, false),
  };
}

/* ------------------------------------------------------------------ read-only fallback */

function unavailableStore(): Store {
  const fail = () => Promise.reject(new StoreUnavailableError());
  return {
    kind: "none",
    writable: false,
    get: async () => null,
    set: fail,
    del: fail,
    hget: async () => null,
    hset: fail,
    hdel: fail,
    hgetall: async () => ({}),
    lpush: fail,
    lrange: async () => [],
    incr: async () => 1,
    setex: async () => undefined,
    getTemp: async () => null,
  };
}

/* ------------------------------------------------------------------ pick one */

/**
 * Finds the Redis REST address and token. Vercel's Upstash integration names them KV_REST_API_URL /
 * KV_REST_API_TOKEN, optionally with a custom prefix such as STORAGE_KV_REST_API_URL.
 */
function redisEnv(): { url?: string; token?: string } {
  const env = process.env;
  const find = (suffixes: string[]) => {
    for (const key of Object.keys(env)) {
      if (suffixes.some((s) => key === s || key.endsWith(`_${s}`)) && env[key]) return env[key];
    }
    return undefined;
  };
  return {
    url: find(["UPSTASH_REDIS_REST_URL", "KV_REST_API_URL"]),
    token: find(["UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN"]),
  };
}

const globalForStore = globalThis as unknown as { __rsStore?: Store; __rsStoreVersion?: number };
const STORE_VERSION = 2;

export function getStore(): Store {
  if (globalForStore.__rsStore && globalForStore.__rsStoreVersion === STORE_VERSION) return globalForStore.__rsStore;

  const { url, token } = redisEnv();

  let store: Store;
  if (url && token) store = redisStore(url, token);
  else if (process.env.NODE_ENV === "production" || process.env.VERCEL) store = unavailableStore();
  else store = fileStore();

  globalForStore.__rsStore = store;
  globalForStore.__rsStoreVersion = STORE_VERSION;
  return store;
}

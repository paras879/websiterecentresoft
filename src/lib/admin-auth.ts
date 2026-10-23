import crypto from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { getStore } from "./store";

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const COOKIE = "rs_admin";
/** A sign-in ends after this long without activity. The open panel renews it while someone is working in it. */
export const IDLE_SECONDS = 20 * 60;
const CREDENTIALS_KEY = "admin:credentials";

/* ------------------------------------------------------------------ secrets & credentials */

const globalForAuth = globalThis as unknown as { __rsDevSecret?: string };

export function sessionSecret(): string | null {
  const fromEnv = process.env.ADMIN_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;
  if (process.env.NODE_ENV === "production") return null;
  // Local development only: a throw-away secret, so sessions simply end when the server restarts.
  globalForAuth.__rsDevSecret ??= crypto.randomBytes(32).toString("hex");
  return globalForAuth.__rsDevSecret;
}

interface StoredCredentials {
  username: string;
  salt: string;
  hash: string;
}

async function storedCredentials(): Promise<StoredCredentials | null> {
  try {
    const raw = await getStore().get(CREDENTIALS_KEY);
    return raw ? (JSON.parse(raw) as StoredCredentials) : null;
  } catch {
    return null;
  }
}

export interface AdminStatus {
  /** True when a username and password exist (stored, or from the environment). */
  configured: boolean;
  /** True when the session secret is available. */
  secretOk: boolean;
  source: "panel" | "environment" | "none";
}

export async function adminStatus(): Promise<AdminStatus> {
  const stored = await storedCredentials();
  const envOk = Boolean(process.env.ADMIN_PASSWORD);
  return {
    configured: Boolean(stored) || envOk,
    secretOk: sessionSecret() !== null,
    source: stored ? "panel" : envOk ? "environment" : "none",
  };
}

export async function adminUsername(): Promise<string> {
  const stored = await storedCredentials();
  return stored?.username ?? (process.env.ADMIN_USERNAME || "admin");
}

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

function safeEqual(a: string, b: string): boolean {
  return crypto.timingSafeEqual(sha(a), sha(b));
}

/** Resolves the current admin identity, or null when none is set up. */
async function currentIdentity(): Promise<{ username: string; fingerprint: string; check: (pw: string) => Promise<boolean> } | null> {
  const stored = await storedCredentials();
  if (stored) {
    return {
      username: stored.username,
      fingerprint: stored.hash.slice(0, 16),
      check: async (pw) => {
        const derived = await scrypt(pw, Buffer.from(stored.salt, "hex"), 64);
        const expected = Buffer.from(stored.hash, "hex");
        return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
      },
    };
  }
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword) {
    return {
      username: process.env.ADMIN_USERNAME || "admin",
      fingerprint: sha(envPassword).toString("hex").slice(0, 16),
      check: async (pw) => safeEqual(pw, envPassword),
    };
  }
  return null;
}

export async function verifyLogin(username: string, password: string): Promise<string | null> {
  const identity = await currentIdentity();
  if (!identity) return null;
  const userOk = safeEqual(username.trim().toLowerCase(), identity.username.toLowerCase());
  const passOk = await identity.check(password);
  return userOk && passOk ? identity.username : null;
}

export async function verifyCurrentPassword(password: string): Promise<boolean> {
  const identity = await currentIdentity();
  return identity ? identity.check(password) : false;
}

/** Saves a new username and password (hashed) in the store. Ends every existing session. */
export async function saveCredentials(username: string, password: string): Promise<void> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  const value: StoredCredentials = {
    username: username.trim(),
    salt: salt.toString("hex"),
    hash: hash.toString("hex"),
  };
  await getStore().set(CREDENTIALS_KEY, JSON.stringify(value));
}

/* ------------------------------------------------------------------ session cookie */

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function createAdminSession(username: string): Promise<void> {
  const secret = sessionSecret();
  const identity = await currentIdentity();
  if (!secret || !identity) throw new Error("Admin is not configured");
  const payload = b64(
    JSON.stringify({
      u: username,
      pv: identity.fingerprint,
      exp: Math.floor(Date.now() / 1000) + IDLE_SECONDS,
    }),
  );
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // No maxAge: a session cookie, so closing the browser signs the person out.
  });
}

/** Gives a signed-in administrator another 20 minutes. Returns false when nobody is signed in. */
export async function renewAdminSession(): Promise<boolean> {
  if (!(await isAuthenticatedAdmin())) return false;
  await createAdminSession(await adminUsername());
  return true;
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const secret = sessionSecret();
    if (!secret) return false;
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return false;
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;
    const expected = sign(payload, secret);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      pv: string;
      exp: number;
    };
    const now = Date.now() / 1000;
    // Older sign-ins were issued for days; only tokens that end within the idle window are accepted now.
    if (!data.exp || data.exp < now || data.exp > now + IDLE_SECONDS + 60) return false;
    const identity = await currentIdentity();
    // Changing the password changes the fingerprint, which signs everyone else out.
    return Boolean(identity) && data.pv === identity!.fingerprint;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ request guards */

/** Rejects cross-site requests. Used on every route that changes data. */
export async function sameOrigin(req: Request): Promise<boolean> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const site = req.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : h.get("x-real-ip") || "unknown").trim();
}

/** Forgets the hits for a key, e.g. after a successful sign-in. */
export async function resetRateLimit(key: string): Promise<void> {
  try {
    await getStore().del(`rl:${key}`);
  } catch {
    /* nothing to reset */
  }
}

/** Allows `limit` hits per `windowSeconds` for a given key. */
export async function withinRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const count = await getStore().incr(`rl:${key}`, windowSeconds);
    return count <= limit;
  } catch {
    return true;
  }
}

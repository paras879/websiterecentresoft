import { modules } from "@/content";
import { clientIp } from "./admin-auth";
import { getCmsUser } from "./cms-auth";
import { getStore } from "./store";

/**
 * The activity log: who changed what, and when. Newest first, kept in the same database as everything else.
 * Writing to it never stops the real change from going through.
 */
const KEY = "audit:log";
const KEEP = 1000;

export type AuditKind = "content" | "page" | "user" | "role" | "media" | "message" | "version" | "sign-in" | "account";

export interface AuditEntry {
  id: string;
  at: string;
  /** Who did it. Empty for a failed sign-in, where nobody is known yet. */
  actorId: string;
  actor: string;
  email: string;
  kind: AuditKind;
  /** A short sentence, for example: Edited "Home". */
  summary: string;
  ip: string;
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export interface Actor {
  id: string;
  name: string;
  email: string;
}

/** The person making the current request (the /admin sign-in counts as the administrator). */
export async function currentActor(): Promise<Actor> {
  const user = await getCmsUser().catch(() => null);
  return user ? { id: user.id, name: user.name, email: user.email } : { id: "", name: "Unknown", email: "" };
}

export async function logAudit(kind: AuditKind, summary: string, actor?: Actor): Promise<void> {
  try {
    const who = actor ?? (await currentActor());
    const entry: AuditEntry = {
      id: `a-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      at: new Date().toISOString(),
      actorId: who.id,
      actor: clip(who.name, 80),
      email: clip(who.email, 120),
      kind,
      summary: clip(summary, 240),
      ip: await clientIp().catch(() => ""),
    };
    await getStore().lpush(KEY, JSON.stringify(entry), KEEP);
  } catch (error) {
    console.error("Could not write the activity log", error);
  }
}

export async function listAudit(limit = KEEP): Promise<AuditEntry[]> {
  const rows = await getStore().lrange(KEY, 0, Math.min(limit, KEEP) - 1);
  const out: AuditEntry[] = [];
  for (const r of rows) {
    try {
      out.push(JSON.parse(r) as AuditEntry);
    } catch {}
  }
  return out;
}

/** The name an editor sees for a part of the site. */
export const moduleTitle = (id: string) => modules.find((m) => m.id === id)?.title ?? id;

/** Names of the top-level parts of a saved document that differ between two copies. */
export function changedParts(before: unknown, after: unknown, label: (key: string) => string = (k) => k): string[] {
  const a = (before ?? {}) as Record<string, unknown>;
  const b = (after ?? {}) as Record<string, unknown>;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])).map(label);
}

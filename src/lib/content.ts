import { cache } from "react";
import { defaultContent, sanitizeContent, type SiteContent } from "@/content";
import { getStore } from "./store";

const CONTENT_KEY = "content";
const HISTORY_KEY = "content:history";
const HISTORY_KEEP = 20;

export interface HistoryEntry {
  id: string;
  at: string;
  note: string;
}

/**
 * The live content: whatever the admin saved, validated against the schema, on top of the built-in
 * copy. Deduplicated per request so the header, footer and page share one read.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const raw = await getStore().get(CONTENT_KEY);
    if (raw) return sanitizeContent(JSON.parse(raw));
  } catch (error) {
    console.error("Could not read saved content, using the built-in copy.", error);
  }
  return sanitizeContent(defaultContent);
});

/** Validates and saves the whole document, and keeps a snapshot so it can be restored later. */
export async function saveSiteContent(raw: unknown, note = ""): Promise<SiteContent> {
  const clean = sanitizeContent(raw);
  const store = getStore();
  const at = new Date().toISOString();
  const entry = { id: `v-${Date.now().toString(36)}`, at, note: note.slice(0, 120), doc: clean };
  await store.set(CONTENT_KEY, JSON.stringify(clean));
  await store.lpush(HISTORY_KEY, JSON.stringify(entry), HISTORY_KEEP);
  return clean;
}

export async function listHistory(): Promise<HistoryEntry[]> {
  const rows = await getStore().lrange(HISTORY_KEY, 0, HISTORY_KEEP - 1);
  return rows
    .map((r) => {
      try {
        const e = JSON.parse(r) as HistoryEntry;
        return { id: e.id, at: e.at, note: e.note ?? "" };
      } catch {
        return null;
      }
    })
    .filter((e): e is HistoryEntry => e !== null);
}

export async function getHistoryDoc(id: string): Promise<SiteContent | null> {
  const rows = await getStore().lrange(HISTORY_KEY, 0, HISTORY_KEEP - 1);
  for (const r of rows) {
    try {
      const e = JSON.parse(r) as { id: string; doc: unknown };
      if (e.id === id) return sanitizeContent(e.doc);
    } catch {
      /* skip unreadable entry */
    }
  }
  return null;
}

export function getDefaultContent(): SiteContent {
  return sanitizeContent(defaultContent);
}

export type { SiteContent };

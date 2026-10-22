import { cache } from "react";
import { revalidateTag } from "next/cache";
import { applyImageUpgrades } from "@/content/image-upgrades";
import { defaultContent, sanitizeContent, type SiteContent } from "@/content";
import { changedParts, currentActor, moduleTitle } from "./audit";
import { SITE_URL } from "./seo";
import { getStore } from "./store";

const CONTENT_KEY = "content";

/** "Home, Careers" or "Home, Careers, About Us and 4 more": what a save changed, short enough to read. */
const describeChange = (parts: string[]) => `Changed ${parts.length > 3 ? `${parts.slice(0, 3).join(", ")} and ${parts.length - 3} more` : parts.join(", ")}`;
const HISTORY_KEY = "content:history";
const HISTORY_KEEP = 20;

export interface HistoryEntry {
  id: string;
  at: string;
  /** What changed in this save, in words. */
  note: string;
  /** Who saved it, when known. */
  by: string;
}

/**
 * The live content: whatever the admin saved, validated against the schema, on top of the built-in
 * copy. Deduplicated per request so the header, footer and page share one read.
 */
/**
 * Services that must always be reachable from the menu, footer and forms. Content saved before a
 * service existed does not list it, so it is added here (after its neighbour) instead of vanishing.
 */
const REQUIRED_SERVICES = [
  { title: "Agentic AI", footer: "AI - Agentic", desc: "Autonomous enterprise agents, multi-agent swarms & MCP workflows", href: "/services/agentic-ai", icon: "assist", after: "/services/software-development" },
  { title: "App Development", footer: "App Development", desc: "Native Android and iOS apps, from idea to the app stores", href: "/services/app-development", icon: "phone", after: "/services/ai-automation" },
];

/** Career areas that must always appear on the Careers page. Added here so saved content from
 *  before these services existed still shows them in the "Where you could fit in" section. */
const REQUIRED_CAREER_AREAS = [
  {
    title: "Agentic AI",
    desc: "Autonomous enterprise agents, multi-agent swarms and tool integrations.",
    href: "/services/agentic-ai",
    image: "/images/services-agentic.jpg",
    after: "/services/software-development",
  },
  {
    title: "App Development",
    desc: "Native iOS and Android apps, cross-platform mobile engineering.",
    href: "/services/app-development",
    image: "/images/services-app.jpg",
    after: "/services/ai-automation",
  },
];

function withRequiredCareerAreas(content: SiteContent): SiteContent {
  const items = content.careers.areas.items as Array<{ title: string; desc: string; href: string; image: string }>;
  for (const req of REQUIRED_CAREER_AREAS) {
    if (!items.some((a) => a.href === req.href)) {
      const at = items.findIndex((a) => a.href === req.after);
      items.splice(at >= 0 ? at + 1 : items.length, 0, {
        title: req.title,
        desc: req.desc,
        href: req.href,
        image: req.image,
      });
    }
  }
  return content;
}

function withRequiredServices(content: SiteContent): SiteContent {
  const { header, footer } = content.site;
  for (const req of REQUIRED_SERVICES) {
    if (!header.menu.some((m) => m.href === req.href)) {
      const at = header.menu.findIndex((m) => m.href === req.after);
      header.menu.splice(at >= 0 ? at + 1 : header.menu.length, 0, {
        title: req.title,
        desc: req.desc,
        href: req.href,
        icon: req.icon,
      });
    }
    const col = footer.columns.find((c) => c.links.some((l) => l.href.startsWith("/services/")));
    if (col && !col.links.some((l) => l.href === req.href)) {
      const at = col.links.findIndex((l) => l.href === req.after);
      col.links.splice(at >= 0 ? at + 1 : col.links.length, 0, { label: req.footer, href: req.href });
    }
    if (content.sitemap?.services?.links && !content.sitemap.services.links.some((l) => l.href === req.href)) {
      const at = content.sitemap.services.links.findIndex((l) => l.href === req.after);
      content.sitemap.services.links.splice(at >= 0 ? at + 1 : content.sitemap.services.links.length, 0, {
        label: req.title,
        desc: req.desc,
        href: req.href,
      });
    }
  }
  return content;
}

const LAUNCH_ADDRESS = "https://websiterecentresoft.vercel.app";

/** The legal pages name the website's address. Once a domain is connected, they name that instead. */
function withSiteAddress(content: SiteContent): SiteContent {
  if (SITE_URL === LAUNCH_ADDRESS) return content;
  const c = content as unknown as Record<string, unknown>;
  for (const id of ["privacy", "terms"]) {
    if (c[id]) c[id] = JSON.parse(JSON.stringify(c[id]).split(LAUNCH_ADDRESS).join(SITE_URL));
  }
  return content;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const raw = await getStore().get(CONTENT_KEY, { cached: true });
    if (raw) return withSiteAddress(applyImageUpgrades(withRequiredCareerAreas(withRequiredServices(sanitizeContent(JSON.parse(raw))))));
  } catch (error) {
    console.error("Could not read saved content, using the built-in copy.", error);
  }
  return withSiteAddress(withRequiredCareerAreas(withRequiredServices(sanitizeContent(defaultContent))));
});

/** Validates and saves the whole document, and keeps a snapshot so it can be restored later. */
export async function saveSiteContent(raw: unknown, note = ""): Promise<SiteContent> {
  const clean = sanitizeContent(raw);
  const store = getStore();
  const at = new Date().toISOString();

  // Say what this save changed, and who saved it, so the Versions list is readable.
  // With nothing saved yet, the built-in copy is what this save is compared with.
  let before: unknown = sanitizeContent(defaultContent);
  let hadSaved = false;
  try {
    const stored = await store.get(CONTENT_KEY);
    if (stored) {
      before = JSON.parse(stored);
      hadSaved = true;
    }
  } catch {}
  const parts = changedParts(before, clean, moduleTitle);
  const label = note.trim() || (parts.length ? describeChange(parts) : "Saved with no changes");
  const by = (await currentActor()).name;
  const entry = { id: `v-${Date.now().toString(36)}`, at, note: label.slice(0, 160), by, doc: clean };
  await store.set(CONTENT_KEY, JSON.stringify(clean));
  // A save that changes nothing is not worth a place in the list.
  if (parts.length > 0 || note.trim() || !hadSaved) await store.lpush(HISTORY_KEY, JSON.stringify(entry), HISTORY_KEEP);
  try {
    // Public pages keep the saved content for a minute; this makes a new save show up right away.
    revalidateTag("site-content", { expire: 0 });
  } catch {}
  return clean;
}

export async function listHistory(): Promise<HistoryEntry[]> {
  const rows = await getStore().lrange(HISTORY_KEY, 0, HISTORY_KEEP - 1);
  const parsed = rows
    .map((r) => {
      try {
        return JSON.parse(r) as { id: string; at: string; note?: string; by?: string; doc?: unknown };
      } catch {
        return null;
      }
    })
    .filter((e): e is { id: string; at: string; note?: string; by?: string; doc?: unknown } => e !== null);

  return parsed.map((e, i) => {
    // Older saves did not record what they changed. Work it out by comparing with the save before.
    let note = e.note ?? "";
    if (!note) {
      const older = parsed[i + 1];
      if (!older) note = "Earliest version still kept";
      else {
        const parts = changedParts(older.doc, e.doc, moduleTitle);
        note = parts.length ? describeChange(parts) : "No visible change";
      }
    }
    return { id: e.id, at: e.at, note, by: e.by ?? "" };
  });
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

/** Earlier saved copies of one page of the site, newest first. */
export async function moduleVersions(moduleId: string): Promise<{ id: string; at: string; note: string; data: unknown }[]> {
  const rows = await getStore().lrange(HISTORY_KEY, 0, HISTORY_KEEP - 1);
  const out: { id: string; at: string; note: string; data: unknown }[] = [];
  for (const r of rows) {
    try {
      const e = JSON.parse(r) as { id: string; at: string; note?: string; doc?: Record<string, unknown> };
      if (e.doc && moduleId in e.doc) out.push({ id: e.id, at: e.at, note: e.note ?? "", data: e.doc[moduleId] });
    } catch {
      /* skip unreadable entry */
    }
  }
  return out;
}

export function getDefaultContent(): SiteContent {
  return sanitizeContent(defaultContent);
}

export type { SiteContent };

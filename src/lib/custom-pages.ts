import crypto from "node:crypto";
import { safeImage, safeUrl } from "@/content/sanitize";
import { CmsError } from "./cms-users";
import {
  newBlockId,
  slugProblem,
  type Block,
  type CustomPage,
  type PageMenu,
  MENU_ICONS,
  type PageStatus,
} from "./custom-pages-types";
import { getStore } from "./store";

const KEY = "cms:pages";
const MAX_PAGES = 100;
const MAX_BLOCKS = 60;

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

/* ------------------------------------------------------------------ cleaning what comes from the browser */

function str(v: unknown, max: number, multiline = false): string {
  if (typeof v !== "string") return "";
  let s = v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  if (!multiline) s = s.replace(/\s+/g, " ");
  return s.trim().slice(0, max);
}

function oneOf<T extends string | number>(v: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(v as T) ? (v as T) : fallback;
}

const id = (v: unknown) => {
  const s = typeof v === "string" ? v.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) : "";
  return s || newBlockId();
};

const list = <T,>(v: unknown, max: number, map: (x: Json) => T): T[] =>
  Array.isArray(v) ? v.filter(isObj).slice(0, max).map(map) : [];

function cleanBlock(raw: Json): Block | null {
  const base = { id: id(raw.id) };
  switch (raw.type) {
    case "hero":
      return {
        ...base,
        type: "hero",
        eyebrow: str(raw.eyebrow, 60),
        title: str(raw.title, 140),
        text: str(raw.text, 600, true),
        buttonLabel: str(raw.buttonLabel, 50),
        buttonHref: safeUrl(raw.buttonHref),
        image: safeImage(raw.image),
        imageAlt: str(raw.imageAlt, 160),
        imageSide: oneOf(raw.imageSide, ["right", "left", "background", "none"] as const, "right"),
      };
    case "text":
      return {
        ...base,
        type: "text",
        heading: str(raw.heading, 140),
        body: str(raw.body, 8000, true),
        align: oneOf(raw.align, ["left", "center"] as const, "left"),
      };
    case "image":
      return {
        ...base,
        type: "image",
        image: safeImage(raw.image),
        alt: str(raw.alt, 160),
        caption: str(raw.caption, 200),
        size: oneOf(raw.size, ["small", "medium", "full"] as const, "medium"),
      };
    case "imageText":
      return {
        ...base,
        type: "imageText",
        image: safeImage(raw.image),
        alt: str(raw.alt, 160),
        heading: str(raw.heading, 140),
        body: str(raw.body, 4000, true),
        buttonLabel: str(raw.buttonLabel, 50),
        buttonHref: safeUrl(raw.buttonHref),
        side: oneOf(raw.side, ["left", "right"] as const, "left"),
      };
    case "features":
      return {
        ...base,
        type: "features",
        heading: str(raw.heading, 140),
        lead: str(raw.lead, 400, true),
        columns: oneOf(Number(raw.columns), [2, 3, 4] as const, 3),
        items: list(raw.items, 24, (x) => ({
          id: id(x.id),
          title: str(x.title, 100),
          desc: str(x.desc, 500, true),
          image: safeImage(x.image),
          imageAlt: str(x.imageAlt, 160),
        })),
      };
    case "gallery":
      return {
        ...base,
        type: "gallery",
        heading: str(raw.heading, 140),
        columns: oneOf(Number(raw.columns), [2, 3, 4] as const, 3),
        images: list(raw.images, 40, (x) => ({ id: id(x.id), image: safeImage(x.image), alt: str(x.alt, 160) })).filter((g) => g.image),
      };
    case "faq":
      return {
        ...base,
        type: "faq",
        heading: str(raw.heading, 140),
        items: list(raw.items, 30, (x) => ({ id: id(x.id), q: str(x.q, 200), a: str(x.a, 1200, true) })).filter((f) => f.q && f.a),
      };
    case "cta":
      return {
        ...base,
        type: "cta",
        heading: str(raw.heading, 140),
        text: str(raw.text, 400, true),
        buttonLabel: str(raw.buttonLabel, 50),
        buttonHref: safeUrl(raw.buttonHref),
      };
    default:
      return null;
  }
}

/** Fields that can be saved as typed: the server fills in the id, the dates and who saved it. */
function cleanPage(raw: unknown): Omit<CustomPage, "id" | "createdAt" | "updatedAt" | "updatedBy"> {
  if (!isObj(raw)) throw new CmsError("Nothing to save.");
  const prefix = oneOf(raw.prefix, ["", "services"] as const, "");
  const slug = str(raw.slug, 80).toLowerCase();
  const problem = slugProblem(prefix, slug);
  if (problem) throw new CmsError(problem);
  const title = str(raw.title, 120);
  if (!title) throw new CmsError("Enter a page title.");

  const rawBlocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  if (rawBlocks.length > MAX_BLOCKS) throw new CmsError(`A page can have up to ${MAX_BLOCKS} blocks.`);
  const blocks = rawBlocks.filter(isObj).map(cleanBlock).filter((b): b is Block => b !== null);
  // Block ids must be unique inside the page.
  const seen = new Set<string>();
  for (const b of blocks) {
    if (seen.has(b.id)) b.id = newBlockId();
    seen.add(b.id);
  }

  const seo = isObj(raw.seo) ? raw.seo : {};
  return {
    slug,
    prefix,
    title,
    status: oneOf(raw.status, ["published", "draft"] as const, "draft") as PageStatus,
    menu: oneOf(raw.menu, ["none", "services", "top", "group", "footer"] as const, "none") as PageMenu,
    menuGroup: str(raw.menuGroup, 30),
    menuIcon: oneOf(raw.menuIcon, MENU_ICONS, "code"),
    seo: {
      title: str(seo.title, 70),
      description: str(seo.description, 200, true),
      image: safeImage(seo.image),
      imageAlt: str(seo.imageAlt, 125),
    },
    blocks,
  };
}

/* ------------------------------------------------------------------ storage */

function parse(raw: string | null): CustomPage[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { pages?: CustomPage[] };
    return Array.isArray(data.pages) ? data.pages : [];
  } catch {
    return [];
  }
}

async function readAll(): Promise<CustomPage[]> {
  return parse(await getStore().get(KEY));
}

async function writeAll(pages: CustomPage[]): Promise<void> {
  await getStore().set(KEY, JSON.stringify({ pages }));
}

export async function listPages(): Promise<CustomPage[]> {
  return (await readAll()).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getPage(pageId: string): Promise<CustomPage | null> {
  return (await readAll()).find((p) => p.id === pageId) ?? null;
}

export async function createPage(raw: unknown, by: string): Promise<CustomPage> {
  const data = cleanPage(raw);
  const pages = await readAll();
  if (pages.length >= MAX_PAGES) throw new CmsError(`You can have up to ${MAX_PAGES} pages.`);
  if (pages.some((p) => p.prefix === data.prefix && p.slug === data.slug)) throw new CmsError("Another page already uses this address.", 409);
  const now = new Date().toISOString();
  const page: CustomPage = {
    id: `pg-${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`,
    ...data,
    createdAt: now,
    updatedAt: now,
    updatedBy: by,
  };
  await writeAll([...pages, page]);
  return page;
}

export async function updatePage(pageId: string, raw: unknown, by: string): Promise<CustomPage> {
  const data = cleanPage(raw);
  const pages = await readAll();
  const index = pages.findIndex((p) => p.id === pageId);
  if (index < 0) throw new CmsError("That page no longer exists.", 404);
  if (pages.some((p) => p.id !== pageId && p.prefix === data.prefix && p.slug === data.slug)) {
    throw new CmsError("Another page already uses this address.", 409);
  }
  const next: CustomPage = { ...pages[index], ...data, id: pageId, updatedAt: new Date().toISOString(), updatedBy: by };
  pages[index] = next;
  await writeAll(pages);
  return next;
}

export async function deletePage(pageId: string): Promise<boolean> {
  const pages = await readAll();
  const rest = pages.filter((p) => p.id !== pageId);
  if (rest.length === pages.length) return false;
  await writeAll(rest);
  return true;
}

/* ------------------------------------------------------------------ for the public website */

/** Published pages. Read with a short cache, so visitors do not wait on the database. */
export async function publishedPages(): Promise<CustomPage[]> {
  try {
    const raw = await getStore().get(KEY, { cached: true });
    return parse(raw).filter((p) => p.status === "published");
  } catch {
    return [];
  }
}

export async function publishedPage(prefix: "" | "services", slug: string): Promise<CustomPage | null> {
  return (await publishedPages()).find((p) => p.prefix === prefix && p.slug === slug) ?? null;
}

/** The site header and footer with links to the published pages that asked to be in a menu. Never saved. */
export function withCustomPageLinks<
  T extends {
    header: { items: { label: string; href: string; hasMenu: boolean }[]; menu: { title: string; desc: string; href: string; icon: string }[] };
    footer: { columns: { links: { label: string; href: string }[] }[] };
  },
>(site: T, pages: CustomPage[]): T {
  const inServices = pages.filter((p) => p.menu === "services");
  const inTop = pages.filter((p) => p.menu === "top");
  const inGroups = pages.filter((p) => p.menu === "group");
  const inFooter = pages.filter((p) => p.menu === "footer");
  if (inServices.length + inTop.length + inGroups.length + inFooter.length === 0) return site;

  const path = (p: CustomPage) => (p.prefix ? `/${p.prefix}/${p.slug}` : `/${p.slug}`);
  const entry = (p: CustomPage) => ({ title: p.title, desc: p.seo.description.slice(0, 90), href: path(p), icon: p.menuIcon || "code" });
  const next = structuredClone(site);

  for (const p of inServices) {
    if (!next.header.menu.some((m) => m.href === path(p))) next.header.menu.push(entry(p));
    const col = next.footer.columns.find((c) => c.links.some((l) => l.href.startsWith("/services/")));
    if (col && !col.links.some((l) => l.href === path(p))) col.links.push({ label: p.title, href: path(p) });
  }

  // Their own place in the top bar, after the built-in links: single links first, then dropdowns.
  const items = next.header.items as { label: string; href: string; hasMenu: boolean; entries?: ReturnType<typeof entry>[] }[];
  for (const p of inTop) items.push({ label: p.title, href: path(p), hasMenu: false });
  const groups = new Map<string, CustomPage[]>();
  for (const p of inGroups) {
    const name = p.menuGroup.trim() || "More";
    groups.set(name, [...(groups.get(name) ?? []), p]);
  }
  for (const [name, list] of groups) items.push({ label: name, href: path(list[0]), hasMenu: true, entries: list.map(entry) });

  const first = next.footer.columns[0];
  if (first) {
    for (const p of [...inTop, ...inGroups, ...inFooter]) {
      if (!first.links.some((l) => l.href === path(p))) first.links.push({ label: p.title, href: path(p) });
    }
  }
  return next;
}

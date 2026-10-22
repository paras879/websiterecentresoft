/**
 * Pages built in the admin panel. Shared by the server (to check and store them), the editor and the public page.
 * A page is a list of blocks; the order of the blocks is the order on the page, so moving a block moves its picture.
 */

export type BlockType = "hero" | "text" | "image" | "imageText" | "features" | "gallery" | "faq" | "cta";

export interface HeroBlock {
  id: string;
  type: "hero";
  eyebrow: string;
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  image: string;
  imageAlt: string;
  /** Where the picture goes: beside the text on the right or left, behind it, or not at all. */
  imageSide: "right" | "left" | "background" | "none";
}

export interface TextBlock {
  id: string;
  type: "text";
  heading: string;
  body: string;
  align: "left" | "center";
}

export interface ImageBlock {
  id: string;
  type: "image";
  image: string;
  alt: string;
  caption: string;
  size: "small" | "medium" | "full";
}

export interface ImageTextBlock {
  id: string;
  type: "imageText";
  image: string;
  alt: string;
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  side: "left" | "right";
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
}

export interface FeaturesBlock {
  id: string;
  type: "features";
  heading: string;
  lead: string;
  columns: 2 | 3 | 4;
  items: FeatureItem[];
}

export interface GalleryImage {
  id: string;
  image: string;
  alt: string;
}

export interface GalleryBlock {
  id: string;
  type: "gallery";
  heading: string;
  columns: 2 | 3 | 4;
  images: GalleryImage[];
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqBlock {
  id: string;
  type: "faq";
  heading: string;
  items: FaqItem[];
}

export interface CtaBlock {
  id: string;
  type: "cta";
  heading: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
}

export type Block = HeroBlock | TextBlock | ImageBlock | ImageTextBlock | FeaturesBlock | GalleryBlock | FaqBlock | CtaBlock;

export type PageStatus = "published" | "draft";
/** Where a link to the page also appears. */
export type PageMenu = "none" | "services" | "top" | "group" | "footer";

/** Icons a page can show in a dropdown. They all exist in the site's icon set. */
export const MENU_ICONS = ["code", "web", "workflow", "assist", "phone", "search", "shield", "rocket", "people", "document", "enterprise", "database", "devices", "handshake"] as const;

export interface CustomPage {
  id: string;
  /** Last part of the address, for example "web-design". */
  slug: string;
  /** "" puts the page at /slug, "services" puts it at /services/slug. */
  prefix: "" | "services";
  title: string;
  status: PageStatus;
  menu: PageMenu;
  /** For menu "group": the name of the dropdown. Pages with the same name share one dropdown. */
  menuGroup: string;
  /** The icon shown beside the page inside a dropdown. */
  menuIcon: string;
  seo: { title: string; description: string; image: string; imageAlt: string };
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export const pagePath = (p: Pick<CustomPage, "slug" | "prefix">) => (p.prefix ? `/${p.prefix}/${p.slug}` : `/${p.slug}`);

export const BLOCK_INFO: Record<BlockType, { label: string; hint: string }> = {
  hero: { label: "Hero banner", hint: "Big heading, text, a button and a picture." },
  text: { label: "Text", hint: "A heading and paragraphs or a bullet list." },
  image: { label: "Picture", hint: "One picture with a caption." },
  imageText: { label: "Picture and text", hint: "A picture beside text. The picture can sit on either side." },
  features: { label: "Cards", hint: "A grid of cards, each with a title, text and an optional picture." },
  gallery: { label: "Gallery", hint: "A set of pictures in a grid." },
  faq: { label: "Questions and answers", hint: "Open-and-close questions. Google can show them in search results." },
  cta: { label: "Call to action", hint: "A closing banner with a button." },
};

export const BLOCK_ORDER: BlockType[] = ["hero", "text", "imageText", "image", "features", "gallery", "faq", "cta"];

let counter = 0;
export const newBlockId = () => `b-${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

/** A new, empty block of the given type. */
export function blankBlock(type: BlockType, fixedId?: string): Block {
  const id = fixedId ?? newBlockId();
  switch (type) {
    case "hero":
      return { id, type, eyebrow: "", title: "Page heading", text: "A short line that explains this page.", buttonLabel: "Contact us", buttonHref: "/contact", image: "", imageAlt: "", imageSide: "right" };
    case "text":
      return { id, type, heading: "Heading", body: "Write your text here.\n\nStart a line with - to make a list.", align: "left" };
    case "image":
      return { id, type, image: "", alt: "", caption: "", size: "medium" };
    case "imageText":
      return { id, type, image: "", alt: "", heading: "Heading", body: "Write your text here.", buttonLabel: "", buttonHref: "", side: "left" };
    case "features":
      return {
        id,
        type,
        heading: "What we offer",
        lead: "",
        columns: 3,
        items: [
          { id: newBlockId(), title: "First point", desc: "Describe it in a sentence or two.", image: "", imageAlt: "" },
          { id: newBlockId(), title: "Second point", desc: "Describe it in a sentence or two.", image: "", imageAlt: "" },
          { id: newBlockId(), title: "Third point", desc: "Describe it in a sentence or two.", image: "", imageAlt: "" },
        ],
      };
    case "gallery":
      return { id, type, heading: "", columns: 3, images: [] };
    case "faq":
      return { id, type, heading: "Frequently asked questions", items: [{ id: newBlockId(), q: "A question?", a: "Its answer." }] };
    case "cta":
      return { id, type, heading: "Ready to start?", text: "Tell us about your project.", buttonLabel: "Contact us", buttonHref: "/contact" };
  }
}

export function blankPage(): CustomPage {
  // Nothing here changes from one call to the next, so the first screen matches on the server and in the browser.
  return {
    id: "",
    slug: "",
    prefix: "",
    title: "",
    status: "draft",
    menu: "none",
    menuGroup: "",
    menuIcon: "code",
    seo: { title: "", description: "", image: "", imageAlt: "" },
    blocks: [blankBlock("hero", "b-start")],
    createdAt: "",
    updatedAt: "",
    updatedBy: "",
  };
}

/* ------------------------------------------------------------------ addresses that must stay free */

const RESERVED_ROOT = new Set([
  "admin", "admin1", "api", "about", "contact", "careers", "services", "privacy-policy", "terms-and-conditions",
  "sitemap", "robots", "robots-txt", "sitemap-xml", "favicon", "icon", "apple-icon", "images", "tech", "icons",
  "_next", "new", "login", "logout",
]);

const RESERVED_SERVICES = new Set([
  "software-development", "ai-automation", "agentic-ai", "app-development", "custom-development", "seo",
]);

export function slugProblem(prefix: string, slug: string): string | null {
  if (!slug) return "Enter the last part of the address, for example web-design.";
  if (slug.length > 60) return "Keep the address to 60 characters or fewer.";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return "Use only small letters, numbers and single hyphens, for example web-design.";
  if (prefix === "" && RESERVED_ROOT.has(slug)) return `/${slug} is already used by the website. Choose another address.`;
  if (prefix === "services" && RESERVED_SERVICES.has(slug)) return `/services/${slug} is already a service page. Choose another address.`;
  return null;
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

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
  // Pages share a dropdown when the names match, ignoring capital letters.
  const groups = new Map<string, { name: string; list: CustomPage[] }>();
  for (const p of inGroups) {
    const name = p.menuGroup.trim() || "More";
    const key = name.toLowerCase();
    const group = groups.get(key) ?? { name, list: [] };
    group.list.push(p);
    groups.set(key, group);
  }
  for (const { name, list } of groups.values()) items.push({ label: name, href: path(list[0]), hasMenu: true, entries: list.map(entry) });

  const first = next.footer.columns[0];
  if (first) {
    for (const p of [...inTop, ...inGroups, ...inFooter]) {
      if (!first.links.some((l) => l.href === path(p))) first.links.push({ label: p.title, href: path(p) });
    }
  }
  return next;
}

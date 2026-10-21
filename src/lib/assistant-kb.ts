import { modules } from "@/content";
import type { SiteContent } from "@/content";
import type { SiteInfo } from "./site";
import { SITE_URL } from "./seo";

/** Facts the assistant may state, plus a short plain-text summary of the pages. Rebuilt from the admin content. */
export interface Knowledge {
  text: string;
  facts: {
    name: string;
    email: string;
    hrEmail: string;
    phone: string;
    whatsappUrl: string;
    address: string;
    mapUrl: string;
    officeHours: string;
    services: { title: string; desc: string; href: string }[];
    socials: { label: string; href: string }[];
  };
}

/** Fields that hold links, pictures, icons or styling, not words a visitor reads. */
const SKIP = new Set([
  "meta", "image", "imageAlt", "alt", "icon", "href", "url", "id", "tone", "color", "logo", "asideImage",
  "primaryHref", "secondaryHref", "buttonHref", "linkHref", "ctaHref", "asideButtonHref", "cardButtonHref",
  "stepWord", "ofWord", "phaseWord", "flowLabel", "linkPrefix", "forYouLabel", "getsLabel", "deliverableLabel",
]);

const PER_PAGE = 2400;

function collect(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    const t = value.trim();
    if (t.length > 2 && !/^(\/|https?:|#|mailto:|tel:)/i.test(t)) out.push(t);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collect(v, out);
    return;
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.q === "string" && typeof o.a === "string") {
      out.push(`Q: ${o.q.trim()} A: ${o.a.trim()}`);
      return;
    }
    for (const [k, v] of Object.entries(o)) if (!SKIP.has(k)) collect(v, out);
  }
}

function summarise(data: unknown, limit: number): string {
  const lines: string[] = [];
  collect(data, lines);
  const seen = new Set<string>();
  let total = 0;
  const kept: string[] = [];
  for (const line of lines) {
    if (seen.has(line)) continue;
    seen.add(line);
    if (total + line.length > limit) break;
    kept.push(line);
    total += line.length + 3;
  }
  return kept.map((l) => `- ${l}`).join("\n");
}

export function buildKnowledge(content: SiteContent, info: SiteInfo): Knowledge {
  const { site } = content;
  const services = site.header.menu.map((m) => ({ title: m.title, desc: m.desc, href: m.href }));
  const socials = site.socials.map((s) => ({ label: s.name, href: s.href }));
  const facts = {
    name: info.name,
    email: info.contact.email,
    hrEmail: info.contact.hrEmail,
    phone: info.contact.phone,
    whatsappUrl: info.contact.whatsappUrl,
    address: info.contact.address,
    mapUrl: info.contact.mapUrl,
    officeHours: info.contact.officeHours,
    services,
    socials,
  };

  const parts: string[] = [];
  parts.push(
    [
      `Company: ${info.legalName} (${info.name}). ${info.tagline}.`,
      info.description,
      `Website: ${SITE_URL}`,
      `Email: ${info.contact.email}`,
      `HR / careers email: ${info.contact.hrEmail}`,
      `Mobile / phone: ${info.contact.phone}`,
      `WhatsApp: ${info.contact.whatsappUrl}`,
      `Office address: ${info.contact.address}`,
      `Google Maps: ${info.contact.mapUrl}`,
      `Office hours: ${info.contact.officeHours || "not published on the website"}`,
      `Social profiles: ${socials.map((s) => `${s.label} ${s.href}`).join("; ") || "none listed"}`,
      `Contact form: ${SITE_URL}/contact`,
    ].join("\n"),
  );
  parts.push("Services (page links):\n" + services.map((s) => `- ${s.title}: ${s.desc} (${SITE_URL}${s.href})`).join("\n"));
  parts.push(
    "Pages: Home (/), About (/about), Services (/services/...), Contact (/contact), Careers (/careers), Privacy Policy (/privacy-policy), Terms & Conditions (/terms-and-conditions), Sitemap (/sitemap).",
  );

  for (const mod of modules) {
    if (!mod.route) continue;
    if (mod.route === "/privacy-policy" || mod.route === "/terms-and-conditions" || mod.route === "/sitemap") continue;
    const data = (content as unknown as Record<string, unknown>)[mod.id];
    const body = summarise(data, PER_PAGE);
    if (body) parts.push(`${mod.title} page (${SITE_URL}${mod.route}):\n${body}`);
  }

  return { text: parts.join("\n\n"), facts };
}

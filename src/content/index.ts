import type { ContentModule } from "./fields";
import { sanitizeModule } from "./sanitize";
import { homeModule } from "./home";
import { siteModule } from "./site";
import { softwareModule } from "./service-software";
import { aiModule } from "./service-ai";
import { customModule } from "./service-custom";
import { seoModule } from "./service-seo";
import { agenticModule } from "./service-agentic";
import { aboutModule } from "./about";
import { contactModule } from "./contact";
import { sitemapModule } from "./sitemap";
import { careersModule } from "./careers";

/** Every editable part of the website, in the order the admin panel lists them. */
export const modules: ContentModule[] = [
  siteModule,
  homeModule,
  aboutModule,
  careersModule,
  contactModule,
  sitemapModule,
  softwareModule,
  aiModule,
  agenticModule,
  customModule,
  seoModule,
];

export const defaultContent = {
  site: siteModule.defaults,
  serviceCustom: customModule.defaults,
  serviceSeo: seoModule.defaults,
  home: homeModule.defaults,
  careers: careersModule.defaults,
  about: aboutModule.defaults,
  contact: contactModule.defaults,
  sitemap: sitemapModule.defaults,
  serviceSoftware: softwareModule.defaults,
  serviceAi: aiModule.defaults,
  serviceAgentic: agenticModule.defaults,
};

export type SiteContent = typeof defaultContent;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Validates a whole content document. Anything missing or invalid falls back to the built-in copy. */
export function sanitizeContent(raw: unknown): SiteContent {
  const src = isObject(raw) ? raw : {};
  const out: Record<string, unknown> = {};
  for (const mod of modules) out[mod.id] = sanitizeModule(mod, src[mod.id]);
  return out as unknown as SiteContent;
}

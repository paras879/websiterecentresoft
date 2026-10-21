import type { Metadata } from "next";
import type { CustomPage } from "./custom-pages-types";
import { pagePath } from "./custom-pages-types";
import { pageMetadata, SITE_URL } from "./seo";

/** A short summary for Google when the person did not write one: the first text on the page. */
function firstText(page: CustomPage): string {
  for (const b of page.blocks) {
    const t = b.type === "hero" ? b.text : b.type === "text" || b.type === "imageText" ? b.body : b.type === "cta" ? b.text : "";
    if (t) return t.replace(/\s+/g, " ").replace(/^[-#•*\s]+/, "").slice(0, 155);
  }
  return `${page.title} at Recenturesoft Infotech.`;
}

export function customPageMetadata(page: CustomPage): Metadata {
  return pageMetadata(
    {
      title: page.seo.title || `${page.title} | Recenturesoft Infotech`,
      description: page.seo.description || firstText(page),
      image: page.seo.image,
      imageAlt: page.seo.imageAlt,
    },
    pagePath(page),
  );
}

/** Breadcrumbs, the page itself, and the questions when the page has a question block. */
export function customPageSchema(page: CustomPage): Record<string, unknown> {
  const url = `${SITE_URL}${pagePath(page)}`;
  const trail = [{ name: "Home", url: SITE_URL }];
  if (page.prefix === "services") trail.push({ name: "Services", url: `${SITE_URL}/services/software-development` });
  trail.push({ name: page.title, url });

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.url })),
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.seo.title || page.title,
      description: page.seo.description || firstText(page),
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      inLanguage: "en-IN",
      dateModified: page.updatedAt,
    },
  ];

  const qa = page.blocks.flatMap((b) => (b.type === "faq" ? b.items : []));
  if (qa.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: qa.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

import { modules } from "@/content";
import type { SiteContent } from "@/content";
import type { SiteInfo } from "./site";
import { SITE_URL } from "./seo";

type Json = Record<string, unknown>;
const ORG = `${SITE_URL}/#organization`;
const SITE = `${SITE_URL}/#website`;

const isObj = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const SERVICE_PREFIX = "/services/";

/**
 * The address typed in the admin ("street, city, state, postal code, country") as a structured postal address.
 * When it does not follow that shape, the whole text is kept as the street line rather than guessed at.
 */
function postalAddress(full: string): Json {
  const parts = full.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 5) return { "@type": "PostalAddress", streetAddress: full.trim() };
  const [country, postal, region, locality] = [parts.at(-1)!, parts.at(-2)!, parts.at(-3)!, parts.at(-4)!];
  return {
    "@type": "PostalAddress",
    streetAddress: parts.slice(0, -4).join(", "),
    addressLocality: locality,
    addressRegion: region,
    postalCode: postal,
    addressCountry: /^india$/i.test(country) ? "IN" : country,
  };
}

/** Business, website and review data that appears on every page. */
export function buildSiteGraph(content: SiteContent, info: SiteInfo): Json {
  const { site } = content;
  const reviews = (content as unknown as { reviews?: { reviews?: { items?: Json[] } } }).reviews?.reviews?.items ?? [];
  const valid = reviews.filter((r) => str(r.author) && str(r.text) && Number(r.rating) >= 1 && Number(r.rating) <= 5);

  const business: Json = {
    "@type": "ProfessionalService",
    "@id": ORG,
    name: info.name,
    legalName: info.legalName,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/recenturesoft-logo.png` },
    image: `${SITE_URL}/images/hero.jpg`,
    description: info.description,
    email: info.contact.email,
    telephone: info.contact.phone,
    address: postalAddress(info.contact.address),
    hasMap: info.contact.mapUrl,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: info.contact.phone,
        email: info.contact.email,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: site.socials.map((s) => s.href),
    knowsAbout: site.header.menu.map((m) => m.title),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${info.name} services`,
      itemListElement: site.header.menu.map((m) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: m.title, url: `${SITE_URL}${m.href}`, description: m.desc },
      })),
    },
  };

  // Ratings are only sent when real customer reviews have been added in the admin panel.
  if (valid.length > 0) {
    const total = valid.reduce((sum, r) => sum + Number(r.rating), 0);
    business.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number((total / valid.length).toFixed(1)),
      reviewCount: valid.length,
      bestRating: 5,
      worstRating: 1,
    };
    business.review = valid.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: str(r.author) },
      reviewRating: { "@type": "Rating", ratingValue: Number(r.rating), bestRating: 5, worstRating: 1 },
      reviewBody: str(r.text),
      ...(str(r.date) ? { datePublished: str(r.date) } : {}),
    }));
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "WebSite",
        "@id": SITE,
        url: SITE_URL,
        name: info.name,
        description: info.description,
        inLanguage: "en-IN",
        publisher: { "@id": ORG },
      },
    ],
  };
}

/** Schema per page: breadcrumbs, the page itself, a Service for service pages, and FAQs when the page has them. */
export function buildPageSchemas(content: SiteContent): Record<string, Json> {
  const { header } = content.site;
  const labels = new Map<string, string>();
  for (const i of header.items) labels.set(i.href, i.label);
  for (const m of header.menu) labels.set(m.href, m.title);

  const servicesHref = header.items.find((i) => i.hasMenu)?.href;
  const out: Record<string, Json> = {};

  for (const mod of modules) {
    if (!mod.route) continue;
    const data = (content as unknown as Record<string, Json>)[mod.id];
    if (!isObj(data)) continue;

    const path = mod.route;
    const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
    const name = labels.get(path) ?? mod.title;
    const meta = isObj(data.meta) ? data.meta : {};
    const description = str(meta.description);

    const trail: { name: string; url: string }[] = [{ name: "Home", url: SITE_URL }];
    if (path.startsWith(SERVICE_PREFIX) && servicesHref) {
      trail.push({ name: "Services", url: `${SITE_URL}${servicesHref}` });
    }
    if (path !== "/") trail.push({ name, url });

    const pageType = path === "/about" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage";
    const graph: Json[] = [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.url })),
      },
      {
        "@type": pageType,
        "@id": `${url}#webpage`,
        url,
        name: str(meta.title) || name,
        ...(description ? { description } : {}),
        isPartOf: { "@id": SITE },
        about: { "@id": ORG },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en-IN",
      },
    ];

    if (path.startsWith(SERVICE_PREFIX)) {
      graph.push({
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: name,
        url,
        ...(description ? { description } : {}),
        provider: { "@id": ORG },
        mainEntityOfPage: { "@id": `${url}#webpage` },
      });
    }

    const faq = isObj(data.faq) ? data.faq : null;
    const items = faq && Array.isArray(faq.items) ? faq.items : [];
    const qa = items
      .filter(isObj)
      .map((i) => ({ q: str(i.q), a: str(i.a) }))
      .filter((i) => i.q && i.a);
    if (qa.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: qa.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      });
    }

    out[path] = { "@context": "https://schema.org", "@graph": graph };
  }
  return out;
}

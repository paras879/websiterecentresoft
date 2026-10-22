import { getSiteContent } from "@/lib/content";
import { publishedPages } from "@/lib/custom-pages";
import { pagePath } from "@/lib/custom-pages-types";
import { SITE_URL } from "@/lib/seo";
import { buildSiteInfo } from "@/lib/site";

/**
 * /llms.txt: a short Markdown guide to the website for AI tools (the llms.txt convention). It is written from the
 * same content as the site, so it stays right when the admin changes a service, a contact detail or a page.
 */
export async function GET() {
  const content = await getSiteContent();
  const info = buildSiteInfo(content.site);
  const custom = await publishedPages();
  const url = (path: string) => `${SITE_URL}${path}`;
  const one = (s: string) => s.replace(/\s+/g, " ").trim();

  const services = content.site.header.menu.map((m) => ({ title: m.title, desc: m.desc, href: m.href }));
  for (const p of custom) {
    if (p.menu === "services" && !services.some((s) => s.href === pagePath(p))) services.push({ title: p.title, desc: p.seo.description, href: pagePath(p) });
  }
  const more = custom.filter((p) => !services.some((s) => s.href === pagePath(p)));

  const lines: string[] = [];
  lines.push(`# ${info.legalName}`, "");
  lines.push(`> ${one(info.description)}`, "");
  lines.push(`${one(info.tagline)}.`, "");

  lines.push("## Services", "");
  for (const s of services) lines.push(`- [${s.title}](${url(s.href)})${s.desc ? `: ${one(s.desc)}` : ""}`);
  lines.push("");

  lines.push("## Company", "");
  lines.push(`- [Home](${url("/")}): What the company does and the services it offers.`);
  lines.push(`- [About us](${url("/about")}): Who we are and how we work.`);
  lines.push(`- [Careers](${url("/careers")}): Working with us, and a form to send a profile or resume.`);
  lines.push(`- [Contact](${url("/contact")}): Contact form, office address, phone and email.`);
  for (const p of more) lines.push(`- [${p.title}](${url(pagePath(p))})${p.seo.description ? `: ${one(p.seo.description)}` : ""}`);
  lines.push("");

  lines.push("## Contact", "");
  lines.push(`- Email: ${info.contact.email}`);
  if (info.contact.hrEmail) lines.push(`- Careers email: ${info.contact.hrEmail}`);
  if (info.contact.phone) lines.push(`- Phone: ${info.contact.phone}`);
  if (info.contact.address) lines.push(`- Address: ${one(info.contact.address)}`);
  if (info.contact.officeHours) lines.push(`- Office hours: ${one(info.contact.officeHours)}`);
  lines.push("");

  lines.push("## Policies", "");
  lines.push(`- [Privacy Policy](${url("/privacy-policy")})`);
  lines.push(`- [Terms and Conditions](${url("/terms-and-conditions")})`);
  lines.push(`- [Sitemap](${url("/sitemap.xml")})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}

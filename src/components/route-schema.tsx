import { getSiteContent } from "@/lib/content";
import { buildPageSchemas } from "@/lib/schema";
import { JsonLd } from "./json-ld";

/**
 * The structured data (breadcrumbs, the page itself, services, FAQs) for one page. Each page asks only for its own,
 * so a page does not carry the structured data of every other page inside its HTML.
 */
export async function RouteSchema({ path }: { path: string }) {
  const data = buildPageSchemas(await getSiteContent())[path];
  return data ? <JsonLd data={data} /> : null;
}

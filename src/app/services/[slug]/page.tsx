import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomPageView } from "@/components/custom-page-view";
import { JsonLd } from "@/components/json-ld";
import { customPageMetadata, customPageSchema } from "@/lib/custom-page-seo";
import { publishedPage } from "@/lib/custom-pages";

// Rendered on each visit from the (briefly cached) saved pages, so a save, unpublish or delete shows at once.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await publishedPage("services", (await params).slug);
  return page ? customPageMetadata(page) : { title: "Page not found", robots: { index: false } };
}

/** A page made in the admin panel, at the address /services/something. The six built-in services take priority. */
export default async function CustomServicePageRoute({ params }: Props) {
  const page = await publishedPage("services", (await params).slug);
  if (!page) notFound();
  return (
    <>
      <JsonLd data={customPageSchema(page)} />
      <CustomPageView page={page} />
    </>
  );
}

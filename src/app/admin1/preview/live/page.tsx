import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { allowed, getCmsUser } from "@/lib/cms-auth";
import { getSiteContent } from "@/lib/content";
import { publishedPages } from "@/lib/custom-pages";
import { buildSiteInfo } from "@/lib/site";
import { LiveFrame } from "./live-frame";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: { absolute: "Live preview | Recenturesoft" }, robots: { index: false, follow: false } };

/** The page inside the editor's live preview. It shows whatever the editor sends, saved or not, with the site's header and footer. */
export default async function LivePreviewPage() {
  const user = await getCmsUser();
  if (!user) redirect("/admin1/login");
  if (!allowed(user, "pages", "read")) notFound();

  const content = await getSiteContent();
  return <LiveFrame site={content.site} info={buildSiteInfo(content.site)} others={await publishedPages()} />;
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { allowed, getCmsUser } from "@/lib/cms-auth";
import { LiveFrame } from "./live-frame";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: { absolute: "Live preview | Recenturesoft" }, robots: { index: false, follow: false } };

/** The page inside the editor's live preview. It shows whatever the editor sends, saved or not. */
export default async function LivePreviewPage() {
  const user = await getCmsUser();
  if (!user) redirect("/admin1/login");
  if (!allowed(user, "pages", "read")) notFound();
  return <LiveFrame />;
}

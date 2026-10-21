import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CustomPageView } from "@/components/custom-page-view";
import { allowed, getCmsUser } from "@/lib/cms-auth";
import { getPage } from "@/lib/custom-pages";
import { pagePath } from "@/lib/custom-pages-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: { absolute: "Preview | Recenturesoft" }, robots: { index: false, follow: false } };

/** Shows a page, drafts included, to people who may read pages. The site's header and footer are left out. */
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCmsUser();
  if (!user) redirect("/admin1/login");
  if (!allowed(user, "pages", "read")) notFound();

  const page = await getPage((await params).id);
  if (!page) notFound();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg-page)" }}>
      <div
        role="note"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 16px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          fontSize: 14,
          color: "#ffffff",
          background: "#111111",
        }}
      >
        <span>
          Preview of <strong>{page.title}</strong> ({page.status === "published" ? "published" : "draft, not visible to visitors"}) at {pagePath(page)}
        </span>
        <Link href={`/admin1/collections/pages/${page.id}`} style={{ color: "#ffffff", textDecoration: "underline" }}>
          Back to the editor
        </Link>
      </div>
      <CustomPageView page={page} />
    </div>
  );
}

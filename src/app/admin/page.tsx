import { redirect } from "next/navigation";
import { adminStatus, adminUsername, isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/content";
import { listInquiries } from "@/lib/records";
import { getStore } from "@/lib/store";
import { AdminApp } from "./_components/admin-app";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticatedAdmin())) redirect("/admin/login");

  const [content, status, username, inquiries] = await Promise.all([
    getSiteContent(),
    adminStatus(),
    adminUsername(),
    listInquiries().catch(() => []),
  ]);

  return (
    <AdminApp
      initialContent={content}
      initialInquiries={inquiries}
      system={{ storage: getStore().kind, source: status.source, username }}
    />
  );
}

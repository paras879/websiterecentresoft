import { redirect } from "next/navigation";
import { modules, type SiteContent } from "@/content";
import { pageResource } from "@/lib/cms-access";
import { allowed, getCmsUser } from "@/lib/cms-auth";
import { getSiteContent } from "@/lib/content";
import { listInquiries } from "@/lib/records";
import { buildSiteInfo } from "@/lib/site";
import { getStore } from "@/lib/store";
import { CmsApp } from "../_components/cms-app";

export const dynamic = "force-dynamic";

/** Every page of the panel lives inside this one shell, so the data is loaded once and the pages switch instantly. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCmsUser();
  if (!user) redirect("/admin1/login");

  const [content, inquiries] = await Promise.all([
    getSiteContent(),
    allowed(user, "inbox", "read") ? listInquiries().catch(() => []) : Promise.resolve([]),
  ]);

  // Only the pages this person may read are sent to the browser.
  const readable = Object.fromEntries(
    modules.filter((m) => allowed(user, pageResource(m.id), "read")).map((m) => [m.id, (content as unknown as Record<string, unknown>)[m.id]]),
  ) as unknown as SiteContent;

  const info = buildSiteInfo(content.site);

  return (
    <CmsApp
      user={{ id: user.id, name: user.name, email: user.email, username: user.username, roleId: user.roleId, roleName: user.role.name, root: user.root }}
      permissions={user.permissions}
      superUser={user.role.id === "super"}
      initialContent={readable}
      initialInquiries={inquiries}
      storage={getStore().kind}
      company={{ legalName: info.legalName, email: info.contact.email, year: new Date().getFullYear() }}
    >
      {children}
    </CmsApp>
  );
}

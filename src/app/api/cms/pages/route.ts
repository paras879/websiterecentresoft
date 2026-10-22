import { revalidatePath, revalidateTag } from "next/cache";
import { logAudit } from "@/lib/audit";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { createPage, listPages } from "@/lib/custom-pages";
import { pagePath } from "@/lib/custom-pages-types";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  const guard = await guardCms(req, { resource: "pages", action: "read" });
  if ("denied" in guard) return guard.denied;
  try {
    return json({ success: true, pages: await listPages() });
  } catch (error) {
    return cmsFailure(error, "Could not load the pages.");
  }
}

export async function POST(req: Request) {
  const guard = await guardCms(req, { resource: "pages", action: "create" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const page = await createPage(await req.json(), guard.user.name);
    await logAudit("page", `Created the page "${page.title}" (${pagePath(page)}, ${page.status})`, guard.user);
    try {
      revalidateTag("site-content", { expire: 0 });
      revalidatePath("/", "layout");
      revalidatePath(pagePath(page));
    } catch {}
    return json({ success: true, page });
  } catch (error) {
    return cmsFailure(error, "Could not create the page.");
  }
}

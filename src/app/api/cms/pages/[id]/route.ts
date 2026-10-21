import { revalidatePath, revalidateTag } from "next/cache";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { deletePage, getPage, updatePage } from "@/lib/custom-pages";
import { pagePath } from "@/lib/custom-pages-types";
import { json } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

const refresh = (paths: string[]) => {
  try {
    revalidateTag("site-content", { expire: 0 });
    revalidatePath("/", "layout");
    for (const p of paths) revalidatePath(p);
  } catch {}
};

export async function GET(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "pages", action: "read" });
  if ("denied" in guard) return guard.denied;
  try {
    const page = await getPage((await params).id);
    return page ? json({ success: true, page }) : json({ success: false, error: "That page no longer exists." }, 404);
  } catch (error) {
    return cmsFailure(error, "Could not load the page.");
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "pages", action: "update" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const { id } = await params;
    const before = await getPage(id);
    const page = await updatePage(id, await req.json(), guard.user.name);
    // The old address (if it changed) and the new one both need refreshing.
    refresh([pagePath(page), ...(before ? [pagePath(before)] : [])]);
    return json({ success: true, page });
  } catch (error) {
    return cmsFailure(error, "Could not save the page.");
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "pages", action: "delete" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const { id } = await params;
    const before = await getPage(id);
    const ok = await deletePage(id);
    if (!ok) return json({ success: false, error: "That page no longer exists." }, 404);
    refresh(before ? [pagePath(before)] : []);
    return json({ success: true });
  } catch (error) {
    return cmsFailure(error, "Could not delete the page.");
  }
}

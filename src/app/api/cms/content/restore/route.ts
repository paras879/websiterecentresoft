import { revalidatePath } from "next/cache";
import { modules } from "@/content";
import { logAudit } from "@/lib/audit";
import { pageResource } from "@/lib/cms-access";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { getSiteContent, moduleVersions, saveSiteContent } from "@/lib/content";
import { json } from "@/lib/api";

/** Brings back one earlier copy of one page. Everything else on the site stays as it is. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { module?: unknown; versionId?: unknown };
    const mod = modules.find((m) => m.id === body.module);
    if (!mod || typeof body.versionId !== "string") return json({ success: false, error: "Choose a version to restore." }, 400);

    const guard = await guardCms(req, { resource: pageResource(mod.id), action: "restore" }, { write: true });
    if ("denied" in guard) return guard.denied;

    const version = (await moduleVersions(mod.id)).find((v) => v.id === body.versionId);
    if (!version) return json({ success: false, error: "That version is no longer available." }, 404);

    const current = await getSiteContent();
    const saved = await saveSiteContent({ ...current, [mod.id]: version.data }, `${mod.title} restored by ${guard.user.name}`);
    await logAudit("version", `Restored an earlier version of ${mod.title}`, guard.user);
    try {
      revalidatePath("/", "layout");
    } catch {}
    return json({ success: true, data: (saved as unknown as Record<string, unknown>)[mod.id] });
  } catch (error) {
    return cmsFailure(error, "That version could not be restored. Please try again.");
  }
}

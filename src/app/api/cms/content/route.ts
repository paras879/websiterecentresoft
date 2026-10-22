import { revalidatePath } from "next/cache";
import { modules } from "@/content";
import { pageResource } from "@/lib/cms-access";
import { changedParts, logAudit } from "@/lib/audit";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { getDefaultContent, getSiteContent, saveSiteContent } from "@/lib/content";
import { json } from "@/lib/api";

/**
 * Saves one page (or one site-wide block) on its own. The page is merged into the newest saved copy, so two people
 * editing different pages never overwrite each other.
 */
export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { module?: unknown; data?: unknown };
    const mod = modules.find((m) => m.id === body.module);
    if (!mod || !body.data || typeof body.data !== "object") {
      return json({ success: false, error: "Nothing to save." }, 400);
    }

    const guard = await guardCms(req, { resource: pageResource(mod.id), action: "update" }, { write: true });
    if ("denied" in guard) return guard.denied;

    const current = await getSiteContent();
    const saved = await saveSiteContent({ ...current, [mod.id]: body.data }, `${mod.title} edited by ${guard.user.name}`);
    const fields = changedParts((current as unknown as Record<string, unknown>)[mod.id], (saved as unknown as Record<string, unknown>)[mod.id]);
    if (fields.length) {
      const more = fields.length > 6 ? ` and ${fields.length - 6} more` : "";
      await logAudit("content", `Edited ${mod.title} (${fields.slice(0, 6).join(", ")}${more})`, guard.user);
    }
    try {
      revalidatePath("/", "layout");
    } catch {}
    return json({ success: true, data: (saved as unknown as Record<string, unknown>)[mod.id] });
  } catch (error) {
    return cmsFailure(error, "Your changes could not be saved. Please try again.");
  }
}

/** Puts one page back to the content it shipped with. Needs the Delete permission on that page. */
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("module");
    const mod = modules.find((m) => m.id === id);
    if (!mod) return json({ success: false, error: "That page does not exist." }, 404);

    const guard = await guardCms(req, { resource: pageResource(mod.id), action: "delete" }, { write: true });
    if ("denied" in guard) return guard.denied;

    const original = (getDefaultContent() as unknown as Record<string, unknown>)[mod.id];
    const current = await getSiteContent();
    const saved = await saveSiteContent({ ...current, [mod.id]: original }, `${mod.title} reset to the original by ${guard.user.name}`);
    await logAudit("content", `Reset ${mod.title} to its original content`, guard.user);
    try {
      revalidatePath("/", "layout");
    } catch {}
    return json({ success: true, data: (saved as unknown as Record<string, unknown>)[mod.id] });
  } catch (error) {
    return cmsFailure(error, "The page could not be reset. Please try again.");
  }
}

import { modules } from "@/content";
import { pageResource } from "@/lib/cms-access";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { getSiteContent, moduleVersions } from "@/lib/content";
import { json } from "@/lib/api";

/** Earlier copies of one page that differ from what is live now. Needs the Restore permission on that page. */
export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("module");
    const mod = modules.find((m) => m.id === id);
    if (!mod) return json({ success: false, error: "That page does not exist." }, 404);

    const guard = await guardCms(req, { resource: pageResource(mod.id), action: "restore" });
    if ("denied" in guard) return guard.denied;

    const now = JSON.stringify((await getSiteContent() as unknown as Record<string, unknown>)[mod.id]);
    const versions = (await moduleVersions(mod.id))
      .filter((v) => JSON.stringify(v.data) !== now)
      .map(({ id: vid, at, note }) => ({ id: vid, at, note }));
    return json({ success: true, versions });
  } catch (error) {
    return cmsFailure(error, "Could not load the earlier versions.");
  }
}

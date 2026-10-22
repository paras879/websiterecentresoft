import { listAudit } from "@/lib/audit";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  const guard = await guardCms(req, { resource: "audit", action: "read" });
  if ("denied" in guard) return guard.denied;
  try {
    return json({ success: true, entries: await listAudit() });
  } catch (error) {
    return cmsFailure(error, "Could not load the activity log.");
  }
}

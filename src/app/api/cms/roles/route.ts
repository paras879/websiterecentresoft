import { allowed, mayManageRole } from "@/lib/cms-auth";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { CmsError, createRole, listRoles, usersPerRole } from "@/lib/cms-users";
import { cleanPermissions } from "@/lib/cms-access";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  // The users form needs the list of roles too, so being allowed to read users is enough.
  const guard = await guardCms(req, null);
  if ("denied" in guard) return guard.denied;
  if (!allowed(guard.user, "roles", "read") && !allowed(guard.user, "users", "read")) {
    return json({ success: false, error: "Your role does not allow this." }, 403);
  }
  try {
    return json({ success: true, roles: await listRoles(), counts: await usersPerRole() });
  } catch (error) {
    return cmsFailure(error, "Could not load the roles.");
  }
}

export async function POST(req: Request) {
  const guard = await guardCms(req, { resource: "roles", action: "create" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const b = (await req.json()) as Record<string, unknown>;
    const permissions = cleanPermissions(b.permissions);
    if (!mayManageRole(guard.user, { id: "", name: "", description: "", permissions })) {
      throw new CmsError("You cannot give a role more access than you have yourself.", 403);
    }
    const role = await createRole({
      name: typeof b.name === "string" ? b.name : "",
      description: typeof b.description === "string" ? b.description : "",
      permissions,
    });
    return json({ success: true, role });
  } catch (error) {
    return cmsFailure(error, "Could not create the role.");
  }
}

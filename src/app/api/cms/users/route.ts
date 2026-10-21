import { mayManageRole } from "@/lib/cms-auth";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { CmsError, createUser, getRole, listUsers } from "@/lib/cms-users";
import { json } from "@/lib/api";

export async function GET(req: Request) {
  const guard = await guardCms(req, { resource: "users", action: "read" });
  if ("denied" in guard) return guard.denied;
  try {
    return json({ success: true, users: await listUsers() });
  } catch (error) {
    return cmsFailure(error, "Could not load the users.");
  }
}

export async function POST(req: Request) {
  const guard = await guardCms(req, { resource: "users", action: "create" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const b = (await req.json()) as Record<string, unknown>;
    const roleId = typeof b.roleId === "string" ? b.roleId : "";
    const role = await getRole(roleId);
    if (!role) throw new CmsError("Choose a role for this user.");
    if (!mayManageRole(guard.user, role)) throw new CmsError("You cannot give a role with more access than your own.", 403);

    const user = await createUser({
      email: typeof b.email === "string" ? b.email : "",
      name: typeof b.name === "string" ? b.name : "",
      roleId,
      password: typeof b.password === "string" ? b.password : "",
      disabled: b.disabled === true,
    });
    return json({ success: true, user });
  } catch (error) {
    return cmsFailure(error, "Could not create the user.");
  }
}

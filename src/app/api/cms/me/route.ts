import { logAudit } from "@/lib/audit";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { checkPassword, CmsError, getStoredUser, updateUser } from "@/lib/cms-users";
import { json } from "@/lib/api";

/** A person changes their own name, email or password. */
export async function PATCH(req: Request) {
  const guard = await guardCms(req, null, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    if (guard.user.root) {
      throw new CmsError("This is the administrator from the environment. Change its password from /admin, under Account.", 403);
    }
    const b = (await req.json()) as Record<string, unknown>;
    const stored = await getStoredUser(guard.user.id);
    if (!stored) throw new CmsError("Your account no longer exists.", 404);

    const patch: { name?: string; email?: string; password?: string } = {};
    if (typeof b.name === "string") patch.name = b.name;
    if (typeof b.email === "string") patch.email = b.email;
    if (typeof b.newPassword === "string" && b.newPassword) {
      if (typeof b.currentPassword !== "string" || !(await checkPassword(stored, b.currentPassword))) {
        throw new CmsError("Your current password is not correct.");
      }
      patch.password = b.newPassword;
    }
    const user = await updateUser(stored.id, patch);
    await logAudit("account", patch.password ? "Changed their own details and password" : "Changed their own details", guard.user);
    return json({ success: true, user, passwordChanged: Boolean(patch.password) });
  } catch (error) {
    return cmsFailure(error, "Could not save your details.");
  }
}

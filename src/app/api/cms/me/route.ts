import { adminUsername, saveCredentials, verifyCurrentPassword } from "@/lib/admin-auth";
import { SUPER_ROLE_ID } from "@/lib/cms-access";
import { cmsLogout } from "@/lib/cms-auth";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { checkPassword, CmsError, getStoredUser, loginNameTaken, MIN_PASSWORD, updateUser } from "@/lib/cms-users";
import { logAudit } from "@/lib/audit";
import { json } from "@/lib/api";

/**
 * Changing your own sign-in details. Only a Super admin may do it: the administrator from the environment changes the
 * username and password, and a Super admin created under Users changes name, email, username and password.
 * Everyone else is locked and asks an administrator.
 */
export async function PATCH(req: Request) {
  const guard = await guardCms(req, null, { write: true });
  if ("denied" in guard) return guard.denied;
  const me = guard.user;
  try {
    if (me.role.id !== SUPER_ROLE_ID) {
      throw new CmsError("Your account details are locked. Please contact your administrator to change them.", 403);
    }
    const b = (await req.json()) as Record<string, unknown>;
    const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
    const currentPassword = text(b.currentPassword, 200);
    const newPassword = text(b.newPassword, 200);

    if (newPassword && newPassword.length < MIN_PASSWORD) throw new CmsError(`Use at least ${MIN_PASSWORD} characters for the new password.`);

    /* ---- the administrator from the environment */
    if (me.root) {
      const username = text(b.username, 60).trim() || (await adminUsername());
      if (username.length > 40) throw new CmsError("Use a username up to 40 characters.");
      if (!currentPassword || !(await verifyCurrentPassword(currentPassword))) throw new CmsError("Your current password is not correct.");
      if (username.toLowerCase() !== (await adminUsername()).toLowerCase() && (await loginNameTaken(username))) {
        throw new CmsError("Someone created under Users already signs in with this name. Choose another.", 409);
      }
      await saveCredentials(username, newPassword || currentPassword);
      await logAudit("account", newPassword ? "Changed the administrator username or password" : "Changed the administrator username", me);
      // Every session ends, so sign in again with the new details.
      await cmsLogout();
      return json({ success: true, signedOut: true });
    }

    /* ---- a Super admin created under Users */
    const stored = await getStoredUser(me.id);
    if (!stored) throw new CmsError("Your account no longer exists.", 404);
    const patch: { name?: string; email?: string; username?: string; password?: string } = {};
    if (typeof b.name === "string") patch.name = b.name;
    if (typeof b.email === "string") patch.email = b.email;
    if (typeof b.username === "string") patch.username = b.username;
    if (newPassword) {
      if (!currentPassword || !(await checkPassword(stored, currentPassword))) throw new CmsError("Your current password is not correct.");
      patch.password = newPassword;
    }
    const user = await updateUser(stored.id, patch);
    await logAudit("account", newPassword ? "Changed their own details and password" : "Changed their own details", me);
    return json({ success: true, user, signedOut: Boolean(newPassword) });
  } catch (error) {
    return cmsFailure(error, "Could not save your details.");
  }
}

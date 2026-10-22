import { logAudit } from "@/lib/audit";
import { mayManageRole } from "@/lib/cms-auth";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { CmsError, deleteUser, getRole, getStoredUser, updateUser } from "@/lib/cms-users";
import { json } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "users", action: "update" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const { id } = await params;
    const target = await getStoredUser(id);
    if (!target) throw new CmsError("That user no longer exists.", 404);

    // Nobody can edit a person whose role holds more than their own.
    const targetRole = await getRole(target.roleId);
    if (targetRole && !mayManageRole(guard.user, targetRole)) {
      throw new CmsError("You cannot change a user with more access than your own.", 403);
    }

    const b = (await req.json()) as Record<string, unknown>;
    const patch: { email?: string; name?: string; roleId?: string; disabled?: boolean; password?: string } = {};
    if (typeof b.email === "string") patch.email = b.email;
    if (typeof b.name === "string") patch.name = b.name;
    if (typeof b.password === "string" && b.password) patch.password = b.password;

    if (typeof b.roleId === "string" && b.roleId !== target.roleId) {
      if (id === guard.user.id) throw new CmsError("You cannot change your own role.", 403);
      const role = await getRole(b.roleId);
      if (!role) throw new CmsError("Choose a role for this user.");
      if (!mayManageRole(guard.user, role)) throw new CmsError("You cannot give a role with more access than your own.", 403);
      patch.roleId = b.roleId;
    }
    if (typeof b.disabled === "boolean") {
      if (b.disabled && id === guard.user.id) throw new CmsError("You cannot switch off your own account.", 403);
      patch.disabled = b.disabled;
    }

    const user = await updateUser(id, patch);
    const did = [
      patch.name !== undefined && patch.name !== target.name ? "name" : "",
      patch.email !== undefined ? "email" : "",
      patch.password ? "password reset" : "",
      patch.roleId ? `role changed to ${(await getRole(patch.roleId))?.name ?? patch.roleId}` : "",
      patch.disabled !== undefined && patch.disabled !== Boolean(target.disabled) ? (patch.disabled ? "switched off" : "switched on") : "",
    ].filter(Boolean);
    await logAudit("user", `Changed the user ${user.email}${did.length ? `: ${did.join(", ")}` : ""}`, guard.user);
    return json({ success: true, user });
  } catch (error) {
    return cmsFailure(error, "Could not save the user.");
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "users", action: "delete" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const { id } = await params;
    if (id === guard.user.id) throw new CmsError("You cannot delete your own account.", 403);
    const target = await getStoredUser(id);
    if (!target) throw new CmsError("That user no longer exists.", 404);
    const targetRole = await getRole(target.roleId);
    if (targetRole && !mayManageRole(guard.user, targetRole)) {
      throw new CmsError("You cannot delete a user with more access than your own.", 403);
    }
    await deleteUser(id);
    await logAudit("user", `Deleted the user ${target.email}`, guard.user);
    return json({ success: true });
  } catch (error) {
    return cmsFailure(error, "Could not delete the user.");
  }
}

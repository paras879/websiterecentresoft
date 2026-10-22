import { logAudit } from "@/lib/audit";
import { mayManageRole } from "@/lib/cms-auth";
import { cleanPermissions } from "@/lib/cms-access";
import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { CmsError, deleteRole, getRole, updateRole } from "@/lib/cms-users";
import { json } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "roles", action: "update" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const { id } = await params;
    const existing = await getRole(id);
    if (!existing) throw new CmsError("That role no longer exists.", 404);
    if (!mayManageRole(guard.user, existing)) {
      throw new CmsError("You cannot change a role with more access than your own.", 403);
    }

    const b = (await req.json()) as Record<string, unknown>;
    const permissions = b.permissions !== undefined ? cleanPermissions(b.permissions) : undefined;
    if (permissions && !mayManageRole(guard.user, { ...existing, permissions })) {
      throw new CmsError("You cannot give a role more access than you have yourself.", 403);
    }
    const role = await updateRole(id, {
      name: typeof b.name === "string" ? b.name : undefined,
      description: typeof b.description === "string" ? b.description : undefined,
      permissions,
    });
    await logAudit("role", `Changed the role "${role.name}"${permissions ? " (permissions updated)" : ""}`, guard.user);
    return json({ success: true, role });
  } catch (error) {
    return cmsFailure(error, "Could not save the role.");
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const guard = await guardCms(req, { resource: "roles", action: "delete" }, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    const { id } = await params;
    const existing = await getRole(id);
    if (!existing) throw new CmsError("That role no longer exists.", 404);
    if (!mayManageRole(guard.user, existing)) {
      throw new CmsError("You cannot delete a role with more access than your own.", 403);
    }
    await deleteRole(id);
    await logAudit("role", existing.builtin ? `Restored the original permissions of the role "${existing.name}"` : `Deleted the role "${existing.name}"`, guard.user);
    return json({ success: true });
  } catch (error) {
    return cmsFailure(error, "Could not delete the role.");
  }
}

import crypto from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import {
  adminUsername,
  clearAdminSession,
  createAdminSession,
  isAuthenticatedAdmin,
  sessionSecret,
  verifyLogin,
} from "./admin-auth";
import { can, isSubset, type Action, type Permissions, type Role, SUPER_ROLE_ID, BUILTIN_ROLES } from "./cms-access";
import { checkPassword, findUserByLogin, fingerprint, getRole, getStoredUser, touchLogin } from "./cms-users";

const COOKIE = "rs_cms";
const SESSION_SECONDS = 60 * 60 * 24;
export const ROOT_ID = "root";

export interface CmsUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  roleId: string;
  role: Role;
  permissions: Permissions;
  /** The administrator whose login comes from the environment (the same one as /admin). */
  root: boolean;
}

const superRole = (): Role => BUILTIN_ROLES.find((r) => r.id === SUPER_ROLE_ID)!;

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(`cms.${payload}`).digest("base64url");

async function setSession(userId: string, pv: string): Promise<void> {
  const secret = sessionSecret();
  if (!secret) throw new Error("Admin is not configured");
  const payload = b64(JSON.stringify({ u: userId, pv, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

async function rootUser(): Promise<CmsUser> {
  const role = superRole();
  const username = await adminUsername();
  return { id: ROOT_ID, email: username, name: "Administrator", roleId: role.id, role, permissions: role.permissions, root: true };
}

/** The signed-in person, or null. Looks at the panel's own cookie first, then at the /admin sign-in. */
export const getCmsUser = cache(async (): Promise<CmsUser | null> => {
  try {
    const secret = sessionSecret();
    const token = (await cookies()).get(COOKIE)?.value;
    if (secret && token) {
      const [payload, signature] = token.split(".");
      if (payload && signature) {
        const expected = sign(payload, secret);
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
          const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as { u: string; pv: string; exp: number };
          if (data.exp && data.exp >= Date.now() / 1000) {
            const user = await getStoredUser(data.u);
            // A disabled or deleted user, or a changed password, ends the session.
            if (user && !user.disabled && fingerprint(user) === data.pv) {
              const role = await getRole(user.roleId);
              if (role) {
                return { id: user.id, email: user.email, username: user.username, name: user.name, roleId: role.id, role, permissions: role.permissions, root: false };
              }
            }
          }
        }
      }
    }
  } catch {
    /* fall through to the /admin sign-in */
  }
  if (await isAuthenticatedAdmin()) return rootUser();
  return null;
});

export type LoginResult = { ok: true; user: CmsUser } | { ok: false; reason: "invalid" | "disabled" };

export async function cmsLogin(identifier: string, password: string): Promise<LoginResult> {
  const stored = await findUserByLogin(identifier);
  if (stored) {
    if (!(await checkPassword(stored, password))) return { ok: false, reason: "invalid" };
    if (stored.disabled) return { ok: false, reason: "disabled" };
    const role = await getRole(stored.roleId);
    if (!role) return { ok: false, reason: "invalid" };
    await setSession(stored.id, fingerprint(stored));
    await touchLogin(stored.id).catch(() => undefined);
    return {
      ok: true,
      user: { id: stored.id, email: stored.email, username: stored.username, name: stored.name, roleId: role.id, role, permissions: role.permissions, root: false },
    };
  }

  // The administrator from the environment (the same username and password as /admin).
  const username = await verifyLogin(identifier, password);
  if (username) {
    await createAdminSession(username);
    return { ok: true, user: await rootUser() };
  }
  return { ok: false, reason: "invalid" };
}

export async function cmsLogout(): Promise<void> {
  (await cookies()).delete(COOKIE);
  await clearAdminSession();
}

/** True when the person may do this. */
export const allowed = (user: CmsUser | null, resource: string, action: Action): boolean =>
  Boolean(user) && (user!.role.id === SUPER_ROLE_ID || can(user!.permissions, resource, action));

/** A person may give out or change a role only if it grants nothing they do not hold themselves. */
export const mayManageRole = (user: CmsUser, role: Role): boolean =>
  user.role.id === SUPER_ROLE_ID || isSubset(role.permissions, user.permissions);

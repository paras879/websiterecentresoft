import crypto from "node:crypto";
import { promisify } from "node:util";
import { adminUsername } from "./admin-auth";
import { BUILTIN_ROLES, cleanPermissions, type Permissions, type Role, SUPER_ROLE_ID } from "./cms-access";
import { getStore } from "./store";

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const USERS = "cms:users";
const ROLES = "cms:roles";

export const MIN_PASSWORD = 10;

/* ------------------------------------------------------------------ users */

interface StoredUser {
  id: string;
  email: string;
  /** Optional short sign-in name, used instead of the email. */
  username?: string;
  name: string;
  roleId: string;
  salt: string;
  hash: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface PublicUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  roleId: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export const publicUser = (u: StoredUser): PublicUser => ({
  id: u.id,
  email: u.email,
  username: u.username,
  name: u.name,
  roleId: u.roleId,
  disabled: u.disabled,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
  lastLogin: u.lastLogin,
});

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`;

async function hashPassword(password: string): Promise<{ salt: string; hash: string }> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return { salt: salt.toString("hex"), hash: hash.toString("hex") };
}

export async function checkPassword(user: StoredUser, password: string): Promise<boolean> {
  const derived = await scrypt(password, Buffer.from(user.salt, "hex"), 64);
  const expected = Buffer.from(user.hash, "hex");
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}

/** First characters of the password hash. A session carries it, so changing the password signs the person out. */
export const fingerprint = (u: StoredUser) => u.hash.slice(0, 16);

async function readAll(): Promise<StoredUser[]> {
  const all = await getStore().hgetall(USERS);
  return Object.values(all)
    .map((raw) => {
      try {
        return JSON.parse(raw) as StoredUser;
      } catch {
        return null;
      }
    })
    .filter((u): u is StoredUser => u !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export async function listUsers(): Promise<PublicUser[]> {
  return (await readAll()).map(publicUser);
}

export async function getStoredUser(id: string): Promise<StoredUser | null> {
  const raw = await getStore().hget(USERS, id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const wanted = email.trim().toLowerCase();
  return (await readAll()).find((u) => u.email.toLowerCase() === wanted) ?? null;
}

/** Finds a person by the email or the username they typed on the sign-in page. */
export async function findUserByLogin(identifier: string): Promise<StoredUser | null> {
  const wanted = identifier.trim().toLowerCase();
  if (!wanted) return null;
  const all = await readAll();
  const direct = all.find((u) => u.email.toLowerCase() === wanted) ?? all.find((u) => u.username?.toLowerCase() === wanted);
  if (direct) return direct;
  // The full name works too, as long as only one person has it.
  const sameName = all.filter((u) => u.name.trim().toLowerCase() === wanted);
  return sameName.length === 1 ? sameName[0] : null;
}

const USERNAME = /^[a-z0-9][a-z0-9._-]{2,31}$/i;

/** Returns the cleaned username ("" for none), or throws when it cannot be used. */
async function checkUsername(raw: string, selfId?: string): Promise<string> {
  const username = raw.trim();
  if (!username) return "";
  if (!USERNAME.test(username)) {
    throw new CmsError("A username is 3 to 32 letters, numbers, dots, dashes or underscores, with no spaces.");
  }
  const lower = username.toLowerCase();
  if (lower === (await adminUsername()).toLowerCase()) throw new CmsError("This username is reserved. Choose another.", 409);
  const clash = (await readAll()).find((u) => u.id !== selfId && (u.username?.toLowerCase() === lower || u.email.toLowerCase() === lower));
  if (clash) throw new CmsError("This username is already taken.", 409);
  return username;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class CmsError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "CmsError";
  }
}

function checkFields(email: string, name: string) {
  if (!EMAIL.test(email) || email.length > 200) throw new CmsError("Enter a valid email address.");
  if (!name.trim() || name.trim().length > 80) throw new CmsError("Enter a name up to 80 characters.");
}

function checkPasswordRules(password: string) {
  if (password.length < MIN_PASSWORD) throw new CmsError(`Use at least ${MIN_PASSWORD} characters for the password.`);
  if (password.length > 200) throw new CmsError("That password is too long.");
}

export async function createUser(input: {
  email: string;
  name: string;
  username?: string;
  roleId: string;
  password: string;
  disabled?: boolean;
}): Promise<PublicUser> {
  const email = input.email.trim();
  checkFields(email, input.name);
  const username = await checkUsername(input.username ?? "");
  checkPasswordRules(input.password);
  if (!(await getRole(input.roleId))) throw new CmsError("Choose a role for this user.");
  if (await findUserByEmail(email)) throw new CmsError("A user with this email already exists.", 409);

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: newId("u"),
    email,
    ...(username ? { username } : {}),
    name: input.name.trim(),
    roleId: input.roleId,
    ...(await hashPassword(input.password)),
    disabled: Boolean(input.disabled),
    createdAt: now,
    updatedAt: now,
  };
  await getStore().hset(USERS, user.id, JSON.stringify(user));
  return publicUser(user);
}

export async function updateUser(
  id: string,
  patch: { email?: string; username?: string; name?: string; roleId?: string; disabled?: boolean; password?: string },
): Promise<PublicUser> {
  const user = await getStoredUser(id);
  if (!user) throw new CmsError("That user no longer exists.", 404);

  if (patch.email !== undefined || patch.name !== undefined) {
    const email = (patch.email ?? user.email).trim();
    const name = patch.name ?? user.name;
    checkFields(email, name);
    const other = await findUserByEmail(email);
    if (other && other.id !== id) throw new CmsError("A user with this email already exists.", 409);
    user.email = email;
    user.name = name.trim();
  }
  if (patch.username !== undefined) {
    const username = await checkUsername(patch.username, id);
    if (username) user.username = username;
    else delete user.username;
  }
  if (patch.roleId !== undefined) {
    if (!(await getRole(patch.roleId))) throw new CmsError("Choose a role for this user.");
    user.roleId = patch.roleId;
  }
  if (patch.disabled !== undefined) user.disabled = patch.disabled;
  if (patch.password) {
    checkPasswordRules(patch.password);
    Object.assign(user, await hashPassword(patch.password));
  }
  user.updatedAt = new Date().toISOString();
  await getStore().hset(USERS, id, JSON.stringify(user));
  return publicUser(user);
}

export async function touchLogin(id: string): Promise<void> {
  const user = await getStoredUser(id);
  if (!user) return;
  user.lastLogin = new Date().toISOString();
  await getStore().hset(USERS, id, JSON.stringify(user));
}

export async function deleteUser(id: string): Promise<boolean> {
  const user = await getStoredUser(id);
  if (!user) return false;
  await getStore().hdel(USERS, id);
  return true;
}

/* ------------------------------------------------------------------ roles */

async function storedRoles(): Promise<Role[]> {
  const all = await getStore().hgetall(ROLES);
  return Object.values(all)
    .map((raw): Role | null => {
      try {
        const r = JSON.parse(raw) as Role;
        return { ...r, permissions: cleanPermissions(r.permissions), builtin: false };
      } catch {
        return null;
      }
    })
    .filter((r): r is Role => r !== null && !BUILTIN_ROLES.some((b) => b.id === r.id))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** A built-in role with the permissions an administrator saved for it, if any. Super admin never changes. */
async function builtinRole(base: Role): Promise<Role> {
  if (base.id === SUPER_ROLE_ID) return base;
  const raw = await getStore().hget(ROLES, base.id);
  if (!raw) return base;
  try {
    const o = JSON.parse(raw) as Partial<Role>;
    return { ...base, description: typeof o.description === "string" ? o.description : base.description, permissions: cleanPermissions(o.permissions), customized: true };
  } catch {
    return base;
  }
}

export async function listRoles(): Promise<Role[]> {
  return [...(await Promise.all(BUILTIN_ROLES.map(builtinRole))), ...(await storedRoles())];
}

export async function getRole(id: string): Promise<Role | null> {
  const builtin = BUILTIN_ROLES.find((r) => r.id === id);
  if (builtin) return builtinRole(builtin);
  const raw = await getStore().hget(ROLES, id);
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as Role;
    return { ...r, permissions: cleanPermissions(r.permissions), builtin: false };
  } catch {
    return null;
  }
}

function checkRoleFields(name: string, description: string) {
  if (!name.trim() || name.trim().length > 60) throw new CmsError("Enter a role name up to 60 characters.");
  if (description.length > 240) throw new CmsError("Keep the description to 240 characters or fewer.");
}

export async function createRole(input: { name: string; description: string; permissions: unknown }): Promise<Role> {
  checkRoleFields(input.name, input.description);
  const taken = (await listRoles()).some((r) => r.name.toLowerCase() === input.name.trim().toLowerCase());
  if (taken) throw new CmsError("A role with this name already exists.", 409);
  const role: Role = {
    id: newId("r"),
    name: input.name.trim(),
    description: input.description.trim(),
    permissions: cleanPermissions(input.permissions),
  };
  await getStore().hset(ROLES, role.id, JSON.stringify(role));
  return role;
}

export async function updateRole(
  id: string,
  patch: { name?: string; description?: string; permissions?: unknown },
): Promise<Role> {
  const role = await getRole(id);
  if (!role) throw new CmsError("That role no longer exists.", 404);
  if (role.builtin) {
    if (id === SUPER_ROLE_ID) throw new CmsError("Super admin always has full access, so it cannot be changed.", 403);
    // Editor and Viewer keep their names; an administrator can change what they may do.
    const description = patch.description ?? role.description;
    if (description.length > 240) throw new CmsError("Keep the description to 240 characters or fewer.");
    const saved = {
      id,
      name: role.name,
      description: description.trim(),
      permissions: patch.permissions !== undefined ? cleanPermissions(patch.permissions) : role.permissions,
    };
    await getStore().hset(ROLES, id, JSON.stringify(saved));
    return { ...role, ...saved, builtin: true, customized: true };
  }
  const name = patch.name ?? role.name;
  const description = patch.description ?? role.description;
  checkRoleFields(name, description);
  const taken = (await listRoles()).some((r) => r.id !== id && r.name.toLowerCase() === name.trim().toLowerCase());
  if (taken) throw new CmsError("A role with this name already exists.", 409);
  const next: Role = {
    id,
    name: name.trim(),
    description: description.trim(),
    permissions: patch.permissions !== undefined ? cleanPermissions(patch.permissions) : role.permissions,
  };
  await getStore().hset(ROLES, id, JSON.stringify(next));
  return next;
}

export async function deleteRole(id: string): Promise<void> {
  if (id === SUPER_ROLE_ID) throw new CmsError("Super admin cannot be deleted.", 403);
  if (BUILTIN_ROLES.some((r) => r.id === id)) {
    // For a built-in role, "delete" puts the original permissions back.
    await getStore().hdel(ROLES, id);
    return;
  }
  const using = (await readAll()).filter((u) => u.roleId === id).length;
  if (using > 0) throw new CmsError(`${using} user${using === 1 ? " uses" : "s use"} this role. Move them to another role first.`, 409);
  await getStore().hdel(ROLES, id);
}

export async function usersPerRole(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const u of await readAll()) counts[u.roleId] = (counts[u.roleId] ?? 0) + 1;
  return counts;
}

export type { Permissions, Role };
export { SUPER_ROLE_ID };

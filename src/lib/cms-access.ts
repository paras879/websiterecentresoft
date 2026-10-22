import { modules } from "@/content";

/**
 * Who may do what in the /admin1 panel.
 *
 * Every part of the panel is a "resource" with a few "actions". A role lists the actions it allows on each
 * resource. This file is shared by the server (to enforce) and the browser (to hide what a person cannot use).
 */

export type Action = "read" | "create" | "update" | "delete" | "restore";

export type ResourceGroup = "Pages" | "Services" | "Site" | "Collections";

export interface ResourceDef {
  id: string;
  label: string;
  group: ResourceGroup;
  actions: Action[];
}

export const ACTION_LABEL: Record<Action, string> = {
  read: "Read",
  create: "Create",
  update: "Update",
  delete: "Delete",
  restore: "Restore",
};

export const pageResource = (moduleId: string) => `page:${moduleId}`;

export const RESOURCES: ResourceDef[] = [
  ...modules.map((m) => ({
    id: pageResource(m.id),
    label: m.id === "site" ? "Header, footer & contact" : m.id === "reviews" ? "Customer reviews" : m.title,
    group: m.group as ResourceGroup,
    actions: ["read", "update"] as Action[],
  })),
  { id: "pages", label: "Custom pages", group: "Collections", actions: ["read", "create", "update", "delete"] },
  { id: "inbox", label: "Messages & applications", group: "Collections", actions: ["read", "update", "delete"] },
  { id: "media", label: "Media", group: "Collections", actions: ["read", "create", "delete"] },
  { id: "history", label: "Versions", group: "Collections", actions: ["read", "restore"] },
  { id: "users", label: "Users", group: "Collections", actions: ["read", "create", "update", "delete"] },
  { id: "roles", label: "Roles", group: "Collections", actions: ["read", "create", "update", "delete"] },
  { id: "audit", label: "Activity log", group: "Collections", actions: ["read"] },
];

export const resourceById = (id: string) => RESOURCES.find((r) => r.id === id);

export type Permissions = Record<string, Action[]>;

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permissions;
  /** Built-in roles ship with the panel and cannot be changed or deleted. */
  builtin?: boolean;
  /** A built-in role whose permissions were changed from the original. */
  customized?: boolean;
}

const everything = (): Permissions => Object.fromEntries(RESOURCES.map((r) => [r.id, [...r.actions]]));

const pagesWith = (actions: Action[]): Permissions =>
  Object.fromEntries(RESOURCES.filter((r) => r.id.startsWith("page:")).map((r) => [r.id, actions.filter((a) => r.actions.includes(a))]));

export const SUPER_ROLE_ID = "super";

export const BUILTIN_ROLES: Role[] = [
  {
    id: SUPER_ROLE_ID,
    name: "Super admin",
    description: "Full access to everything, including users and roles.",
    permissions: everything(),
    builtin: true,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Edits every page, reads messages and uploads images. Cannot manage users or restore versions.",
    permissions: {
      ...pagesWith(["read", "update"]),
      pages: ["read", "create", "update"],
      inbox: ["read", "update"],
      media: ["read", "create"],
      history: ["read"],
    },
    builtin: true,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Can look at everything but change nothing.",
    permissions: {
      ...pagesWith(["read"]),
      pages: ["read"],
      inbox: ["read"],
      media: ["read"],
      history: ["read"],
    },
    builtin: true,
  },
];

export function can(perms: Permissions | undefined, resource: string, action: Action): boolean {
  return Boolean(perms?.[resource]?.includes(action));
}

/** True when `inner` grants nothing that `outer` does not. Used so nobody can hand out more power than they hold. */
export function isSubset(inner: Permissions, outer: Permissions): boolean {
  return Object.entries(inner).every(([res, actions]) => actions.every((a) => outer[res]?.includes(a)));
}

/** Keeps only known resources and the actions each one really has. */
export function cleanPermissions(raw: unknown): Permissions {
  const out: Permissions = {};
  if (!raw || typeof raw !== "object") return out;
  for (const def of RESOURCES) {
    const given = (raw as Record<string, unknown>)[def.id];
    if (!Array.isArray(given)) continue;
    const actions = def.actions.filter((a) => given.includes(a));
    // Reading is needed for anything else to make sense.
    if (actions.length > 0 && !actions.includes("read") && def.actions.includes("read")) actions.unshift("read");
    if (actions.length > 0) out[def.id] = actions;
  }
  return out;
}

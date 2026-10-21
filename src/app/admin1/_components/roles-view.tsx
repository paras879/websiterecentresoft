"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  ACTION_LABEL,
  RESOURCES,
  type Action,
  type Permissions,
  type ResourceGroup,
  type Role,
} from "@/lib/cms-access";
import adminStyles from "../../admin/admin.module.css";
import { api } from "../../admin/_components/lib";
import { Button, ConfirmDialog, UiIcon, useToast } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { useAccess } from "./access-context";
import { NavLink, useNav } from "./nav-context";
import { PageHead } from "./page-head";

const ACTIONS: Action[] = ["read", "create", "update", "delete", "restore"];
const GROUPS: ResourceGroup[] = ["Pages", "Services", "Site", "Collections"];

function useRoles() {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await api<{ roles: Role[]; counts: Record<string, number> }>("/api/cms/roles");
    if (res.success) {
      setRoles(res.roles);
      setCounts(res.counts);
    } else {
      setRoles([]);
      setError(res.error ?? "Could not load the roles.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { roles, counts, error };
}

/* ------------------------------------------------------------------ list */

export function RolesList() {
  const { can } = useAccess();
  const { roles, counts, error } = useRoles();

  return (
    <>
      <PageHead title="Roles" lead="A role is a set of permissions. Give each user a role to control what they can read, change, create or delete.">
        {can("roles", "create") ? (
          <NavLink to={{ name: "role", id: "create" }} className={`${adminStyles.btn} ${adminStyles.btn_primary}`}>
            <UiIcon name="plus" /> Create new
          </NavLink>
        ) : null}
      </PageHead>

      {error ? <p className={cms.error}>{error}</p> : null}

      <div className={cms.tableWrap}>
        <table className={cms.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {roles === null ? (
              <tr>
                <td colSpan={4} className={cms.empty}>
                  Loading...
                </td>
              </tr>
            ) : (
              roles.map((r) => (
                <tr key={r.id}>
                  <td>
                    <NavLink className={cms.rowLink} to={{ name: "role", id: r.id }}>
                      {r.name}
                    </NavLink>
                  </td>
                  <td className={cms.muted}>{r.description || "-"}</td>
                  <td>
                    <span className={cms.pill}>{r.builtin ? "Built-in" : "Custom"}</span>
                  </td>
                  <td>{counts[r.id] ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ create / edit */

export function RoleEdit({ id }: { id: string }) {
  const creating = id === "create";
  const { can, permissions: mine, superUser } = useAccess();
  const notify = useToast();
  const nav = useNav();
  const { roles, counts, error: loadError } = useRoles();

  const existing = roles?.find((r) => r.id === id) ?? null;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms] = useState<Permissions>({});
  const [loaded, setLoaded] = useState(creating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (creating || !existing || loaded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(existing.name);
    setDescription(existing.description);
    setPerms(structuredClone(existing.permissions));
    setLoaded(true);
  }, [creating, existing, loaded]);

  const builtin = Boolean(existing?.builtin);
  const canSave = !builtin && (creating ? can("roles", "create") : can("roles", "update"));
  // A person can only tick what they hold themselves.
  const mayTick = (resource: string, action: Action) => superUser || Boolean(mine[resource]?.includes(action));

  const toggle = (resource: string, action: Action, on: boolean) =>
    setPerms((prev) => {
      const next: Permissions = { ...prev };
      const current = new Set(next[resource] ?? []);
      if (on) {
        current.add(action);
        if (action !== "read") current.add("read");
      } else {
        current.delete(action);
        if (action === "read") current.clear();
      }
      if (current.size) next[resource] = [...current];
      else delete next[resource];
      return next;
    });

  const setAll = (resource: string, actions: Action[], on: boolean) =>
    setPerms((prev) => {
      const next: Permissions = { ...prev };
      const allowedNow = actions.filter((a) => mayTick(resource, a));
      if (on) next[resource] = [...new Set([...(next[resource] ?? []), ...allowedNow])];
      else next[resource] = (next[resource] ?? []).filter((a) => !allowedNow.includes(a));
      if (!next[resource]?.length) delete next[resource];
      return next;
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Enter a name for the role.");
    setSaving(true);
    const body = { name, description, permissions: perms };
    const res = creating
      ? await api<{ role: Role }>("/api/cms/roles", { method: "POST", json: body })
      : await api<{ role: Role }>(`/api/cms/roles/${encodeURIComponent(id)}`, { method: "PATCH", json: body });
    setSaving(false);
    if (!res.success) return setError(res.error ?? "Could not save the role.");
    notify("success", creating ? "Role created." : "Role saved.");
    if (creating) nav.go({ name: "role", id: res.role.id });
  };

  const remove = async () => {
    setDeleting(false);
    const res = await api(`/api/cms/roles/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.success) {
      notify("success", "Role deleted.");
      nav.go({ name: "roles" });
    } else {
      notify("error", res.error ?? "Could not delete the role.");
    }
  };

  const duplicate = async () => {
    const res = await api<{ role: Role }>("/api/cms/roles", {
      method: "POST",
      json: { name: `Copy of ${name}`, description, permissions: perms },
    });
    if (res.success) {
      notify("success", "Copy created. You can edit it now.");
      nav.go({ name: "role", id: res.role.id });
    } else {
      notify("error", res.error ?? "Could not copy the role.");
    }
  };

  if (!creating && roles !== null && !existing) {
    return (
      <div className={cms.empty}>
        <h1 className={cms.pageH1}>Role not found</h1>
        <p className={cms.lead} style={{ margin: "8px auto 0" }}>
          <NavLink to={{ name: "roles" }}>Back to roles</NavLink>
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHead title={creating ? "Create new role" : existing?.name || "Role"} />
      <form onSubmit={save} noValidate>
        <div className={cms.doc}>
          <div className={cms.docMain}>
            {builtin ? (
              <div className={cms.notice} role="note">
                <UiIcon name="info" />
                <span>This is a built-in role, so it cannot be changed. Use “Duplicate” to make your own version with different permissions.</span>
              </div>
            ) : null}
            {loadError ? <p className={cms.error}>{loadError}</p> : null}

            <fieldset className={cms.fieldset} disabled={!canSave}>
              <div className={cms.form} style={{ maxWidth: "none" }}>
                <div className={cms.formRow} style={{ maxWidth: 640 }}>
                  <div className={adminStyles.field}>
                    <label htmlFor="r-name" className={adminStyles.label}>
                      Name <span className={adminStyles.req}>*</span>
                    </label>
                    <input id="r-name" className={adminStyles.input} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="off" />
                  </div>
                  <div className={adminStyles.field}>
                    <label htmlFor="r-desc" className={adminStyles.label}>
                      Description
                    </label>
                    <input id="r-desc" className={adminStyles.input} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={240} autoComplete="off" />
                  </div>
                </div>

                <div>
                  <h2 className={cms.dashGroupTitle} style={{ fontSize: 16 }}>
                    Permissions
                  </h2>
                  <p className={cms.help} style={{ marginBottom: 10 }}>
                    Tick what this role may do. “Read” is needed for anything else, so it switches on by itself.
                    {superUser ? "" : " You can only tick permissions that you have yourself."}
                  </p>
                  <div className={cms.matrixWrap}>
                    <table className={cms.matrix}>
                      <thead>
                        <tr>
                          <th>Area</th>
                          {ACTIONS.map((a) => (
                            <th key={a}>{ACTION_LABEL[a]}</th>
                          ))}
                          <th>All</th>
                        </tr>
                      </thead>
                      <tbody>
                        {GROUPS.map((group) => {
                          const rows = RESOURCES.filter((r) => r.group === group);
                          if (!rows.length) return null;
                          return (
                            <Fragment key={group}>
                              <tr className={cms.matrixGroup}>
                                <td colSpan={ACTIONS.length + 2}>{group}</td>
                              </tr>
                              {rows.map((r) => {
                                const has = perms[r.id] ?? [];
                                const everything = r.actions.every((a) => has.includes(a));
                                return (
                                  <tr key={r.id}>
                                    <td>{r.label}</td>
                                    {ACTIONS.map((a) => (
                                      <td key={a}>
                                        {r.actions.includes(a) ? (
                                          <input
                                            type="checkbox"
                                            aria-label={`${r.label}: ${ACTION_LABEL[a]}`}
                                            checked={has.includes(a)}
                                            disabled={!canSave || !mayTick(r.id, a)}
                                            onChange={(e) => toggle(r.id, a, e.target.checked)}
                                          />
                                        ) : (
                                          <span className={cms.dash}>-</span>
                                        )}
                                      </td>
                                    ))}
                                    <td>
                                      <button
                                        type="button"
                                        className={cms.allBtn}
                                        disabled={!canSave}
                                        onClick={() => setAll(r.id, r.actions, !everything)}
                                      >
                                        {everything ? "None" : "All"}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {error ? (
                  <p className={cms.error} role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            </fieldset>
          </div>

          <aside className={cms.docAside} aria-label="Document actions">
            <p className={cms.asideTitle}>Actions</p>
            <div className={cms.asideActions}>
              {builtin ? null : (
                <Button variant="primary" icon="save" type="submit" busy={saving} disabled={!canSave}>
                  {creating ? "Create role" : "Save"}
                </Button>
              )}
              {!creating && can("roles", "create") ? (
                <Button icon="copy" onClick={() => void duplicate()}>
                  Duplicate
                </Button>
              ) : null}
              {!creating && !builtin && can("roles", "delete") ? (
                <Button variant="danger" icon="trash" onClick={() => setDeleting(true)}>
                  Delete role
                </Button>
              ) : null}
              <NavLink className={cms.asideLink} to={{ name: "roles" }}>
                Back to roles
              </NavLink>
            </div>
            {existing ? (
              <div className={cms.asideRow}>
                <span>Users with this role</span>
                <span>{counts[existing.id] ?? 0}</span>
              </div>
            ) : null}
          </aside>
        </div>
      </form>

      <ConfirmDialog
        open={deleting}
        title={`Delete the role “${existing?.name ?? ""}”?`}
        body="Roles that are still given to a user cannot be deleted. Move those users to another role first."
        confirmLabel="Delete role"
        onCancel={() => setDeleting(false)}
        onConfirm={() => void remove()}
      />
    </>
  );
}

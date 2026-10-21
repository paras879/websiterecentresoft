"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Role } from "@/lib/cms-access";
import { isSubset } from "@/lib/cms-access";
import type { PublicUser } from "@/lib/cms-users";
import adminStyles from "../../admin/admin.module.css";
import { api, fullDate, relativeTime } from "../../admin/_components/lib";
import { Button, ConfirmDialog, UiIcon, useToast } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { useAccess } from "./access-context";
import { NavLink, useNav } from "./nav-context";
import { PageHead } from "./page-head";

function useUsersAndRoles() {
  const [users, setUsers] = useState<PublicUser[] | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [u, r] = await Promise.all([
      api<{ users: PublicUser[] }>("/api/cms/users"),
      api<{ roles: Role[] }>("/api/cms/roles"),
    ]);
    if (u.success) setUsers(u.users);
    else {
      setUsers([]);
      setError(u.error ?? "Could not load the users.");
    }
    if (r.success) setRoles(r.roles);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { users, setUsers, roles, error, reload: load };
}

/* ------------------------------------------------------------------ list */

export function UsersList() {
  const { can, user: me } = useAccess();
  const notify = useToast();
  const { users, roles, error, reload } = useUsersAndRoles();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);

  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? id;
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (users ?? []).filter((u) => !needle || `${u.name} ${u.email} ${roleName(u.roleId)}`.toLowerCase().includes(needle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, q, roles]);

  const selectable = rows.filter((u) => u.id !== me.id);
  const allPicked = selectable.length > 0 && selectable.every((u) => picked.has(u.id));

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const removePicked = async () => {
    setConfirming(false);
    let done = 0;
    for (const id of picked) {
      const res = await api(`/api/cms/users/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.success) done += 1;
      else notify("error", res.error ?? "Could not delete a user.");
    }
    setPicked(new Set());
    if (done) notify("success", done === 1 ? "User deleted." : `${done} users deleted.`);
    await reload();
  };

  return (
    <>
      <PageHead title="Users" lead="People who can sign in to this panel. Each one has a role that decides what they can do.">
        {can("users", "create") ? (
          <NavLink to={{ name: "user", id: "create" }} className={`${adminStyles.btn} ${adminStyles.btn_primary}`}>
            <UiIcon name="plus" /> Create new
          </NavLink>
        ) : null}
      </PageHead>

      <div className={cms.listBar}>
        <input
          className={`${adminStyles.input} ${cms.search}`}
          type="search"
          placeholder="Search by name, email or role"
          aria-label="Search users"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {picked.size > 0 ? (
        <div className={cms.selectionBar}>
          <span>{picked.size} selected</span>
          <Button variant="danger" icon="trash" onClick={() => setConfirming(true)} disabled={!can("users", "delete")}>
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setPicked(new Set())}>
            Clear
          </Button>
        </div>
      ) : null}

      {error ? <p className={cms.error}>{error}</p> : null}

      <div className={cms.tableWrap}>
        <table className={cms.table}>
          <thead>
            <tr>
              <th className={cms.checkCell}>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allPicked}
                  disabled={selectable.length === 0 || !can("users", "delete")}
                  onChange={() => setPicked(allPicked ? new Set() : new Set(selectable.map((u) => u.id)))}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last login</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users === null ? (
              <tr>
                <td colSpan={7} className={cms.empty}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={cms.empty}>
                  {users.length === 0 ? "No users yet. Create the first one." : "No user matches your search."}
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id}>
                  <td className={cms.checkCell}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${u.name}`}
                      checked={picked.has(u.id)}
                      disabled={u.id === me.id || !can("users", "delete")}
                      onChange={() => toggle(u.id)}
                    />
                  </td>
                  <td>
                    <NavLink className={cms.rowLink} to={{ name: "user", id: u.id }}>
                      {u.name}
                    </NavLink>
                    {u.id === me.id ? <span className={cms.muted}> (you)</span> : null}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={cms.pill}>{roleName(u.roleId)}</span>
                  </td>
                  <td>
                    <span className={`${cms.pill} ${u.disabled ? cms.pillOff : cms.pillOn}`}>{u.disabled ? "Disabled" : "Active"}</span>
                  </td>
                  <td className={cms.muted}>{u.lastLogin ? relativeTime(u.lastLogin) : "Never"}</td>
                  <td className={cms.muted}>{fullDate(u.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className={cms.help} style={{ marginTop: 14 }}>
        The administrator from the environment settings (the same sign-in as /admin) always has full access and is not listed here.
      </p>

      <ConfirmDialog
        open={confirming}
        title={`Delete ${picked.size} user${picked.size === 1 ? "" : "s"}?`}
        body="They will not be able to sign in any more. This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setConfirming(false)}
        onConfirm={() => void removePicked()}
      />
    </>
  );
}

/* ------------------------------------------------------------------ create / edit */

export function UserEdit({ id }: { id: string }) {
  const creating = id === "create";
  const { can, user: me, permissions, superUser } = useAccess();
  const notify = useToast();
  const nav = useNav();
  const { users, roles, error: loadError } = useUsersAndRoles();

  const existing = users?.find((u) => u.id === id) ?? null;
  const [form, setForm] = useState({ name: "", email: "", roleId: "editor", disabled: false, password: "", confirm: "" });
  const [loaded, setLoaded] = useState(creating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (creating || !existing || loaded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ name: existing.name, email: existing.email, roleId: existing.roleId, disabled: existing.disabled, password: "", confirm: "" });
    setLoaded(true);
  }, [creating, existing, loaded]);

  const isSelf = !creating && id === me.id;
  const canSave = creating ? can("users", "create") : can("users", "update");
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const mayGive = (r: Role) => superUser || isSubset(r.permissions, permissions);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Enter a name.");
    if (!form.email.trim()) return setError("Enter an email address.");
    if (creating && !form.password) return setError("Choose a password for this user.");
    if (form.password && form.password !== form.confirm) return setError("The two passwords do not match.");

    setSaving(true);
    const body = {
      name: form.name,
      email: form.email,
      roleId: form.roleId,
      disabled: form.disabled,
      ...(form.password ? { password: form.password } : {}),
    };
    const res = creating
      ? await api<{ user: PublicUser }>("/api/cms/users", { method: "POST", json: body })
      : await api<{ user: PublicUser }>(`/api/cms/users/${encodeURIComponent(id)}`, { method: "PATCH", json: body });
    setSaving(false);

    if (!res.success) {
      setError(res.error ?? "Could not save the user.");
      return;
    }
    if (creating) {
      notify("success", "User created.");
      nav.go({ name: "user", id: res.user.id });
    } else {
      notify("success", "User saved.");
      set("password", "");
      set("confirm", "");
      if (res.user.id === me.id && form.password) window.location.reload();
    }
  };

  const remove = async () => {
    setDeleting(false);
    const res = await api(`/api/cms/users/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.success) {
      notify("success", "User deleted.");
      nav.go({ name: "users" });
    } else {
      notify("error", res.error ?? "Could not delete the user.");
    }
  };

  if (!creating && users !== null && !existing) {
    return (
      <div className={cms.empty}>
        <h1 className={cms.pageH1}>User not found</h1>
        <p className={cms.lead} style={{ margin: "8px auto 0" }}>
          <NavLink to={{ name: "users" }}>Back to users</NavLink>
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHead title={creating ? "Create new user" : existing?.name || "User"} />
      <form onSubmit={save} noValidate>
        <div className={cms.doc}>
          <div className={cms.docMain}>
            <fieldset className={cms.fieldset} disabled={!canSave}>
              <div className={cms.form}>
                {loadError ? <p className={cms.error}>{loadError}</p> : null}
                <div className={cms.formRow}>
                  <div className={adminStyles.field}>
                    <label htmlFor="u-name" className={adminStyles.label}>
                      Name <span className={adminStyles.req}>*</span>
                    </label>
                    <input id="u-name" className={adminStyles.input} value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={80} autoComplete="off" />
                  </div>
                  <div className={adminStyles.field}>
                    <label htmlFor="u-email" className={adminStyles.label}>
                      Email <span className={adminStyles.req}>*</span>
                    </label>
                    <input id="u-email" type="email" className={adminStyles.input} value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={200} autoComplete="off" />
                  </div>
                </div>

                <div className={adminStyles.field}>
                  <label htmlFor="u-role" className={adminStyles.label}>
                    Role <span className={adminStyles.req}>*</span>
                  </label>
                  <select id="u-role" className={adminStyles.input} value={form.roleId} onChange={(e) => set("roleId", e.target.value)} disabled={isSelf}>
                    {roles.length === 0 ? <option value={form.roleId}>{form.roleId}</option> : null}
                    {roles.map((r) => (
                      <option key={r.id} value={r.id} disabled={!mayGive(r) && r.id !== form.roleId}>
                        {r.name}
                        {!mayGive(r) ? " (more access than you have)" : ""}
                      </option>
                    ))}
                  </select>
                  <span className={cms.help}>
                    {roles.find((r) => r.id === form.roleId)?.description ?? "The role decides which pages this person can read and change."}
                    {isSelf ? " You cannot change your own role." : ""}
                  </span>
                </div>

                <div className={cms.formRow}>
                  <div className={adminStyles.field}>
                    <label htmlFor="u-pass" className={adminStyles.label}>
                      {creating ? "Password" : "New password"} {creating ? <span className={adminStyles.req}>*</span> : null}
                    </label>
                    <input id="u-pass" type="password" className={adminStyles.input} value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" />
                    <span className={cms.help}>{creating ? "At least 10 characters." : "Leave empty to keep the current password."}</span>
                  </div>
                  <div className={adminStyles.field}>
                    <label htmlFor="u-confirm" className={adminStyles.label}>
                      Confirm password
                    </label>
                    <input id="u-confirm" type="password" className={adminStyles.input} value={form.confirm} onChange={(e) => set("confirm", e.target.value)} autoComplete="new-password" />
                  </div>
                </div>

                {isSelf ? null : (
                  <label className={cms.check}>
                    <input type="checkbox" checked={form.disabled} onChange={(e) => set("disabled", e.target.checked)} />
                    <span>
                      <strong>Switch off this account</strong>
                      <br />
                      <span className={cms.help}>A switched-off user cannot sign in. Their account is kept.</span>
                    </span>
                  </label>
                )}

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
              <Button variant="primary" icon="save" type="submit" busy={saving} disabled={!canSave}>
                {creating ? "Create user" : "Save"}
              </Button>
              {!creating && !isSelf && can("users", "delete") ? (
                <Button variant="danger" icon="trash" onClick={() => setDeleting(true)}>
                  Delete user
                </Button>
              ) : null}
              <NavLink className={cms.asideLink} to={{ name: "users" }}>
                Back to users
              </NavLink>
            </div>
            {existing ? (
              <>
                <div className={cms.asideRow}>
                  <span>Last login</span>
                  <span>{existing.lastLogin ? fullDate(existing.lastLogin) : "Never"}</span>
                </div>
                <div className={cms.asideRow}>
                  <span>Last modified</span>
                  <span>{fullDate(existing.updatedAt)}</span>
                </div>
                <div className={cms.asideRow}>
                  <span>Created</span>
                  <span>{fullDate(existing.createdAt)}</span>
                </div>
              </>
            ) : null}
          </aside>
        </div>
      </form>

      <ConfirmDialog
        open={deleting}
        title={`Delete ${existing?.name ?? "this user"}?`}
        body="They will not be able to sign in any more. This cannot be undone."
        confirmLabel="Delete user"
        onCancel={() => setDeleting(false)}
        onConfirm={() => void remove()}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import adminStyles from "../../admin/admin.module.css";
import { api } from "../../admin/_components/lib";
import { Button, UiIcon, useToast } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { PageHead } from "./page-head";
import { useCms } from "./cms-context";

/**
 * The signed-in person's details. A Super admin can change them here; for everyone else they are shown read-only,
 * and an administrator changes them from Users.
 */
export function AccountView() {
  const { user, signOut } = useCms();
  const notify = useToast();
  const mayChange = user.roleId === "super";
  const [form, setForm] = useState({ name: user.name, email: user.email, username: user.root ? user.email : (user.username ?? ""), current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (user.root && !form.username.trim()) return setError("Enter a username.");
    if (!user.root && !form.name.trim()) return setError("Enter your name.");
    if (form.next && form.next !== form.confirm) return setError("The two new passwords do not match.");
    const changesLogin = user.root ? true : form.next !== "";
    if (changesLogin && !form.current) return setError("Enter your current password to confirm the change.");

    setSaving(true);
    const res = await api<{ signedOut?: boolean }>("/api/cms/me", {
      method: "PATCH",
      json: user.root
        ? { username: form.username, currentPassword: form.current, newPassword: form.next }
        : { name: form.name, email: form.email, username: form.username, currentPassword: form.current, newPassword: form.next },
    });
    setSaving(false);
    if (!res.success) return setError(res.error ?? "Could not save your details.");
    if (res.signedOut) {
      notify("success", "Saved. Please sign in again with the new details.");
      window.setTimeout(() => (window.location.href = "/admin1/login"), 900);
      return;
    }
    notify("success", "Your details were saved.");
    set("current", "");
  };

  return (
    <>
      <PageHead title="Account" lead={`Signed in as ${user.email}. Your role: ${user.roleName}.`} />

      {mayChange ? (
        <form className={cms.form} onSubmit={save} noValidate>
          {user.root ? (
            <div className={cms.notice} role="note">
              <UiIcon name="info" />
              <span>This is the main administrator login. You will be signed out after changing it, and use the new details from then on, here and at /admin.</span>
            </div>
          ) : null}

          {user.root ? (
            <div className={adminStyles.field}>
              <label htmlFor="a-username" className={adminStyles.label}>
                Username
              </label>
              <input id="a-username" className={adminStyles.input} value={form.username} onChange={(e) => set("username", e.target.value)} maxLength={40} autoCapitalize="none" spellCheck={false} />
            </div>
          ) : (
            <>
              <div className={cms.formRow}>
                <div className={adminStyles.field}>
                  <label htmlFor="a-name" className={adminStyles.label}>
                    Name
                  </label>
                  <input id="a-name" className={adminStyles.input} value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={80} />
                </div>
                <div className={adminStyles.field}>
                  <label htmlFor="a-email" className={adminStyles.label}>
                    Email
                  </label>
                  <input id="a-email" type="email" className={adminStyles.input} value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={200} />
                </div>
              </div>
              <div className={adminStyles.field}>
                <label htmlFor="a-username" className={adminStyles.label}>
                  Username
                </label>
                <input id="a-username" className={adminStyles.input} value={form.username} onChange={(e) => set("username", e.target.value)} maxLength={32} autoCapitalize="none" spellCheck={false} />
                <span className={cms.help}>Optional. Sign in with this instead of your email.</span>
              </div>
            </>
          )}

          <div className={adminStyles.field}>
            <label htmlFor="a-cur" className={adminStyles.label}>
              Current password
            </label>
            <input id="a-cur" type="password" className={adminStyles.input} value={form.current} onChange={(e) => set("current", e.target.value)} autoComplete="current-password" />
            <span className={cms.help}>{user.root ? "Needed to confirm any change here." : "Needed only when you set a new password."}</span>
          </div>

          <div className={cms.formRow}>
            <div className={adminStyles.field}>
              <label htmlFor="a-new" className={adminStyles.label}>
                New password
              </label>
              <input id="a-new" type="password" className={adminStyles.input} value={form.next} onChange={(e) => set("next", e.target.value)} autoComplete="new-password" />
              <span className={cms.help}>At least 10 characters. Leave empty to keep the current one.</span>
            </div>
            <div className={adminStyles.field}>
              <label htmlFor="a-conf" className={adminStyles.label}>
                Confirm new password
              </label>
              <input id="a-conf" type="password" className={adminStyles.input} value={form.confirm} onChange={(e) => set("confirm", e.target.value)} autoComplete="new-password" />
            </div>
          </div>

          {error ? (
            <p className={cms.error} role="alert">
              {error}
            </p>
          ) : null}

          <div className={adminStyles.row}>
            <Button variant="primary" icon="save" type="submit" busy={saving}>
              Save
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className={cms.notice} role="note">
            <UiIcon name="info" />
            <span>Your name, email, username and password are locked. If you need to change any of them, please contact your administrator.</span>
          </div>

          <div className={cms.form} style={{ marginTop: 18 }}>
            <div className={cms.formRow}>
              <div className={adminStyles.field}>
                <label htmlFor="a-name" className={adminStyles.label}>
                  Name
                </label>
                <input id="a-name" className={adminStyles.input} value={user.name} readOnly aria-readonly="true" />
              </div>
              <div className={adminStyles.field}>
                <label htmlFor="a-email" className={adminStyles.label}>
                  Email
                </label>
                <input id="a-email" className={adminStyles.input} value={user.email} readOnly aria-readonly="true" />
              </div>
            </div>
            <div className={cms.formRow}>
              <div className={adminStyles.field}>
                <label htmlFor="a-username" className={adminStyles.label}>
                  Username
                </label>
                <input id="a-username" className={adminStyles.input} value={user.username ?? ""} placeholder="Not set" readOnly aria-readonly="true" />
              </div>
              <div className={adminStyles.field}>
                <label htmlFor="a-pass" className={adminStyles.label}>
                  Password
                </label>
                <input id="a-pass" className={adminStyles.input} value={String.fromCharCode(8226).repeat(10)} readOnly aria-readonly="true" />
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: 28 }}>
        <Button icon="logout" onClick={() => void signOut()}>
          Log out
        </Button>
      </div>
    </>
  );
}

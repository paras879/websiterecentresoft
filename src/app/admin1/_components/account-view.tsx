"use client";

import { useState } from "react";
import Link from "next/link";
import adminStyles from "../../admin/admin.module.css";
import { api } from "../../admin/_components/lib";
import { Button, UiIcon, useToast } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { PageHead } from "./page-head";
import { useCms } from "./cms-context";

/** The signed-in person's own details and password. */
export function AccountView() {
  const { user, signOut } = useCms();
  const notify = useToast();
  const [form, setForm] = useState({ name: user.name, email: user.email, current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Enter your name.");
    if (form.next && form.next !== form.confirm) return setError("The two new passwords do not match.");
    if (form.next && !form.current) return setError("Enter your current password to set a new one.");

    setSaving(true);
    const res = await api<{ passwordChanged: boolean }>("/api/cms/me", {
      method: "PATCH",
      json: { name: form.name, email: form.email, currentPassword: form.current, newPassword: form.next },
    });
    setSaving(false);
    if (!res.success) return setError(res.error ?? "Could not save your details.");
    notify("success", "Your details were saved.");
    if (res.passwordChanged) {
      // Changing the password ends every session, so sign in again.
      window.location.href = "/admin1/login";
    }
  };

  return (
    <>
      <PageHead title="Account" lead={`Signed in as ${user.email}. Your role: ${user.roleName}.`} />

      {user.root ? (
        <div className={cms.notice} role="note">
          <UiIcon name="info" />
          <span>
            You are signed in as the administrator from the environment settings. Its name and password are changed from <Link href="/admin">/admin</Link>, under
            Account. Other people you add under Users can change their own details here.
          </span>
        </div>
      ) : (
        <form className={cms.form} onSubmit={save} noValidate>
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
            <label htmlFor="a-cur" className={adminStyles.label}>
              Current password
            </label>
            <input id="a-cur" type="password" className={adminStyles.input} value={form.current} onChange={(e) => set("current", e.target.value)} autoComplete="current-password" />
            <span className={cms.help}>Only needed when you set a new password.</span>
          </div>

          <div className={cms.formRow}>
            <div className={adminStyles.field}>
              <label htmlFor="a-new" className={adminStyles.label}>
                New password
              </label>
              <input id="a-new" type="password" className={adminStyles.input} value={form.next} onChange={(e) => set("next", e.target.value)} autoComplete="new-password" />
              <span className={cms.help}>At least 10 characters. You will be signed out after changing it.</span>
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
      )}

      <div style={{ marginTop: 28 }}>
        <Button icon="logout" onClick={() => void signOut()}>
          Log out
        </Button>
      </div>
    </>
  );
}

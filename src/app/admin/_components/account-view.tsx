"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { api } from "./lib";
import { Badge, Button, useToast } from "./ui";

export interface SystemInfo {
  storage: "redis" | "file" | "none";
  source: "panel" | "environment" | "none";
  username: string;
}

export function AccountView({ system, onSignOut }: { system: SystemInfo; onSignOut: () => void }) {
  const [username, setUsername] = useState(system.username);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempt, setAttempt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const notify = useToast();

  const errors = {
    username: username.trim() ? null : "Enter a username.",
    current: current ? null : "Enter your current password.",
    next: next.length >= 10 ? null : "Use at least 10 characters. A few random words make a strong password.",
    confirm: confirm === next && confirm ? null : "The two passwords do not match.",
  };
  const show = (k: keyof typeof errors) => ((touched[k] || attempt) && errors[k] ? errors[k] : null);
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempt(true);
    setServerError(null);
    const first = (Object.keys(errors) as (keyof typeof errors)[]).find((k) => errors[k]);
    if (first) {
      document.getElementById(`acc-${first}`)?.focus();
      return;
    }
    setBusy(true);
    const res = await api("/api/admin/password", { method: "POST", json: { current, username, next } });
    setBusy(false);
    if (res.success) {
      notify("success", "Password changed. Please sign in again.");
      window.setTimeout(() => (window.location.href = "/admin/login"), 900);
    } else {
      setServerError(res.error ?? "Could not change the password.");
    }
  };

  const field = (key: keyof typeof errors, label: string, value: string, set: (v: string) => void, props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const err = show(key);
    return (
      <div className={styles.field} data-invalid={err ? "true" : undefined}>
        <label className={styles.label} htmlFor={`acc-${key}`}>
          {label}
        </label>
        <input
          id={`acc-${key}`}
          className={styles.input}
          value={value}
          onChange={(e) => set(e.target.value)}
          onBlur={blur(key)}
          onFocus={() => setTouched((t) => ({ ...t, [key]: false }))}
          aria-invalid={err ? true : undefined}
          {...props}
        />
        {err ? (
          <p className={styles.fieldError} role="alert">
            {err}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.twoCol}>
        <section className={styles.panel} aria-labelledby="pw-heading">
          <header className={styles.formHead}>
            <div>
              <h2 id="pw-heading" className={styles.panelTitle}>
                Sign-in details
              </h2>
              <p className={styles.formLead}>
                Change your username or password. You will be signed out everywhere and asked to sign in again.
              </p>
            </div>
          </header>
          <form className={styles.formBody} onSubmit={submit} noValidate>
            {field("username", "Username", username, setUsername, { autoComplete: "username" })}
            {field("current", "Current password", current, setCurrent, { type: "password", autoComplete: "current-password" })}
            {field("next", "New password", next, setNext, { type: "password", autoComplete: "new-password" })}
            {field("confirm", "Repeat the new password", confirm, setConfirm, { type: "password", autoComplete: "new-password" })}
            {serverError ? (
              <p className={styles.fieldError} role="alert">
                {serverError}
              </p>
            ) : null}
            <div className={styles.row}>
              <Button type="submit" variant="primary" busy={busy}>
                Change password
              </Button>
            </div>
          </form>
        </section>

        <section className={styles.panel} aria-labelledby="sys-heading">
          <header className={styles.formHead}>
            <div>
              <h2 id="sys-heading" className={styles.panelTitle}>
                This website
              </h2>
              <p className={styles.formLead}>How your admin panel is set up.</p>
            </div>
          </header>
          <dl className={styles.statusList}>
            <div>
              <dt>Where changes are saved</dt>
              <dd>
                {system.storage === "redis" ? <Badge tone="green">Database connected</Badge> : null}
                {system.storage === "file" ? <Badge tone="amber">This computer only</Badge> : null}
                {system.storage === "none" ? <Badge tone="amber">Not connected</Badge> : null}
              </dd>
            </div>
            <div>
              <dt>Password kept in</dt>
              <dd>{system.source === "panel" ? "This panel (stored securely, hashed)" : "Your hosting settings (ADMIN_PASSWORD)"}</dd>
            </div>
            <div>
              <dt>Signed in as</dt>
              <dd>{system.username}</dd>
            </div>
          </dl>
          <div className={styles.formBody}>
            <Button icon="logout" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

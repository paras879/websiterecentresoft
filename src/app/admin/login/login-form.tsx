"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import styles from "../admin.module.css";

export function LoginForm({
  ready,
  missingSecret,
  missingPassword,
}: {
  ready: boolean;
  missingSecret: boolean;
  missingPassword: boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [attempt, setAttempt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const problems = {
    username: username.trim() ? null : "Enter your username.",
    password: password ? null : "Enter your password.",
  };
  const showErr = (k: keyof typeof problems) => ((touched[k] || attempt) && problems[k] ? problems[k] : null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempt(true);
    setError(null);
    if (problems.username) return userRef.current?.focus();
    if (problems.password) return passRef.current?.focus();

    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        window.location.href = "/admin";
        return;
      }
      setError(data.error ?? "Could not sign you in. Please try again.");
      setPassword("");
      passRef.current?.focus();
    } catch {
      setError("Could not reach the server. Check your internet connection and try again.");
    }
    setBusy(false);
  };

  return (
    <div role="main" className={styles.loginPage}>
      <div className={styles.loginBox}>
        <div className={styles.loginBrand}>
          <Link href="/" className={styles.brandLogoLink} title="Recenturesoft">
            <Image
              src="/images/recenturesoft-logo.png"
              alt="Recenturesoft"
              width={180}
              height={50}
              priority
              className={styles.brandLogoLight}
            />
            <Image
              src="/images/logo_white.PNG"
              alt="Recenturesoft"
              width={180}
              height={50}
              priority
              className={styles.brandLogoDark}
            />
          </Link>
          <span className={styles.brandBadge}>Website Admin</span>
        </div>
        <h1 className={styles.loginTitle}>Sign in</h1>
        <p className={styles.loginLead}>Manage the pages, pictures and messages of your website.</p>

        {!ready ? (
          <div className={styles.notice} role="alert">
            <div>
              <h2 className={styles.noticeTitle}>The admin panel is not set up yet</h2>
              <p className={styles.noticeText}>
                {missingPassword ? "Add ADMIN_PASSWORD" : ""}
                {missingPassword && missingSecret ? " and " : ""}
                {missingSecret ? "ADMIN_SESSION_SECRET (at least 32 random characters)" : ""} in your hosting settings
                (Vercel: Settings, then Environment Variables), or in a file named .env.local when working on your
                computer. Then restart the site and reload this page.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className={styles.loginForm}>
            <div className={styles.field} data-invalid={showErr("username") ? "true" : undefined}>
              <label htmlFor="login-user" className={styles.label}>
                Username
              </label>
              <input
                ref={userRef}
                id="login-user"
                className={styles.input}
                value={username}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                onFocus={() => setTouched((t) => ({ ...t, username: false }))}
                aria-invalid={showErr("username") ? true : undefined}
                autoFocus
              />
              {showErr("username") ? (
                <p className={styles.fieldError} role="alert">
                  {showErr("username")}
                </p>
              ) : null}
            </div>

            <div className={styles.field} data-invalid={showErr("password") ? "true" : undefined}>
              <div className={styles.labelRow}>
                <label htmlFor="login-pass" className={styles.label}>
                  Password
                </label>
                <button type="button" className={styles.linkBtn} onClick={() => setShow((s) => !s)} aria-pressed={show}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <input
                ref={passRef}
                id="login-pass"
                className={styles.input}
                type={show ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                onFocus={() => setTouched((t) => ({ ...t, password: false }))}
                aria-invalid={showErr("password") ? true : undefined}
              />
              {showErr("password") ? (
                <p className={styles.fieldError} role="alert">
                  {showErr("password")}
                </p>
              ) : null}
            </div>

            {error ? (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className={`${styles.btn} ${styles.btn_primary} ${styles.loginBtn}`} aria-busy={busy || undefined}>
              {busy ? <span className={styles.spinner} aria-hidden="true" /> : null}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        <Link href="/" className={styles.loginBack}>
          &larr; Back to the website
        </Link>
      </div>
    </div>
  );
}

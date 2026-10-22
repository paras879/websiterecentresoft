"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Recaptcha, recaptchaEnabled, type RecaptchaHandle } from "@/components/recaptcha";
import adminStyles from "../../admin/admin.module.css";
import { api } from "../../admin/_components/lib";
import { Button } from "../../admin/_components/ui";
import cms from "../cms.module.css";

export function LoginForm({ missingSecret }: { missingSecret: boolean }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaMissing, setCaptchaMissing] = useState(false);
  const captchaRef = useRef<RecaptchaHandle>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (recaptchaEnabled && !captcha) {
      setCaptchaMissing(true);
      return;
    }
    setBusy(true);
    const res = await api("/api/cms/auth", { method: "POST", json: { email: identifier, password, recaptcha: captcha } });
    if (res.success) {
      window.location.href = "/admin1";
      return;
    }
    setBusy(false);
    // A security check can only be used once.
    captchaRef.current?.reset();
    setError(res.error ?? "Could not sign you in. Please try again.");
  };

  return (
    <main className={cms.loginPage}>
      <div className={cms.loginBox}>
        <div className={cms.loginBrand}>
          <Image src="/images/recenturesoft-logo.png" alt="Recenturesoft" width={190} height={76} priority className={cms.navLogoLight} />
          <Image src="/images/logo_white.PNG" alt="Recenturesoft" width={190} height={76} priority className={cms.navLogoDark} />
        </div>

        <h1 className={cms.loginTitle}>Login</h1>
        <p className={cms.loginLead}>Sign in to manage the Recenturesoft website.</p>

        {missingSecret ? (
          <p className={cms.error} role="alert">
            The panel is not set up yet. Add ADMIN_SESSION_SECRET to the environment.
          </p>
        ) : null}

        <form className={cms.loginForm} onSubmit={submit} noValidate>
          <div className={adminStyles.field}>
            <label htmlFor="cms-id" className={adminStyles.label}>
              Email or username
            </label>
            <input
              id="cms-id"
              className={adminStyles.input}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div className={adminStyles.field}>
            <label htmlFor="cms-pass" className={adminStyles.label}>
              Password
            </label>
            <div className={cms.passRow}>
              <input
                id="cms-pass"
                type={show ? "text" : "password"}
                className={`${adminStyles.input} ${cms.passInput}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="button" className={cms.passToggle} onClick={() => setShow((v) => !v)} aria-pressed={show}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Recaptcha
            ref={captchaRef}
            invalid={captchaMissing}
            onChange={(token) => {
              setCaptcha(token);
              if (token) setCaptchaMissing(false);
            }}
          />
          {captchaMissing ? (
            <p className={cms.error} role="alert">
              Please tick &quot;I&apos;m not a robot&quot; to sign in.
            </p>
          ) : null}

          {error ? (
            <p className={cms.error} role="alert">
              {error}
            </p>
          ) : null}

          <Button variant="primary" busy={busy} type="submit" disabled={missingSecret}>
            Login
          </Button>
        </form>

        <Link className={cms.loginBack} href="/">
          Back to the website
        </Link>
      </div>
    </main>
  );
}

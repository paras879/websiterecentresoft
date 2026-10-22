"use client";

import { useRef, useState } from "react";
import { PhoneField, composePhone, emptyPhone, validatePhone, type PhoneValue } from "./phone-field";
import { Recaptcha, recaptchaEnabled, type RecaptchaHandle } from "./recaptcha";
import styles from "./career-form.module.css";

const MAX_BROWSER_BYTES = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface FormState {
  name: string;
  email: string;
  phone: PhoneValue;
  area: string;
  experience: string;
  link: string;
  note: string;
  agreed: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "sending" | "success";

interface CareerFormProps {
  hrEmail: string;
  areas: string[];
  experience: string[];
  /** Titles of currently open roles, listed first in the area choices. */
  openingTitles?: string[];
  submitLabel: string;
  idleNote: string;
  /** Shown when sending fails. {email} is replaced by the HR address. */
  errorText: string;
  successText: string;
  resumeLabel: string;
  resumeHint: string;
}

export function CareerForm({
  hrEmail,
  areas,
  experience,
  openingTitles = [],
  submitLabel,
  idleNote,
  errorText,
  successText,
  resumeLabel,
  resumeHint,
}: CareerFormProps) {
  const areaChoices = [...openingTitles, ...areas.filter((a) => !openingTitles.includes(a))];
  const initial = (): FormState => ({
    name: "",
    email: "",
    phone: emptyPhone(),
    area: areaChoices[0] ?? "",
    experience: experience[1] ?? experience[0] ?? "",
    link: "",
    note: "",
    agreed: false,
  });

  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [apiError, setApiError] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef<RecaptchaHandle>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!data.name.trim()) next.name = "Please enter your full name.";
    if (!data.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = "Please enter a valid email address.";
    const phoneProblem = validatePhone(data.phone, true);
    if (phoneProblem) next.phone = phoneProblem;
    if (!data.agreed) next.agreed = "Please confirm so we can contact you about this application.";
    const needsCaptcha = recaptchaEnabled && !captchaToken;
    setCaptchaError(needsCaptcha);
    setErrors(next);
    return Object.keys(next).length === 0 && !needsCaptcha;
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setApiError("");
    if (file && file.size > MAX_BROWSER_BYTES) {
      setResume(null);
      e.target.value = "";
      setApiError("That file is too large. Please share a link to your resume instead, or email it to us.");
      return;
    }
    setResume(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending" || !validate()) return;

    setApiError("");
    setStatus("sending");
    const body = new FormData();
    body.set("name", data.name.trim());
    body.set("email", data.email.trim());
    body.set("phone", composePhone(data.phone));
    body.set("area", data.area);
    body.set("experience", data.experience);
    body.set("link", data.link.trim());
    body.set("note", data.note.trim());
    body.set("agreed", "true");
    body.set("website", trapRef.current?.value ?? "");
    body.set("recaptcha", captchaToken);
    if (resume) body.set("resume", resume);

    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        code?: string;
        error?: string;
      };
      if (res.ok && json.success) {
        setStatus("success");
        setData(initial());
        setResume(null);
        if (fileRef.current) fileRef.current.value = "";
        captchaRef.current?.reset();
        return;
      }
      setStatus("idle");
      captchaRef.current?.reset();
      if (res.status === 503 || json.code === "storage_unavailable") {
        setApiError(errorText.replace("{email}", hrEmail));
        return;
      }
      setApiError(json.error || errorText.replace("{email}", hrEmail));
    } catch {
      setStatus("idle");
      setApiError(errorText.replace("{email}", hrEmail));
    }
  };

  const hint = resumeHint.trim();

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.trap} aria-hidden="true">
        <input
          ref={trapRef}
          aria-label="Leave this field empty"
          id="cr-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cr-name" className={styles.label}>
            Full name <span className={styles.requiredStar} aria-hidden="true">*</span>
          </label>
          <input
            id="cr-name"
            className={`${styles.input} ${errors.name ? styles.bad : ""}`}
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
            aria-invalid={!!errors.name}
          />
          {errors.name ? <p className={styles.err}>{errors.name}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="cr-email" className={styles.label}>
            Email address <span className={styles.requiredStar} aria-hidden="true">*</span>
          </label>
          <input
            id="cr-email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.bad : ""}`}
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email ? <p className={styles.err}>{errors.email}</p> : null}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cr-phone" className={styles.label}>
            Mobile number <span className={styles.requiredStar} aria-hidden="true">*</span>
          </label>
          <PhoneField
            id="cr-phone"
            value={data.phone}
            inputClass={`${styles.input} ${errors.phone ? styles.bad : ""}`}
            invalid={!!errors.phone}
            required
            onChange={(next) => set("phone", next)}
          />
          {errors.phone ? <p className={styles.err}>{errors.phone}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="cr-exp" className={styles.label}>
            Experience
          </label>
          <select
            id="cr-exp"
            className={styles.input}
            value={data.experience}
            onChange={(e) => set("experience", e.target.value)}
          >
            {experience.map((x, i) => (
              <option key={`${x}-${i}`}>{x}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Area you are interested in</legend>
        <div className={styles.chips}>
          {areaChoices.map((area) => (
            <label key={area} className={styles.pick}>
              <input
                type="radio"
                name="cr-area"
                value={area}
                checked={data.area === area}
                onChange={() => set("area", area)}
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="cr-link" className={styles.label}>
          LinkedIn, portfolio or GitHub <span className={styles.opt}>(optional)</span>
        </label>
        <input
          id="cr-link"
          className={styles.input}
          placeholder="https://"
          value={data.link}
          onChange={(e) => set("link", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="cr-resume" className={styles.label}>
          {resumeLabel} <span className={styles.opt}>(optional, PDF, DOC or DOCX)</span>
        </label>
        <input
          ref={fileRef}
          id="cr-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className={styles.input}
          onChange={onFile}
          aria-describedby="cr-resume-hint"
        />
        <p id="cr-resume-hint" className={styles.hint}>
          {resume ? `Chosen: ${resume.name} (${formatSize(resume.size)}). ` : ""}
          {hint ? `${hint.charAt(0).toUpperCase()}${hint.slice(1)}${/[.!?]$/.test(hint) ? "" : "."}` : ""}
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="cr-note" className={styles.label}>
          Tell us about yourself <span className={styles.opt}>(optional)</span>
        </label>
        <textarea
          id="cr-note"
          rows={4}
          className={styles.input}
          value={data.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </div>

      <label className={styles.agree}>
        <input
          type="checkbox"
          checked={data.agreed}
          onChange={(e) => set("agreed", e.target.checked)}
        />
        <span>I agree to be contacted by Recenturesoft about this application.</span>
      </label>
      {errors.agreed ? <p className={styles.err}>{errors.agreed}</p> : null}

      <div className={styles.captcha}>
        <Recaptcha
          ref={captchaRef}
          invalid={captchaError}
          onChange={(token) => {
            setCaptchaToken(token);
            if (token) setCaptchaError(false);
          }}
        />
        {captchaError ? <p className={styles.err}>Please tick &quot;I&apos;m not a robot&quot; before sending.</p> : null}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={status === "sending"}>
          {submitLabel} <span aria-hidden="true">&rarr;</span>
        </button>
        {apiError ? (
          <p className={styles.err} role="alert">
            {apiError}
          </p>
        ) : null}
      </div>

      {status === "success" ? (
        <p className={styles.success} role="status">
          {successText}
        </p>
      ) : (
        <p className={styles.note} role="status">
          {idleNote}
        </p>
      )}
    </form>
  );
}

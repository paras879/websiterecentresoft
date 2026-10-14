"use client";

import { useState } from "react";
import styles from "./career-form.module.css";

const HR_EMAIL = "hr@recenturesoft.com";

const AREAS = [
  "Software Development",
  "AI Automation",
  "Custom Development",
  "SEO & Digital Marketing",
  "Design (UI/UX)",
  "Something else",
];

const EXPERIENCE = ["Fresher", "1–3 years", "4–6 years", "7+ years"];

const PHONE_FORMAT = /^\+?[0-9\s\-()]+$/;

function sanitizePhone(value: string): string {
  const cleaned = value.replace(/[^0-9+\s\-()]/g, "");
  return cleaned.replace(/(?!^)\+/g, "");
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  area: string;
  experience: string;
  link: string;
  note: string;
  agreed: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

export function CareerForm() {
  const [data, setData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    area: AREAS[0],
    experience: EXPERIENCE[1],
    link: "",
    note: "",
    agreed: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

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
    const phone = data.phone.trim();
    if (!phone) next.phone = "Please enter your phone number.";
    else {
      const digits = phone.replace(/\D/g, "").length;
      if (!PHONE_FORMAT.test(phone) || digits < 7 || digits > 15)
        next.phone = "Please enter a valid phone number (7–15 digits).";
    }
    if (!data.agreed) next.agreed = "Please confirm so we can contact you about this application.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const body = [
      "Application for Recenturesoft Infotech",
      "======================================",
      `Name: ${data.name.trim()}`,
      `Email: ${data.email.trim()}`,
      `Phone: ${data.phone.trim()}`,
      `Area of interest: ${data.area}`,
      `Experience: ${data.experience}`,
      `LinkedIn / Portfolio / GitHub: ${data.link.trim() || "Not shared"}`,
      "",
      "About me:",
      data.note.trim() || "-",
      "",
      "(Resume attached to this email)",
    ].join("\n");

    const subject = encodeURIComponent(`[Careers] ${data.area} - ${data.name.trim()}`);
    setSent(true);
    window.location.href = `mailto:${HR_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cr-name" className={styles.label}>
            Full name <span aria-hidden="true">*</span>
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
            Email address <span aria-hidden="true">*</span>
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
            Phone number <span aria-hidden="true">*</span>
          </label>
          <input
            id="cr-phone"
            type="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            className={`${styles.input} ${errors.phone ? styles.bad : ""}`}
            value={data.phone}
            onChange={(e) => set("phone", sanitizePhone(e.target.value))}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
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
            {EXPERIENCE.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Area you are interested in</legend>
        <div className={styles.chips}>
          {AREAS.map((area) => (
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

      <button type="submit" className={styles.submit}>
        Prepare my application <span aria-hidden="true">&rarr;</span>
      </button>

      <p className={styles.note} role="status">
        {sent
          ? `Your email app should have opened with the details filled in. Attach your resume and send it. If nothing opened, write to ${HR_EMAIL}.`
          : "This opens an email to our HR team with your details filled in. Attach your resume before sending."}
      </p>
    </form>
  );
}

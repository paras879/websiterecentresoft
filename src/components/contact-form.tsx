"use client";

import { useRef, useState } from "react";
import { PhoneField, composePhone, emptyPhone, validatePhone, type PhoneValue } from "./phone-field";
import { Recaptcha, recaptchaEnabled, type RecaptchaHandle } from "./recaptcha";
import styles from "./contact-form.module.css";

interface FormState {
  fullName: string;
  email: string;
  company: string;
  phone: PhoneValue;
  service: string;
  message: string;
  privacyAgreed: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  privacyAgreed?: string;
}

interface ContactFormProps {
  /** Choices shown in the "Service of Interest" list. The first one is selected by default. */
  services: string[];
  /** Address the fallback email draft is addressed to. */
  recipientEmail: string;
}

export function ContactForm({ services, recipientEmail }: ContactFormProps) {
  const serviceOptions = services.length > 0 ? services : ["General Enquiry"];
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    company: "",
    phone: emptyPhone(),
    service: serviceOptions[0],
    message: "",
    privacyAgreed: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [website, setWebsite] = useState(""); // honeypot, real visitors never fill this in
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef<RecaptchaHandle>(null);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your work email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address (e.g., name@company.com).";
    }

    const phoneProblem = validatePhone(formData.phone, false);
    if (phoneProblem) nextErrors.phone = phoneProblem;

    if (!formData.service) {
      nextErrors.service = "Please select a service of interest.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please write a brief summary of your requirements.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters long.";
    }

    if (!formData.privacyAgreed) {
      nextErrors.privacyAgreed = "Please acknowledge that you agree to be contacted regarding this enquiry.";
    }

    const needsCaptcha = recaptchaEnabled && !captchaToken;
    setCaptchaError(needsCaptcha);

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !needsCaptcha;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!validate()) return;

    setApiError(null);
    setSent(false);
    setSending(true);

    const failed = `We could not send your message right now. Please try again in a moment, or write to ${recipientEmail}.`;

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: composePhone(formData.phone),
          company: formData.company.trim(),
          service: formData.service,
          message: formData.message.trim(),
          website,
          recaptcha: captchaToken,
        }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean; error?: string; code?: string } | null;

      if (res.ok && data?.success) {
        setSent(true);
        setFormData({
          fullName: "",
          email: "",
          company: "",
          phone: emptyPhone(),
          service: serviceOptions[0],
          message: "",
          privacyAgreed: false,
        });
        setErrors({});
        captchaRef.current?.reset();
      } else if (res.status === 503 || data?.code === "storage_unavailable") {
        setApiError(failed);
      } else {
        setApiError(data?.error || failed);
        captchaRef.current?.reset();
      }
    } catch {
      setApiError(failed);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.formContainer} id="contact-form">
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Contact Us</h2>
        <p className={styles.formSubtitle}>
          Fill out the details below and our team will get back to you.
        </p>
        <div className={styles.formNotice}>
          <strong>How it works:</strong> your message goes straight to our team and we reply by email to
          the address you give us.
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.honeypot} aria-hidden="true">
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className={styles.formGrid}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && (
              <span id="fullName-error" className={styles.errorMessage} role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Work Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Work Email <span className={styles.requiredStar}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span id="email-error" className={styles.errorMessage} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Company Name (Optional) */}
          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              Company Name <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              autoComplete="organization"
              className={styles.input}
              placeholder="Your organization"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>

          {/* Mobile number (optional) */}
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Mobile Number <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <PhoneField
              id="phone"
              value={formData.phone}
              inputClass={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              invalid={!!errors.phone}
              describedBy={errors.phone ? "phone-error" : undefined}
              onChange={(next) => {
                setFormData((prev) => ({ ...prev, phone: next }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
            />
            {errors.phone && (
              <span id="phone-error" className={styles.errorMessage} role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Service of Interest */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="service" className={styles.label}>
              Service of Interest <span className={styles.requiredStar}>*</span>
            </label>
            <select
              id="service"
              name="service"
              required
              className={`${styles.select} ${errors.service ? styles.inputError : ""}`}
              value={formData.service}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, service: e.target.value }));
                if (errors.service) setErrors((prev) => ({ ...prev, service: undefined }));
              }}
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? "service-error" : undefined}
            >
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.service && (
              <span id="service-error" className={styles.errorMessage} role="alert">
                {errors.service}
              </span>
            )}
          </div>

          {/* Message */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="message" className={styles.label}>
              Project Details <span className={styles.requiredStar}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
              placeholder="Describe your technical requirements, goals, and expected timeline..."
              value={formData.message}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, message: e.target.value }));
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <span id="message-error" className={styles.errorMessage} role="alert">
                {errors.message}
              </span>
            )}
          </div>
        </div>

        {/* Privacy Acknowledgement */}
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="privacyAgreed"
            name="privacyAgreed"
            required
            className={styles.checkbox}
            checked={formData.privacyAgreed}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, privacyAgreed: e.target.checked }));
              if (errors.privacyAgreed) setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
            }}
            aria-invalid={!!errors.privacyAgreed}
            aria-describedby={errors.privacyAgreed ? "privacy-error" : undefined}
          />
          <label htmlFor="privacyAgreed" className={styles.checkboxLabel}>
            I confirm this enquiry is for business purposes and agree to be contacted about it at the email address and mobile number I gave.
          </label>
        </div>
        {errors.privacyAgreed && (
          <span id="privacy-error" className={styles.errorMessage} role="alert">
            {errors.privacyAgreed}
          </span>
        )}

        <div className={styles.captchaRow}>
          <Recaptcha
            ref={captchaRef}
            invalid={captchaError}
            onChange={(token) => {
              setCaptchaToken(token);
              if (token) setCaptchaError(false);
            }}
          />
          {captchaError && (
            <span className={styles.errorMessage} role="alert">
              Please tick &quot;I&apos;m not a robot&quot; before sending.
            </span>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={sending}>
            {sending ? "Sending..." : "Send Project Enquiry"}
          </button>
        </div>
      </form>

      {sent && (
        <div className={`${styles.statusBox} ${styles.statusOk}`} role="status">
          <div className={styles.statusTitle}>
            <span>Thank you, your message has been sent. We will get back to you soon.</span>
          </div>
        </div>
      )}

      {apiError && (
        <div className={`${styles.statusBox} ${styles.statusBad}`} role="alert">
          <p className={styles.statusDesc}>{apiError}</p>
        </div>
      )}

    </div>
  );
}

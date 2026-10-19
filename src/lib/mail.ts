import nodemailer from "nodemailer";
import { getSiteContent } from "./content";
import { getBlob, type Inquiry } from "./records";

/** True when the mail server details have been added to the environment. */
export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const row = (label: string, value: string) => (value ? { label, value } : null);

/**
 * Emails a new contact message or job application to the team. The enquiry is already saved in the
 * admin inbox before this runs, so a mail problem never loses it. Does nothing when SMTP is not set up.
 */
export async function notifyInquiry(inquiry: Inquiry): Promise<void> {
  if (!mailConfigured()) {
    console.warn("Email notifications are off: SMTP_HOST, SMTP_USER and SMTP_PASS are not set.");
    return;
  }

  try {
    const { site } = await getSiteContent();
    const isCareer = inquiry.kind === "career";
    const to =
      process.env.MAIL_TO ||
      (isCareer ? site.contact.hrEmail || site.contact.email : site.contact.email);
    if (!to) return;

    const port = Number(process.env.SMTP_PORT) || 465;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });

    const rows = (
      isCareer
        ? [
            row("Name", inquiry.name),
            row("Email", inquiry.email),
            row("Phone", inquiry.phone),
            row("Area applied for", inquiry.topic),
            row("Experience", inquiry.detail),
            row("Link", inquiry.link),
            row("Note", inquiry.message),
            row("Resume", inquiry.resume ? `${inquiry.resume.name} (attached)` : "Not attached"),
          ]
        : [
            row("Name", inquiry.name),
            row("Email", inquiry.email),
            row("Phone", inquiry.phone),
            row("Company", inquiry.detail),
            row("Service", inquiry.topic),
            row("Message", inquiry.message),
          ]
    ).filter((r): r is { label: string; value: string } => r !== null);

    const subject = isCareer
      ? `New job application: ${inquiry.name}${inquiry.topic ? ` (${inquiry.topic})` : ""}`
      : `New website enquiry: ${inquiry.name}`;
    const heading = isCareer ? "New job application" : "New message from the website";

    const attachments: { filename: string; content: Buffer }[] = [];
    if (isCareer && inquiry.resume) {
      const file = await getBlob(inquiry.resume.id);
      if (file) attachments.push({ filename: inquiry.resume.name, content: file });
    }

    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      replyTo: inquiry.email,
      subject,
      text: `${heading}\n\n${rows.map((r) => `${r.label}: ${r.value}`).join("\n")}\n\nAlso saved in the admin inbox.`,
      html:
        `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0b1f44">` +
        `<h2 style="margin:0 0 12px">${heading}</h2>` +
        `<table cellpadding="6" style="border-collapse:collapse">` +
        rows
          .map(
            (r) =>
              `<tr><td style="color:#5b6a82;vertical-align:top;white-space:nowrap">${escapeHtml(r.label)}</td>` +
              `<td style="white-space:pre-wrap">${escapeHtml(r.value)}</td></tr>`,
          )
          .join("") +
        `</table><p style="color:#5b6a82;margin-top:16px">Also saved in the admin inbox.</p></div>`,
      attachments,
    });
  } catch (error) {
    console.error("Could not send the notification email.", error);
  }
}

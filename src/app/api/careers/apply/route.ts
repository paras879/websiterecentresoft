import { clientIp, sameOrigin, withinRateLimit } from "@/lib/admin-auth";
import { failure, json } from "@/lib/api";
import { addInquiry, maxResumeBytes, putBlob } from "@/lib/records";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9\s\-()]{7,25}$/;

const field = (v: FormDataEntryValue | null, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// PDF "%PDF", old Word (OLE) and DOCX (ZIP) file signatures.
function looksLikeDocument(b: Buffer): boolean {
  if (b.length < 4) return false;
  const pdf = b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46;
  const doc = b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;
  const docx = b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
  return pdf || doc || docx;
}

/** Saves a job application (and optional resume) so it appears in the admin inbox. */
export async function POST(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "Blocked." }, 403);

  try {
    const form = await req.formData();
    if (field(form.get("website"), 100)) return json({ success: true });

    const name = field(form.get("name"), 120);
    const email = field(form.get("email"), 200);
    const phone = field(form.get("phone"), 40);
    if (!name || !EMAIL.test(email) || !PHONE.test(phone)) {
      return json({ success: false, error: "Please check your name, email and phone number." }, 400);
    }
    if (form.get("agreed") !== "true") {
      return json({ success: false, error: "Please agree to be contacted about this application." }, 400);
    }

    const ip = await clientIp();
    if (!(await withinRateLimit(`apply:${ip}`, 5, 60 * 60))) {
      return json({ success: false, error: "Too many applications. Please try again later." }, 429);
    }

    let resume: { id: string; name: string; size: number } | null = null;
    const file = form.get("resume");
    if (file instanceof File && file.size > 0) {
      const limit = maxResumeBytes();
      if (file.size > limit) {
        return json(
          {
            success: false,
            code: "resume_too_large",
            error: `Your resume is larger than ${Math.round(limit / 1024)} KB. Please share a link to it instead, or email it to us.`,
          },
          413,
        );
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!["pdf", "doc", "docx"].includes(ext) || !looksLikeDocument(buffer)) {
        return json({ success: false, error: "Please attach a PDF, DOC or DOCX file." }, 400);
      }
      const blobId = await putBlob(buffer);
      resume = { id: blobId, name: file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 80), size: buffer.length };
    }

    await addInquiry({
      kind: "career",
      name,
      email,
      phone,
      detail: field(form.get("experience"), 60),
      topic: field(form.get("area"), 120),
      message: field(form.get("note"), 5000),
      link: field(form.get("link"), 500),
      resume,
    });
    return json({ success: true });
  } catch (error) {
    return failure(error, "Could not submit your application.");
  }
}

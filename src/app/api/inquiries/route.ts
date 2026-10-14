import { clientIp, sameOrigin, withinRateLimit } from "@/lib/admin-auth";
import { failure, json } from "@/lib/api";
import { addInquiry } from "@/lib/records";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Saves a message sent from the Contact page so it appears in the admin inbox. */
export async function POST(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "Blocked." }, 403);

  try {
    const body = (await req.json()) as Record<string, unknown>;

    // Hidden field that people never fill in. Bots usually do, so they are quietly ignored.
    if (field(body.website, 100)) return json({ success: true });

    const name = field(body.name, 120);
    const email = field(body.email, 200);
    if (!name || !EMAIL.test(email)) {
      return json({ success: false, error: "Please enter your name and a valid email." }, 400);
    }

    const ip = await clientIp();
    if (!(await withinRateLimit(`contact:${ip}`, 6, 60 * 60))) {
      return json({ success: false, error: "Too many messages. Please try again later." }, 429);
    }

    await addInquiry({
      kind: "contact",
      name,
      email,
      phone: field(body.phone, 40),
      detail: field(body.company, 160),
      topic: field(body.service, 120),
      message: field(body.message, 5000),
      link: "",
      resume: null,
    });
    return json({ success: true });
  } catch (error) {
    return failure(error, "Could not send your message.");
  }
}

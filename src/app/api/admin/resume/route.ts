import { getBlob, listInquiries } from "@/lib/records";
import { failure, guardAdmin, json } from "@/lib/api";

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Downloads the resume attached to an application. Only signed-in admins can reach it. */
export async function GET(req: Request) {
  const denied = await guardAdmin(req);
  if (denied) return denied;

  try {
    const inquiryId = new URL(req.url).searchParams.get("inquiry");
    const inquiry = (await listInquiries()).find((i) => i.id === inquiryId);
    if (!inquiry?.resume) return json({ success: false, error: "No resume was attached." }, 404);

    const file = await getBlob(inquiry.resume.id);
    if (!file) return json({ success: false, error: "The resume file could not be found." }, 404);

    const ext = inquiry.resume.name.split(".").pop()?.toLowerCase() ?? "";
    const safeName = inquiry.resume.name.replace(/[^\w.\- ]+/g, "_");
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": TYPES[ext] ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return failure(error, "Could not download the resume.");
  }
}

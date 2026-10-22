import { deleteInquiry, listInquiries, setInquiryStatus, type InquiryStatus } from "@/lib/records";
import { logAudit } from "@/lib/audit";
import { failure, guardAdmin, json } from "@/lib/api";

const STATUSES: InquiryStatus[] = ["new", "contacted", "archived"];

export async function GET(req: Request) {
  const denied = await guardAdmin(req, { perm: ["inbox", "read"] });
  if (denied) return denied;
  try {
    return json({ success: true, inquiries: await listInquiries() });
  } catch (error) {
    return failure(error, "Could not load the messages.");
  }
}

export async function PATCH(req: Request) {
  const denied = await guardAdmin(req, { write: true, perm: ["inbox", "update"] });
  if (denied) return denied;
  try {
    const { id, status } = (await req.json()) as { id?: unknown; status?: unknown };
    if (typeof id !== "string" || !STATUSES.includes(status as InquiryStatus)) {
      return json({ success: false, error: "That update is not valid." }, 400);
    }
    const ok = await setInquiryStatus(id, status as InquiryStatus);
    if (ok) await logAudit("message", `Marked a message as ${status}`);
    return ok ? json({ success: true }) : json({ success: false, error: "That message no longer exists." }, 404);
  } catch (error) {
    return failure(error, "Could not update the message.");
  }
}

export async function DELETE(req: Request) {
  const denied = await guardAdmin(req, { write: true, perm: ["inbox", "delete"] });
  if (denied) return denied;
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ success: false, error: "Missing message." }, 400);
    const ok = await deleteInquiry(id);
    if (ok) await logAudit("message", "Deleted a message");
    return ok ? json({ success: true }) : json({ success: false, error: "That message no longer exists." }, 404);
  } catch (error) {
    return failure(error, "Could not delete the message.");
  }
}

import { revalidatePath } from "next/cache";
import { getDefaultContent, getHistoryDoc, listHistory, saveSiteContent } from "@/lib/content";
import { failure, guardAdmin, json } from "@/lib/api";

export async function GET(req: Request) {
  const denied = await guardAdmin(req, { perm: ["history", "read"] });
  if (denied) return denied;
  try {
    return json({ success: true, history: await listHistory() });
  } catch (error) {
    return failure(error, "Could not load the history.");
  }
}

/** Restores an earlier saved version, or the original built-in content when id is "original". */
export async function POST(req: Request) {
  const denied = await guardAdmin(req, { write: true, perm: ["history", "restore"] });
  if (denied) return denied;

  try {
    const { id } = (await req.json()) as { id?: unknown };
    if (typeof id !== "string") return json({ success: false, error: "Missing version." }, 400);

    const doc = id === "original" ? getDefaultContent() : await getHistoryDoc(id);
    if (!doc) return json({ success: false, error: "That version is no longer available." }, 404);

    const content = await saveSiteContent(doc, id === "original" ? "Restored the original content" : "Restored an earlier version");
    try {
      revalidatePath("/", "layout");
    } catch {}
    return json({ success: true, content });
  } catch (error) {
    return failure(error, "Could not restore that version.");
  }
}

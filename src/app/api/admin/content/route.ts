import { revalidatePath } from "next/cache";
import { getDefaultContent, getSiteContent, saveSiteContent } from "@/lib/content";
import { failure, guardAdmin, json } from "@/lib/api";
import { getStore } from "@/lib/store";

export async function GET(req: Request) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const store = getStore();
  return json({
    success: true,
    content: await getSiteContent(),
    defaults: getDefaultContent(),
    storage: { kind: store.kind, writable: store.writable },
  });
}

export async function PUT(req: Request) {
  const denied = await guardAdmin(req, { write: true });
  if (denied) return denied;

  try {
    const body = (await req.json()) as { content?: unknown; note?: unknown };
    if (!body.content || typeof body.content !== "object") {
      return json({ success: false, error: "Nothing to save." }, 400);
    }
    const note = typeof body.note === "string" ? body.note : "";
    const content = await saveSiteContent(body.content, note);
    try {
      revalidatePath("/", "layout");
    } catch {}
    return json({ success: true, content });
  } catch (error) {
    return failure(error, "Your changes could not be saved. Please try again.");
  }
}

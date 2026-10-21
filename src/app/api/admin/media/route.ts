import { addMedia, deleteMedia, IMAGE_TYPES, listMedia, maxImageBytes, sniffImageType } from "@/lib/records";
import { failure, guardAdmin, json } from "@/lib/api";

export async function GET(req: Request) {
  const denied = await guardAdmin(req, { perm: ["media", "read"] });
  if (denied) return denied;
  try {
    return json({ success: true, media: await listMedia(), maxBytes: maxImageBytes() });
  } catch (error) {
    return failure(error, "Could not load the images.");
  }
}

export async function POST(req: Request) {
  const denied = await guardAdmin(req, { write: true, perm: ["media", "create"] });
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return json({ success: false, error: "Choose an image to upload." }, 400);

    const limit = maxImageBytes();
    if (file.size > limit) {
      return json(
        { success: false, error: `This image is ${Math.round(file.size / 1024)} KB. Please use one under ${Math.round(limit / 1024)} KB.` },
        413,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Trust the file's first bytes, not its name or the type the browser reports.
    const type = sniffImageType(buffer);
    if (!type || !(type in IMAGE_TYPES)) {
      return json({ success: false, error: "Please upload a JPG, PNG, WebP or GIF image." }, 400);
    }

    const item = await addMedia(buffer, file.name, type);
    return json({ success: true, item });
  } catch (error) {
    return failure(error, "The image could not be uploaded.");
  }
}

export async function DELETE(req: Request) {
  const denied = await guardAdmin(req, { write: true, perm: ["media", "delete"] });
  if (denied) return denied;
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ success: false, error: "Missing image." }, 400);
    await deleteMedia(id);
    return json({ success: true });
  } catch (error) {
    return failure(error, "Could not delete the image.");
  }
}

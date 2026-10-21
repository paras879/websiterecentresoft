import { getMedia } from "@/lib/records";

/** Serves an image uploaded from the admin panel. Public, because the website pages use it. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^m-[a-z0-9]+$/.test(id)) return new Response("Not found", { status: 404 });

  const media = await getMedia(id);
  if (!media) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(media.buffer), {
    headers: {
      "Content-Type": media.type,
      // File names are unique per upload, so the image can be cached for a long time.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}

import crypto from "node:crypto";
import { getStore } from "./store";

/* ------------------------------------------------------------------ inquiries & applications */

export type InquiryKind = "contact" | "career";
export type InquiryStatus = "new" | "contacted" | "archived";

export interface Inquiry {
  id: string;
  kind: InquiryKind;
  status: InquiryStatus;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  /** Contact: company name. Career: years of experience. */
  detail: string;
  /** Contact: service of interest. Career: area applied for. */
  topic: string;
  message: string;
  link: string;
  resume: { id: string; name: string; size: number } | null;
}

const INQUIRIES = "inquiries";

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`;

export async function addInquiry(
  data: Omit<Inquiry, "id" | "createdAt" | "status">,
): Promise<Inquiry> {
  const inquiry: Inquiry = { ...data, id: newId("q"), status: "new", createdAt: new Date().toISOString() };
  await getStore().hset(INQUIRIES, inquiry.id, JSON.stringify(inquiry));
  return inquiry;
}

export async function listInquiries(): Promise<Inquiry[]> {
  const all = await getStore().hgetall(INQUIRIES);
  return Object.values(all)
    .map((raw) => {
      try {
        return JSON.parse(raw) as Inquiry;
      } catch {
        return null;
      }
    })
    .filter((i): i is Inquiry => i !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<boolean> {
  const store = getStore();
  const raw = await store.hget(INQUIRIES, id);
  if (!raw) return false;
  const inquiry = JSON.parse(raw) as Inquiry;
  inquiry.status = status;
  await store.hset(INQUIRIES, id, JSON.stringify(inquiry));
  return true;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const store = getStore();
  const raw = await store.hget(INQUIRIES, id);
  if (!raw) return false;
  const inquiry = JSON.parse(raw) as Inquiry;
  if (inquiry.resume) await store.hdel(BLOBS, inquiry.resume.id);
  await store.hdel(INQUIRIES, id);
  return true;
}

/* ------------------------------------------------------------------ private files (resumes) */

const BLOBS = "blobs";

/** Redis requests are small; local files can be larger. */
export function maxResumeBytes(): number {
  return getStore().kind === "redis" ? 600 * 1024 : 10 * 1024 * 1024;
}

export function maxImageBytes(): number {
  return getStore().kind === "redis" ? 700 * 1024 : 5 * 1024 * 1024;
}

export async function putBlob(buffer: Buffer): Promise<string> {
  const id = newId("f");
  await getStore().hset(BLOBS, id, buffer.toString("base64"));
  return id;
}

export async function getBlob(id: string): Promise<Buffer | null> {
  const raw = await getStore().hget(BLOBS, id);
  return raw ? Buffer.from(raw, "base64") : null;
}

/* ------------------------------------------------------------------ uploaded images */

export interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  url: string;
}

const MEDIA_META = "media:meta";
const MEDIA_DATA = "media:data";

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Recognises an image by its first bytes instead of trusting the file name or type sent by the browser. */
export function sniffImageType(b: Buffer): string | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (b.length > 12 && b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP")
    return "image/webp";
  if (b.length > 6 && b.subarray(0, 3).toString() === "GIF") return "image/gif";
  return null;
}

export async function addMedia(buffer: Buffer, name: string, type: string): Promise<MediaItem> {
  const id = newId("m");
  const item: MediaItem = {
    id,
    name: name.replace(/[^\w.\- ]+/g, "").slice(0, 80) || "image",
    type,
    size: buffer.length,
    createdAt: new Date().toISOString(),
    url: `/api/media/${id}`,
  };
  const store = getStore();
  await store.hset(MEDIA_DATA, id, buffer.toString("base64"));
  await store.hset(MEDIA_META, id, JSON.stringify(item));
  return item;
}

export async function listMedia(): Promise<MediaItem[]> {
  const all = await getStore().hgetall(MEDIA_META);
  return Object.values(all)
    .map((raw) => {
      try {
        return JSON.parse(raw) as MediaItem;
      } catch {
        return null;
      }
    })
    .filter((m): m is MediaItem => m !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getMedia(id: string): Promise<{ buffer: Buffer; type: string } | null> {
  const store = getStore();
  const [data, meta] = await Promise.all([store.hget(MEDIA_DATA, id), store.hget(MEDIA_META, id)]);
  if (!data || !meta) return null;
  return { buffer: Buffer.from(data, "base64"), type: (JSON.parse(meta) as MediaItem).type };
}

export async function deleteMedia(id: string): Promise<void> {
  const store = getStore();
  await store.hdel(MEDIA_DATA, id);
  await store.hdel(MEDIA_META, id);
}

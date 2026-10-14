import { modules, type SiteContent } from "@/content";
import type { Field } from "@/content/fields";
import { safeUrl } from "@/content/sanitize";

export type Path = (string | number)[];
type Json = Record<string, unknown>;

export const pathKey = (path: Path) => path.join(".");

export function getIn(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Json)[key as string];
  }
  return cur;
}

/** Immutable set: only the objects along `path` are copied, so untouched branches keep their identity. */
export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const base = (Array.isArray(obj) ? [...obj] : { ...(obj as Json) }) as Json;
  base[head as string] = setIn(base[head as string], rest, value);
  return base as T;
}

export function emptyFor(field: Field): unknown {
  if (field.initial !== undefined) return structuredClone(field.initial);
  switch (field.type) {
    case "toggle":
      return false;
    case "strings":
    case "list":
      return [];
    case "group": {
      const o: Json = {};
      for (const f of field.fields) o[f.key] = emptyFor(f);
      return o;
    }
    case "id":
      return `id-${Math.random().toString(36).slice(2, 10)}`;
    case "select":
      return field.options[0]?.value ?? "";
    default:
      return "";
  }
}

export function blankItem(fields: Field[]): Json {
  const o: Json = {};
  for (const f of fields) o[f.key] = emptyFor(f);
  return o;
}

/** A copy of a list item with fresh ids, for "Duplicate". */
export function cloneItem(item: unknown, fields: Field[]): unknown {
  const copy = structuredClone(item) as Json;
  for (const f of fields) if (f.type === "id") copy[f.key] = emptyFor(f);
  return copy;
}

/* ------------------------------------------------------------------ validation */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9\s\-()]{5,25}$/;

export function validateField(field: Field, value: unknown): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  const isText = ["text", "longtext", "url", "email", "phone", "image"].includes(field.type);

  if (field.required && isText && !text) return `Enter ${field.label.toLowerCase()}.`;
  if (!isText || !text) return null;

  switch (field.type) {
    case "url":
      return safeUrl(text) ? null : "Start with / for a page on this site, or use https:// for another site.";
    case "email":
      return EMAIL.test(text) ? null : "Enter an email like name@company.com.";
    case "phone":
      return PHONE.test(text) ? null : "Use digits, spaces and a leading +, e.g. +91 98765 43210.";
    case "text":
      return field.max && text.length > field.max ? `Shorten this to ${field.max} characters or fewer.` : null;
    case "longtext":
      return field.max && text.length > field.max ? `Shorten this to ${field.max} characters or fewer.` : null;
    default:
      return null;
  }
}

export interface Problem {
  moduleId: string;
  sectionId: string;
  path: Path;
  message: string;
}

/** Walks every module against its schema and lists the first problems, in page order. */
export function validateAll(content: SiteContent): Problem[] {
  const problems: Problem[] = [];

  const walk = (fields: Field[], value: unknown, path: Path, moduleId: string, sectionId: string) => {
    const obj = (value ?? {}) as Json;
    for (const f of fields) {
      const v = obj[f.key];
      const p = [...path, f.key];
      const msg = validateField(f, v);
      if (msg) problems.push({ moduleId, sectionId, path: p, message: msg });
      if (f.type === "group") walk(f.fields, v, p, moduleId, sectionId);
      if (f.type === "list" && Array.isArray(v)) {
        v.forEach((item, i) => walk(f.fields, item, [...p, i], moduleId, sectionId));
      }
    }
  };

  for (const mod of modules) {
    const root = (content as unknown as Json)[mod.id];
    for (const section of mod.sections) walk(section.fields, root, [mod.id], mod.id, section.id);
  }
  return problems;
}

/** True when any field inside this item (or its nested groups and lists) fails validation. */
export function hasProblem(fields: Field[], item: unknown): boolean {
  const obj = (item ?? {}) as Json;
  return fields.some((f) => {
    const v = obj[f.key];
    if (validateField(f, v)) return true;
    if (f.type === "group") return hasProblem(f.fields, v);
    if (f.type === "list" && Array.isArray(v)) return v.some((x) => hasProblem(f.fields, x));
    return false;
  });
}

/* ------------------------------------------------------------------ small helpers */

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.round((then - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return "just now";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function fullDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** JSON request helper that turns failures into readable messages. */
export async function api<T = Record<string, unknown>>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<T & { success: boolean; error?: string; code?: string; status: number }> {
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string>) };
  let body = init?.body;
  if (init?.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  try {
    const res = await fetch(url, { ...init, headers, body, cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ...(data as T), success: res.ok && data.success !== false, status: res.status, error: data.error as string | undefined, code: data.code as string | undefined };
  } catch {
    return { success: false, status: 0, error: "Could not reach the server. Check your internet connection and try again." } as T & {
      success: boolean;
      error?: string;
      code?: string;
      status: number;
    };
  }
}

/** Shrinks a photo in the browser so it fits the upload limit. GIFs are left alone. */
export async function compressImage(file: File, maxBytes: number): Promise<File> {
  if (file.type === "image/gif") return file;
  if (file.size <= maxBytes * 0.6 && file.size < 400 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  const maxDim = 1800;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const toBlob = (type: string, q: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q));

  let type = "image/webp";
  for (let q = 0.86; q >= 0.4; q -= 0.12) {
    let blob = await toBlob(type, q);
    if (!blob || blob.type !== type) {
      type = "image/jpeg";
      blob = await toBlob(type, q);
    }
    if (blob && blob.size <= maxBytes * 0.95) {
      const ext = type === "image/webp" ? "webp" : "jpg";
      return new File([blob], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type });
    }
  }
  return file;
}

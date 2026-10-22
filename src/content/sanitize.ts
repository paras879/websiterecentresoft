import { iconPaths } from "@/app/services/icons";
import type { ContentModule, Field } from "./fields";

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9\s\-()]{5,25}$/;

function cleanString(value: unknown, max: number, multiline: boolean): string {
  if (typeof value !== "string") return "";
  let s = value.replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "");
  if (!multiline) s = s.replace(/\n+/g, " ");
  return s.trim().slice(0, max);
}

/** Internal paths, anchors, and http(s)/mailto/tel links only. Anything else (javascript:, data:) is dropped. */
export function safeUrl(value: unknown): string {
  const s = cleanString(value, 2000, false);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (s.startsWith("#")) return s;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s;
  return "";
}

/** Images must live on this site (the built-in /images folder or an upload), never on another host. */
export function safeImage(value: unknown): string {
  const s = cleanString(value, 2000, false);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//") && !s.includes("..")) return s;
  return "";
}

function emptyFor(field: Field): unknown {
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
      return "";
    default:
      return "";
  }
}

function newId(): string {
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeField(field: Field, value: unknown, fallback: unknown): unknown {
  const keep = (v: unknown) => (v === undefined ? fallback ?? emptyFor(field) : v);

  switch (field.type) {
    case "text":
      return cleanString(keep(value), field.max ?? 400, false);
    case "longtext":
      return cleanString(keep(value), field.max ?? 6000, true);
    case "date": {
      // Only a real calendar date (2026-03-28) is kept; anything else is left empty.
      const s = cleanString(keep(value), 10, false);
      const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00Z`) : null;
      return d && !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s ? s : "";
    }
    case "url":
      return safeUrl(keep(value));
    case "image":
      return safeImage(keep(value));
    case "email": {
      const s = cleanString(keep(value), 200, false);
      return s === "" || EMAIL.test(s) ? s : cleanString(fallback, 200, false);
    }
    case "phone": {
      const s = cleanString(keep(value), 40, false);
      return s === "" || PHONE.test(s) ? s : cleanString(fallback, 40, false);
    }
    case "icon": {
      const s = cleanString(keep(value), 40, false);
      if (s in iconPaths) return s;
      const fb = cleanString(fallback, 40, false);
      return fb in iconPaths ? fb : "";
    }
    case "toggle":
      return typeof keep(value) === "boolean" ? keep(value) : Boolean(fallback);
    case "select": {
      const s = cleanString(keep(value), 100, false);
      if (field.options.some((o) => o.value === s)) return s;
      const fb = cleanString(fallback, 100, false);
      return field.options.some((o) => o.value === fb) ? fb : (field.options[0]?.value ?? "");
    }
    case "id": {
      const s = cleanString(value, 60, false).replace(/[^a-zA-Z0-9_-]/g, "");
      return s || newId();
    }
    case "strings": {
      const arr = Array.isArray(value) ? value : Array.isArray(fallback) && value === undefined ? fallback : [];
      return arr
        .map((v) => cleanString(v, field.multiline ? 2000 : 300, !!field.multiline))
        .filter(Boolean)
        .slice(0, field.max ?? 40);
    }
    case "group": {
      const src = isObject(value) ? value : {};
      const fb = isObject(fallback) ? fallback : {};
      const out: Json = {};
      for (const f of field.fields) out[f.key] = sanitizeField(f, src[f.key], fb[f.key]);
      return out;
    }
    case "list": {
      const arr = Array.isArray(value) ? value : Array.isArray(fallback) && value === undefined ? fallback : [];
      const fbArr = Array.isArray(fallback) ? fallback : [];
      return arr
        .filter(isObject)
        .slice(0, field.max ?? 60)
        .map((item, i) => {
          const fbItem = isObject(fbArr[i]) ? (fbArr[i] as Json) : {};
          const out: Json = {};
          for (const f of field.fields) out[f.key] = sanitizeField(f, item[f.key], fbItem[f.key]);
          return out;
        });
    }
  }
}

/**
 * Validates one module of the content document against its schema. Keys that the schema does not
 * describe keep their default value, so fixed implementation details are never lost.
 */
export function sanitizeModule(mod: ContentModule, stored: unknown): Json {
  const src = isObject(stored) ? stored : {};
  const out: Json = structuredClone(mod.defaults) as Json;
  for (const section of mod.sections) {
    for (const field of section.fields) {
      out[field.key] = sanitizeField(field, src[field.key], (mod.defaults as Json)[field.key]);
    }
  }
  return out;
}

/** Dotted key paths in `defaults` that no section field describes. Used by the dev check. */
export function uncoveredPaths(mod: ContentModule): string[] {
  const missing: string[] = [];
  const topKeys = new Set(mod.sections.flatMap((s) => s.fields.map((f) => f.key)));

  const walk = (value: unknown, fields: Field[] | null, path: string) => {
    if (fields === null) return;
    if (Array.isArray(value)) return;
    if (!isObject(value)) return;
    for (const key of Object.keys(value)) {
      const f = fields.find((x) => x.key === key);
      if (!f) {
        missing.push(`${path}${key}`);
        continue;
      }
      const v = value[key];
      if (f.type === "group") walk(v, f.fields, `${path}${key}.`);
      if (f.type === "list" && Array.isArray(v)) {
        v.forEach((item, i) => walk(item, f.fields, `${path}${key}[${i}].`));
      }
    }
  };

  const root = mod.defaults as Json;
  const allFields = mod.sections.flatMap((s) => s.fields);
  for (const key of Object.keys(root)) {
    if (!topKeys.has(key)) missing.push(key);
  }
  walk(root, allFields, "");
  return missing;
}

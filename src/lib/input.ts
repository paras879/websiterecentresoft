/** Small helpers for text that arrives from the public forms. */

// Control characters (and the Unicode line separators) have no place in a name or an email address, and they are how
// header-injection tricks hide, so single-line fields have them turned into spaces.
const CONTROL = /[\u0000-\u001f\u007f\u2028\u2029]+/g;
const CONTROL_KEEP_NEWLINE = /[\u0000-\u0009\u000b-\u001f\u007f\u2028\u2029]+/g;

/** One line of text: trimmed, cut to `max`, without control characters. */
export function oneLine(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(CONTROL, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
}

/** Several lines (a message or a note): new lines are kept, other control characters are dropped. */
export function multiLine(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(CONTROL_KEEP_NEWLINE, "").trim().slice(0, max) : "";
}

/** True when the request says its body is larger than `max` bytes, so it can be refused before it is read. */
export function bodyTooLarge(req: Request, max: number): boolean {
  const length = Number(req.headers.get("content-length") ?? 0);
  return Number.isFinite(length) && length > max;
}

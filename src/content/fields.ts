/**
 * Field schema for the website content.
 *
 * Every editable piece of copy on the public site is described here, so the admin panel can build
 * its forms from it and the server can validate whatever is saved against the same description.
 */

export interface FieldBase {
  key: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Value a brand-new list item starts with (otherwise empty text / false / empty list). */
  initial?: unknown;
}

export type Field =
  | (FieldBase & { type: "text"; max?: number; placeholder?: string })
  | (FieldBase & { type: "longtext"; max?: number; rows?: number })
  | (FieldBase & { type: "url"; placeholder?: string })
  | (FieldBase & { type: "email" })
  | (FieldBase & { type: "phone" })
  | (FieldBase & { type: "image"; imageAlt?: boolean })
  | (FieldBase & { type: "icon" })
  | (FieldBase & { type: "toggle" })
  | (FieldBase & { type: "id" })
  | (FieldBase & { type: "select"; options: { value: string; label: string }[] })
  | (FieldBase & { type: "strings"; addLabel?: string; max?: number; multiline?: boolean })
  | (FieldBase & { type: "group"; fields: Field[] })
  | (FieldBase & {
      type: "list";
      /** Singular name used in buttons, e.g. "service" → "Add service". */
      itemLabel: string;
      /** Key of the item field shown as the row title. */
      titleKey?: string;
      fields: Field[];
      min?: number;
      max?: number;
    });

export interface Section {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export interface ContentModule<T = Record<string, unknown>> {
  /** Key under which this module lives in the content document. */
  id: string;
  title: string;
  /** Public route, used for "View page" links. */
  route?: string;
  group: "Pages" | "Services" | "Site";
  defaults: T;
  sections: Section[];
}

export function defineModule<T extends Record<string, unknown>>(m: ContentModule<T>): ContentModule<T> {
  return m;
}

/* ------------------------------------------------------------------ builders */

type Opts<F extends Field> = Partial<Omit<F, "type" | "key" | "label">>;

export const text = (key: string, label: string, o: Opts<Extract<Field, { type: "text" }>> = {}): Field => ({
  type: "text",
  key,
  label,
  ...o,
});

export const longtext = (
  key: string,
  label: string,
  o: Opts<Extract<Field, { type: "longtext" }>> = {},
): Field => ({ type: "longtext", key, label, ...o });

export const url = (key: string, label: string, o: Opts<Extract<Field, { type: "url" }>> = {}): Field => ({
  type: "url",
  key,
  label,
  ...o,
});

export const email = (key: string, label: string, o: Opts<Extract<Field, { type: "email" }>> = {}): Field => ({
  type: "email",
  key,
  label,
  ...o,
});

export const phone = (key: string, label: string, o: Opts<Extract<Field, { type: "phone" }>> = {}): Field => ({
  type: "phone",
  key,
  label,
  ...o,
});

export const image = (key: string, label: string, o: Opts<Extract<Field, { type: "image" }>> = {}): Field => ({
  type: "image",
  key,
  label,
  ...o,
});

export const icon = (key: string, label = "Icon", o: Opts<Extract<Field, { type: "icon" }>> = {}): Field => ({
  type: "icon",
  key,
  label,
  ...o,
});

/** Hidden, auto-generated identifier for list items (never shown in the admin forms). */
export const id = (key = "id"): Field => ({ type: "id", key, label: "ID" });

export const toggle = (key: string, label: string, o: Opts<Extract<Field, { type: "toggle" }>> = {}): Field => ({
  type: "toggle",
  key,
  label,
  ...o,
});

export const select = (
  key: string,
  label: string,
  options: { value: string; label: string }[],
  o: Opts<Extract<Field, { type: "select" }>> = {},
): Field => ({ type: "select", key, label, options, ...o });

export const strings = (
  key: string,
  label: string,
  o: Opts<Extract<Field, { type: "strings" }>> = {},
): Field => ({ type: "strings", key, label, ...o });

export const group = (key: string, label: string, fields: Field[], o: Opts<Extract<Field, { type: "group" }>> = {}): Field => ({
  type: "group",
  key,
  label,
  fields,
  ...o,
});

export const list = (
  key: string,
  label: string,
  itemLabel: string,
  fields: Field[],
  o: Opts<Extract<Field, { type: "list" }>> = {},
): Field => ({ type: "list", key, label, itemLabel, fields, ...o });

/** Standard SEO block every page carries. */
export const seoFields = (): Field =>
  group("meta", "Search & sharing", [
    text("title", "Page title", {
      max: 70,
      help: "Shown in the browser tab and on Google. About 50 to 60 characters works best.",
    }),
    longtext("description", "Description", {
      max: 200,
      rows: 3,
      help: "The short summary shown under the title on Google. About 150 characters works best.",
    }),
    image("image", "Sharing image", {
      help: "Shown when the page is shared on WhatsApp, LinkedIn or Facebook. Recommended 1200 × 630.",
    }),
    text("imageAlt", "Sharing image description", {
      max: 125,
      help: "Describes the sharing image for people who cannot see it. Leave empty to use the page title.",
    }),
  ]);

export interface PageMeta {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

/** Admin section for a page's frequently asked questions. The same questions feed the FAQ structured data for Google. */
export const faqSection = () => ({
  id: "faq",
  title: "Frequently asked questions",
  fields: [
    group("faq", "Frequently asked questions", [
      text("title", "Section heading", { max: 100 }),
      list(
        "items",
        "Questions",
        "question",
        [text("q", "Question", { max: 150 }), longtext("a", "Answer", { max: 800, rows: 4 })],
        { titleKey: "q", max: 15 },
      ),
    ]),
  ],
});

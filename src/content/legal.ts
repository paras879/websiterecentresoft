import { defineModule, group, icon, list, longtext, seoFields, text } from "./fields";

export type LegalDefaults = {
  meta: { title: string; description: string; image: string };
  hero: { title: string; lead: string; image: string };
  quick: { title: string; text: string; target: string; icon: string }[];
  sections: { title: string; body: string }[];
  contact: { officer: string; railTitle: string; railText: string };
};

/**
 * Shared editor for the two legal pages. Section text is plain: separate paragraphs with a blank
 * line, start a line with "> " for a highlighted note, "## " for a small heading, "- " for a short
 * list item, and "(a) " style prefixes for lettered clauses. The last section is the contact block.
 */
export function legalModule(opts: {
  id: string;
  title: string;
  route: string;
  defaults: LegalDefaults;
  contactLabel: string;
}) {
  return defineModule({
    id: opts.id,
    title: opts.title,
    route: opts.route,
    group: "Pages",
    defaults: opts.defaults,
    sections: [
      { id: "meta", title: "Search & sharing", fields: [seoFields()] },
      {
        id: "hero",
        title: "Top banner",
        fields: [
          group("hero", "Top banner", [
            text("title", "Heading", { required: true, max: 80 }),
            longtext("lead", "Intro line", { rows: 2 }),
          ]),
        ],
      },
      {
        id: "quick",
        title: "Quick links",
        description: "The four tiles under the banner. Each tile scrolls to a section.",
        fields: [
          list(
            "quick",
            "Tiles",
            "tile",
            [
              text("title", "Title", { required: true }),
              text("text", "Short line"),
              text("target", "Section it opens", { help: "Type the exact heading of the section, e.g. Cookies." }),
              icon("icon"),
            ],
            { titleKey: "title", max: 4 },
          ),
        ],
      },
      {
        id: "sections",
        title: "Document sections",
        description:
          "Separate paragraphs with a blank line. Start a line with “> ” for a highlighted note, “## ” for a small heading, or “- ” for a short list item. The last section is the contact block.",
        fields: [
          list(
            "sections",
            "Sections",
            "section",
            [text("title", "Heading", { required: true, max: 120 }), longtext("body", "Text", { rows: 10, max: 12000 })],
            { titleKey: "title", max: 20 },
          ),
        ],
      },
      {
        id: "contact",
        title: opts.contactLabel,
        fields: [
          group("contact", opts.contactLabel, [
            text("officer", "Name of the contact person or team", { required: true }),
            text("railTitle", "Side card heading"),
            longtext("railText", "Side card text", { rows: 2 }),
          ]),
        ],
      },
    ],
  });
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

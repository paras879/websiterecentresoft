import type { Metadata } from "next";
import type { PageMeta } from "@/content/fields";

const ORIGIN = "https://www.recenturesoft.com";

/** Builds the page <head> data from the editable "Search & sharing" fields of a page. */
export function pageMetadata(meta: PageMeta, path: string): Metadata {
  const url = path === "/" ? ORIGIN : `${ORIGIN}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      ...(meta.image
        ? { images: [{ url: meta.image, width: 1200, height: 630, alt: meta.title }] }
        : {}),
    },
  };
}

import type { Metadata } from "next";
import type { PageMeta } from "@/content/fields";

/** The public address of the website. Set NEXT_PUBLIC_SITE_URL when the final domain is connected. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://websiterecentresoft.vercel.app").replace(/\/+$/, "");
const ORIGIN = SITE_URL;

/** Builds the page <head> data from the editable "Search & sharing" fields of a page. */
export function pageMetadata(meta: PageMeta, path: string): Metadata {
  const url = path === "/" ? ORIGIN : `${ORIGIN}${path}`;
  const title = meta.title?.includes("Recenturesoft")
    ? { absolute: meta.title }
    : meta.title;

  return {
    title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Recenturesoft Infotech",
      title: meta.title,
      description: meta.description,
      url,
      ...(meta.image
        ? { images: [{ url: meta.image, width: 1200, height: 630, alt: meta.imageAlt || meta.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: "@recenture_soft",
      title: meta.title,
      description: meta.description,
      images: meta.image ? [{ url: meta.image, alt: meta.imageAlt || meta.title }] : [],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.png", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}


"use client";

import { usePathname } from "next/navigation";

/** Adds the structured data (breadcrumbs, page, service, FAQ) that belongs to the page being viewed. */
export function PageSchema({ pages }: { pages: Record<string, unknown> }) {
  const pathname = usePathname() || "/";
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const data = pages[key];
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

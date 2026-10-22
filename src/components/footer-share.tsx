"use client";

import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import styles from "./site-footer.module.css";

/** Plain "share this page" links. They are ordinary links, so no script from the networks is loaded. */
export function FooterShare({ name }: { name: string }) {
  const pathname = usePathname() || "/";
  const url = encodeURIComponent(`${SITE_URL}${pathname === "/" ? "" : pathname}`);
  const text = encodeURIComponent(name);
  const targets = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${url}` },
  ];
  return (
    <div className={styles.shareRow}>
      <span className={styles.shareLabel}>Share this page</span>
      {targets.map((t) => (
        <a key={t.label} href={t.href} className={styles.shareLink} target="_blank" rel="noopener noreferrer" aria-label={`Share this page on ${t.label}`}>
          {t.label}
        </a>
      ))}
    </div>
  );
}

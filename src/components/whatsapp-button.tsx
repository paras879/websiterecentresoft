"use client";

import { usePathname } from "next/navigation";
import styles from "./whatsapp-button.module.css";

export function WhatsAppFloatingButton({ url }: { url: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <aside aria-label="WhatsApp quick contact">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatBtn}
        aria-label="Chat on WhatsApp"
        title="Chat with Recenturesoft on WhatsApp"
      >
        <span className={styles.pulse} aria-hidden="true" />
        <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.507 14.307l-.009.075c-.246.732-1.44 1.341-2.007 1.38-.521.036-1.198.059-3.468-1.047-2.732-1.332-4.48-4.321-4.615-4.523-.136-.201-1.11-1.635-1.11-3.118 0-1.484.708-2.214.962-2.513.255-.3.673-.448.898-.448.225 0 .45.002.646.012.207.01.482-.087.755.637.28.741.956 2.585 1.041 2.776.084.192.14.417.028.665-.113.248-.17.404-.338.622-.169.217-.355.485-.508.652-.169.186-.346.388-.149.764.197.375.877 1.597 1.88 2.593 1.293 1.282 2.383 1.68 2.723 1.868.34.188.54.16.741-.094.202-.254.863-1.11 1.094-1.492.232-.383.464-.32.781-.19.317.13 2.012 1.054 2.358 1.246.346.192.577.286.662.448.085.162.085.938-.161 1.67zM12 2a10 10 0 0 0-8.66 15L2 22l5.13-1.31A10 10 0 1 0 12 2z"
          />
        </svg>
        <span className={styles.label}>Chat with us</span>
      </a>
    </aside>
  );
}

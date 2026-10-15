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
            fill="#ffffff"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"
          />
          <path
            fill="#25d366"
            d="M17.51 14.31c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.17.24-.65.79-.8 1-.15.17-.3.19-.54.07-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.17.04-.31-.02-.43s-.55-1.32-.75-1.81c-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7 2.46 1.06 2.46.71 2.9.66.44-.05 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"
          />
        </svg>
        <span className={styles.label}>Chat with us</span>
      </a>
    </aside>
  );
}

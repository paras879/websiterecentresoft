"use client";

import { useId, useState } from "react";
import styles from "./seo-faq.module.css";

export interface FaqItem {
  q: string;
  a: string;
}

export function SeoFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${base}-panel-${index}`;
        const buttonId = `${base}-btn-${index}`;
        return (
          <div key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.question}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className={styles.qText}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`${styles.answerWrap} ${isOpen ? styles.answerWrapOpen : ""}`}
            >
              <div className={styles.answerInner}>
                <p className={styles.answer}>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

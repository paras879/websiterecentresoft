"use client";

import { useId, useState } from "react";
import faqStyles from "./seo-faq.module.css";
import styles from "./faq-section.module.css";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
}

export function FaqSection({ title, items }: FaqSectionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  if (items.length === 0) return null;

  return (
    <section className={styles.wrap} aria-labelledby={`${base}-heading`}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.head}>
          <h2 id={`${base}-heading`} className={styles.title}>
            {title}
          </h2>
        </header>
        <div className={styles.list}>
          {items.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${base}-panel-${index}`;
            const buttonId = `${base}-btn-${index}`;
            return (
              <div
                key={item.q}
                className={`${faqStyles.item} ${isOpen ? faqStyles.itemOpen : ""}`}
              >
                <div className={faqStyles.heading}>
                  <button
                    type="button"
                    id={buttonId}
                    className={faqStyles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span className={faqStyles.qText}>{item.q}</span>
                    <span className={faqStyles.icon} aria-hidden="true" />
                  </button>
                </div>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`${faqStyles.answerWrap} ${isOpen ? faqStyles.answerWrapOpen : ""}`}
                >
                  <div className={faqStyles.answerInner}>
                    <p className={faqStyles.answer}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

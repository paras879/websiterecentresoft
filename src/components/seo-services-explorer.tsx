"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./seo-services-explorer.module.css";

export interface SeoService {
  title: string;
  desc: string;
  includes: string[];
  image: string;
  alt?: string;
}

export function SeoServicesExplorer({ services, linkPrefix = "Ask about" }: { services: SeoService[]; linkPrefix?: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = services.length - 1;
  const current = services[active];

  const select = (index: number, focus = false) => {
    const next = Math.min(Math.max(index, 0), last);
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      select(active + 1, true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      select(active - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(last, true);
    }
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.list}
        role="tablist"
        aria-orientation="vertical"
        aria-label="SEO services"
        onKeyDown={onKeyDown}
      >
        {services.map((item, index) => (
          <button
            key={item.title}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`seo-tab-${index}`}
            aria-selected={index === active}
            aria-controls="seo-panel"
            tabIndex={index === active ? 0 : -1}
            className={`${styles.tab} ${index === active ? styles.tabActive : ""}`}
            onClick={() => select(index)}
            onMouseEnter={() => select(index)}
          >
            <span className={styles.tabTitle}>{item.title}</span>
            <span className={styles.tabArrow} aria-hidden="true">
              &rarr;
            </span>
          </button>
        ))}
      </div>

      <div
        className={styles.panel}
        role="tabpanel"
        id="seo-panel"
        aria-labelledby={`seo-tab-${active}`}
      >
        <div className={styles.photo} key={`p-${active}`}>
          <Image
            src={current.image}
            alt={current.alt || current.title}
            fill
            sizes="(max-width: 900px) 100vw, 640px"
            className={styles.photoImg}
          />
          <span className={styles.photoShade} aria-hidden="true" />
        </div>

        <div className={styles.body} key={`b-${active}`}>
          <h3 className={styles.title}>{current.title}</h3>
          <p className={styles.text}>{current.desc}</p>
          <ul className={styles.includes} aria-label={`${current.title} includes`}>
            {current.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href="/contact" className={styles.link}>
            {linkPrefix} {current.title} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

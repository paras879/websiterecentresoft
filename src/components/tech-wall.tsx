"use client";

import { useRef, useState } from "react";
import styles from "./tech-wall.module.css";

export interface TechItem {
  name: string;
  role: string;
  /** one line on what we use it for */
  use: string;
  /** file name in /public/tech (without .svg); omit for the generic pipeline icon */
  icon?: string;
  color: string;
}

export interface TechGroup {
  group: string;
  items: TechItem[];
}

export function TechWall({ groups }: { groups: TechGroup[] }) {
  const [active, setActive] = useState(0);
  const [pick, setPick] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = groups.length - 1;
  const current = groups[active];
  const featured = current.items[Math.min(pick, current.items.length - 1)];

  const select = (index: number, focus = false) => {
    const next = Math.min(Math.max(index, 0), last);
    setActive(next);
    setPick(0);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select(active + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      select(active - 1, true);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Technology categories"
          onKeyDown={onKeyDown}
        >
          {groups.map((g, index) => (
            <button
              key={g.group}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`tech-tab-${index}`}
              aria-selected={index === active}
              aria-controls="tech-panel"
              tabIndex={index === active ? 0 : -1}
              className={`${styles.tab} ${index === active ? styles.tabActive : ""}`}
              onClick={() => select(index)}
            >
              {g.group}
              <span className={styles.count}>{g.items.length}</span>
            </button>
          ))}
        </div>

        <aside className={styles.feature} aria-live="polite" key={featured.name}>
          <span
            className={styles.featureLogo}
            style={{ "--brand": featured.color } as React.CSSProperties}
          >
            {featured.icon ? (
              <span
                className={styles.featureMask}
                style={{
                  maskImage: `url(/tech/${featured.icon}.svg)`,
                  WebkitMaskImage: `url(/tech/${featured.icon}.svg)`,
                }}
                aria-hidden="true"
              />
            ) : (
              <svg className={styles.logoSvg} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3" />
              </svg>
            )}
          </span>
          <div className={styles.featureText}>
            <span className={styles.featureKicker}>How we use it</span>
            <h3 className={styles.featureName}>{featured.name}</h3>
            <p className={styles.featureUse}>{featured.use}</p>
          </div>
        </aside>
      </div>

      <div
        className={styles.grid}
        role="tabpanel"
        id="tech-panel"
        aria-labelledby={`tech-tab-${active}`}
        key={current.group}
      >
        {current.items.map((item, i) => (
          <button
            type="button"
            key={item.name}
            className={`${styles.tile} ${i === pick ? styles.tileOn : ""}`}
            style={{ animationDelay: `${i * 70}ms` }}
            onMouseEnter={() => setPick(i)}
            onFocus={() => setPick(i)}
            onClick={() => setPick(i)}
          >
            <span
              className={styles.logoWrap}
              style={{ "--brand": item.color } as React.CSSProperties}
            >
              {item.icon ? (
                <span
                  className={styles.logo}
                  style={{
                    maskImage: `url(/tech/${item.icon}.svg)`,
                    WebkitMaskImage: `url(/tech/${item.icon}.svg)`,
                  }}
                  aria-hidden="true"
                />
              ) : (
                <svg className={styles.logoSvg} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3" />
                </svg>
              )}
            </span>
            <span className={styles.meta}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.role}>{item.role}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

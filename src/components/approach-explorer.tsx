"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon, type IconName } from "@/app/services/icons";
import styles from "./approach-explorer.module.css";

export interface ApproachStep {
  step: string;
  title: string;
  desc: string;
  icon: IconName;
  image: string;
}

export function ApproachExplorer({ steps }: { steps: ApproachStep[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = steps.length - 1;
  const current = steps[active];

  const select = (index: number, focus = false) => {
    const next = Math.min(Math.max(index, 0), last);
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select(active + 1, true);
    } else if (e.key === "ArrowLeft") {
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
    <div className={styles.explorer}>
      {/* Stepper */}
      <div className={styles.stepper}>
        <div className={styles.track} aria-hidden="true">
          <span
            className={styles.trackFill}
            style={{ width: `${(active / last) * 100}%` }}
          />
        </div>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Engineering approach steps"
          onKeyDown={handleKeyDown}
        >
          {steps.map((item, index) => {
            const state = index === active ? "active" : index < active ? "done" : "todo";
            return (
              <button
                key={item.step}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`approach-tab-${index}`}
                aria-selected={index === active}
                aria-controls="approach-panel"
                tabIndex={index === active ? 0 : -1}
                className={`${styles.tab} ${styles[state]}`}
                onClick={() => select(index)}
              >
                <span className={styles.dot}>
                  {state === "done" ? (
                    <Icon name="check" className={styles.dotIcon} />
                  ) : (
                    <span>{item.step}</span>
                  )}
                </span>
                <span className={styles.tabLabel}>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div
        className={styles.panel}
        role="tabpanel"
        id="approach-panel"
        aria-labelledby={`approach-tab-${active}`}
      >
        <div className={styles.panelVisual} aria-hidden="true">
          <Image
            key={`img-${active}`}
            src={current.image}
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 400px"
            className={styles.panelImg}
          />
          <span className={styles.panelShade} />
          <span className={styles.bigNum} key={`n-${active}`}>
            {current.step}
          </span>
          <span className={styles.panelIcon} key={`i-${active}`}>
            <Icon name={current.icon} className={styles.panelIconSvg} />
          </span>
        </div>

        <div className={styles.panelBody} key={`b-${active}`}>
          <span className={styles.panelLabel}>
            Step {current.step} of {steps[last].step}
          </span>
          <h3 className={styles.panelTitle}>{current.title}</h3>
          <p className={styles.panelText}>{current.desc}</p>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.ctrl}
              onClick={() => select(active - 1)}
              disabled={active === 0}
              aria-label="Previous step"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className={`${styles.ctrl} ${styles.ctrlNext}`}
              onClick={() => select(active + 1)}
              disabled={active === last}
              aria-label="Next step"
            >
              <span>{active === last ? "Final step" : `Next: ${steps[active + 1].title}`}</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/app/services/icons";
import styles from "./process-journey.module.css";

export interface JourneyStep {
  title: string;
  desc: string;
  gets: string;
  icon: IconName;
}

export function ProcessJourney({
  steps,
  sideLead = "",
  stepWord = "Step",
  getsLabel = "You get",
}: {
  steps: JourneyStep[];
  sideLead?: string;
  stepWord?: string;
  getsLabel?: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = listRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      const ratio = Math.min(Math.max((mid - rect.top) / rect.height, 0), 1);
      setProgress(ratio);
      const items = Array.from(el.children) as HTMLElement[];
      let count = 0;
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        if (r.top + 40 < mid) count += 1;
      });
      setReached(count);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        {sideLead ? <p className={styles.sideLead}>{sideLead}</p> : null}
        <ol className={styles.mini} aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.title} className={`${styles.miniItem} ${i < reached ? styles.miniDone : ""}`}>
              <span className={styles.miniDot} />
              {s.title}
            </li>
          ))}
        </ol>
      </aside>

      <ol className={styles.list} ref={listRef}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} style={{ height: `${progress * 100}%` }} />
        </span>
        {steps.map((step, index) => {
          const done = index < reached;
          return (
            <li key={step.title} className={`${styles.item} ${done ? styles.itemDone : ""}`}>
              <span className={styles.node} aria-hidden="true">
                <Icon name={step.icon} className={styles.nodeIcon} />
              </span>
              <div className={styles.card}>
                <span className={styles.step}>{stepWord} {index + 1}</span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.text}>{step.desc}</p>
                <p className={styles.gets}>
                  <span className={styles.getsLabel}>{getsLabel}</span>
                  {step.gets}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./reviews-section.module.css";

/**
 * Used when there are more than four reviews: they sit in one row that slides. Arrows move it by one card, it
 * moves by itself every few seconds, and it stops while someone is pointing at it, touching it or has asked
 * their device for less motion.
 */
export function ReviewsSlider({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const paused = useRef(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = (card?.getBoundingClientRect().width ?? el.clientWidth) + gap;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * width, behavior: "smooth" });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!paused.current && document.visibilityState === "visible") step(1);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [step]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <div className={styles.slider} onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume} onTouchStart={pause}>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => step(-1)} disabled={edges.start} aria-label="Previous reviews">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Next reviews">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <ul ref={track} className={styles.track} onScroll={measure} tabIndex={0} aria-label="Customer reviews, scroll sideways for more">
        {children}
      </ul>
    </div>
  );
}

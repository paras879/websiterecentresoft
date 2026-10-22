"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./reviews-section.module.css";

const EVERY = 4500;
const SLIDE_MS = 650;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Used when there are more than four reviews: they sit in one row that slides by itself every few seconds and
 * comes back to the first review after the last. It waits while the mouse is over it or it is being touched.
 * Small dots show where it is, and can be pressed to jump.
 */
export function ReviewsSlider({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);
  const frame = useRef<number | null>(null);
  const [dots, setDots] = useState({ count: 0, index: 0 });

  const stepWidth = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return (card?.getBoundingClientRect().width ?? el.clientWidth) + gap;
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const step = stepWidth();
    if (!step) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const count = Math.round(max / step) + 1;
    setDots({ count, index: Math.min(count - 1, Math.round(el.scrollLeft / step)) });
  }, [stepWidth]);

  /** Moves the row to `to` with an eased slide (or straight away when the device asks for less motion). */
  const slideTo = useCallback((to: number) => {
    const el = track.current;
    if (!el) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = el.scrollLeft;
    if (reduced || Math.abs(to - from) < 2) {
      el.scrollLeft = to;
      return;
    }
    // Snapping would fight the slide, so it is switched off until the slide ends.
    el.style.scrollSnapType = "none";
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SLIDE_MS);
      el.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else {
        frame.current = null;
        el.style.scrollSnapType = "";
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  const next = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // After the last review it comes back round to the first.
    if (el.scrollLeft >= max - 4) slideTo(0);
    else slideTo(Math.min(max, el.scrollLeft + stepWidth()));
  }, [slideTo, stepWidth]);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!hovering.current && document.visibilityState === "visible") next();
    }, EVERY);
    return () => window.clearInterval(timer);
  }, [next]);

  const enter = () => {
    hovering.current = true;
  };
  const leave = () => {
    hovering.current = false;
  };
  // A touch on a phone should not leave it paused for good.
  const touch = () => {
    hovering.current = true;
    window.setTimeout(() => {
      hovering.current = false;
    }, 8000);
  };

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    slideTo(Math.min(el.scrollWidth - el.clientWidth, i * stepWidth()));
  };

  return (
    <div className={styles.slider} onMouseEnter={enter} onMouseLeave={leave} onTouchStart={touch}>
      <ul ref={track} className={styles.track} onScroll={measure} aria-label="Customer reviews">
        {children}
      </ul>
      {dots.count > 1 ? (
        <div className={styles.dots} role="group" aria-label="Choose which reviews to show">
          {Array.from({ length: dots.count }, (_, i) => (
            <button key={i} type="button" className={`${styles.dot} ${i === dots.index ? styles.dotOn : ""}`} aria-label={`Show reviews from number ${i + 1}`} aria-current={i === dots.index} onClick={() => jump(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

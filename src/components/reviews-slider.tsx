"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./reviews-section.module.css";

const EVERY = 4500;
const SLIDE_MS = 650;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Used when there are more than four reviews: they sit in one row that slides. It moves by itself every few
 * seconds and goes back to the first review after the last. Arrows move it by hand, and a button stops and
 * restarts it. It also waits while someone points at it or touches it.
 */
export function ReviewsSlider({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);
  const frame = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

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

  const step = useCallback(
    (dir: 1 | -1) => {
      const el = track.current;
      if (!el) return;
      const card = el.querySelector("li");
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const width = (card?.getBoundingClientRect().width ?? el.clientWidth) + gap;
      const max = el.scrollWidth - el.clientWidth;
      const atEnd = el.scrollLeft >= max - 4;
      // After the last review it comes back round to the first.
      if (dir === 1 && atEnd) slideTo(0);
      else slideTo(Math.max(0, Math.min(max, el.scrollLeft + dir * width)));
    },
    [slideTo],
  );

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
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!hovering.current && document.visibilityState === "visible") step(1);
    }, EVERY);
    return () => window.clearInterval(timer);
  }, [playing, step]);

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

  return (
    <div className={styles.slider} onMouseEnter={enter} onMouseLeave={leave} onTouchStart={touch}>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} aria-label={playing ? "Pause automatic sliding" : "Start automatic sliding"}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M9 6v12M15 6v12" /> : <path d="M8 5l11 7-11 7z" />}
          </svg>
        </button>
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

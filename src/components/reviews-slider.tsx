"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./reviews-section.module.css";

const EVERY = 2000;
const SLIDE_MS = 650;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Used when there are more than four reviews: they sit in one row that slides by itself and never turns back.
 * A second copy of the cards follows the last one, so after the last review the first one slides in from the
 * same side; once it has arrived the row quietly steps back to the real first card, which looks identical.
 * It waits while the mouse is over it or it is being touched. Small dots show where it is.
 */
export function ReviewsSlider({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const frame = useRef<number | null>(null);
  const count = Children.count(children);
  const [looped, setLooped] = useState(false);
  const [index, setIndex] = useState(0);

  // The copy is added after the page has loaded, so search engines and screen readers only ever see each review once.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLooped(true);
  }, []);

  const stepWidth = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return (card?.getBoundingClientRect().width ?? el.clientWidth) + gap;
  }, []);

  /** When the row has reached the copy of the first card, step back to the real one. */
  const wrap = useCallback(() => {
    const el = track.current;
    const step = stepWidth();
    if (!el || !step || !looped) return;
    const loop = count * step;
    if (el.scrollLeft >= loop - 2) el.scrollLeft -= loop;
  }, [count, looped, stepWidth]);

  const measure = useCallback(() => {
    const el = track.current;
    const step = stepWidth();
    if (!el || !step) return;
    if (frame.current === null) wrap();
    setIndex(Math.round(el.scrollLeft / step) % count);
  }, [count, stepWidth, wrap]);

  /** Moves the row to `to` with an eased slide (or straight away when the device asks for less motion). */
  const slideTo = useCallback(
    (to: number) => {
      const el = track.current;
      if (!el) return;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const from = el.scrollLeft;
      if (reduced || Math.abs(to - from) < 2) {
        el.scrollLeft = to;
        wrap();
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
          wrap();
          el.style.scrollSnapType = "";
        }
      };
      frame.current = requestAnimationFrame(tick);
    },
    [wrap],
  );

  const next = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const step = stepWidth();
    // Without the copy yet (or on a very wide screen) it can only go as far as the row goes.
    const max = el.scrollWidth - el.clientWidth;
    if (!looped) slideTo(el.scrollLeft >= max - 4 ? 0 : Math.min(max, el.scrollLeft + step));
    else slideTo(el.scrollLeft + step);
  }, [looped, slideTo, stepWidth]);

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
    const step = stepWidth();
    const base = Math.floor(el.scrollLeft / (count * step)) * count * step;
    slideTo(base + i * step);
  };

  return (
    <div className={styles.slider} onMouseEnter={enter} onMouseLeave={leave} onTouchStart={touch}>
      <div ref={track} className={styles.track} onScroll={measure} role="group" aria-label="Customer reviews">
        <ul className={styles.set}>{children}</ul>
        {looped ? (
          <ul className={styles.set} aria-hidden="true">
            {children}
          </ul>
        ) : null}
      </div>
      {count > 1 ? (
        <div className={styles.dots} role="group" aria-label="Choose which reviews to show">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} type="button" className={`${styles.dot} ${i === index ? styles.dotOn : ""}`} aria-label={`Show reviews from number ${i + 1}`} aria-current={i === index} onClick={() => jump(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

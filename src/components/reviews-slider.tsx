"use client";

import { Children, useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import styles from "./reviews-section.module.css";

const EVERY = 2000;
const SLIDE_MS = 650;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Used when there are more than four reviews: they sit in one row that slides by itself and never turns back.
 * A second copy of the cards follows the last one, so after the last review the first one slides in from the
 * same side; once it has arrived the row quietly steps back to the real first card, which looks identical.
 * The row can also be dragged with the mouse or swiped with a finger, in either direction, and it keeps going
 * round. It waits while the mouse is over it or it is being touched.
 */
export function ReviewsSlider({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const dragging = useRef(false);
  const frame = useRef<number | null>(null);
  const settle = useRef<number | null>(null);
  const drag = useRef({ x: 0, left: 0, id: -1 });
  const count = Children.count(children);
  const [looped, setLooped] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

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

  /** Near the very start there is nothing to the left, so the view moves to the same place one round later. */
  const roomOnTheLeft = useCallback(() => {
    const el = track.current;
    const step = stepWidth();
    if (!el || !step || !looped) return;
    if (el.scrollLeft < step) el.scrollLeft += count * step;
  }, [count, looped, stepWidth]);

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
        el.style.scrollSnapType = "";
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
    // Without the copy yet it can only go as far as the row goes.
    const max = el.scrollWidth - el.clientWidth;
    if (!looped) slideTo(el.scrollLeft >= max - 4 ? 0 : Math.min(max, el.scrollLeft + step));
    else slideTo(el.scrollLeft + step);
  }, [looped, slideTo, stepWidth]);

  useEffect(() => {
    const el = track.current;
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (settle.current !== null) window.clearTimeout(settle.current);
      if (el) el.style.scrollSnapType = "";
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!hovering.current && !dragging.current && document.visibilityState === "visible") next();
    }, EVERY);
    return () => window.clearInterval(timer);
  }, [next]);

  /* ---- a finger swipe is the browser's own scrolling; the round trip is fixed up when it comes to rest */
  const onScroll = () => {
    if (dragging.current || frame.current !== null) return;
    if (settle.current !== null) window.clearTimeout(settle.current);
    settle.current = window.setTimeout(wrap, 140);
  };

  const onTouchStart = () => {
    roomOnTheLeft();
    hovering.current = true;
    window.setTimeout(() => {
      hovering.current = false;
    }, 8000);
  };

  /* ---- dragging with the mouse */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    roomOnTheLeft();
    dragging.current = true;
    drag.current = { x: e.clientX, left: el.scrollLeft, id: e.pointerId };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
    setGrabbing(true);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el || !dragging.current || e.pointerId !== drag.current.id) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el || !dragging.current || e.pointerId !== drag.current.id) return;
    dragging.current = false;
    setGrabbing(false);
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    // Settle on the nearest card.
    const step = stepWidth();
    slideTo(Math.round(el.scrollLeft / step) * step);
  };

  return (
    <div className={styles.slider} onMouseEnter={() => (hovering.current = true)} onMouseLeave={() => (hovering.current = false)}>
      <div
        ref={track}
        className={`${styles.track} ${grabbing ? styles.grabbing : ""}`}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="group"
        aria-label="Customer reviews"
      >
        <ul className={styles.set}>{children}</ul>
        {looped ? (
          <ul className={styles.set} aria-hidden="true">
            {children}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

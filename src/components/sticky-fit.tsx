"use client";

import { useEffect, useRef } from "react";

/**
 * Put inside a section that sticks while the next section slides over it. When the section is taller than the
 * window, it sticks higher up so its bottom edge stays visible and every line can be read before it is covered.
 */
export function StickyFit({ offset = 76 }: { offset?: number }) {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const wide = window.matchMedia("(min-width: 1025px)");

    const apply = () => {
      if (!wide.matches) {
        section.style.top = "";
        return;
      }
      section.style.top = `${Math.min(offset, window.innerHeight - section.offsetHeight)}px`;
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(section);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
      section.style.top = "";
    };
  }, [offset]);

  return <span ref={marker} hidden />;
}

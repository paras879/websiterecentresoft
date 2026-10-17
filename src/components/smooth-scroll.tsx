"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

export function SmoothScroll() {
  const pathname = usePathname();
  // The admin panel has its own scrolling areas (sidebar, lists), so smooth scrolling stays off there.
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    // Respect user's motion preferences
    if (isAdmin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let instance: Lenis | null = null;
    let cancelled = false;

    // Loaded after the page is interactive, so it never delays first paint.
    const start = () => {
      import("lenis").then(({ default: LenisClass }) => {
        if (cancelled) return;
        instance = new LenisClass({
          autoRaf: true,
          anchors: true,
          smoothWheel: true,
          duration: 1.4,
          lerp: 0.065, // Calmer, velvety momentum
          wheelMultiplier: 0.75, // Slightly slower scroll travel distance per notch
          touchMultiplier: 1.2,
        });
        (window as unknown as { __lenis?: Lenis }).__lenis = instance;
      });
    };

    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = idle ? idle(start) : window.setTimeout(start, 400);

    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(handle);
      instance?.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [isAdmin]);

  // Reset scroll to top on route change
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}

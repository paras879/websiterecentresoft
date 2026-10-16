"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
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

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      duration: 1.4,
      lerp: 0.065, // Calmer, velvety momentum
      wheelMultiplier: 0.75, // Slightly slower scroll travel distance per notch
      touchMultiplier: 1.2,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
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

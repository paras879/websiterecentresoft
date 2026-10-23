"use client";

import { useEffect } from "react";

const IDLE_MS = 20 * 60_000;
const PING_EVERY_MS = 2 * 60_000;
const CHECK_EVERY_MS = 20_000;
const SIGNS_OF_LIFE = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"] as const;

/**
 * Signs the person out after 20 minutes without activity. While they are working, the server's 20-minute clock is
 * renewed every couple of minutes; if the server has already ended the session (or the computer slept), the next
 * check sends them to the sign-in page.
 */
export function AdminIdleGuard({ authUrl, loginUrl }: { authUrl: string; loginUrl: string }) {
  useEffect(() => {
    let lastActive = Date.now();
    let lastPing = Date.now();
    let leaving = false;

    const leave = async (signOut: boolean) => {
      if (leaving) return;
      leaving = true;
      if (signOut) await fetch(authUrl, { method: "DELETE" }).catch(() => undefined);
      window.location.href = loginUrl;
    };

    const check = async () => {
      if (leaving) return;
      const now = Date.now();
      if (now - lastActive >= IDLE_MS) return leave(true);
      if (lastActive > lastPing && now - lastPing >= PING_EVERY_MS) {
        lastPing = now;
        try {
          const res = await fetch(authUrl, { method: "PATCH" });
          if (res.status === 401) return leave(false);
        } catch {
          /* offline for a moment: try again at the next check */
        }
      }
    };

    const alive = () => {
      lastActive = Date.now();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };

    for (const type of SIGNS_OF_LIFE) window.addEventListener(type, alive, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(() => void check(), CHECK_EVERY_MS);
    return () => {
      for (const type of SIGNS_OF_LIFE) window.removeEventListener(type, alive);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, [authUrl, loginUrl]);

  return null;
}

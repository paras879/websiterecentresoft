"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

interface Grecaptcha {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      theme: "light" | "dark";
      size: "normal" | "compact";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => number;
  reset: (id?: number) => void;
  ready: (cb: () => void) => void;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

/** The public key from Google. Without it the check is simply not shown and forms work as before. */
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export const recaptchaEnabled = SITE_KEY.length > 0;

export interface RecaptchaHandle {
  reset: () => void;
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.grecaptcha?.render) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("reCAPTCHA could not be loaded"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

const currentTheme = (): "light" | "dark" =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

/** Google's "I'm not a robot" box. Loads only when the form scrolls near the screen. */
export const Recaptcha = forwardRef<RecaptchaHandle, { onChange: (token: string) => void; invalid?: boolean }>(
  function Recaptcha({ onChange, invalid }, ref) {
    const host = useRef<HTMLDivElement>(null);
    const widget = useRef<number | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const draw = useCallback(async () => {
      const el = host.current;
      if (!el || !SITE_KEY) return;
      try {
        await loadScript();
      } catch {
        return;
      }
      window.grecaptcha?.ready(() => {
        if (!host.current || !window.grecaptcha) return;
        host.current.innerHTML = "";
        const box = document.createElement("div");
        host.current.appendChild(box);
        if (currentTheme() === "dark") {
          // Google draws a light edge around its dark box. Trim it so the box sits cleanly on the dark form.
          box.style.width = "304px";
          box.style.height = "78px";
          box.style.clipPath = "inset(2px round 6px)";
        }
        onChangeRef.current("");
        widget.current = window.grecaptcha.render(box, {
          sitekey: SITE_KEY,
          theme: currentTheme(),
          size: host.current.clientWidth > 0 && host.current.clientWidth < 310 ? "compact" : "normal",
          callback: (token) => onChangeRef.current(token),
          "expired-callback": () => onChangeRef.current(""),
          "error-callback": () => onChangeRef.current(""),
        });
      });
    }, []);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widget.current !== null) window.grecaptcha?.reset(widget.current);
        onChangeRef.current("");
      },
    }));

    useEffect(() => {
      const el = host.current;
      if (!el || !SITE_KEY) return;
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        void draw();
      };
      const watcher = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            watcher.disconnect();
          }
        },
        { rootMargin: "400px" },
      );
      watcher.observe(el);

      // Draw the box again in the other colours when the theme is switched.
      const themeWatcher = new MutationObserver(() => {
        if (started) void draw();
      });
      themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      return () => {
        watcher.disconnect();
        themeWatcher.disconnect();
      };
    }, [draw]);

    if (!SITE_KEY) return null;

    return (
      <div
        ref={host}
        aria-label="Security check"
        style={{
          minHeight: 78,
          maxWidth: "100%",
          outline: invalid ? "2px solid #dc2626" : undefined,
          outlineOffset: 4,
          borderRadius: 4,
        }}
      />
    );
  },
);

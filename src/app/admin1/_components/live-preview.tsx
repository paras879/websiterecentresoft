"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomPage } from "@/lib/custom-pages-types";
import cms from "../cms.module.css";
import type { FrameMessage } from "../preview/live/live-frame";

const DEVICES = [
  { id: "desktop", label: "Desktop", width: 1024 },
  { id: "tablet", label: "Tablet", width: 820 },
  { id: "phone", label: "Phone", width: 390 },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

/**
 * The page as visitors will see it, redrawn while the editor types. The picture inside is the real site layout
 * (a frame that receives the unsaved page), shrunk to fit the column.
 */
export function LivePreview({ page, scrollTo, onClose }: { page: CustomPage; scrollTo: { id: string; n: number } | null; onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const latest = useRef(page);
  const [device, setDevice] = useState<DeviceId>("desktop");
  const [theme, setTheme] = useState<"light" | "dark" | "site">("site");
  const [size, setSize] = useState({ w: 600, h: 600 });

  const post = (m: FrameMessage) => frame.current?.contentWindow?.postMessage(m, window.location.origin);

  // The frame says hello once it has loaded; from then on every edit is sent.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "rs-preview-ready") {
        ready.current = true;
        post({ type: "rs-preview-page", page: latest.current });
        if (theme !== "site") post({ type: "rs-preview-theme", theme });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    latest.current = page;
    if (!ready.current) return;
    const t = window.setTimeout(() => post({ type: "rs-preview-page", page }), 120);
    return () => window.clearTimeout(t);
  }, [page]);

  useEffect(() => {
    if (theme !== "site" && ready.current) post({ type: "rs-preview-theme", theme });
  }, [theme]);

  useEffect(() => {
    if (scrollTo && ready.current) post({ type: "rs-preview-scroll", blockId: scrollTo.id });
  }, [scrollTo]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const width = DEVICES.find((d) => d.id === device)!.width;
  const scale = Math.min(1, size.w / width);

  return (
    <section className={cms.live} aria-label="Live preview">
      <div className={cms.liveBar}>
        <strong className={cms.liveTitle}>Live preview</strong>
        <div className={cms.liveSeg} role="group" aria-label="Screen size">
          {DEVICES.map((d) => (
            <button key={d.id} type="button" className={device === d.id ? cms.liveOn : ""} aria-pressed={device === d.id} onClick={() => setDevice(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
        <div className={cms.liveSeg} role="group" aria-label="Colour theme">
          {(["site", "light", "dark"] as const).map((t) => (
            <button key={t} type="button" className={theme === t ? cms.liveOn : ""} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t === "site" ? "Auto" : t === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
        <button type="button" className={cms.liveClose} onClick={onClose} aria-label="Hide the live preview">
          Hide
        </button>
      </div>
      <div ref={box} className={cms.liveBox}>
        <div className={cms.liveStage} style={{ width: width * scale, height: size.h, margin: "0 auto" }}>
          <iframe
            ref={frame}
            title="Live preview of the page"
            src="/admin1/preview/live"
            className={cms.liveFrame}
            style={{ width, height: size.h / scale, transform: `scale(${scale})` }}
          />
        </div>
      </div>
      <p className={cms.liveNote}>Shows your changes as you type. Nothing goes on the website until you save.</p>
    </section>
  );
}

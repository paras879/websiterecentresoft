"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import { CustomPageView } from "@/components/custom-page-view";
import type { CustomPage } from "@/lib/custom-pages-types";

/** Messages the editor sends to this frame. */
export type FrameMessage =
  | { type: "rs-preview-page"; page: CustomPage }
  | { type: "rs-preview-scroll"; blockId: string }
  | { type: "rs-preview-theme"; theme: "light" | "dark" };

/** A half-typed value (for example an unfinished picture address) must not blank the whole preview. */
class Guard extends Component<{ page: CustomPage; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  componentDidUpdate(prev: { page: CustomPage }) {
    // A new edit arrives: try drawing again.
    if (this.state.failed && prev.page !== this.props.page) this.setState({ failed: false });
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p style={{ padding: 24, color: "var(--color-text-muted)" }}>The preview could not be drawn for this change. Keep typing, it updates when the content is complete.</p>
    ) : (
      this.props.children
    );
  }
}

export function LiveFrame() {
  const [page, setPage] = useState<CustomPage | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent<FrameMessage>) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return;
      const m = e.data;
      if (m.type === "rs-preview-page") setPage(m.page);
      else if (m.type === "rs-preview-theme") document.documentElement.setAttribute("data-theme", m.theme);
      else if (m.type === "rs-preview-scroll") document.getElementById(`blk-${m.blockId}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "rs-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg-page)" }}>
      {page ? (
        <Guard page={page}>
          {page.blocks.length === 0 ? (
            <p style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)" }}>Add a content block and it appears here.</p>
          ) : (
            <CustomPageView page={page} />
          )}
        </Guard>
      ) : (
        <p style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)" }}>Loading the preview...</p>
      )}
    </div>
  );
}

"use client";

/** Shown when the panel cannot load, for example when the database could not be reached for a moment. */
export default function PanelError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100dvh", padding: 24, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 420 }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600 }}>The admin panel could not load</h1>
        <p style={{ margin: "0 0 18px", color: "#666", lineHeight: 1.5 }}>
          The website is fine and nothing was changed. The saved content could not be read just now, so the panel did not open
          rather than show old text. Please try again.
        </p>
        <button type="button" onClick={reset} style={{ padding: "10px 18px", font: "inherit", color: "#fff", cursor: "pointer", background: "#111", border: 0, borderRadius: 6 }}>
          Try again
        </button>
      </div>
    </main>
  );
}

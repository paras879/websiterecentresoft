"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/content";
import styles from "../admin.module.css";
import { api, fullDate, relativeTime } from "./lib";
import { Badge, Button, ConfirmDialog, EmptyState, useToast } from "./ui";

interface Entry {
  id: string;
  at: string;
  note: string;
}

export function HistoryView({
  dirty,
  writable,
  refreshKey,
  onRestored,
}: {
  dirty: boolean;
  writable: boolean;
  refreshKey: number;
  onRestored: (content: SiteContent) => void;
}) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<Entry | "original" | null>(null);
  const [busy, setBusy] = useState(false);
  const notify = useToast();

  const load = useCallback(async () => {
    const res = await api<{ history: Entry[] }>("/api/admin/history");
    if (res.success) {
      setEntries(res.history);
      setError(null);
    } else {
      setEntries([]);
      setError(res.error ?? "Could not load the history.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load, refreshKey]);

  const restore = async () => {
    if (!target) return;
    setBusy(true);
    const res = await api<{ content: SiteContent }>("/api/admin/history", {
      method: "POST",
      json: { id: target === "original" ? "original" : target.id },
    });
    setBusy(false);
    setTarget(null);
    if (res.success) {
      onRestored(res.content);
      notify("success", "Restored. The website now shows that version.");
      void load();
    } else {
      notify("error", res.error ?? "Could not restore that version.");
    }
  };

  return (
    <div className={styles.page}>
      <p className={styles.pageLead}>
        Every time you save, a copy is kept here (the latest 20). Restoring a version puts it on the website straight
        away, and the version you replace stays in this list.
      </p>

      {entries === null ? (
        <p className={styles.help}>Loading…</p>
      ) : (
        <ul className={styles.historyList}>
          {entries.map((e, i) => (
            <li key={e.id} className={styles.historyRow}>
              <div>
                <p className={styles.historyTitle}>
                  {fullDate(e.at)}
                  {i === 0 ? <Badge tone="green">Live now</Badge> : null}
                </p>
                <p className={styles.historyMeta}>
                  {relativeTime(e.at)}
                  {e.note ? ` · ${e.note}` : ""}
                </p>
              </div>
              {i > 0 ? (
                <Button icon="reset" disabled={!writable} onClick={() => setTarget(e)}>
                  Restore
                </Button>
              ) : null}
            </li>
          ))}
          <li className={styles.historyRow}>
            <div>
              <p className={styles.historyTitle}>Original content</p>
              <p className={styles.historyMeta}>The text and pictures the website launched with.</p>
            </div>
            <Button icon="reset" disabled={!writable} onClick={() => setTarget("original")}>
              Restore
            </Button>
          </li>
        </ul>
      )}
      {entries && entries.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No saved versions yet"
          text={error ?? "After your first save, versions will be listed here."}
        />
      ) : null}

      <ConfirmDialog
        open={target !== null}
        title={target === "original" ? "Restore the original content?" : target ? `Restore the version from ${fullDate(target.at)}?` : ""}
        body={
          <>
            The website will show that version straight away.
            {dirty ? " Your unsaved changes in the editor will be lost." : ""}
          </>
        }
        confirmLabel={busy ? "Restoring…" : "Restore version"}
        danger={false}
        onCancel={() => setTarget(null)}
        onConfirm={() => void restore()}
      />
    </div>
  );
}

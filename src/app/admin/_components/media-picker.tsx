"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { builtinImages, builtinLogos } from "@/content/builtin-images";
import styles from "../admin.module.css";
import { api, compressImage } from "./lib";
import { Button, cx, Dialog, EmptyState, useToast } from "./ui";

export interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  url: string;
}

type Tab = "uploaded" | "builtin" | "logos";

/** Upload + choose pictures. Used inside forms (picker) and on the Images page. */
export function useUploads(enabled: boolean) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [maxBytes, setMaxBytes] = useState(700 * 1024);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api<{ media: MediaItem[]; maxBytes: number }>("/api/admin/media");
    if (res.success) {
      setItems(res.media);
      setMaxBytes(res.maxBytes);
      setError(null);
    } else {
      setItems([]);
      setError(res.error ?? "Could not load your images.");
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [enabled, load]);

  return { items, setItems, maxBytes, error, reload: load };
}

export async function uploadFile(file: File, maxBytes: number): Promise<{ item?: MediaItem; error?: string }> {
  if (!file.type.startsWith("image/")) return { error: "Please choose a JPG, PNG, WebP or GIF image." };
  let prepared = file;
  try {
    prepared = await compressImage(file, maxBytes);
  } catch {
    /* fall back to the original file */
  }
  const body = new FormData();
  body.append("file", prepared);
  const res = await api<{ item: MediaItem }>("/api/admin/media", { method: "POST", body });
  return res.success ? { item: res.item } : { error: res.error ?? "The image could not be uploaded." };
}

export function MediaPicker({
  open,
  current,
  onClose,
  onPick,
}: {
  open: boolean;
  current: string;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("uploaded");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { items, setItems, maxBytes, error } = useUploads(open);
  const notify = useToast();

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    const result = await uploadFile(file, maxBytes);
    setBusy(false);
    if (result.item) {
      setItems((prev) => [result.item as MediaItem, ...(prev ?? [])]);
      onPick((result.item as MediaItem).url);
      notify("success", "Image uploaded.");
    } else {
      notify("error", result.error ?? "The image could not be uploaded.");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const grid = (urls: { url: string; label: string }[]) => (
    <ul className={styles.pickGrid}>
      {urls.map((m) => (
        <li key={m.url}>
          <button
            type="button"
            className={cx(styles.pickCell, m.url === current && styles.pickCellOn)}
            onClick={() => onPick(m.url)}
            data-autofocus={m.url === current ? "" : undefined}
            aria-pressed={m.url === current}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt="" loading="lazy" />
            <span>{m.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <Dialog open={open} onClose={onClose} title="Choose an image" wide>
      <div className={styles.pickBar}>
        <div className={styles.tabs} role="tablist" aria-label="Image source">
          {(
            [
              ["uploaded", "Your uploads"],
              ["builtin", "Website pictures"],
              ["logos", "Technology logos"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={cx(styles.tab, tab === key && styles.tabOn)}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.visuallyHidden}
          aria-label="Upload an image"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <Button variant="primary" icon="upload" busy={busy} onClick={() => fileRef.current?.click()}>
          Upload new image
        </Button>
      </div>

      <div className={styles.pickBody}>
        {tab === "uploaded" ? (
          items === null ? (
            <p className={styles.help}>Loading…</p>
          ) : items.length === 0 ? (
            <EmptyState
              icon="image"
              title="No uploads yet"
              text={error ?? "Upload a photo and it will show up here. Large photos are shrunk automatically."}
            />
          ) : (
            grid(items.map((m) => ({ url: m.url, label: m.name })))
          )
        ) : null}
        {tab === "builtin" ? grid(builtinImages.map((u) => ({ url: u, label: u.split("/").pop() ?? u }))) : null}
        {tab === "logos" ? grid(builtinLogos.map((u) => ({ url: u, label: u.split("/").pop()?.replace(".svg", "") ?? u }))) : null}
      </div>
    </Dialog>
  );
}

"use client";

import { useRef, useState } from "react";
import styles from "../admin.module.css";
import { api, formatBytes, relativeTime } from "./lib";
import { uploadFile, useUploads, type MediaItem } from "./media-picker";
import { Badge, Button, ConfirmDialog, cx, EmptyState, IconButton, useToast } from "./ui";

export function MediaView({ contentJson, writable }: { contentJson: string; writable: boolean }) {
  const { items, setItems, maxBytes, error } = useUploads(true);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [deleting, setDeleting] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const notify = useToast();

  const upload = async (files: FileList | File[] | null | undefined) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    let done = 0;
    for (const file of Array.from(files)) {
      const result = await uploadFile(file, maxBytes);
      if (result.item) {
        const item = result.item;
        setItems((prev) => [item, ...(prev ?? [])]);
        done += 1;
      } else {
        notify("error", `${file.name}: ${result.error}`);
      }
    }
    setBusy(false);
    if (done) notify("success", done === 1 ? "Image uploaded." : `${done} images uploaded.`);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = async (item: MediaItem) => {
    const res = await api(`/api/admin/media?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    setDeleting(null);
    if (res.success) {
      setItems((prev) => (prev ?? []).filter((m) => m.id !== item.id));
      notify("success", `Deleted ${item.name}.`);
    } else {
      notify("error", res.error ?? "Could not delete the image.");
    }
  };

  const copy = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      notify("success", "Image address copied.");
    } catch {
      notify("info", item.url);
    }
  };

  const used = (item: MediaItem) => contentJson.includes(item.url);

  return (
    <div className={styles.page}>
      <div
        className={cx(styles.dropzone, drag && styles.dropzoneOn)}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void upload(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.visuallyHidden}
          aria-label="Upload images"
          onChange={(e) => void upload(e.target.files)}
        />
        <p className={styles.dropTitle}>Drag pictures here, or</p>
        <Button variant="primary" icon="upload" busy={busy} disabled={!writable} onClick={() => fileRef.current?.click()}>
          Upload images
        </Button>
        <p className={styles.help}>
          JPG, PNG, WebP or GIF. Large photos are shrunk automatically to stay under {formatBytes(maxBytes)}.
        </p>
        {!writable ? <p className={styles.fieldError}>Uploads need a database. See the notice on the Overview page.</p> : null}
      </div>

      {items === null ? (
        <p className={styles.help}>Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState icon="image" title="No uploaded images yet" text={error ?? "Pictures you upload appear here, ready to use anywhere on the website."} />
      ) : (
        <ul className={styles.mediaGrid}>
          {items.map((m) => (
            <li key={m.id} className={styles.mediaItem}>
              <div className={styles.mediaThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt="" loading="lazy" />
              </div>
              <div className={styles.mediaInfo}>
                <p className={styles.mediaName} title={m.name}>
                  {m.name}
                </p>
                <p className={styles.mediaMeta}>
                  {formatBytes(m.size)} · {relativeTime(m.createdAt)}
                </p>
                {used(m) ? <Badge tone="green">Used on the website</Badge> : null}
              </div>
              <div className={styles.mediaTools}>
                <IconButton icon="copy" label={`Copy address of ${m.name}`} onClick={() => void copy(m)} />
                <IconButton icon="trash" label={`Delete ${m.name}`} onClick={() => setDeleting(m)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={deleting ? `Delete “${deleting.name}”?` : ""}
        body={
          deleting && used(deleting)
            ? "This picture is used on the website. If you delete it, that spot will show no image until you choose another one."
            : "This cannot be undone."
        }
        confirmLabel="Delete image"
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && void remove(deleting)}
      />
    </div>
  );
}

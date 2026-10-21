"use client";

import { useId, useState } from "react";
import Image from "next/image";
import {
  newBlockId,
  type Block,
  type FaqItem,
  type FeatureItem,
  type GalleryImage,
} from "@/lib/custom-pages-types";
import adminStyles from "../../admin/admin.module.css";
import { MediaPicker } from "../../admin/_components/media-picker";
import { Button, IconButton } from "../../admin/_components/ui";
import cms from "../cms.module.css";

/* ------------------------------------------------------------------ small form pieces */

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className={adminStyles.field}>
      <label htmlFor={id} className={adminStyles.label}>
        {label}
      </label>
      {children(id)}
      {hint ? <span className={cms.help}>{hint}</span> : null}
    </div>
  );
}

export function TextField({ label, value, onChange, hint, max, placeholder }: { label: string; value: string; onChange: (v: string) => void; hint?: string; max?: number; placeholder?: string }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => <input id={id} className={adminStyles.input} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export function AreaField({ label, value, onChange, hint, rows = 4, max }: { label: string; value: string; onChange: (v: string) => void; hint?: string; rows?: number; max?: number }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => <textarea id={id} className={adminStyles.input} rows={rows} value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export function Seg<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className={adminStyles.field}>
      <span className={adminStyles.label}>{label}</span>
      <div className={cms.seg} role="group" aria-label={label}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" className={`${cms.segBtn} ${o.value === value ? cms.segOn : ""}`} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Choose a picture from the library, with its description for people who cannot see it. */
export function ImagePick({
  label = "Picture",
  value,
  alt,
  onChange,
  onAlt,
  noAlt,
}: {
  label?: string;
  value: string;
  alt?: string;
  onChange: (v: string) => void;
  onAlt?: (v: string) => void;
  noAlt?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={adminStyles.field}>
      <span className={adminStyles.label}>{label}</span>
      <div className={cms.imgPick}>
        <div className={cms.thumb}>
          {value ? <Image src={value} alt="" width={160} height={110} unoptimized={value.startsWith("/api/")} /> : <span className={cms.help}>No picture</span>}
        </div>
        <div className={cms.imgPickActions}>
          <Button icon="image" onClick={() => setOpen(true)}>
            {value ? "Change picture" : "Choose picture"}
          </Button>
          {value ? (
            <Button variant="ghost" icon="trash" onClick={() => onChange("")}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      {!noAlt && onAlt ? (
        <input
          className={adminStyles.input}
          style={{ marginTop: 8 }}
          value={alt ?? ""}
          maxLength={160}
          placeholder="Describe the picture, for example: Team talking around a table"
          aria-label={`${label} description`}
          onChange={(e) => onAlt(e.target.value)}
        />
      ) : null}
      <MediaPicker
        open={open}
        current={value}
        onClose={() => setOpen(false)}
        onPick={(url) => {
          onChange(url);
          setOpen(false);
        }}
      />
    </div>
  );
}

/** Moves one entry of a list a step up or down. */
const swap = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

function RowTools({ index, count, onMove, onRemove, label }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void; label: string }) {
  return (
    <div className={cms.rowTools}>
      <IconButton icon="up" label={`Move ${label} earlier`} disabled={index === 0} onClick={() => onMove(index - 1)} />
      <IconButton icon="down" label={`Move ${label} later`} disabled={index === count - 1} onClick={() => onMove(index + 1)} />
      <IconButton icon="trash" label={`Remove ${label}`} onClick={onRemove} />
    </div>
  );
}

/* ------------------------------------------------------------------ one editor per block type */

export function BlockBody({ block, onChange }: { block: Block; onChange: (next: Block) => void }) {
  const set = <K extends string>(key: K, value: unknown) => onChange({ ...block, [key]: value } as Block);

  switch (block.type) {
    case "hero":
      return (
        <div className={cms.blockFields}>
          <TextField label="Small label above the heading" value={block.eyebrow} onChange={(v) => set("eyebrow", v)} max={60} />
          <TextField label="Heading" value={block.title} onChange={(v) => set("title", v)} max={140} />
          <AreaField label="Text" value={block.text} onChange={(v) => set("text", v)} rows={3} max={600} />
          <div className={cms.formRow}>
            <TextField label="Button text" value={block.buttonLabel} onChange={(v) => set("buttonLabel", v)} max={50} />
            <TextField label="Button link" value={block.buttonHref} onChange={(v) => set("buttonHref", v)} placeholder="/contact" hint="A page on this site starts with /. Another site starts with https://" />
          </div>
          <Seg
            label="Where the picture goes"
            value={block.imageSide}
            options={[
              { value: "right", label: "Right" },
              { value: "left", label: "Left" },
              { value: "background", label: "Behind the text" },
              { value: "none", label: "No picture" },
            ]}
            onChange={(v) => set("imageSide", v)}
          />
          {block.imageSide !== "none" ? <ImagePick value={block.image} alt={block.imageAlt} onChange={(v) => set("image", v)} onAlt={(v) => set("imageAlt", v)} /> : null}
        </div>
      );

    case "text":
      return (
        <div className={cms.blockFields}>
          <TextField label="Heading (optional)" value={block.heading} onChange={(v) => set("heading", v)} max={140} />
          <AreaField label="Text" value={block.body} onChange={(v) => set("body", v)} rows={8} max={8000} hint="A blank line starts a new paragraph. Start a line with - for a list, or with ## for a small heading." />
          <Seg label="Alignment" value={block.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} onChange={(v) => set("align", v)} />
        </div>
      );

    case "image":
      return (
        <div className={cms.blockFields}>
          <ImagePick value={block.image} alt={block.alt} onChange={(v) => set("image", v)} onAlt={(v) => set("alt", v)} />
          <TextField label="Caption (optional)" value={block.caption} onChange={(v) => set("caption", v)} max={200} />
          <Seg label="Size" value={block.size} options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "full", label: "Full width" }]} onChange={(v) => set("size", v)} />
        </div>
      );

    case "imageText":
      return (
        <div className={cms.blockFields}>
          <Seg label="Picture side" value={block.side} options={[{ value: "left", label: "Picture on the left" }, { value: "right", label: "Picture on the right" }]} onChange={(v) => set("side", v)} />
          <ImagePick value={block.image} alt={block.alt} onChange={(v) => set("image", v)} onAlt={(v) => set("alt", v)} />
          <TextField label="Heading" value={block.heading} onChange={(v) => set("heading", v)} max={140} />
          <AreaField label="Text" value={block.body} onChange={(v) => set("body", v)} rows={6} max={4000} hint="A blank line starts a new paragraph. Start a line with - for a list." />
          <div className={cms.formRow}>
            <TextField label="Button text (optional)" value={block.buttonLabel} onChange={(v) => set("buttonLabel", v)} max={50} />
            <TextField label="Button link" value={block.buttonHref} onChange={(v) => set("buttonHref", v)} placeholder="/contact" />
          </div>
        </div>
      );

    case "features": {
      const setItem = (i: number, patch: Partial<FeatureItem>) => set("items", block.items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
      return (
        <div className={cms.blockFields}>
          <TextField label="Heading" value={block.heading} onChange={(v) => set("heading", v)} max={140} />
          <AreaField label="Intro (optional)" value={block.lead} onChange={(v) => set("lead", v)} rows={2} max={400} />
          <Seg label="Cards in a row" value={block.columns} options={[{ value: 2, label: "2" }, { value: 3, label: "3" }, { value: 4, label: "4" }]} onChange={(v) => set("columns", v)} />
          <div className={cms.miniList}>
            {block.items.map((item, i) => (
              <div key={item.id} className={cms.miniItem}>
                <div className={cms.miniHead}>
                  <strong>Card {i + 1}</strong>
                  <RowTools index={i} count={block.items.length} label={`card ${i + 1}`} onMove={(to) => set("items", swap(block.items, i, to))} onRemove={() => set("items", block.items.filter((_, j) => j !== i))} />
                </div>
                <TextField label="Title" value={item.title} onChange={(v) => setItem(i, { title: v })} max={100} />
                <AreaField label="Text" value={item.desc} onChange={(v) => setItem(i, { desc: v })} rows={3} max={500} />
                <ImagePick label="Picture (optional)" value={item.image} alt={item.imageAlt} onChange={(v) => setItem(i, { image: v })} onAlt={(v) => setItem(i, { imageAlt: v })} />
              </div>
            ))}
          </div>
          <div>
            <Button icon="plus" disabled={block.items.length >= 24} onClick={() => set("items", [...block.items, { id: newBlockId(), title: "New card", desc: "", image: "", imageAlt: "" }])}>
              Add card
            </Button>
          </div>
        </div>
      );
    }

    case "gallery":
      return <GalleryEditor block={block} onChange={onChange} />;

    case "faq": {
      const setItem = (i: number, patch: Partial<FaqItem>) => set("items", block.items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
      return (
        <div className={cms.blockFields}>
          <TextField label="Heading" value={block.heading} onChange={(v) => set("heading", v)} max={140} />
          <div className={cms.miniList}>
            {block.items.map((item, i) => (
              <div key={item.id} className={cms.miniItem}>
                <div className={cms.miniHead}>
                  <strong>Question {i + 1}</strong>
                  <RowTools index={i} count={block.items.length} label={`question ${i + 1}`} onMove={(to) => set("items", swap(block.items, i, to))} onRemove={() => set("items", block.items.filter((_, j) => j !== i))} />
                </div>
                <TextField label="Question" value={item.q} onChange={(v) => setItem(i, { q: v })} max={200} />
                <AreaField label="Answer" value={item.a} onChange={(v) => setItem(i, { a: v })} rows={3} max={1200} />
              </div>
            ))}
          </div>
          <div>
            <Button icon="plus" disabled={block.items.length >= 30} onClick={() => set("items", [...block.items, { id: newBlockId(), q: "", a: "" }])}>
              Add question
            </Button>
          </div>
        </div>
      );
    }

    case "cta":
      return (
        <div className={cms.blockFields}>
          <TextField label="Heading" value={block.heading} onChange={(v) => set("heading", v)} max={140} />
          <AreaField label="Text" value={block.text} onChange={(v) => set("text", v)} rows={2} max={400} />
          <div className={cms.formRow}>
            <TextField label="Button text" value={block.buttonLabel} onChange={(v) => set("buttonLabel", v)} max={50} />
            <TextField label="Button link" value={block.buttonHref} onChange={(v) => set("buttonHref", v)} placeholder="/contact" />
          </div>
        </div>
      );
  }
}

/** A gallery whose pictures can be added, put in a new order and described one by one. */
function GalleryEditor({ block, onChange }: { block: Extract<Block, { type: "gallery" }>; onChange: (b: Block) => void }) {
  const [open, setOpen] = useState(false);
  const set = (images: GalleryImage[]) => onChange({ ...block, images });
  return (
    <div className={cms.blockFields}>
      <TextField label="Heading (optional)" value={block.heading} onChange={(v) => onChange({ ...block, heading: v })} max={140} />
      <Seg label="Pictures in a row" value={block.columns} options={[{ value: 2, label: "2" }, { value: 3, label: "3" }, { value: 4, label: "4" }]} onChange={(v) => onChange({ ...block, columns: v })} />
      <div className={cms.galleryGrid}>
        {block.images.map((g, i) => (
          <div key={g.id} className={cms.galleryTile}>
            <div className={cms.galleryThumb}>
              <Image src={g.image} alt="" width={200} height={140} unoptimized={g.image.startsWith("/api/")} />
            </div>
            <input
              className={adminStyles.input}
              value={g.alt}
              maxLength={160}
              placeholder="Describe this picture"
              aria-label={`Picture ${i + 1} description`}
              onChange={(e) => set(block.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
            />
            <RowTools index={i} count={block.images.length} label={`picture ${i + 1}`} onMove={(to) => set(swap(block.images, i, to))} onRemove={() => set(block.images.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <div>
        <Button icon="image" disabled={block.images.length >= 40} onClick={() => setOpen(true)}>
          Add a picture
        </Button>
      </div>
      <MediaPicker
        open={open}
        current=""
        onClose={() => setOpen(false)}
        onPick={(url) => {
          set([...block.images, { id: newBlockId(), image: url, alt: "" }]);
          setOpen(false);
        }}
      />
    </div>
  );
}

/** A short line that tells blocks apart in the collapsed list. */
export function blockSummary(block: Block): string {
  switch (block.type) {
    case "hero":
      return block.title;
    case "text":
    case "imageText":
    case "features":
    case "gallery":
    case "faq":
    case "cta":
      return block.heading || "";
    case "image":
      return block.caption || (block.image ? "Picture" : "No picture yet");
  }
}


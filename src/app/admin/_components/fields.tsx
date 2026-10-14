"use client";

import { createContext, memo, useContext, useId, useRef, useState } from "react";
import { iconPaths, type IconName } from "@/app/services/icons";
import { modules } from "@/content";
import type { Field } from "@/content/fields";
import styles from "../admin.module.css";
import { blankItem, cloneItem, hasProblem, pathKey, validateField, type Path } from "./lib";
import { MediaPicker } from "./media-picker";
import { Button, ConfirmDialog, cx, Dialog, IconButton, UiIcon } from "./ui";

/* ------------------------------------------------------------------ shared form state */

interface FormCtx {
  /** Increases every time the person presses Save and something is invalid, so every error shows. */
  attempt: number;
  update: (path: Path, value: unknown) => void;
}

const FormContext = createContext<FormCtx>({ attempt: 0, update: () => undefined });
export const FormProvider = FormContext.Provider;

const SITE_ROUTES = modules.filter((m) => m.route).map((m) => ({ route: m.route as string, title: m.title }));

interface FieldProps {
  field: Field;
  path: Path;
  value: unknown;
}

/* ------------------------------------------------------------------ the renderer */

export const FieldRenderer = memo(function FieldRenderer({ field, path, value }: FieldProps) {
  switch (field.type) {
    case "text":
    case "longtext":
    case "url":
    case "email":
    case "phone":
      return <TextLike field={field} path={path} value={value as string} />;
    case "image":
      return <ImageField field={field} path={path} value={value as string} />;
    case "icon":
      return <IconField field={field} path={path} value={value as string} />;
    case "toggle":
      return <ToggleField field={field} path={path} value={Boolean(value)} />;
    case "select":
      return <SelectField field={field} path={path} value={value as string} />;
    case "strings":
      return <StringsField field={field} path={path} value={(value as string[]) ?? []} />;
    case "group":
      return <GroupField field={field} path={path} value={value as Record<string, unknown>} />;
    case "list":
      return <ListField field={field} path={path} value={(value as Record<string, unknown>[]) ?? []} />;
    case "id":
      return null;
  }
});

export function FieldList({ fields, path, value }: { fields: Field[]; path: Path; value: Record<string, unknown> | undefined }) {
  return (
    <>
      {fields.map((f) => (
        <FieldRenderer key={f.key} field={f} path={[...path, f.key]} value={value?.[f.key]} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ labels, help and errors */

function Labelled({
  field,
  htmlFor,
  error,
  children,
  counter,
  path,
}: {
  field: Field;
  htmlFor?: string;
  error?: string | null;
  children: React.ReactNode;
  counter?: string;
  path: Path;
}) {
  const helpId = `${htmlFor}-help`;
  return (
    <div className={styles.field} data-path={pathKey(path)} data-invalid={error ? "true" : undefined}>
      <div className={styles.labelRow}>
        <label htmlFor={htmlFor} className={styles.label}>
          {field.label}
          {field.required ? <span className={styles.req}> *</span> : null}
        </label>
        {counter ? <span className={styles.counter}>{counter}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={helpId} className={styles.fieldError} role="alert">
          {error}
        </p>
      ) : field.help ? (
        <p id={helpId} className={styles.help}>
          {field.help}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ text-like inputs */

function TextLike({ field, path, value }: { field: Extract<Field, { type: "text" | "longtext" | "url" | "email" | "phone" }>; path: Path; value: string }) {
  const { update, attempt } = useContext(FormContext);
  const id = useId();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const listId = field.type === "url" ? `${id}-routes` : undefined;

  // Errors appear after the first blur, clear as soon as the person returns to the field, and all show after a failed Save.
  const error = (touched || attempt > 0) && !focused ? validateField(field, value) : null;
  const max = field.type === "text" || field.type === "longtext" ? field.max : undefined;
  const len = (value ?? "").length;
  const counter = max && (focused || len > max * 0.85) ? `${len} / ${max}` : undefined;

  const common = {
    id,
    value: value ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(path, e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      setTouched(true);
    },
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || field.help ? `${id}-help` : undefined,
    className: cx(styles.input, error && styles.inputInvalid),
  };

  return (
    <Labelled field={field} htmlFor={id} error={error} counter={counter} path={path}>
      {field.type === "longtext" ? (
        <textarea {...common} rows={field.rows ?? 3} />
      ) : (
        <input
          {...common}
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          inputMode={field.type === "phone" ? "tel" : field.type === "email" ? "email" : undefined}
          autoComplete="off"
          list={listId}
          placeholder={field.type === "url" ? (field.placeholder ?? "/contact or https://…") : field.type === "text" ? field.placeholder : undefined}
        />
      )}
      {listId ? (
        <datalist id={listId}>
          {SITE_ROUTES.map((r) => (
            <option key={r.route} value={r.route}>
              {r.title}
            </option>
          ))}
        </datalist>
      ) : null}
    </Labelled>
  );
}

/* ------------------------------------------------------------------ toggle & select */

function ToggleField({ field, path, value }: { field: Field; path: Path; value: boolean }) {
  const { update } = useContext(FormContext);
  const id = useId();
  return (
    <div className={styles.field} data-path={pathKey(path)}>
      <div className={styles.toggleRow}>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={value}
          className={cx(styles.switch, value && styles.switchOn)}
          onClick={() => update(path, !value)}
        >
          <span className={styles.switchKnob} />
        </button>
        <label htmlFor={id} className={styles.toggleLabel}>
          {field.label}
        </label>
      </div>
      {field.help ? <p className={styles.help}>{field.help}</p> : null}
    </div>
  );
}

function SelectField({ field, path, value }: { field: Extract<Field, { type: "select" }>; path: Path; value: string }) {
  const { update } = useContext(FormContext);
  const id = useId();
  return (
    <Labelled field={field} htmlFor={id} path={path}>
      <select id={id} className={styles.input} value={value} onChange={(e) => update(path, e.target.value)}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Labelled>
  );
}

/* ------------------------------------------------------------------ image */

function ImageField({ field, path, value }: { field: Extract<Field, { type: "image" }>; path: Path; value: string }) {
  const { update } = useContext(FormContext);
  const [open, setOpen] = useState(false);
  const id = useId();
  const name = value ? decodeURIComponent(value.split("/").pop() ?? value) : "";

  return (
    <Labelled field={field} htmlFor={id} path={path}>
      <div className={styles.imageField}>
        <div className={styles.imagePreview}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" />
          ) : (
            <span className={styles.imageNone}>
              <UiIcon name="image" />
              No image
            </span>
          )}
        </div>
        <div className={styles.imageActions}>
          {name ? <span className={styles.imageName}>{name}</span> : null}
          <div className={styles.row}>
            <Button id={id} icon="image" onClick={() => setOpen(true)}>
              {value ? "Change image" : "Choose image"}
            </Button>
            {value ? (
              <Button variant="ghost" onClick={() => update(path, "")}>
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <MediaPicker
        open={open}
        current={value}
        onClose={() => setOpen(false)}
        onPick={(url) => {
          update(path, url);
          setOpen(false);
        }}
      />
    </Labelled>
  );
}

/* ------------------------------------------------------------------ icon */

const ICON_NAMES = Object.keys(iconPaths) as IconName[];

function IconField({ field, path, value }: { field: Field; path: Path; value: string }) {
  const { update } = useContext(FormContext);
  const [open, setOpen] = useState(false);
  const id = useId();
  const valid = value in iconPaths;

  return (
    <Labelled field={field} htmlFor={id} path={path}>
      <button id={id} type="button" className={styles.iconPick} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className={styles.iconPickPreview}>
          {valid ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconPickSvg}>
              <path d={iconPaths[value as IconName]} />
            </svg>
          ) : null}
        </span>
        <span>{valid ? value : "Choose an icon"}</span>
        <UiIcon name="chevronDown" className={styles.iconPickCaret} />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Choose an icon">
        <div className={styles.iconGrid} role="listbox" aria-label="Icons">
          {ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={name === value}
              title={name}
              className={cx(styles.iconCell, name === value && styles.iconCellOn)}
              data-autofocus={name === value ? "" : undefined}
              onClick={() => {
                update(path, name);
                setOpen(false);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconCellSvg}>
                <path d={iconPaths[name]} />
              </svg>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </Dialog>
    </Labelled>
  );
}

/* ------------------------------------------------------------------ list of short texts */

function StringsField({ field, path, value }: { field: Extract<Field, { type: "strings" }>; path: Path; value: string[] }) {
  const { update } = useContext(FormContext);
  const refs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);
  const id = useId();
  const max = field.max ?? 40;

  const set = (next: string[]) => update(path, next);
  const focusLater = (i: number) => window.setTimeout(() => refs.current[i]?.focus(), 30);

  return (
    <div className={styles.field} data-path={pathKey(path)}>
      <div className={styles.labelRow}>
        <span className={styles.label} id={`${id}-label`}>
          {field.label}
        </span>
      </div>
      <ul className={styles.stringList} aria-labelledby={`${id}-label`}>
        {value.map((item, i) => (
          <li key={i} className={styles.stringRow}>
            {field.multiline ? (
              <textarea
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={styles.input}
                rows={2}
                value={item}
                aria-label={`${field.label} ${i + 1}`}
                onChange={(e) => set(value.map((v, j) => (j === i ? e.target.value : v)))}
              />
            ) : (
              <input
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={styles.input}
                value={item}
                autoComplete="off"
                aria-label={`${field.label} ${i + 1}`}
                onChange={(e) => set(value.map((v, j) => (j === i ? e.target.value : v)))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && value.length < max) {
                    e.preventDefault();
                    const next = [...value];
                    next.splice(i + 1, 0, "");
                    set(next);
                    focusLater(i + 1);
                  }
                }}
              />
            )}
            <div className={styles.stringTools}>
              <IconButton
                icon="up"
                label={`Move ${field.label} ${i + 1} up`}
                disabled={i === 0}
                onClick={() => {
                  const next = [...value];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  set(next);
                }}
              />
              <IconButton
                icon="down"
                label={`Move ${field.label} ${i + 1} down`}
                disabled={i === value.length - 1}
                onClick={() => {
                  const next = [...value];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  set(next);
                }}
              />
              <IconButton icon="close" label={`Remove ${field.label} ${i + 1}`} onClick={() => set(value.filter((_, j) => j !== i))} />
            </div>
          </li>
        ))}
      </ul>
      {value.length < max ? (
        <Button
          icon="plus"
          className={styles.addBtn}
          onClick={() => {
            set([...value, ""]);
            focusLater(value.length);
          }}
        >
          {field.addLabel ?? "Add"}
        </Button>
      ) : null}
      {field.help ? <p className={styles.help}>{field.help}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ group */

function GroupField({ field, path, value }: { field: Extract<Field, { type: "group" }>; path: Path; value: Record<string, unknown> }) {
  return (
    <div className={styles.group} data-path={pathKey(path)}>
      <FieldList fields={field.fields} path={path} value={value} />
    </div>
  );
}

/* ------------------------------------------------------------------ repeatable list */

function itemTitle(field: Extract<Field, { type: "list" }>, item: Record<string, unknown>): string {
  const raw = field.titleKey ? item[field.titleKey] : undefined;
  const text = typeof raw === "string" ? raw.trim() : "";
  return text || `New ${field.itemLabel}`;
}

function ListField({ field, path, value }: { field: Extract<Field, { type: "list" }>; path: Path; value: Record<string, unknown>[] }) {
  const { update, attempt } = useContext(FormContext);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [removing, setRemoving] = useState<number | null>(null);
  const id = useId();
  const max = field.max ?? 60;
  // Short lists start open; long lists start closed so the page stays easy to scan.
  const isOpen = (i: number) => open[i] ?? (attempt > 0 && hasProblem(field.fields, value[i]) ? true : value.length <= 3);

  const set = (next: unknown[]) => update(path, next);
  const move = (from: number, to: number) => {
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    set(next);
    setOpen((o) => ({ ...o, [from]: isOpen(to), [to]: isOpen(from) }));
  };

  return (
    <div className={styles.listField} data-path={pathKey(path)}>
      <div className={styles.listHead}>
        <h3 className={styles.listTitle} id={`${id}-title`}>
          {field.label}
          <span className={styles.listCount}>{value.length}</span>
        </h3>
        {field.help ? <p className={styles.help}>{field.help}</p> : null}
      </div>

      {value.length === 0 ? <p className={styles.listEmpty}>Nothing here yet.</p> : null}

      <ol className={styles.items} aria-labelledby={`${id}-title`}>
        {value.map((item, i) => {
          const expanded = isOpen(i);
          const title = itemTitle(field, item);
          const bodyId = `${id}-item-${i}`;
          return (
            <li key={(item.id as string) ?? i} className={styles.item} data-path={pathKey([...path, i])}>
              <div className={styles.itemHead}>
                <button
                  type="button"
                  className={styles.itemToggle}
                  aria-expanded={expanded}
                  aria-controls={bodyId}
                  onClick={() => setOpen((o) => ({ ...o, [i]: !expanded }))}
                >
                  <span className={styles.itemNum}>{i + 1}</span>
                  <span className={styles.itemName}>{title}</span>
                  <UiIcon name="chevronDown" className={cx(styles.itemCaret, expanded && styles.itemCaretOpen)} />
                </button>
                <div className={styles.itemTools}>
                  <IconButton icon="up" label={`Move ${title} up`} disabled={i === 0} onClick={() => move(i, i - 1)} />
                  <IconButton icon="down" label={`Move ${title} down`} disabled={i === value.length - 1} onClick={() => move(i, i + 1)} />
                  <IconButton
                    icon="copy"
                    label={`Duplicate ${title}`}
                    disabled={value.length >= max}
                    onClick={() => {
                      const next = [...value];
                      next.splice(i + 1, 0, cloneItem(item, field.fields) as Record<string, unknown>);
                      set(next);
                      setOpen((o) => ({ ...o, [i + 1]: true }));
                    }}
                  />
                  <IconButton icon="trash" label={`Delete ${title}`} onClick={() => setRemoving(i)} />
                </div>
              </div>
              {expanded ? (
                <div id={bodyId} className={styles.itemBody}>
                  <FieldList fields={field.fields} path={[...path, i]} value={item} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {value.length < max ? (
        <Button
          icon="plus"
          className={styles.addBtn}
          onClick={() => {
            set([...value, blankItem(field.fields)]);
            setOpen((o) => ({ ...o, [value.length]: true }));
          }}
        >
          Add {field.itemLabel}
        </Button>
      ) : null}

      <ConfirmDialog
        open={removing !== null}
        title={removing !== null ? `Delete “${itemTitle(field, value[removing] ?? {})}”?` : ""}
        body="It is removed from the page when you save. You can bring it back from History."
        confirmLabel={`Delete ${field.itemLabel}`}
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing !== null) set(value.filter((_, j) => j !== removing));
          setRemoving(null);
        }}
      />
    </div>
  );
}

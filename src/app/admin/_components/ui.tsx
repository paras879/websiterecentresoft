"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { iconPaths } from "@/app/services/icons";
import styles from "../admin.module.css";

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ icons used by the admin UI */

const ui = {
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M18 6L6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6",
  up: "M12 19V5M5 12l7-7 7 7",
  down: "M12 5v14M19 12l-7 7-7-7",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  chevronLeft: "M15 6l-6 6 6 6",
  copy: "M9 9h11v11H9zM5 15V4h11",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  inbox: "M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6z",
  image: "M3 5h18v14H3zM8 11a2 2 0 100-4 2 2 0 000 4zM21 16l-5-5-8 8",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  file: "M6 3h9l4 4v14H6zM14 3v5h5",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  briefcase: "M3 8h18v12H3zM8 8V5h8v3M3 14h18",
  logout: "M9 21H5V3h4M16 17l5-5-5-5M21 12H9",
  alert: "M12 3l10 18H2zM12 10v5M12 18h.01",
  download: "M12 3v12M7 10l5 5 5-5M4 21h16",
  upload: "M12 15V3M7 8l5-5 5 5M4 21h16",
  reset: "M3 12a9 9 0 109-9 9 9 0 00-6.7 3M3 4v5h5",
  save: "M5 3h11l3 3v15H5zM8 3v6h7V3M8 21v-7h8v7",
  sliders: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4",
  info: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8h.01",
  key: "M15 7a4 4 0 11-3.9 4.9L3 20v-3h3v-3h3l1.1-1.1A4 4 0 0115 7z",
  ...iconPaths,
} as const;

export type UiIconName = keyof typeof ui;

export function UiIcon({ name, className }: { name: UiIconName; className?: string }) {
  return (
    <svg className={cx(styles.uiIcon, className)} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ui[name]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ buttons */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: UiIconName;
  busy?: boolean;
};

export function Button({ variant = "secondary", icon, busy, children, className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      aria-busy={busy || undefined}
      className={cx(styles.btn, styles[`btn_${variant}`], className)}
    >
      {busy ? <span className={styles.spinner} aria-hidden="true" /> : icon ? <UiIcon name={icon} /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: UiIconName; label: string }) {
  return (
    <button type="button" title={label} aria-label={label} {...rest} className={cx(styles.iconBtn, className)}>
      <UiIcon name={icon} />
    </button>
  );
}

/* ------------------------------------------------------------------ dialog (native <dialog>: traps focus, closes on Esc, restores focus) */

export function Dialog({
  open,
  onClose,
  title,
  children,
  variant = "modal",
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "modal" | "slide";
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      el.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, variant === "slide" && styles.dialogSlide, wide && styles.dialogWide)}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open ? (
        <div className={styles.dialogBody}>
          <div className={styles.dialogHead}>
            <h2 id={titleId} className={styles.dialogTitle}>
              {title}
            </h2>
            <IconButton icon="close" label="Close" onClick={onClose} />
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}

/** Destructive actions always name the thing being removed, and focus starts on Cancel. */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  danger = true,
}: {
  open: boolean;
  title: string;
  body?: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      {body ? <div className={styles.dialogText}>{body}</div> : null}
      <div className={styles.dialogActions}>
        <Button data-autofocus onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ toasts */

interface Toast {
  id: number;
  kind: "success" | "error" | "info";
  message: string;
}

const ToastContext = createContext<(kind: Toast["kind"], message: string) => void>(() => undefined);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const notify = useCallback((kind: Toast["kind"], message: string) => {
    const id = ++counter.current;
    setToasts((t) => [...t.slice(-2), { id, kind, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 7000 : 4000);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={styles.toasts} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={cx(styles.toast, styles[`toast_${t.kind}`])} role={t.kind === "error" ? "alert" : "status"}>
            <UiIcon name={t.kind === "error" ? "alert" : t.kind === "success" ? "check" : "info"} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ misc */

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "blue" | "green" | "amber"; children: React.ReactNode }) {
  return <span className={cx(styles.badge, styles[`badge_${tone}`])}>{children}</span>;
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: UiIconName;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <UiIcon name={icon} />
      </span>
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyText}>{text}</p>
      {action}
    </div>
  );
}

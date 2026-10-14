"use client";

import { useMemo, useState } from "react";
import styles from "../admin.module.css";
import { api, formatBytes, fullDate, relativeTime } from "./lib";
import { Badge, Button, ConfirmDialog, cx, EmptyState, IconButton, UiIcon, useToast } from "./ui";

export interface Inquiry {
  id: string;
  kind: "contact" | "career";
  status: "new" | "contacted" | "archived";
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  detail: string;
  topic: string;
  message: string;
  link: string;
  resume: { id: string; name: string; size: number } | null;
}

type KindFilter = "all" | "contact" | "career";
type StatusFilter = "open" | "new" | "contacted" | "archived";

const httpOnly = (url: string) => (/^https?:\/\//i.test(url) ? url : "");

function toCsv(rows: Inquiry[]): string {
  const head = ["Date", "Type", "Status", "Name", "Email", "Phone", "Company / experience", "Topic", "Message", "Link", "Resume"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.createdAt,
      r.kind === "career" ? "Application" : "Message",
      r.status,
      r.name,
      r.email,
      r.phone,
      r.detail,
      r.topic,
      r.message,
      r.link,
      r.resume?.name ?? "",
    ]
      .map(esc)
      .join(","),
  );
  return [head.map(esc).join(","), ...lines].join("\n");
}

export function InboxView({
  items,
  loading,
  selectedId,
  onSelect,
  onChange,
  onReload,
}: {
  items: Inquiry[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (next: Inquiry[]) => void;
  onReload: () => void;
}) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("open");
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Inquiry | null>(null);
  const notify = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (kind !== "all" && i.kind !== kind) return false;
      if (status === "open" ? i.status === "archived" : i.status !== status) return false;
      if (!q) return true;
      return [i.name, i.email, i.phone, i.topic, i.detail, i.message].some((v) => v.toLowerCase().includes(q));
    });
  }, [items, kind, status, query]);

  const selected = items.find((i) => i.id === selectedId) ?? null;
  const counts = {
    all: items.length,
    contact: items.filter((i) => i.kind === "contact").length,
    career: items.filter((i) => i.kind === "career").length,
  };

  const setItemStatus = async (inquiry: Inquiry, next: Inquiry["status"]) => {
    const before = items;
    onChange(items.map((i) => (i.id === inquiry.id ? { ...i, status: next } : i)));
    const res = await api("/api/admin/inquiries", { method: "PATCH", json: { id: inquiry.id, status: next } });
    if (!res.success) {
      onChange(before);
      notify("error", res.error ?? "Could not update the message.");
    }
  };

  const remove = async (inquiry: Inquiry) => {
    const res = await api(`/api/admin/inquiries?id=${encodeURIComponent(inquiry.id)}`, { method: "DELETE" });
    setDeleting(null);
    if (res.success) {
      onChange(items.filter((i) => i.id !== inquiry.id));
      onSelect(null);
      notify("success", `Deleted the message from ${inquiry.name}.`);
    } else {
      notify("error", res.error ?? "Could not delete the message.");
    }
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `recenturesoft-inbox-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={cx(styles.inbox, selected && styles.inboxHasSelection)}>
      <section className={styles.inboxList} aria-label="Messages">
        <div className={styles.inboxTools}>
          <div className={styles.searchBox}>
            <UiIcon name="search" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search by name, email or text"
              aria-label="Search messages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.tabs} role="tablist" aria-label="Type">
            {(
              [
                ["all", `All ${counts.all}`],
                ["contact", `Messages ${counts.contact}`],
                ["career", `Applications ${counts.career}`],
              ] as [KindFilter, string][]
            ).map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={kind === key} className={cx(styles.tab, kind === key && styles.tabOn)} onClick={() => setKind(key)}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.inboxRow}>
            <label className={styles.inlineSelect}>
              <span>Show</span>
              <select className={styles.input} value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
                <option value="open">Open (new and contacted)</option>
                <option value="new">New only</option>
                <option value="contacted">Contacted</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <IconButton icon="reset" label="Refresh" onClick={onReload} />
            <IconButton icon="download" label="Download as spreadsheet (CSV)" onClick={exportCsv} disabled={visible.length === 0} />
          </div>
        </div>

        {loading && items.length === 0 ? (
          <p className={styles.help}>Loading…</p>
        ) : visible.length === 0 ? (
          <EmptyState
            icon="inbox"
            title={items.length === 0 ? "No messages yet" : "Nothing matches"}
            text={
              items.length === 0
                ? "When someone sends a message from the Contact page or applies on the Careers page, it will appear here."
                : "Try another filter or search."
            }
          />
        ) : (
          <ul className={styles.mailList}>
            {visible.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  className={cx(styles.mailRow, i.id === selectedId && styles.mailRowOn)}
                  aria-current={i.id === selectedId ? "true" : undefined}
                  onClick={() => onSelect(i.id)}
                >
                  <span className={cx(styles.mailDot, i.status === "new" && styles.mailDotNew)} aria-label={i.status === "new" ? "New" : undefined} />
                  <span className={styles.mailMain}>
                    <span className={styles.mailTop}>
                      <strong className={cx(styles.mailName, i.status === "new" && styles.mailNameNew)}>{i.name}</strong>
                      <time suppressHydrationWarning className={styles.mailTime} dateTime={i.createdAt}>
                        {relativeTime(i.createdAt)}
                      </time>
                    </span>
                    <span className={styles.mailSub}>
                      {i.kind === "career" ? "Application" : "Message"}
                      {i.topic ? ` · ${i.topic}` : ""}
                    </span>
                    <span className={styles.mailSnippet}>{i.message || i.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.inboxDetail} aria-label="Message details">
        {selected ? (
          <article className={styles.detail}>
            <div className={styles.detailBack}>
              <Button variant="ghost" icon="chevronLeft" onClick={() => onSelect(null)}>
                All messages
              </Button>
            </div>
            <header className={styles.detailHead}>
              <div>
                <div className={styles.detailBadges}>
                  <Badge tone={selected.kind === "career" ? "blue" : "neutral"}>{selected.kind === "career" ? "Job application" : "Contact message"}</Badge>
                  <Badge tone={selected.status === "new" ? "amber" : selected.status === "contacted" ? "green" : "neutral"}>
                    {selected.status === "new" ? "New" : selected.status === "contacted" ? "Contacted" : "Archived"}
                  </Badge>
                </div>
                <h2 className={styles.detailName}>{selected.name}</h2>
                <p className={styles.detailDate}>{fullDate(selected.createdAt)}</p>
              </div>
            </header>

            <div className={styles.detailActions}>
              <a
                className={cx(styles.btn, styles.btn_primary)}
                href={`mailto:${selected.email}?subject=${encodeURIComponent(selected.kind === "career" ? "Your application to Recenturesoft" : "Re: your message to Recenturesoft")}`}
                onClick={() => selected.status === "new" && void setItemStatus(selected, "contacted")}
              >
                <UiIcon name="mailIcon" />
                Reply by email
              </a>
              {selected.phone ? (
                <a className={cx(styles.btn, styles.btn_secondary)} href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}>
                  <UiIcon name="phone" />
                  Call
                </a>
              ) : null}
              {selected.resume ? (
                <a className={cx(styles.btn, styles.btn_secondary)} href={`/api/admin/resume?inquiry=${encodeURIComponent(selected.id)}`}>
                  <UiIcon name="download" />
                  Resume ({formatBytes(selected.resume.size)})
                </a>
              ) : null}
            </div>

            <dl className={styles.detailGrid}>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{selected.phone || "Not given"}</dd>
              </div>
              <div>
                <dt>{selected.kind === "career" ? "Experience" : "Company"}</dt>
                <dd>{selected.detail || "Not given"}</dd>
              </div>
              <div>
                <dt>{selected.kind === "career" ? "Area applied for" : "Interested in"}</dt>
                <dd>{selected.topic || "Not given"}</dd>
              </div>
              {selected.link ? (
                <div>
                  <dt>Profile or portfolio</dt>
                  <dd>
                    {httpOnly(selected.link) ? (
                      <a href={httpOnly(selected.link)} target="_blank" rel="noopener noreferrer">
                        {selected.link}
                      </a>
                    ) : (
                      selected.link
                    )}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className={styles.detailMessage}>
              <h3 className={styles.detailLabel}>{selected.kind === "career" ? "About the applicant" : "Message"}</h3>
              <p>{selected.message || "No message was written."}</p>
            </div>

            <footer className={styles.detailFoot}>
              {selected.status !== "contacted" ? (
                <Button icon="check" onClick={() => void setItemStatus(selected, "contacted")}>
                  Mark as contacted
                </Button>
              ) : (
                <Button onClick={() => void setItemStatus(selected, "new")}>Mark as new</Button>
              )}
              {selected.status !== "archived" ? (
                <Button onClick={() => void setItemStatus(selected, "archived")}>Archive</Button>
              ) : (
                <Button onClick={() => void setItemStatus(selected, "contacted")}>Restore from archive</Button>
              )}
              <Button variant="danger" icon="trash" onClick={() => setDeleting(selected)}>
                Delete
              </Button>
            </footer>
          </article>
        ) : (
          <div className={styles.detailEmpty}>
            <EmptyState icon="inbox" title="Select a message" text="Choose a message from the list to read it and reply." />
          </div>
        )}
      </section>

      <ConfirmDialog
        open={deleting !== null}
        title={deleting ? `Delete the ${deleting.kind === "career" ? "application" : "message"} from ${deleting.name}?` : ""}
        body={deleting?.resume ? "Their resume is deleted too. This cannot be undone." : "This cannot be undone."}
        confirmLabel={deleting?.kind === "career" ? "Delete application" : "Delete message"}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && void remove(deleting)}
      />
    </div>
  );
}

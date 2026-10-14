"use client";

import { useEffect, useState } from "react";
import { modules, type SiteContent } from "@/content";
import styles from "../admin.module.css";
import type { SystemInfo } from "./account-view";
import type { Inquiry } from "./inbox-view";
import { api, relativeTime } from "./lib";
import { Badge, Button, UiIcon } from "./ui";

export function OverviewView({
  content,
  inquiries,
  system,
  refreshKey,
  go,
}: {
  content: SiteContent;
  inquiries: Inquiry[];
  system: SystemInfo;
  refreshKey: number;
  go: (hash: string) => void;
}) {
  const [lastSaved, setLastSaved] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void api<{ history: { at: string }[] }>("/api/admin/history").then((res) => {
      if (!cancelled) setLastSaved(res.success ? (res.history[0]?.at ?? null) : null);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const newCount = inquiries.filter((i) => i.status === "new").length;
  const openings = ((content as unknown as { careers: { openings: { active: boolean }[] } }).careers?.openings ?? []).filter((o) => o.active).length;
  const latest = inquiries.filter((i) => i.status !== "archived").slice(0, 4);
  const pages = modules.filter((m) => m.group !== "Site");

  return (
    <div className={styles.page}>
      {system.storage !== "redis" ? (
        <aside className={styles.notice} role="note">
          <span className={styles.noticeIcon}>
            <UiIcon name="info" />
          </span>
          <div>
            <h2 className={styles.noticeTitle}>
              {system.storage === "none" ? "Saving is not switched on for the live website yet" : "You are working on your own computer"}
            </h2>
            <p className={styles.noticeText}>
              {system.storage === "none"
                ? "Visitors see the original content, and edits cannot be saved until a free database is connected. It takes about two minutes:"
                : "Changes are saved in a file on this computer, so they will not appear on the live website. To edit the live site, connect a free database:"}
            </p>
            <ol className={styles.noticeSteps}>
              <li>Open your project on Vercel and go to the Storage tab.</li>
              <li>Choose Upstash Redis (free plan) and connect it to this project.</li>
              <li>Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Settings, then Environment Variables, and redeploy.</li>
            </ol>
          </div>
        </aside>
      ) : null}

      <ul className={styles.statRow}>
        <li className={styles.stat}>
          <p className={styles.statLabel}>New messages</p>
          <p className={styles.statValue}>{newCount}</p>
          <Button variant="ghost" onClick={() => go("#/inbox")}>
            Open inbox
          </Button>
        </li>
        <li className={styles.stat}>
          <p className={styles.statLabel}>Open job roles</p>
          <p className={styles.statValue}>{openings}</p>
          <Button variant="ghost" onClick={() => go("#/edit/careers/openings")}>
            Manage roles
          </Button>
        </li>
        <li className={styles.stat}>
          <p className={styles.statLabel}>Last saved</p>
          <p className={styles.statValueSmall}>
            {lastSaved === undefined ? "…" : lastSaved ? relativeTime(lastSaved) : "Not yet"}
          </p>
          <p className={styles.statHint}>{lastSaved === null ? "The website shows its original content." : "Changes are live right after saving."}</p>
        </li>
      </ul>

      <div className={styles.twoCol}>
        <section className={styles.card} aria-labelledby="latest-heading">
          <header className={styles.cardHead}>
            <h2 id="latest-heading" className={styles.cardTitle}>
              Latest messages
            </h2>
            <Button variant="ghost" onClick={() => go("#/inbox")}>
              View all
            </Button>
          </header>
          {latest.length === 0 ? (
            <p className={styles.help}>Nothing yet. Messages from the Contact page and job applications will appear here.</p>
          ) : (
            <ul className={styles.miniList}>
              {latest.map((i) => (
                <li key={i.id}>
                  <button type="button" className={styles.miniRow} onClick={() => go(`#/inbox/${i.id}`)}>
                    <span className={styles.miniMain}>
                      <strong>{i.name}</strong>
                      <span>{i.kind === "career" ? "Application" : "Message"}{i.topic ? ` · ${i.topic}` : ""}</span>
                    </span>
                    <span className={styles.miniSide}>
                      {i.status === "new" ? <Badge tone="amber">New</Badge> : null}
                      <time suppressHydrationWarning dateTime={i.createdAt}>{relativeTime(i.createdAt)}</time>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card} aria-labelledby="edit-heading">
          <header className={styles.cardHead}>
            <h2 id="edit-heading" className={styles.cardTitle}>
              Edit your pages
            </h2>
          </header>
          <ul className={styles.miniList}>
            {pages.map((m) => (
              <li key={m.id}>
                <div className={styles.pageRow}>
                  <button type="button" className={styles.pageRowMain} onClick={() => go(`#/edit/${m.id}`)}>
                    <UiIcon name="file" />
                    <span>
                      <strong>{m.title}</strong>
                      <span>{m.route}</span>
                    </span>
                  </button>
                  {m.route ? (
                    <a className={styles.pageRowLink} href={m.route} target="_blank" rel="noopener noreferrer" aria-label={`View ${m.title} on the website`}>
                      <UiIcon name="external" />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

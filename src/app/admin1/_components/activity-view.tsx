"use client";

import { useEffect, useMemo, useState } from "react";
import type { AuditEntry, AuditKind } from "@/lib/audit";
import adminStyles from "../../admin/admin.module.css";
import { api, fullDate, relativeTime } from "../../admin/_components/lib";
import cms from "../cms.module.css";
import { PageHead } from "./page-head";

const KIND_LABEL: Record<AuditKind, string> = {
  content: "Content",
  page: "Custom pages",
  user: "Users",
  role: "Roles",
  media: "Media",
  message: "Messages",
  version: "Versions",
  "sign-in": "Sign-ins",
  account: "Account",
};

/** Who changed what and when, newest first. Only people whose role includes the Activity log can open it. */
export function ActivityView() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [who, setWho] = useState("");
  const [kind, setKind] = useState("");

  useEffect(() => {
    let live = true;
    void api<{ entries: AuditEntry[] }>("/api/cms/audit").then((res) => {
      if (!live) return;
      if (res.success) setEntries(res.entries);
      else {
        setEntries([]);
        setError(res.error ?? "Could not load the activity log.");
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const people = useMemo(() => [...new Set((entries ?? []).map((e) => e.actor).filter(Boolean))].sort(), [entries]);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (entries ?? []).filter(
      (e) =>
        (!who || e.actor === who) &&
        (!kind || e.kind === kind) &&
        (!needle || `${e.actor} ${e.email} ${e.summary} ${e.ip}`.toLowerCase().includes(needle)),
    );
  }, [entries, q, who, kind]);

  return (
    <>
      <PageHead title="Activity log" lead="Who changed what, and when. The latest 1000 actions are kept." />

      <div className={cms.listBar}>
        <input
          className={`${adminStyles.input} ${cms.search}`}
          type="search"
          placeholder="Search the log"
          aria-label="Search the activity log"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={adminStyles.input} style={{ width: "auto", minWidth: 170 }} aria-label="Filter by person" value={who} onChange={(e) => setWho(e.target.value)}>
          <option value="">Everyone</option>
          {people.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select className={adminStyles.input} style={{ width: "auto", minWidth: 170 }} aria-label="Filter by type" value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="">All types</option>
          {(Object.keys(KIND_LABEL) as AuditKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className={cms.error}>{error}</p> : null}

      <div className={cms.tableWrap}>
        <table className={cms.table}>
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Type</th>
              <th>What happened</th>
              <th>IP address</th>
            </tr>
          </thead>
          <tbody>
            {entries === null ? (
              <tr>
                <td colSpan={5} className={cms.empty}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className={cms.empty}>
                  {entries.length === 0 ? "Nothing has been recorded yet. Changes made from now on will show here." : "Nothing matches your search."}
                </td>
              </tr>
            ) : (
              rows.map((e) => (
                <tr key={e.id}>
                  <td title={fullDate(e.at)}>{relativeTime(e.at)}</td>
                  <td>
                    {e.actor}
                    {e.email && e.email !== e.actor ? <span className={cms.muted}> ({e.email})</span> : null}
                  </td>
                  <td>
                    <span className={cms.pill}>{KIND_LABEL[e.kind] ?? e.kind}</span>
                  </td>
                  <td>{e.summary}</td>
                  <td className={cms.muted}>{e.ip || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

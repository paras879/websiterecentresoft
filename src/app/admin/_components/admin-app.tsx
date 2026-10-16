"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { modules, type SiteContent } from "@/content";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "../admin.module.css";
import { AccountView, type SystemInfo } from "./account-view";
import { EditorView } from "./editor-view";
import { FormProvider } from "./fields";
import { HistoryView } from "./history-view";
import { InboxView, type Inquiry } from "./inbox-view";
import { api, pathKey, setIn, validateAll, type Path } from "./lib";
import { MediaView } from "./media-view";
import { OverviewView } from "./overview-view";
import { Button, ConfirmDialog, cx, ToastProvider, UiIcon, useToast, type UiIconName } from "./ui";

/* ------------------------------------------------------------------ routing through the URL hash */

type View =
  | { name: "overview" }
  | { name: "edit"; module: string; section?: string }
  | { name: "inbox"; id?: string }
  | { name: "images" }
  | { name: "history" }
  | { name: "account" };

function parseHash(hash: string): View {
  const [, name, a, b] = hash.replace(/^#/, "").split("/");
  if (name === "edit" && modules.some((m) => m.id === a)) return { name: "edit", module: a, section: b };
  if (name === "inbox") return { name: "inbox", id: a };
  if (name === "images" || name === "history" || name === "account") return { name };
  return { name: "overview" };
}

interface NavItem {
  label: string;
  icon: UiIconName;
  hash: string;
  active: (v: View) => boolean;
  badge?: number;
}

/* ------------------------------------------------------------------ app */

export interface AdminProps {
  initialContent: SiteContent;
  initialInquiries: Inquiry[];
  system: SystemInfo;
}

export function AdminApp(props: AdminProps) {
  return (
    <ToastProvider>
      <Shell {...props} />
    </ToastProvider>
  );
}

function Shell({ initialContent, initialInquiries, system }: AdminProps) {
  const notify = useToast();
  const [content, setContent] = useState(initialContent);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialContent));
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [view, setView] = useState<View>({ name: "overview" });
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
  const [storageBlocked, setStorageBlocked] = useState(system.storage === "none");
  const mainRef = useRef<HTMLDivElement>(null);

  const contentJson = useMemo(() => JSON.stringify(content), [content]);
  const dirty = contentJson !== savedJson;

  /* ---- navigation ---- */
  useEffect(() => {
    const read = () => setView(parseHash(window.location.hash));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const go = useCallback((hash: string) => {
    if (window.location.hash === hash) setView(parseHash(hash));
    else window.location.hash = hash;
    setNavOpen(false);
  }, []);

  const viewKey = view.name === "edit" ? `edit/${view.module}/${view.section ?? ""}` : view.name;
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [viewKey]);

  /* ---- unsaved-changes guard ---- */
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ---- content edits ---- */
  const update = useCallback((path: Path, value: unknown) => {
    setContent((prev) => setIn(prev, path, value));
  }, []);
  const formCtx = useMemo(() => ({ attempt, update }), [attempt, update]);

  const expired = useCallback(() => {
    notify("error", "Your session ended. Please sign in again.");
    window.setTimeout(() => (window.location.href = "/admin/login"), 1200);
  }, [notify]);

  const save = useCallback(async () => {
    const problems = validateAll(content);
    if (problems.length > 0) {
      const first = problems[0];
      setAttempt((a) => a + 1);
      go(`#/edit/${first.moduleId}/${first.sectionId}`);
      notify(
        "error",
        problems.length === 1 ? first.message : `${problems.length} things need a look before saving. First: ${first.message}`,
      );
      window.setTimeout(() => {
        const el = document.querySelector<HTMLElement>(`[data-path="${pathKey(first.path)}"]`);
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
        el?.querySelector<HTMLElement>("input, textarea, select, button")?.focus({ preventScroll: true });
      }, 120);
      return;
    }
    if (!dirty) {
      notify("info", "There are no changes to save.");
      return;
    }

    setSaving(true);
    const res = await api<{ content: SiteContent }>("/api/admin/content", { method: "PUT", json: { content } });
    setSaving(false);

    if (res.success) {
      setContent(res.content);
      setSavedJson(JSON.stringify(res.content));
      setSavedTick((t) => t + 1);
      setAttempt(0);
      notify("success", "Saved. Your website is updated.");
    } else if (res.status === 401) {
      expired();
    } else if (res.code === "storage_unavailable") {
      setStorageBlocked(true);
      notify("error", "Saving is not switched on for the live website yet. See the steps on the Overview page.");
    } else {
      notify("error", res.error ?? "Your changes could not be saved. Please try again.");
    }
  }, [content, dirty, expired, go, notify]);

  // Ctrl/Cmd + S saves from anywhere.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const discard = () => {
    setContent(JSON.parse(savedJson) as SiteContent);
    setAttempt(0);
    setDiscarding(false);
    notify("info", "Your unsaved changes were discarded.");
  };

  /* ---- inbox ---- */
  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    const res = await api<{ inquiries: Inquiry[] }>("/api/admin/inquiries");
    setInboxLoading(false);
    if (res.success) setInquiries(res.inquiries);
    else if (res.status === 401) expired();
  }, [expired]);

  useEffect(() => {
    if (view.name === "inbox") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadInbox();
    }
  }, [view.name, loadInbox]);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadInbox();
    }, 60_000);
    return () => window.clearInterval(t);
  }, [loadInbox]);

  const signOut = async () => {
    await api("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  /* ---- navigation list ---- */
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const editItem = (id: string, icon: UiIconName = "file"): NavItem => {
    const m = modules.find((x) => x.id === id)!;
    return { label: m.title, icon, hash: `#/edit/${id}`, active: (v) => v.name === "edit" && v.module === id && v.section !== "openings" };
  };

  const groups: { title: string; items: NavItem[] }[] = [
    { title: "", items: [{ label: "Overview", icon: "home", hash: "#/overview", active: (v) => v.name === "overview" }] },
    {
      title: "Inbox",
      items: [{ label: "Messages & applications", icon: "inbox", hash: "#/inbox", badge: newCount, active: (v) => v.name === "inbox" }],
    },
    {
      title: "Pages",
      items: [
        editItem("home", "home"),
        editItem("about"),
        editItem("careers", "briefcase"),
        { label: "Job openings", icon: "briefcase", hash: "#/edit/careers/openings", active: (v) => v.name === "edit" && v.module === "careers" && v.section === "openings" },
        editItem("contact", "mailIcon"),
        editItem("sitemap", "layers"),
        editItem("privacy", "shield"),
        editItem("terms", "document"),
      ],
    },
    { title: "Services", items: ["serviceSoftware", "serviceAi", "serviceAgentic", "serviceApp", "serviceCustom", "serviceSeo"].map((id) => editItem(id, "code")) },
    { title: "Site-wide", items: [{ ...editItem("site", "sliders"), label: "Header, footer & contact" }] },
    {
      title: "Library",
      items: [
        { label: "Images", icon: "image", hash: "#/images", active: (v) => v.name === "images" },
        { label: "History", icon: "clock", hash: "#/history", active: (v) => v.name === "history" },
        { label: "Account", icon: "user", hash: "#/account", active: (v) => v.name === "account" },
      ],
    },
  ];

  const currentModule = view.name === "edit" ? modules.find((m) => m.id === view.module) : undefined;
  const titles: Record<string, string> = {
    overview: "Overview",
    inbox: "Messages & applications",
    images: "Images",
    history: "History",
    account: "Account",
  };
  const pageTitle = currentModule ? (currentModule.id === "site" ? "Header, footer & contact" : currentModule.title) : titles[view.name];

  return (
    <FormProvider value={formCtx}>
      <div className={styles.shell}>
        <div className={cx(styles.scrim, navOpen && styles.scrimOn)} onClick={() => setNavOpen(false)} aria-hidden="true" />

        <aside className={cx(styles.sidebar, navOpen && styles.sidebarOpen)} aria-label="Admin navigation">
          <div className={styles.brand}>
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                go("#overview");
              }}
              className={styles.brandLogoLink}
              title="Recenturesoft Overview"
            >
              <Image
                src="/images/recenturesoft-logo.png"
                alt="Recenturesoft"
                width={160}
                height={46}
                priority
                className={styles.brandLogoLight}
              />
              <Image
                src="/images/logo_white.PNG"
                alt="Recenturesoft"
                width={160}
                height={46}
                priority
                className={styles.brandLogoDark}
              />
            </a>
            <span className={styles.brandBadge}>Admin</span>
          </div>
          <nav className={styles.nav}>
            {groups.map((g, gi) => (
              <div key={gi} className={styles.navGroup}>
                {g.title ? <p className={styles.navTitle}>{g.title}</p> : null}
                <ul>
                  {g.items.map((item) => (
                    <li key={item.hash}>
                      <a
                        href={item.hash}
                        className={cx(styles.navLink, item.active(view) && styles.navLinkOn)}
                        aria-current={item.active(view) ? "page" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          go(item.hash);
                        }}
                      >
                        <UiIcon name={item.icon} />
                        <span>{item.label}</span>
                        {item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className={styles.sidebarFoot}>
            <a className={styles.navLink} href="/" target="_blank" rel="noopener noreferrer">
              <UiIcon name="external" />
              <span>View website</span>
            </a>
            <button type="button" className={cx(styles.navLink, styles.navButton)} onClick={() => void signOut()}>
              <UiIcon name="logout" />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <button type="button" className={styles.menuBtn} aria-label="Open menu" onClick={() => setNavOpen(true)}>
              <UiIcon name="menu" />
            </button>
            <div className={styles.topTitle}>
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
              {currentModule?.route ? (
                <a className={styles.viewLink} href={currentModule.route} target="_blank" rel="noopener noreferrer">
                  View page <UiIcon name="external" />
                </a>
              ) : null}
            </div>
            <div className={styles.topActions}>
              <span className={cx(styles.status, dirty && styles.statusDirty)} role="status" aria-live="polite">
                <span className={styles.statusDot} aria-hidden="true" />
                <span className={styles.statusText}>{dirty ? "Unsaved changes" : "All changes saved"}</span>
              </span>
              {dirty ? (
                <Button variant="ghost" onClick={() => setDiscarding(true)}>
                  Discard
                </Button>
              ) : null}
              <Button variant="primary" icon="save" busy={saving} onClick={() => void save()}>
                Save changes
              </Button>
              <ThemeToggle />
            </div>
          </header>

          {storageBlocked && view.name !== "overview" ? (
            <div className={styles.banner} role="note">
              <UiIcon name="info" />
              <span>
                Saving is not switched on for the live website yet.{" "}
                <a href="#/overview" onClick={(e) => { e.preventDefault(); go("#/overview"); }}>
                  See how to switch it on
                </a>
                .
              </span>
            </div>
          ) : null}

          <div ref={mainRef} role="main" className={styles.content} id="admin-main" tabIndex={-1}>
            {view.name === "overview" ? (
              <OverviewView content={content} inquiries={inquiries} system={system} refreshKey={savedTick} go={go} />
            ) : null}
            {view.name === "edit" && currentModule ? (
              <EditorView
                mod={currentModule}
                content={content}
                sectionId={view.section ?? currentModule.sections[0].id}
                onSection={(id) => go(`#/edit/${currentModule.id}/${id}`)}
                onChange={update}
              />
            ) : null}
            {view.name === "inbox" ? (
              <InboxView
                items={inquiries}
                loading={inboxLoading}
                selectedId={view.id ?? null}
                onSelect={(id) => go(id ? `#/inbox/${id}` : "#/inbox")}
                onChange={setInquiries}
                onReload={() => void loadInbox()}
              />
            ) : null}
            {view.name === "images" ? <MediaView contentJson={contentJson} writable={system.storage !== "none"} /> : null}
            {view.name === "history" ? (
              <HistoryView
                dirty={dirty}
                writable={system.storage !== "none"}
                refreshKey={savedTick}
                onRestored={(restored) => {
                  setContent(restored);
                  setSavedJson(JSON.stringify(restored));
                  setSavedTick((t) => t + 1);
                }}
              />
            ) : null}
            {view.name === "account" ? <AccountView system={system} onSignOut={() => void signOut()} /> : null}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={discarding}
        title="Discard your unsaved changes?"
        body="Everything you changed since the last save will be lost. The website is not affected."
        confirmLabel="Discard changes"
        onCancel={() => setDiscarding(false)}
        onConfirm={discard}
      />
    </FormProvider>
  );
}

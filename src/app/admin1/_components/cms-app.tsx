"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { modules, type SiteContent } from "@/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { can as canDo, pageResource, type Action, type Permissions } from "@/lib/cms-access";
import adminStyles from "../../admin/admin.module.css";
import { HistoryView } from "../../admin/_components/history-view";
import { InboxView, type Inquiry } from "../../admin/_components/inbox-view";
import { FormProvider } from "../../admin/_components/fields";
import { api, setIn, validateAll, type Path } from "../../admin/_components/lib";
import { MediaView } from "../../admin/_components/media-view";
import { ToastProvider, UiIcon, useToast } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { AccountView } from "./account-view";
import { CmsContext, type CmsContextValue, type CmsUserInfo } from "./cms-context";
import { DashboardView } from "./dashboard-view";
import { PageDocView } from "./page-doc-view";
import { RoleEdit, RolesList } from "./roles-view";
import { UserEdit, UsersList } from "./users-view";
import { ActivityView } from "./activity-view";
import { PagesList, PageEdit } from "./pages-view";
import { PageHead } from "./page-head";
import { AccessContext } from "./access-context";
import { NavContext, type NavRoute, type NavValue } from "./nav-context";

const BASE = "/admin1";

/** Text form of a page's data, remembered per object, so only the branches that changed are turned into text again. */
const jsonCache = new WeakMap<object, string>();
function jsonOf(o: unknown): string {
  if (!o || typeof o !== "object") return JSON.stringify(o);
  let s = jsonCache.get(o);
  if (s === undefined) {
    s = JSON.stringify(o);
    jsonCache.set(o, s);
  }
  return s;
}

/* ------------------------------------------------------------------ routes */

type Route =
  | { name: "dashboard" }
  | { name: "users" }
  | { name: "user"; id: string }
  | { name: "roles" }
  | { name: "role"; id: string }
  | { name: "pages" }
  | { name: "page"; id: string }
  | { name: "activity" }
  | { name: "media" }
  | { name: "messages"; id?: string }
  | { name: "versions" }
  | { name: "global"; module: string }
  | { name: "account" }
  | { name: "missing" };

function parseRoute(pathname: string): Route {
  const parts = pathname.replace(BASE, "").split("/").filter(Boolean);
  if (parts.length === 0) return { name: "dashboard" };
  const [a, b, c] = parts;
  if (a === "collections") {
    if (b === "users") return c ? { name: "user", id: c } : { name: "users" };
    if (b === "roles") return c ? { name: "role", id: c } : { name: "roles" };
    if (b === "pages") return c ? { name: "page", id: c } : { name: "pages" };
    if (b === "activity") return { name: "activity" };
    if (b === "media") return { name: "media" };
    if (b === "messages") return { name: "messages", id: c };
    if (b === "versions") return { name: "versions" };
  }
  if (a === "globals" && b && modules.some((m) => m.id === b)) return { name: "global", module: b };
  if (a === "account") return { name: "account" };
  return { name: "missing" };
}

/** What a route needs before it can be shown. */
function routeNeeds(route: Route): { resource: string; action: Action } | null {
  switch (route.name) {
    case "users":
    case "user":
      return { resource: "users", action: "read" };
    case "roles":
    case "role":
      return { resource: "roles", action: "read" };
    case "pages":
    case "page":
      return { resource: "pages", action: "read" };
    case "activity":
      return { resource: "audit", action: "read" };
    case "media":
      return { resource: "media", action: "read" };
    case "messages":
      return { resource: "inbox", action: "read" };
    case "versions":
      return { resource: "history", action: "read" };
    case "global":
      return { resource: pageResource(route.module), action: "read" };
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ app */

export interface CmsAppProps {
  user: CmsUserInfo;
  permissions: Permissions;
  superUser: boolean;
  initialContent: SiteContent;
  initialInquiries: Inquiry[];
  storage: "redis" | "file" | "none";
  /** Shown in the footer of the panel. */
  company: { legalName: string; email: string; year: number };
  children?: React.ReactNode;
}

export function CmsApp(props: CmsAppProps) {
  return (
    <ToastProvider>
      <Shell {...props} />
    </ToastProvider>
  );
}

const GROUP_ORDER = ["Pages", "Services", "Site"] as const;

function Shell({ user, permissions, superUser, initialContent, initialInquiries, storage, company }: CmsAppProps) {
  const notify = useToast();
  const pathname = usePathname() || BASE;
  const router = useRouter();
  const route = useMemo(() => parseRoute(pathname), [pathname]);

  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(initialContent as unknown as Record<string, unknown>).map(([k, v]) => [k, JSON.stringify(v)])),
  );
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [savingModule, setSavingModule] = useState<string | null>(null);
  const [savedTick, setSavedTick] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  // One sidebar group is open at a time. Undefined means "follow the page being shown"; the dashboard shows none.
  const [openGroup, setOpenGroup] = useState<string | null | undefined>(undefined);
  const [groupPath, setGroupPath] = useState(pathname);
  if (groupPath !== pathname) {
    setGroupPath(pathname);
    setOpenGroup(undefined);
  }
  const mainRef = useRef<HTMLDivElement>(null);

  const can = useCallback(
    (resource: string, action: Action) => superUser || canDo(permissions, resource, action),
    [permissions, superUser],
  );

  /* ---- unsaved state, cheap to compute: only the branches that changed are turned into text again ---- */
  const dirtyModules = useMemo(() => {
    const out = new Set<string>();
    for (const [id, value] of Object.entries(content as unknown as Record<string, unknown>)) {
      if (jsonOf(value) !== saved[id]) out.add(id);
    }
    return out;
  }, [content, saved]);
  const isDirty = useCallback((id: string) => dirtyModules.has(id), [dirtyModules]);
  const anyDirty = dirtyModules.size > 0;

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNavOpen(false);
  }, [pathname]);

  const update = useCallback((path: Path, value: unknown) => {
    setContent((prev) => setIn(prev, path, value));
  }, []);
  const formCtx = useMemo(() => ({ attempt, update }), [attempt, update]);

  const signOut = useCallback(async () => {
    await api("/api/cms/auth", { method: "DELETE" });
    window.location.href = `${BASE}/login`;
  }, []);

  const expired = useCallback(() => {
    notify("error", "Your session ended. Please sign in again.");
    window.setTimeout(() => (window.location.href = `${BASE}/login`), 1200);
  }, [notify]);

  const savePage = useCallback(
    async (moduleId: string): Promise<boolean> => {
      const problems = validateAll(content).filter((p) => p.moduleId === moduleId);
      if (problems.length > 0) {
        setAttempt((a) => a + 1);
        notify(
          "error",
          problems.length === 1 ? problems[0].message : `${problems.length} things need a look before saving. First: ${problems[0].message}`,
        );
        return false;
      }
      const data = (content as unknown as Record<string, unknown>)[moduleId];
      setSavingModule(moduleId);
      const res = await api<{ data: unknown }>("/api/cms/content", { method: "PUT", json: { module: moduleId, data } });
      setSavingModule(null);
      if (res.success) {
        setContent((prev) => ({ ...(prev as object), [moduleId]: res.data }) as unknown as SiteContent);
        setSaved((prev) => ({ ...prev, [moduleId]: JSON.stringify(res.data) }));
        setSavedTick((t) => t + 1);
        setAttempt(0);
        notify("success", "Saved. Your website is updated.");
        return true;
      }
      if (res.status === 401) expired();
      else if (res.code === "storage_unavailable") notify("error", "Saving is not switched on for the live website yet.");
      else notify("error", res.error ?? "Your changes could not be saved. Please try again.");
      return false;
    },
    [content, expired, notify],
  );

  const discardPage = useCallback(
    (moduleId: string) => {
      const original = saved[moduleId];
      if (original === undefined) return;
      setContent((prev) => ({ ...(prev as object), [moduleId]: JSON.parse(original) }) as unknown as SiteContent);
      setAttempt(0);
      notify("info", "Your unsaved changes were discarded.");
    },
    [saved, notify],
  );

  const applyPage = useCallback((moduleId: string, data: unknown) => {
    setContent((prev) => ({ ...(prev as object), [moduleId]: data }) as unknown as SiteContent);
    setSaved((prev) => ({ ...prev, [moduleId]: JSON.stringify(data) }));
    setSavedTick((t) => t + 1);
    setAttempt(0);
  }, []);

  const replaceAll = useCallback(
    (next: SiteContent) => {
      // Keep only what this person may read.
      const readable = Object.fromEntries(
        modules.filter((m) => can(pageResource(m.id), "read")).map((m) => [m.id, (next as unknown as Record<string, unknown>)[m.id]]),
      ) as unknown as SiteContent;
      setContent(readable);
      setSaved(Object.fromEntries(Object.entries(readable as unknown as Record<string, unknown>).map(([k, v]) => [k, JSON.stringify(v)])));
      setSavedTick((t) => t + 1);
    },
    [can],
  );

  /* ---- messages ---- */
  const canReadInbox = can("inbox", "read");
  const loadInbox = useCallback(async () => {
    if (!canReadInbox) return;
    setInboxLoading(true);
    const res = await api<{ inquiries: Inquiry[] }>("/api/admin/inquiries");
    setInboxLoading(false);
    if (res.success) setInquiries(res.inquiries);
    else if (res.status === 401) expired();
  }, [canReadInbox, expired]);

  useEffect(() => {
    if (route.name === "messages") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadInbox();
    }
  }, [route.name, loadInbox]);

  useEffect(() => {
    if (!canReadInbox) return;
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadInbox();
    }, 60_000);
    return () => window.clearInterval(t);
  }, [canReadInbox, loadInbox]);

  const navValue: NavValue = useMemo(() => {
    const href = (r: NavRoute): string => {
      switch (r.name) {
        case "users":
          return `${BASE}/collections/users`;
        case "user":
          return `${BASE}/collections/users/${r.id}`;
        case "roles":
          return `${BASE}/collections/roles`;
        case "role":
          return `${BASE}/collections/roles/${r.id}`;
        case "pages":
          return `${BASE}/collections/pages`;
        case "page":
          return `${BASE}/collections/pages/${r.id}`;
        case "activity":
          return `${BASE}/collections/activity`;
      }
    };
    return { kind: "next", href, go: (r) => router.push(href(r)), preview: (id) => `${BASE}/preview/${id}` };
  }, [router]);
  const accessValue = useMemo(() => ({ user, permissions, superUser, can }), [user, permissions, superUser, can]);

  const ctx: CmsContextValue = {
    user,
    permissions,
    superUser,
    can,
    storage,
    content,
    update,
    isDirty,
    anyDirty,
    savePage,
    discardPage,
    applyPage,
    savingModule,
    attempt,
    replaceAll,
    savedTick,
    signOut,
  };

  /* ---- navigation ---- */
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const pageLabel = (id: string) => {
    const m = modules.find((x) => x.id === id)!;
    return id === "site" ? "Header, footer & contact" : id === "reviews" ? "Customer reviews" : m.title;
  };

  interface NavItem {
    label: string;
    href: string;
    on: boolean;
    badge?: number;
    dirty?: boolean;
  }
  const navGroups: { title: string; items: NavItem[] }[] = [];

  const collections: NavItem[] = [];
  if (can("users", "read")) collections.push({ label: "Users", href: `${BASE}/collections/users`, on: route.name === "users" || route.name === "user" });
  if (can("roles", "read")) collections.push({ label: "Roles", href: `${BASE}/collections/roles`, on: route.name === "roles" || route.name === "role" });
  if (can("audit", "read")) collections.push({ label: "Activity log", href: `${BASE}/collections/activity`, on: route.name === "activity" });
  if (can("pages", "read")) collections.push({ label: "Custom pages", href: `${BASE}/collections/pages`, on: route.name === "pages" || route.name === "page" });
  if (can("media", "read")) collections.push({ label: "Media", href: `${BASE}/collections/media`, on: route.name === "media" });
  if (canReadInbox)
    collections.push({ label: "Messages & applications", href: `${BASE}/collections/messages`, on: route.name === "messages", badge: newCount });
  if (can("history", "read")) collections.push({ label: "Versions", href: `${BASE}/collections/versions`, on: route.name === "versions" });
  if (collections.length) navGroups.push({ title: "Collections", items: collections });

  for (const group of GROUP_ORDER) {
    const items = modules
      .filter((m) => m.group === group && can(pageResource(m.id), "read"))
      .map((m) => ({
        label: pageLabel(m.id),
        href: `${BASE}/globals/${m.id}`,
        on: route.name === "global" && route.module === m.id,
        dirty: dirtyModules.has(m.id),
      }));
    if (items.length) navGroups.push({ title: group, items });
  }

  /* ---- breadcrumbs ---- */
  const crumbs: { label: string; href?: string }[] = [{ label: "Dashboard", href: BASE }];
  switch (route.name) {
    case "users":
      crumbs.push({ label: "Collections" }, { label: "Users" });
      break;
    case "user":
      crumbs.push({ label: "Users", href: `${BASE}/collections/users` }, { label: route.id === "create" ? "Create new" : "Edit" });
      break;
    case "roles":
      crumbs.push({ label: "Collections" }, { label: "Roles" });
      break;
    case "role":
      crumbs.push({ label: "Roles", href: `${BASE}/collections/roles` }, { label: route.id === "create" ? "Create new" : "Edit" });
      break;
    case "pages":
      crumbs.push({ label: "Collections" }, { label: "Custom pages" });
      break;
    case "page":
      crumbs.push({ label: "Custom pages", href: `${BASE}/collections/pages` }, { label: route.id === "create" ? "Create new" : "Edit" });
      break;
    case "activity":
      crumbs.push({ label: "Collections" }, { label: "Activity log" });
      break;
    case "media":
      crumbs.push({ label: "Collections" }, { label: "Media" });
      break;
    case "messages":
      crumbs.push({ label: "Collections" }, { label: "Messages & applications" });
      break;
    case "versions":
      crumbs.push({ label: "Collections" }, { label: "Versions" });
      break;
    case "global": {
      const m = modules.find((x) => x.id === route.module)!;
      crumbs.push({ label: m.group }, { label: pageLabel(m.id) });
      break;
    }
    case "account":
      crumbs.push({ label: "Account" });
      break;
    case "missing":
      crumbs.push({ label: "Not found" });
      break;
    default:
      crumbs.length = 0;
      crumbs.push({ label: "Dashboard" });
  }

  const needs = routeNeeds(route);
  const blocked = needs ? !can(needs.resource, needs.action) : false;
  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <CmsContext.Provider value={ctx}>
      <AccessContext.Provider value={accessValue}>
      <NavContext.Provider value={navValue}>
      <FormProvider value={formCtx}>
        <div className={cms.frame}>
          <div className={`${cms.scrim} ${navOpen ? cms.scrimOn : ""}`} onClick={() => setNavOpen(false)} aria-hidden="true" />

          <aside className={`${cms.nav} ${navOpen ? cms.navOpen : ""}`} aria-label="Panel navigation">
            <div className={cms.navBrand}>
              <Link href={BASE} className={cms.navLogo} aria-label="Dashboard">
                <Image src="/images/recenturesoft-logo.png" alt="Recenturesoft" width={150} height={60} priority className={cms.navLogoLight} />
                <Image src="/images/logo_white.PNG" alt="Recenturesoft" width={150} height={60} priority className={cms.navLogoDark} />
              </Link>
              <button type="button" className={`${adminStyles.iconBtn} ${cms.navClose}`} aria-label="Close menu" onClick={() => setNavOpen(false)}>
                <UiIcon name="close" />
              </button>
            </div>

            <nav>
              <ul className={cms.navList}>
                <li>
                  <Link href={BASE} className={`${cms.navLink} ${route.name === "dashboard" ? cms.navLinkOn : ""}`} aria-current={route.name === "dashboard" ? "page" : undefined}>
                    Dashboard
                  </Link>
                </li>
              </ul>
              {navGroups.map((g) => {
                const shown = openGroup === undefined ? (navGroups.find((x) => x.items.some((i) => i.on))?.title ?? null) : openGroup;
                const isClosed = shown !== g.title;
                return (
                  <div key={g.title} className={cms.navGroup}>
                    <button
                      type="button"
                      className={cms.navGroupBtn}
                      aria-expanded={!isClosed}
                      onClick={() => setOpenGroup(isClosed ? g.title : null)}
                    >
                      {g.title}
                      <svg viewBox="0 0 24 24" className={`${cms.navCaret} ${isClosed ? cms.navCaretClosed : ""}`} aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isClosed ? null : (
                      <ul className={cms.navList}>
                        {g.items.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} className={`${cms.navLink} ${item.on ? cms.navLinkOn : ""}`} aria-current={item.on ? "page" : undefined}>
                              <span>{item.label}</span>
                              {item.badge ? <span className={cms.navBadge}>{item.badge}</span> : null}
                              {item.dirty ? <span className={cms.navDot} title="Unsaved changes" /> : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className={cms.navFoot}>
              <Link href={`${BASE}/account`} className={cms.navUser} aria-label="Your account">
                <span className={cms.avatar}>{initials || "U"}</span>
                <span className={cms.navUserText}>
                  <span className={cms.navUserName}>{user.name}</span>
                  <span className={cms.navUserRole}>{user.roleName}</span>
                </span>
              </Link>
              <button type="button" className={adminStyles.iconBtn} title="Log out" aria-label="Log out" onClick={() => void signOut()}>
                <UiIcon name="logout" />
              </button>
            </div>
          </aside>

          <div className={cms.main}>
            <header className={cms.topbar}>
              <button type="button" className={`${adminStyles.iconBtn} ${cms.menuBtn}`} aria-label="Open menu" onClick={() => setNavOpen(true)}>
                <UiIcon name="menu" />
              </button>
              <div className={cms.crumbs} aria-label="Breadcrumb">
                {crumbs.map((c, i) => (
                  <span key={i} style={{ display: "contents" }}>
                    {i > 0 ? <span className={cms.crumbSep}>/</span> : null}
                    {c.href && i < crumbs.length - 1 ? (
                      <Link href={c.href}>{c.label}</Link>
                    ) : i === crumbs.length - 1 ? (
                      <span className={cms.crumbHere}>{c.label}</span>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </span>
                ))}
              </div>
              <div className={cms.topRight}>
                <a className={adminStyles.viewLink} href="/" target="_blank" rel="noopener noreferrer">
                  View website <UiIcon name="external" />
                </a>
                <ThemeToggle />
              </div>
            </header>

            <div ref={mainRef} className={cms.body} id="cms-main" tabIndex={-1}>
              {storage === "none" ? (
                <div className={cms.notice} role="note">
                  <UiIcon name="info" />
                  <span>Saving is not switched on for the live website yet, so changes cannot be stored.</span>
                </div>
              ) : null}

              {blocked ? (
                <div className={cms.empty}>
                  <h1 className={cms.pageH1}>You do not have access</h1>
                  <p className={cms.lead} style={{ margin: "8px auto 0" }}>
                    Your role ({user.roleName}) cannot open this page. Ask an administrator if you need it.
                  </p>
                </div>
              ) : null}

              {!blocked && route.name === "dashboard" ? <DashboardView newMessages={newCount} /> : null}
              {!blocked && route.name === "global" ? <PageDocView key={route.module} moduleId={route.module} /> : null}
              {!blocked && route.name === "users" ? <UsersList /> : null}
              {!blocked && route.name === "user" ? <UserEdit key={route.id} id={route.id} /> : null}
              {!blocked && route.name === "roles" ? <RolesList /> : null}
              {!blocked && route.name === "activity" ? <ActivityView /> : null}
              {!blocked && route.name === "role" ? <RoleEdit key={route.id} id={route.id} /> : null}
              {!blocked && route.name === "pages" ? <PagesList /> : null}
              {!blocked && route.name === "page" ? <PageEdit key={route.id} id={route.id} /> : null}
              {!blocked && route.name === "media" ? (
                <>
                  <PageHead title="Media" lead="Pictures you upload here can be chosen on any page." />
                  <MediaView contentJson={JSON.stringify(content)} writable={can("media", "create") && storage !== "none"} />
                </>
              ) : null}
              {!blocked && route.name === "messages" ? (
                <>
                  <PageHead title="Messages & applications" lead="Everything sent through the Contact and Careers forms." />
                  <InboxView
                    items={inquiries}
                    loading={inboxLoading}
                    selectedId={route.id ?? null}
                    onSelect={(id) => router.push(id ? `${BASE}/collections/messages/${id}` : `${BASE}/collections/messages`)}
                    onChange={setInquiries}
                    onReload={() => void loadInbox()}
                  />
                </>
              ) : null}
              {!blocked && route.name === "versions" ? (
                <>
                  <PageHead title="Versions" lead="Every time you save, a copy is kept here (the latest 20). Restoring a version puts it on the website straight away, and the version you replace stays in this list." />
                  <HistoryView
                    hideLead
                    dirty={anyDirty}
                    writable={can("history", "restore") && storage !== "none"}
                    refreshKey={savedTick}
                    onRestored={replaceAll}
                  />
                </>
              ) : null}
              {route.name === "account" ? <AccountView /> : null}
              {route.name === "missing" ? (
                <div className={cms.empty}>
                  <h1 className={cms.pageH1}>Not found</h1>
                  <p className={cms.lead} style={{ margin: "8px auto 0" }}>
                    <Link href={BASE}>Go to the dashboard</Link>
                  </p>
                </div>
              ) : null}
            </div>
            <footer className={cms.footer}>
              <div className={cms.footerRow}>
                <span>
                  &copy; {company.year} {company.legalName}. All rights reserved.
                </span>
                <span className={cms.footerLinks}>
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                    Terms &amp; Conditions
                  </a>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    View website
                  </a>
                </span>
              </div>
              <p className={cms.footerNote}>
                Website admin panel for authorised staff only. Changes made here are recorded in the activity log. For access or password help, contact{" "}
                <a href={`mailto:${company.email}`}>{company.email}</a>.
              </p>
            </footer>
          </div>
        </div>
      </FormProvider>
      </NavContext.Provider>
      </AccessContext.Provider>
    </CmsContext.Provider>
  );
}

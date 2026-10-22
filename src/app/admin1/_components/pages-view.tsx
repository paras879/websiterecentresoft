"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BLOCK_INFO,
  BLOCK_ORDER,
  blankBlock,
  blankPage,
  pagePath,
  slugProblem,
  slugify,
  type Block,
  type BlockType,
  type CustomPage,
  MENU_ICONS,
} from "@/lib/custom-pages-types";
import adminStyles from "../../admin/admin.module.css";
import { api, fullDate, relativeTime } from "../../admin/_components/lib";
import { Button, ConfirmDialog, IconButton, UiIcon, useToast } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { useAccess } from "./access-context";
import { BlockBody, blockSummary, Field, ImagePick, Seg, TextField, AreaField } from "./block-editors";
import { NavLink, useNav } from "./nav-context";
import { LivePreview } from "./live-preview";
import { PageHead } from "./page-head";

/* ------------------------------------------------------------------ list */

export function PagesList() {
  const { can } = useAccess();
  const [pages, setPages] = useState<CustomPage[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const res = await api<{ pages: CustomPage[] }>("/api/cms/pages");
    if (res.success) setPages(res.pages);
    else {
      setPages([]);
      setError(res.error ?? "Could not load the pages.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (pages ?? []).filter((p) => !needle || `${p.title} ${pagePath(p)}`.toLowerCase().includes(needle));
  }, [pages, q]);

  return (
    <>
      <PageHead title="Custom pages" lead="Make new pages for the website without touching code. Each page is a stack of blocks that you can move around.">
        {can("pages", "create") ? (
          <NavLink to={{ name: "page", id: "create" }} className={`${adminStyles.btn} ${adminStyles.btn_primary}`}>
            <UiIcon name="plus" /> Create new page
          </NavLink>
        ) : null}
      </PageHead>

      <div className={cms.listBar}>
        <input className={`${adminStyles.input} ${cms.search}`} type="search" placeholder="Search by title or address" aria-label="Search pages" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error ? <p className={cms.error}>{error}</p> : null}

      <div className={cms.tableWrap}>
        <table className={cms.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Address</th>
              <th>Status</th>
              <th>In menu</th>
              <th>Last saved</th>
            </tr>
          </thead>
          <tbody>
            {pages === null ? (
              <tr>
                <td colSpan={5} className={cms.empty}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className={cms.empty}>
                  {pages.length === 0 ? "No custom pages yet. Create the first one." : "No page matches your search."}
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <NavLink className={cms.rowLink} to={{ name: "page", id: p.id }}>
                      {p.title}
                    </NavLink>
                  </td>
                  <td>
                    {p.status === "published" ? (
                      <a href={pagePath(p)} target="_blank" rel="noopener noreferrer">
                        {pagePath(p)}
                      </a>
                    ) : (
                      <span className={cms.muted}>{pagePath(p)}</span>
                    )}
                  </td>
                  <td>
                    <span className={`${cms.pill} ${p.status === "published" ? cms.pillOn : ""}`}>{p.status === "published" ? "Published" : "Draft"}</span>
                  </td>
                  <td className={cms.muted}>{p.menu === "services" ? "Services menu" : p.menu === "top" ? "Top bar" : p.menu === "group" ? `Dropdown: ${p.menuGroup || "More"}` : p.menu === "footer" ? "Footer" : "No"}</td>
                  <td className={cms.muted} title={fullDate(p.updatedAt)}>
                    {relativeTime(p.updatedAt)}
                    {p.updatedBy ? ` by ${p.updatedBy}` : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ create / edit */

export function PageEdit({ id }: { id: string }) {
  const creating = id === "create";
  const { can } = useAccess();
  const nav = useNav();
  const notify = useToast();

  const [initialPage] = useState<CustomPage>(() => blankPage());
  const [page, setPage] = useState<CustomPage>(initialPage);
  const [saved, setSaved] = useState(() => JSON.stringify(initialPage));
  const [loaded, setLoaded] = useState(creating);
  const [missing, setMissing] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!creating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [closedBlocks, setClosedBlocks] = useState<Record<string, boolean>>({});
  const dragFrom = useRef<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [scrollTo, setScrollTo] = useState<{ id: string; n: number } | null>(null);
  const showBlock = (blockId: string) => setScrollTo((cur) => ({ id: blockId, n: (cur?.n ?? 0) + 1 }));

  // The preview opens by default on a wide screen, and the choice is remembered.
  useEffect(() => {
    let on = window.innerWidth >= 1200;
    try {
      const saved = localStorage.getItem("rs-cms-live-preview");
      if (saved === "on") on = true;
      if (saved === "off") on = false;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowPreview(on);
  }, []);
  const togglePreview = () =>
    setShowPreview((v) => {
      try {
        localStorage.setItem("rs-cms-live-preview", v ? "off" : "on");
      } catch {}
      return !v;
    });
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    if (creating) return;
    let alive = true;
    void (async () => {
      const res = await api<{ page: CustomPage }>(`/api/cms/pages/${encodeURIComponent(id)}`);
      if (!alive) return;
      if (res.success) {
        setPage(res.page);
        setSaved(JSON.stringify(res.page));
        setLoaded(true);
      } else {
        setMissing(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, creating]);

  const dirty = loaded && JSON.stringify(page) !== saved;
  const canSave = creating ? can("pages", "create") : can("pages", "update");

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const patch = (p: Partial<CustomPage>) => setPage((cur) => ({ ...cur, ...p }));
  const setBlock = (index: number, next: Block) => setPage((cur) => ({ ...cur, blocks: cur.blocks.map((b, i) => (i === index ? next : b)) }));
  const moveBlock = (from: number, to: number) =>
    setPage((cur) => {
      if (to < 0 || to >= cur.blocks.length || from === to) return cur;
      const blocks = [...cur.blocks];
      const [b] = blocks.splice(from, 1);
      blocks.splice(to, 0, b);
      window.setTimeout(() => showBlock(b.id), 150);
      return { ...cur, blocks };
    });
  const addBlock = (type: BlockType) => {
    const fresh = blankBlock(type);
    setPage((cur) => ({ ...cur, blocks: [...cur.blocks, fresh] }));
    setAdding(false);
    window.setTimeout(() => showBlock(fresh.id), 300);
    window.setTimeout(() => document.getElementById("page-blocks-end")?.scrollIntoView({ block: "center", behavior: "smooth" }), 80);
  };
  const duplicateBlock = (index: number) =>
    setPage((cur) => {
      const copy = structuredClone(cur.blocks[index]) as Block;
      copy.id = blankBlock(copy.type).id;
      const blocks = [...cur.blocks];
      blocks.splice(index + 1, 0, copy);
      return { ...cur, blocks };
    });

  const slugError = page.slug ? slugProblem(page.prefix, page.slug) : null;

  const save = async (nextStatus?: "published" | "draft") => {
    setError("");
    if (!page.title.trim()) return setError("Enter a page title.");
    const problem = slugProblem(page.prefix, page.slug);
    if (problem) return setError(problem);

    const body = { ...page, status: nextStatus ?? page.status };
    setSaving(true);
    const res = creating
      ? await api<{ page: CustomPage }>("/api/cms/pages", { method: "POST", json: body })
      : await api<{ page: CustomPage }>(`/api/cms/pages/${encodeURIComponent(id)}`, { method: "PUT", json: body });
    setSaving(false);
    if (!res.success) return setError(res.error ?? "Could not save the page.");

    setPage(res.page);
    setSaved(JSON.stringify(res.page));
    notify("success", res.page.status === "published" ? "Saved. The page is live." : "Saved as a draft. Visitors cannot see it yet.");
    if (creating) nav.go({ name: "page", id: res.page.id });
  };

  const remove = async () => {
    setDeleting(false);
    const res = await api(`/api/cms/pages/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.success) {
      notify("success", "Page deleted.");
      setSaved(JSON.stringify(page));
      nav.go({ name: "pages" });
    } else {
      notify("error", res.error ?? "Could not delete the page.");
    }
  };

  if (missing) {
    return (
      <div className={cms.empty}>
        <h1 className={cms.pageH1}>Page not found</h1>
        <p className={cms.lead} style={{ margin: "8px auto 0" }}>
          <NavLink to={{ name: "pages" }}>Back to pages</NavLink>
        </p>
      </div>
    );
  }

  const actions = (
    <aside className={`${cms.docAside} ${showPreview ? cms.docAsideInline : ""}`} aria-label="Document actions">
      <p className={cms.asideTitle}>Actions</p>
      <span className={`${cms.state} ${dirty ? cms.stateDirty : ""}`} role="status" aria-live="polite">
        <span className={cms.stateDot} aria-hidden="true" />
        {dirty ? "Unsaved changes" : "All changes saved"}
      </span>

      <Seg<"published" | "draft">
        label="Status"
        value={page.status}
        options={[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ]}
        onChange={(v) => patch({ status: v })}
      />

      <Field label="Show a link in" hint="The link is added to the menu or footer automatically while the page is published.">
        {(fid) => (
          <select id={fid} className={adminStyles.input} value={page.menu} onChange={(e) => patch({ menu: e.target.value as CustomPage["menu"] })} disabled={!canSave}>
            <option value="none">No menu</option>
            <option value="services">Inside the Services dropdown</option>
            <option value="top">Top bar, as its own link</option>
            <option value="group">Top bar, in a dropdown of its own</option>
            <option value="footer">Footer only</option>
          </select>
        )}
      </Field>

      {page.menu === "group" ? (
        <TextField
          label="Dropdown name"
          value={page.menuGroup}
          max={30}
          onChange={(v) => patch({ menuGroup: v })}
          hint="Shown in the top bar, after Careers. Every page with the same name goes into the same dropdown."
        />
      ) : null}

      {page.menu === "services" || page.menu === "group" ? (
        <Field label="Icon in the dropdown" hint="The short description under the name comes from the page description in Search and sharing.">
          {(fid) => (
            <select id={fid} className={adminStyles.input} value={page.menuIcon} onChange={(e) => patch({ menuIcon: e.target.value })} disabled={!canSave}>
              {MENU_ICONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </Field>
      ) : null}

      {error ? (
        <p className={cms.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={cms.asideActions}>
        <Button variant="primary" icon="save" busy={saving} disabled={!canSave || !loaded} onClick={() => void save()}>
          {creating ? "Create page" : "Save"}
        </Button>
        {!creating && page.status === "draft" && can("pages", "update") ? (
          <Button disabled={saving} onClick={() => void save("published")}>
            Save and publish
          </Button>
        ) : null}
        {!creating && page.status === "published" && can("pages", "update") ? (
          <Button variant="ghost" disabled={saving} onClick={() => void save("draft")}>
            Unpublish (make a draft)
          </Button>
        ) : null}
        {!creating ? (
          <a className={cms.asideLink} href={nav.preview(id)} target="_blank" rel="noopener noreferrer">
            Preview <UiIcon name="external" />
          </a>
        ) : null}
        {!creating && page.status === "published" ? (
          <a className={cms.asideLink} href={pagePath(page)} target="_blank" rel="noopener noreferrer">
            View live page <UiIcon name="external" />
          </a>
        ) : null}
        {!creating && can("pages", "delete") ? (
          <Button variant="danger" icon="trash" onClick={() => setDeleting(true)}>
            Delete page
          </Button>
        ) : null}
        <NavLink className={cms.asideLink} to={{ name: "pages" }}>
          Back to pages
        </NavLink>
      </div>
      {!creating ? <p className={cms.help}>Preview shows the last saved version. Save first to see new changes.</p> : null}
    </aside>
  );

  return (
    <>
      <PageHead title={creating ? "Create new page" : page.title || "Page"}>
        <Button onClick={togglePreview} aria-pressed={showPreview}>
          {showPreview ? "Hide live preview" : "Show live preview"}
        </Button>
      </PageHead>

      <div className={`${cms.doc} ${showPreview ? cms.docSplit : ""}`}>
        <div className={cms.docMain}>
          {showPreview ? actions : null}
          <fieldset className={cms.fieldset} disabled={!canSave || !loaded}>
            {/* ---- basics */}
            <section className={cms.card} aria-labelledby="pg-basics">
              <h2 id="pg-basics" className={cms.cardTitle}>
                Page
              </h2>
              <div className={cms.form} style={{ maxWidth: "none" }}>
                <TextField
                  label="Page title"
                  value={page.title}
                  max={120}
                  onChange={(v) => {
                    patch({ title: v, ...(slugTouched ? {} : { slug: slugify(v) }) });
                  }}
                  hint="Shown in the menu and as the page name."
                />
                <div className={cms.formRow} style={{ gridTemplateColumns: "minmax(0,220px) minmax(0,1fr)" }}>
                  <Field label="Folder">
                    {(fid) => (
                      <select id={fid} className={adminStyles.input} value={page.prefix} onChange={(e) => patch({ prefix: e.target.value as "" | "services" })}>
                        <option value="">/ (main site)</option>
                        <option value="services">/services/</option>
                      </select>
                    )}
                  </Field>
                  <Field label="Address" hint={slugError ?? `The page will be at ${pagePath(page)}`}>
                    {(fid) => (
                      <input
                        id={fid}
                        className={`${adminStyles.input} ${slugError ? adminStyles.inputInvalid : ""}`}
                        value={page.slug}
                        maxLength={60}
                        aria-invalid={Boolean(slugError)}
                        onChange={(e) => {
                          setSlugTouched(true);
                          patch({ slug: e.target.value.toLowerCase() });
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </section>

            {/* ---- blocks */}
            <section aria-labelledby="pg-blocks" style={{ marginTop: 24 }}>
              <div className={cms.blocksHead}>
                <h2 id="pg-blocks" className={cms.cardTitle} style={{ margin: 0 }}>
                  Content blocks
                </h2>
                <span className={cms.help}>Drag a block by its handle, or use the arrows, to move it. Pictures move with their block.</span>
              </div>

              {page.blocks.length === 0 ? <div className={cms.empty}>This page has no content yet. Add a block below.</div> : null}

              <ol className={cms.blocks}>
                {page.blocks.map((block, i) => {
                  const closed = Boolean(closedBlocks[block.id]);
                  const summary = blockSummary(block);
                  return (
                    <li
                      key={block.id}
                      className={`${cms.blockCard} ${dragOver === i ? cms.blockOver : ""}`}
                      onFocusCapture={() => {
                        if (scrollTo?.id !== block.id) showBlock(block.id);
                      }}
                      onDragOver={(e) => {
                        if (dragFrom.current === null) return;
                        e.preventDefault();
                        if (dragOver !== i) setDragOver(i);
                      }}
                      onDragLeave={() => setDragOver((cur) => (cur === i ? null : cur))}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragFrom.current !== null) moveBlock(dragFrom.current, i);
                        dragFrom.current = null;
                        setDragOver(null);
                      }}
                    >
                      <div className={cms.blockHead}>
                        <span
                          className={cms.handle}
                          draggable={canSave}
                          title="Drag to move"
                          aria-hidden="true"
                          onDragStart={(e) => {
                            dragFrom.current = i;
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", String(i));
                            const card = (e.currentTarget as HTMLElement).closest("li");
                            if (card) e.dataTransfer.setDragImage(card, 20, 20);
                          }}
                          onDragEnd={() => {
                            dragFrom.current = null;
                            setDragOver(null);
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                            <circle cx="9" cy="6" r="1.6" />
                            <circle cx="15" cy="6" r="1.6" />
                            <circle cx="9" cy="12" r="1.6" />
                            <circle cx="15" cy="12" r="1.6" />
                            <circle cx="9" cy="18" r="1.6" />
                            <circle cx="15" cy="18" r="1.6" />
                          </svg>
                        </span>
                        <button type="button" className={cms.blockTitleBtn} aria-expanded={!closed} onClick={() => setClosedBlocks((c) => ({ ...c, [block.id]: !c[block.id] }))}>
                          <span className={cms.blockNum}>{i + 1}</span>
                          <span className={cms.blockType}>{BLOCK_INFO[block.type].label}</span>
                          {summary ? <span className={cms.blockSummary}>{summary}</span> : null}
                        </button>
                        <div className={cms.blockTools}>
                          <label className={adminStyles.visuallyHidden} htmlFor={`pos-${block.id}`}>
                            Move block {i + 1} to position
                          </label>
                          <select id={`pos-${block.id}`} className={cms.posSelect} value={i} onChange={(e) => moveBlock(i, Number(e.target.value))} title="Move to position">
                            {page.blocks.map((_, n) => (
                              <option key={n} value={n}>
                                Position {n + 1}
                              </option>
                            ))}
                          </select>
                          <IconButton icon="up" label={`Move block ${i + 1} up`} disabled={i === 0} onClick={() => moveBlock(i, i - 1)} />
                          <IconButton icon="down" label={`Move block ${i + 1} down`} disabled={i === page.blocks.length - 1} onClick={() => moveBlock(i, i + 1)} />
                          <IconButton icon="copy" label={`Duplicate block ${i + 1}`} onClick={() => duplicateBlock(i)} />
                          <IconButton icon="trash" label={`Delete block ${i + 1}`} onClick={() => setPage((cur) => ({ ...cur, blocks: cur.blocks.filter((_, j) => j !== i) }))} />
                        </div>
                      </div>
                      {closed ? null : (
                        <div className={cms.blockBody}>
                          <BlockBody block={block} onChange={(next) => setBlock(i, next)} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              <span id="page-blocks-end" />

              <div className={cms.addBar}>
                <Button icon="plus" onClick={() => setAdding((v) => !v)} aria-expanded={adding}>
                  Add a block
                </Button>
              </div>
              {adding ? (
                <div className={cms.addGrid}>
                  {BLOCK_ORDER.map((t) => (
                    <button key={t} type="button" className={cms.addOption} onClick={() => addBlock(t)}>
                      <strong>{BLOCK_INFO[t].label}</strong>
                      <span>{BLOCK_INFO[t].hint}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </section>

            {/* ---- search and sharing */}
            <section className={cms.card} aria-labelledby="pg-seo" style={{ marginTop: 24 }}>
              <h2 id="pg-seo" className={cms.cardTitle}>
                Search and sharing
              </h2>
              <div className={cms.form} style={{ maxWidth: "none" }}>
                <TextField label="Page title for Google" value={page.seo.title} max={70} onChange={(v) => patch({ seo: { ...page.seo, title: v } })} hint="About 50 to 60 characters. Leave empty to use the page title." />
                <AreaField label="Description" value={page.seo.description} rows={3} max={200} onChange={(v) => patch({ seo: { ...page.seo, description: v } })} hint="About 150 characters. Leave empty to use the first text on the page." />
                <ImagePick label="Sharing picture" value={page.seo.image} alt={page.seo.imageAlt} onChange={(v) => patch({ seo: { ...page.seo, image: v } })} onAlt={(v) => patch({ seo: { ...page.seo, imageAlt: v } })} />
              </div>
            </section>
          </fieldset>
        </div>

        {showPreview ? (
          <div className={cms.liveCol}>
            <LivePreview page={page} scrollTo={scrollTo} onClose={togglePreview} />
          </div>
        ) : (
          actions
        )}
      </div>

      <ConfirmDialog
        open={deleting}
        title={`Delete “${page.title}”?`}
        body="The page disappears from the website at once. This cannot be undone."
        confirmLabel="Delete page"
        onCancel={() => setDeleting(false)}
        onConfirm={() => void remove()}
      />
    </>
  );
}

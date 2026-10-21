"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { defaultContent, modules } from "@/content";
import { pageResource } from "@/lib/cms-access";
import { Button, ConfirmDialog, UiIcon } from "../../admin/_components/ui";
import { FieldList } from "../../admin/_components/fields";
import { pathKey, validateAll } from "../../admin/_components/lib";
import cms from "../cms.module.css";
import { useCms } from "./cms-context";

/** One page of the website, edited the way a Payload "global" is: tabs on top, the form, and a save column on the right. */
export function PageDocView({ moduleId }: { moduleId: string }) {
  const { content, can, isDirty, savePage, discardPage, savingModule, attempt, update, storage } = useCms();
  const mod = modules.find((m) => m.id === moduleId)!;
  const [tab, setTab] = useState(mod.sections[0].id);
  const [resetting, setResetting] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const root = (content as unknown as Record<string, Record<string, unknown>>)[moduleId];
  const section = mod.sections.find((s) => s.id === tab) ?? mod.sections[0];
  const canEdit = can(pageResource(moduleId), "update") && storage !== "none";
  const dirty = isDirty(moduleId);
  const saving = savingModule === moduleId;
  const title = moduleId === "site" ? "Header, footer & contact" : moduleId === "reviews" ? "Customer reviews" : mod.title;

  // After a failed save, jump to the first thing that needs fixing.
  const first = useMemo(() => validateAll(content).find((p) => p.moduleId === moduleId), [content, moduleId]);
  useEffect(() => {
    if (attempt === 0 || !first) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab(first.sectionId);
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-path="${pathKey(first.path)}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.querySelector<HTMLElement>("input, textarea, select, button")?.focus({ preventScroll: true });
    }, 120);
    return () => window.clearTimeout(t);
    // Only a new save attempt should move the screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  // Ctrl/Cmd + S saves this page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (canEdit && dirty) void savePage(moduleId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canEdit, dirty, savePage, moduleId]);

  const resetSection = () => {
    const defaults = (defaultContent as unknown as Record<string, Record<string, unknown>>)[moduleId];
    for (const f of section.fields) update([moduleId, f.key], structuredClone(defaults[f.key]));
    setResetting(false);
  };

  return (
    <>
      <div className={cms.pageHead}>
        <div>
          <h1 className={cms.pageH1}>{title}</h1>
          {section.description ? <p className={cms.lead}>{section.description}</p> : null}
        </div>
      </div>

      <div className={cms.doc}>
        <div className={cms.docMain}>
          <div className={cms.tabs} role="tablist" aria-label={`${title} sections`}>
            {mod.sections.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === section.id}
                className={`${cms.tab} ${s.id === section.id ? cms.tabOn : ""}`}
                onClick={() => setTab(s.id)}
              >
                {s.title}
              </button>
            ))}
          </div>

          {!canEdit && storage !== "none" ? (
            <div className={cms.notice} role="note">
              <UiIcon name="info" />
              <span>Your role can read this page but not change it.</span>
            </div>
          ) : null}

          <fieldset className={cms.fieldset} disabled={!canEdit}>
            <FieldList fields={section.fields} path={[moduleId]} value={root} />
          </fieldset>
        </div>

        <aside className={cms.docAside} aria-label="Document actions">
          <p className={cms.asideTitle}>Actions</p>
          <span className={`${cms.state} ${dirty ? cms.stateDirty : ""}`} role="status" aria-live="polite">
            <span className={cms.stateDot} aria-hidden="true" />
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <div className={cms.asideActions}>
            <Button variant="primary" icon="save" busy={saving} disabled={!canEdit || !dirty} onClick={() => void savePage(moduleId)}>
              Save
            </Button>
            {dirty ? (
              <Button variant="ghost" onClick={() => setDiscarding(true)} disabled={!canEdit}>
                Discard changes
              </Button>
            ) : null}
            <Button variant="ghost" icon="reset" disabled={!canEdit} onClick={() => setResetting(true)}>
              Reset this tab
            </Button>
            {mod.route ? (
              <a className={cms.asideLink} href={mod.route} target="_blank" rel="noopener noreferrer">
                View page <UiIcon name="external" />
              </a>
            ) : null}
            {can("history", "read") ? (
              <Link className={cms.asideLink} href="/admin1/collections/versions">
                Versions
              </Link>
            ) : null}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={resetting}
        title={`Reset “${section.title}” on ${title}?`}
        body="This puts the original text and pictures back for this tab only. Nothing changes on the website until you save, and you can undo it from Versions."
        confirmLabel="Reset this tab"
        onCancel={() => setResetting(false)}
        onConfirm={resetSection}
      />
      <ConfirmDialog
        open={discarding}
        title="Discard your unsaved changes?"
        body={`Everything you changed on ${title} since the last save will be lost. The website is not affected.`}
        confirmLabel="Discard changes"
        onCancel={() => setDiscarding(false)}
        onConfirm={() => {
          discardPage(moduleId);
          setDiscarding(false);
        }}
      />
    </>
  );
}


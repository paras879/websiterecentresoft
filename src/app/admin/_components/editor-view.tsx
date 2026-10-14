"use client";

import { useState } from "react";
import { defaultContent, type SiteContent } from "@/content";
import type { ContentModule } from "@/content/fields";
import styles from "../admin.module.css";
import { FieldList } from "./fields";
import type { Path } from "./lib";
import { Button, ConfirmDialog, cx, UiIcon } from "./ui";

interface Props {
  mod: ContentModule;
  content: SiteContent;
  sectionId: string;
  onSection: (id: string) => void;
  onChange: (path: Path, value: unknown) => void;
}

/** One page of the website: a list of its sections on the left and the form for the chosen section. */
export function EditorView({ mod, content, sectionId, onSection, onChange }: Props) {
  const section = mod.sections.find((s) => s.id === sectionId) ?? mod.sections[0];
  const root = (content as unknown as Record<string, Record<string, unknown>>)[mod.id];
  const [resetting, setResetting] = useState(false);
  const index = mod.sections.indexOf(section);

  const reset = () => {
    const defaults = (defaultContent as unknown as Record<string, Record<string, unknown>>)[mod.id];
    for (const f of section.fields) onChange([mod.id, f.key], structuredClone(defaults[f.key]));
    setResetting(false);
  };

  return (
    <div className={styles.editor}>
      <nav className={styles.sectionNav} aria-label={`${mod.title} sections`}>
        <p className={styles.sectionNavTitle}>Sections</p>
        <ul>
          {mod.sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={cx(styles.sectionLink, s.id === section.id && styles.sectionLinkOn)}
                aria-current={s.id === section.id ? "true" : undefined}
                onClick={() => onSection(s.id)}
              >
                <span className={styles.sectionLinkNum}>{i + 1}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sectionSelectWrap}>
        <label htmlFor="section-select" className={styles.label}>
          Section
        </label>
        <select id="section-select" className={styles.input} value={section.id} onChange={(e) => onSection(e.target.value)}>
          {mod.sections.map((s, i) => (
            <option key={s.id} value={s.id}>
              {i + 1}. {s.title}
            </option>
          ))}
        </select>
      </div>

      <section className={styles.panel} aria-labelledby="section-heading">
        <header className={styles.formHead}>
          <div>
            <h2 id="section-heading" className={styles.panelTitle}>
              {section.title}
            </h2>
            {section.description ? <p className={styles.formLead}>{section.description}</p> : null}
          </div>
          <Button variant="ghost" icon="reset" onClick={() => setResetting(true)}>
            Reset section
          </Button>
        </header>

        <div className={styles.formBody}>
          <FieldList fields={section.fields} path={[mod.id]} value={root} />
        </div>

        <footer className={styles.formFoot}>
          <Button
            icon="chevronLeft"
            variant="ghost"
            disabled={index === 0}
            onClick={() => onSection(mod.sections[index - 1].id)}
          >
            Previous
          </Button>
          <span className={styles.formFootCount}>
            {index + 1} of {mod.sections.length}
          </span>
          <Button
            variant="ghost"
            disabled={index === mod.sections.length - 1}
            onClick={() => onSection(mod.sections[index + 1].id)}
          >
            Next
            <UiIcon name="chevronRight" />
          </Button>
        </footer>
      </section>

      <ConfirmDialog
        open={resetting}
        title={`Reset “${section.title}” on ${mod.title}?`}
        body="This puts the original text and pictures back for this section only. Nothing changes on the website until you save, and you can undo it from History."
        confirmLabel="Reset section"
        onCancel={() => setResetting(false)}
        onConfirm={reset}
      />
    </div>
  );
}

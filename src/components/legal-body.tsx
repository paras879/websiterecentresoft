import type { ReactNode } from "react";

type Styles = Record<string, string>;

const CLAUSE = /^(\([a-z0-9]{1,3}\))\s+([\s\S]+)$/i;

/** Turns the plain text of a legal section into paragraphs, notes, short lists and lettered clauses. */
export function LegalBody({ body, styles }: { body: string; styles: Styles }) {
  const parts = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const nodes: ReactNode[] = [];
  let chips: string[] = [];
  let clauses: { key: string; text: string }[] = [];

  const flush = (at: number) => {
    if (chips.length) {
      nodes.push(
        <ul key={`c${at}`} className={styles.chips}>
          {chips.map((c, i) => (
            <li key={`${c}-${i}`} className={styles.chip}>
              <span className={styles.chipLetter}>{String.fromCharCode(97 + i)}</span>
              {c}
            </li>
          ))}
        </ul>,
      );
      chips = [];
    }
    if (clauses.length) {
      nodes.push(
        <ol key={`k${at}`} className={styles.clauses}>
          {clauses.map((c) => (
            <li key={c.key + c.text.slice(0, 12)}>
              <span className={styles.clauseKey}>{c.key}</span>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>,
      );
      clauses = [];
    }
  };

  parts.forEach((part, i) => {
    if (part.startsWith("- ")) {
      if (clauses.length) flush(i);
      chips.push(part.slice(2));
      return;
    }
    const clause = part.match(CLAUSE);
    if (clause) {
      if (chips.length) flush(i);
      clauses.push({ key: clause[1], text: clause[2] });
      return;
    }
    flush(i);
    if (part.startsWith("## ")) {
      nodes.push(
        <h3 key={i} className={styles.sub}>
          {part.slice(3)}
        </h3>,
      );
    } else if (part.startsWith("> ")) {
      nodes.push(
        <p key={i} className={styles.note}>
          {part.slice(2)}
        </p>,
      );
    } else {
      nodes.push(<p key={i}>{part}</p>);
    }
  });
  flush(parts.length);

  return <>{nodes}</>;
}

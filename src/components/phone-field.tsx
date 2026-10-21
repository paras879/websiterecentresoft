"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_ISO, nationalNumberRange, type Country } from "@/lib/countries";
import styles from "./phone-field.module.css";

export interface PhoneValue {
  iso: string;
  number: string;
}

export const emptyPhone = (): PhoneValue => ({ iso: DEFAULT_COUNTRY_ISO, number: "" });

const byIso = (iso: string): Country => COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];

/** "+91 9876543210", or an empty string when no number was typed. */
export function composePhone(value: PhoneValue): string {
  const digits = value.number.replace(/\D/g, "");
  return digits ? `+${byIso(value.iso).dial} ${digits}` : "";
}

/** Returns an error message, or null when the number is fine (or empty and not required). */
export function validatePhone(value: PhoneValue, required: boolean): string | null {
  const digits = value.number.replace(/\D/g, "");
  if (!digits) return required ? "Please enter your mobile number." : null;
  const country = byIso(value.iso);
  const { min, max } = nationalNumberRange(country);
  if (digits.length < min || digits.length > max) {
    return min === max
      ? `A ${country.name} number has ${min} digits (without +${country.dial}).`
      : `Please enter a valid ${country.name} number (${min}–${max} digits, without +${country.dial}).`;
  }
  return null;
}

/** When someone pastes "+44 7700 900123", pick the country from the code and keep the rest as the number. */
function fromPaste(raw: string, current: string): PhoneValue | null {
  const text = raw.trim();
  if (!text.startsWith("+")) return null;
  const digits = text.replace(/\D/g, "");
  const match = COUNTRIES.filter((c) => digits.startsWith(c.dial)).sort((a, b) => b.dial.length - a.dial.length);
  if (match.length === 0) return null;
  const longest = match[0].dial.length;
  const candidates = match.filter((c) => c.dial.length === longest);
  const country = candidates.find((c) => c.iso === current) ?? candidates[0];
  return { iso: country.iso, number: digits.slice(country.dial.length) };
}

interface Props {
  id: string;
  value: PhoneValue;
  onChange: (next: PhoneValue) => void;
  /** Class of the form's text inputs, so both parts look like the rest of the form. */
  inputClass: string;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
}

export function PhoneField({ id, value, onChange, inputClass, invalid, describedBy, required }: Props) {
  const country = byIso(value.iso);
  const { max } = nationalNumberRange(country);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.dial.startsWith(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const row = listRef.current?.children[active] as HTMLElement | undefined;
    row?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (c: Country) => {
    onChange({ iso: c.iso, number: value.number.slice(0, nationalNumberRange(c).max) });
    setOpen(false);
    setQuery("");
    document.getElementById(id)?.focus();
  };

  const openList = () => {
    setQuery("");
    setActive(Math.max(0, COUNTRIES.findIndex((c) => c.iso === value.iso)));
    setOpen(true);
  };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={`${inputClass} ${styles.trigger}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Country code: ${country.name} +${country.dial}. Change`}
        onClick={() => (open ? setOpen(false) : openList())}
      >
        <span className={styles.iso}>{country.iso}</span>
        <span className={styles.dial}>+{country.dial}</span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      <input
        id={id}
        name={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        className={`${inputClass} ${styles.number}`}
        placeholder={country.iso === "IN" ? "98765 43210" : "Mobile number"}
        value={value.number}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => {
          const pasted = fromPaste(e.target.value, value.iso);
          if (pasted) {
            onChange(pasted);
            return;
          }
          onChange({ iso: value.iso, number: e.target.value.replace(/\D/g, "").slice(0, max) });
        }}
      />

      {open ? (
        <div className={styles.panel}>
          <input
            ref={searchRef}
            type="search"
            className={styles.search}
            placeholder="Search country or code"
            aria-label="Search country or code"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onSearchKey}
          />
          <ul className={styles.list} role="listbox" id={listId} ref={listRef} aria-label="Countries">
            {results.length === 0 ? <li className={styles.empty}>No country found</li> : null}
            {results.map((c, i) => (
              <li
                key={c.iso}
                role="option"
                aria-selected={c.iso === value.iso}
                className={`${styles.option} ${i === active ? styles.optionActive : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(c)}
              >
                <span className={styles.optName}>{c.name}</span>
                <span className={styles.optDial}>+{c.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

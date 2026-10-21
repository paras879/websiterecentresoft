"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./ai-assistant.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "recenturesoft-assistant";

const SUGGESTIONS = [
  "What services do you offer?",
  "What is your email and phone number?",
  "Where is your office?",
  "Are you hiring?",
  "I want a quote for my project",
];

const WELCOME =
  "Hello! I'm the Recenturesoft assistant. I can help with our services, careers, contact details and location. Feel free to ask in English or Hinglish.";

/** Turns links, emails, phone numbers and page paths in a reply into clickable text. */
const LINKS =
  /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+|\+\d[\d\s-]{8,}\d|(?<![\w/])\/(?:contact|careers|about|services\/[a-z-]+|privacy-policy|terms-and-conditions|sitemap)\b)/g;

/** A readable name for a long web address. */
function shortLink(url: string): string {
  if (/google\.[a-z.]+\/maps/i.test(url)) return "Open in Google Maps";
  if (/whatsapp\.com|wa\.me/i.test(url)) return "Chat on WhatsApp";
  const plain = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return plain.length > 42 ? `${plain.slice(0, 40)}...` : plain;
}

function linkify(text: string): React.ReactNode[] {
  return text.split(LINKS).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    let href = part;
    if (part.startsWith("/")) href = part;
    else if (part.includes("@") && !part.startsWith("http")) href = `mailto:${part}`;
    else if (part.startsWith("+")) href = `tel:${part.replace(/[^\d+]/g, "")}`;
    const external = href.startsWith("http");
    return (
      <a key={i} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {external ? shortLink(part) : part}
      </a>
    );
  });
}

function Reply({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {bullets.map((b, i) => (
            <li key={i}>{linkify(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  for (const line of lines) {
    const m = line.match(/^\s*(?:[-•*]\s+)(.*)$/);
    if (m) bullets.push(m[1]);
    else {
      flush();
      blocks.push(<p key={`p-${blocks.length}`}>{linkify(line.replace(/\*\*/g, ""))}</p>);
    }
  }
  flush();
  return <>{blocks}</>;
}

export function AiAssistant({ whatsappUrl }: { whatsappUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Keep the conversation while the tab is open.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setMessages(parsed.slice(-30));
      }
    } catch {
      /* storage can be blocked */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage can be blocked */
    }
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.replace(/\s+/g, " ").trim().slice(0, 500);
      if (!text || busy) return;
      const next: Message[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      setInput("");
      setBusy(true);
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next.slice(-8) }),
        });
        const data = (await res.json().catch(() => null)) as { success?: boolean; reply?: string; error?: string } | null;
        const reply =
          res.ok && data?.success && data.reply
            ? data.reply
            : data?.error || "Sorry, I could not answer just now. Please use our Contact form at /contact.";
        setMessages([...next, { role: "assistant", content: reply }]);
      } catch {
        setMessages([
          ...next,
          { role: "assistant", content: "I could not connect just now. Please try again, or use our Contact form at /contact." },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages],
  );

  if (pathname?.startsWith("/admin")) return null;

  const showSuggestions = messages.length === 0;

  return (
    <aside aria-label="Assistant">
      {open ? (
        <div className={styles.panel} role="dialog" aria-label="Chat with the Recenturesoft assistant" data-lenis-prevent>
          <header className={styles.head}>
            <span className={styles.headIcon} aria-hidden="true">
              <Sparkle />
            </span>
            <div className={styles.headText}>
              <strong>Recenturesoft Assistant</strong>
              <span>AI answers about our company</span>
            </div>
            <button
              type="button"
              className={styles.close}
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className={styles.list} ref={listRef} aria-live="polite">
            <div className={`${styles.bubble} ${styles.bot}`}>
              <p>{WELCOME}</p>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`${styles.bubble} ${m.role === "user" ? styles.me : styles.bot}`}>
                {m.role === "user" ? <p>{m.content}</p> : <Reply text={m.content} />}
              </div>
            ))}

            {busy ? (
              <div className={`${styles.bubble} ${styles.bot}`} aria-label="Typing">
                <span className={styles.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            ) : null}

            {showSuggestions ? (
              <div className={styles.chips}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className={styles.chip} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={1}
              maxLength={500}
              placeholder="Type your question..."
              aria-label="Your question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <button type="submit" className={styles.send} disabled={busy || !input.trim()} aria-label="Send">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <p className={styles.foot}>
            AI can make mistakes. For anything else, use our <a href="/contact">Contact form</a>
            {whatsappUrl ? (
              <>
                {" "}
                or{" "}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        aria-label={open ? "Close the assistant" : "Ask our AI assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className={styles.launcherIcon} aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <span className={styles.pulse} aria-hidden="true" />
            <Sparkle className={styles.launcherIcon} />
            <span className={styles.launcherLabel}>Ask AI</span>
          </>
        )}
      </button>
    </aside>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="currentColor" stroke="none" />
      <path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" fill="currentColor" stroke="none" />
    </svg>
  );
}

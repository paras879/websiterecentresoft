"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/content";
import type { SiteInfo } from "@/lib/site";
import { Icon, iconPaths, type IconName } from "@/app/services/icons";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import styles from "./site-header.module.css";

interface Props {
  site: SiteContent["site"];
  info: SiteInfo;
}

interface MenuEntry {
  title: string;
  desc: string;
  href: string;
  icon: string;
}

const isIcon = (name: string): name is IconName => name in iconPaths;

interface DropdownProps {
  /** Used for element ids, so each dropdown on the page has its own. */
  id: string;
  label: string;
  heading: string;
  entries: MenuEntry[];
  active: boolean;
  /** Few links: a narrower panel with one column. */
  compact?: boolean;
  header: SiteContent["site"]["header"];
  info: SiteInfo;
}

/** One hover-and-click dropdown with the list of links and the contact panel beside it. */
function NavDropdown({ id, label, heading, entries, active, compact, header, info }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Hover opens the menu for mouse users; a short delay on leave keeps it from flickering.
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearCloseTimer();
    setOpen(true);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => clearCloseTimer, []);

  // The panel sits centred under its link, like Services. Near the edge of the screen it slides back inside.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const el = menuRef.current;
      if (!el) return;
      el.style.setProperty("--dd-shift", "0px");
      const rect = el.getBoundingClientRect();
      const room = 16;
      const over = rect.right - (window.innerWidth - room);
      const under = room - rect.left;
      el.style.setProperty("--dd-shift", `${over > 0 ? -over : under > 0 ? under : 0}px`);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  // Close dropdown on outside click or Escape (returning focus to trigger)
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Close dropdown on route change without triggering cascading render effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div
      className={styles.dropdownContainer}
      ref={dropdownRef}
      onBlur={handleBlur}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-menu-button`}
        className={`${styles.dropdownTrigger} ${active ? styles.activeTrigger : ""}`}
        aria-expanded={open}
        aria-controls={`${id}-dropdown-menu`}
        onClick={(e) =>
          // A mouse click keeps the hover-opened menu open; keyboard and touch toggle it.
          open && (e.nativeEvent as PointerEvent).pointerType === "mouse" ? undefined : setOpen((prev) => !prev)
        }
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {label}
        <svg className={`${styles.caret} ${open ? styles.caretRotated : ""}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div id={`${id}-dropdown-menu`} ref={menuRef} className={`${styles.dropdownMenu} ${compact ? styles.dropdownMenuCompact : ""}`} aria-labelledby={`${id}-menu-button`}>
          <div className={styles.dropdownPanel}>
            <div className={styles.dropdownMain}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownHeaderTitle}>{heading}</span>
              </div>

              <div className={styles.dropdownItems}>
                {entries.map((entry) => {
                  const isCurrent = pathname === entry.href;
                  return (
                    <Link
                      key={`${entry.href}-${entry.title}`}
                      href={entry.href}
                      className={`${styles.dropdownItem} ${isCurrent ? styles.dropdownItemCurrent : ""}`}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.dropdownItemIconBox}>
                        {isIcon(entry.icon) ? <Icon name={entry.icon} className={styles.dropdownItemIcon} /> : null}
                      </span>
                      <span className={styles.dropdownItemContent}>
                        <span className={styles.dropdownItemTitle}>{entry.title}</span>
                        <span className={styles.dropdownItemDesc}>{entry.desc}</span>
                      </span>
                      <span className={styles.dropdownItemArrow} aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div
              className={styles.dropdownAside}
              style={header.asideImage ? ({ "--aside-img": `url("${encodeURI(header.asideImage)}")` } as React.CSSProperties) : undefined}
            >
              <span className={styles.asideKicker}>{header.asideKicker}</span>
              <p className={styles.asideTitle}>{header.asideTitle}</p>
              <p className={styles.asideText}>{header.asideText}</p>

              <ul className={styles.asideList}>
                <li>
                  <a href={`mailto:${info.contact.email}`} className={styles.asideRow}>
                    <span className={styles.asideIcon}>
                      <Icon name="mailIcon" />
                    </span>
                    {info.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${info.contact.phoneRaw}`} className={styles.asideRow}>
                    <span className={styles.asideIcon}>
                      <Icon name="phone" />
                    </span>
                    {info.contact.phone}
                  </a>
                </li>
                {info.contact.address ? (
                  <li>
                    <a href={info.contact.mapUrl} className={`${styles.asideRow} ${styles.asideAddress}`} target="_blank" rel="noopener noreferrer">
                      <span className={styles.asideIcon}>
                        <Icon name="pin" />
                      </span>
                      {info.contact.address}
                    </a>
                  </li>
                ) : null}
              </ul>
              <Link href={header.asideButtonHref || "/contact"} className={styles.asideBtn} onClick={() => setOpen(false)}>
                {header.asideButton} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ site, info }: Props) {
  const { header } = site;
  const pathname = usePathname();

  const hasAgenticMenu = header.menu.some((m) => m.href === "/services/agentic-ai");
  const menuEntries = hasAgenticMenu
    ? header.menu
    : [
      ...header.menu.slice(0, 1),
      {
        title: "Agentic AI",
        desc: "Autonomous enterprise agents, multi-agent swarms & MCP workflows",
        href: "/services/agentic-ai",
        icon: "assist",
      },
      ...header.menu.slice(1),
    ];

  // The Services dropdown is the first item flagged as a menu without its own list. Dropdowns made from the admin
  // panel carry their own list of links.
  const menuIndex = header.items.findIndex((item) => item.hasMenu && !(item as { entries?: MenuEntry[] }).entries);
  const isServicesActive =
    menuEntries.some((m) => pathname === m.href) || Boolean(pathname?.startsWith("/services"));

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.brand} aria-label={`${info.name} - A Hub of IT Services`}>
          <Image
            src="/images/recenturesoft-logo.png"
            alt={info.logoAlt}
            width={190}
            height={76}
            loading="eager"
            className={styles.brandLogoLight}
          />
          <Image
            src="/images/logo_white.PNG"
            alt="Recenturesoft"
            width={190}
            height={76}
            className={styles.brandLogoDark}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {header.items.map((item, index) => {
            const entries = (item as { entries?: MenuEntry[] }).entries;
            if (item.hasMenu && entries) {
              return (
                <NavDropdown
                  key={`${item.label}-${index}`}
                  id={`menu-${index}`}
                  label={item.label}
                  heading={item.label}
                  entries={entries}
                  active={entries.some((e) => pathname === e.href)}
                  compact={entries.length <= 4}
                  header={header}
                  info={info}
                />
              );
            }
            if (index !== menuIndex) {
              const current = pathname === item.href;
              return (
                <Link
                  key={`${item.label}-${index}`}
                  href={item.href}
                  className={`${styles.navLink} ${current ? styles.activeNavLink : ""}`}
                  aria-current={current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <NavDropdown
                key={`${item.label}-${index}`}
                id="services"
                label={item.label}
                heading={header.menuTitle}
                entries={menuEntries}
                active={isServicesActive}
                header={header}
                info={info}
              />
            );
          })}
        </nav>

        {/* Action / CTA + Mobile Menu */}
        <div className={styles.actions}>
          {info.contact.phoneRaw ? (
            <a href={`tel:${info.contact.phoneRaw}`} className={styles.callBtn} aria-label={`Call us on ${info.contact.phone}`}>
              <Icon name="phone" className={styles.callIcon} />
              <span className={styles.callText}>Call</span>
            </a>
          ) : null}
          <ThemeToggle />
          <Link href={header.ctaHref || "/contact"} className={`btn btn-primary ${styles.ctaBtn}`}>
            {header.ctaLabel}
          </Link>
          <MobileNavigation site={site} info={info} />
        </div>
      </div>
    </header>
  );
}

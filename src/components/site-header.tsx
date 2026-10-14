"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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

const isIcon = (name: string): name is IconName => name in iconPaths;

export function SiteHeader({ site, info }: Props) {
  const { header } = site;
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    setServicesOpen(true);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };

  useEffect(() => clearCloseTimer, []);

  const menuIndex = header.items.findIndex((item) => item.hasMenu);
  const isServicesActive =
    header.menu.some((m) => pathname === m.href) || Boolean(pathname?.startsWith("/services"));

  // Close dropdown on outside click or Escape (returning focus to trigger)
  useEffect(() => {
    if (!servicesOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [servicesOpen]);

  // Close dropdown on route change without triggering cascading render effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setServicesOpen(false);
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setServicesOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.brand} aria-label={`${info.name} Home`}>
          <span className={styles.brandMark} aria-hidden="true">
            {info.name.charAt(0).toUpperCase()}
          </span>
          <span className={styles.brandText}>
            {info.name}
            <span className={styles.brandAccent}>.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {header.items.map((item, index) => {
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
              <div
                key={`${item.label}-${index}`}
                className={styles.dropdownContainer}
                ref={dropdownRef}
                onBlur={handleBlur}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  id="services-menu-button"
                  className={`${styles.dropdownTrigger} ${
                    isServicesActive ? styles.activeTrigger : ""
                  }`}
                  aria-expanded={servicesOpen}
                  aria-controls="services-dropdown-menu"
                  onClick={(e) =>
                    // A mouse click keeps the hover-opened menu open; keyboard and touch toggle it.
                    servicesOpen && (e.nativeEvent as PointerEvent).pointerType === "mouse"
                      ? undefined
                      : setServicesOpen((prev) => !prev)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" && !servicesOpen) {
                      e.preventDefault();
                      setServicesOpen(true);
                    }
                  }}
                >
                  {item.label}
                  <svg
                    className={`${styles.caret} ${servicesOpen ? styles.caretRotated : ""}`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {servicesOpen && (
                  <div
                    id="services-dropdown-menu"
                    className={styles.dropdownMenu}
                    aria-labelledby="services-menu-button"
                  >
                    <div className={styles.dropdownPanel}>
                      <div className={styles.dropdownMain}>
                        <div className={styles.dropdownHeader}>
                          <span className={styles.dropdownHeaderTitle}>{header.menuTitle}</span>
                        </div>

                        <div className={styles.dropdownItems}>
                          {header.menu.map((entry) => {
                            const isCurrent = pathname === entry.href;
                            return (
                              <Link
                                key={`${entry.href}-${entry.title}`}
                                href={entry.href}
                                className={`${styles.dropdownItem} ${
                                  isCurrent ? styles.dropdownItemCurrent : ""
                                }`}
                                aria-current={isCurrent ? "page" : undefined}
                                onClick={() => setServicesOpen(false)}
                              >
                                <span className={styles.dropdownItemIconBox}>
                                  {isIcon(entry.icon) ? (
                                    <Icon name={entry.icon} className={styles.dropdownItemIcon} />
                                  ) : null}
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

                      <div className={styles.dropdownAside}>
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
                          {info.contact.shortLocation ? (
                            <li>
                              <span className={styles.asideRow}>
                                <span className={styles.asideIcon}>
                                  <Icon name="pin" />
                                </span>
                                {info.contact.shortLocation}
                              </span>
                            </li>
                          ) : null}
                        </ul>
                        <Link
                          href={header.asideButtonHref || "/contact"}
                          className={styles.asideBtn}
                          onClick={() => setServicesOpen(false)}
                        >
                          {header.asideButton} <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action / CTA + Mobile Menu */}
        <div className={styles.actions}>
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

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/content";
import type { SiteInfo } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import styles from "./mobile-navigation.module.css";

export function MobileNavigation({ site, info }: { site: SiteContent["site"]; info: SiteInfo }) {
  const { header } = site;
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Auto-close on route transition without triggering cascading render effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Handle ESC key, focus trap and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    closeBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      // Keyboard Focus Trap within modal panel
      if (event.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeMenu]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.mobileToggle}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        onClick={isOpen ? closeMenu : openMenu}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <div
        id="mobile-nav-panel"
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
        aria-label="Mobile Navigation"
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
      >
        <div className={styles.panelHeader}>
          <div className={styles.brand}>
            <Image
              src="/images/recenturesoft-logo.png"
              alt="Recenturesoft - A Hub of IT Services"
              width={150}
              height={50}
              className={styles.brandLogoLight}
            />
            <Image
              src="/images/logo_white.PNG"
              alt="Recenturesoft"
              width={150}
              height={50}
              className={styles.brandLogoDark}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ThemeToggle />
            <button
              ref={closeBtnRef}
              type="button"
              className={styles.closeButton}
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.navBody}>
          <nav className={styles.navList} aria-label="Mobile Navigation Menu">
            {header.items.map((item, index) => {
              if (!item.hasMenu) {
                const current = pathname === item.href;
                return (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className={`${styles.navLink} ${current ? styles.activeNavLink : ""}`}
                    aria-current={current ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={`${item.label}-${index}`} className={styles.servicesGroup}>
                  <div className={styles.groupLabel}>{item.label}</div>
                  {(header.menu.some((m) => m.href === "/services/agentic-ai")
                    ? header.menu
                    : [
                        ...header.menu.slice(0, 1),
                        {
                          title: "AI - Agentic",
                          desc: "Autonomous enterprise agents, multi-agent swarms & MCP workflows",
                          href: "/services/agentic-ai",
                          icon: "assist",
                        },
                        ...header.menu.slice(1),
                      ]
                  ).map((entry) => {
                    const current = pathname === entry.href;
                    return (
                      <Link
                        key={`${entry.href}-${entry.title}`}
                        href={entry.href}
                        className={`${styles.subNavLink} ${current ? styles.activeSubNavLink : ""}`}
                        aria-current={current ? "page" : undefined}
                        onClick={closeMenu}
                        prefetch={false}
                      >
                        {entry.title}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        <div className={styles.panelFooter}>
          <Link
            href={header.ctaHref || "/contact"}
            className={`btn btn-primary ${styles.ctaButton}`}
            onClick={closeMenu}
          >
            {header.ctaLabel}
          </Link>
          <div className={styles.quickContact}>
            <span>
              Direct:{" "}
              <a
                href={`tel:${info.contact.phoneRaw}`}
                className={styles.quickContactLink}
              >
                {info.contact.phone}
              </a>
            </span>
            <span>
              Email:{" "}
              <a
                href={`mailto:${info.contact.email}`}
                className={styles.quickContactLink}
              >
                {info.contact.email}
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

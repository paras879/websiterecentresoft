"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "./theme-toggle";
import styles from "./mobile-navigation.module.css";

export function MobileNavigation() {
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

      <nav
        id="mobile-nav-panel"
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
        aria-label="Mobile Navigation"
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
      >
        <div className={styles.panelHeader}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              R
            </span>
            <span className={styles.brandText}>
              {siteConfig.name}
              <span className={styles.brandAccent}>.</span>
            </span>
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
          <div className={styles.navList}>
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === "/" ? styles.activeNavLink : ""}`}
              aria-current={pathname === "/" ? "page" : undefined}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${styles.navLink} ${pathname === "/about" ? styles.activeNavLink : ""}`}
              aria-current={pathname === "/about" ? "page" : undefined}
              onClick={closeMenu}
            >
              About Us
            </Link>

            <div className={styles.servicesGroup}>
              <div className={styles.groupLabel}>Services</div>
              <Link
                href="/services/software-development"
                className={`${styles.subNavLink} ${
                  pathname === "/services/software-development" ? styles.activeSubNavLink : ""
                }`}
                aria-current={
                  pathname === "/services/software-development" ? "page" : undefined
                }
                onClick={closeMenu}
              >
                Software Development
              </Link>
              <Link
                href="/services/ai-automation"
                className={`${styles.subNavLink} ${
                  pathname === "/services/ai-automation" ? styles.activeSubNavLink : ""
                }`}
                aria-current={pathname === "/services/ai-automation" ? "page" : undefined}
                onClick={closeMenu}
              >
                AI Automation
              </Link>
              <Link
                href="/services/custom-development"
                className={`${styles.subNavLink} ${
                  pathname === "/services/custom-development" ? styles.activeSubNavLink : ""
                }`}
                aria-current={pathname === "/services/custom-development" ? "page" : undefined}
                onClick={closeMenu}
              >
                Custom Development
              </Link>
              <Link
                href="/services/seo"
                className={`${styles.subNavLink} ${
                  pathname === "/services/seo" ? styles.activeSubNavLink : ""
                }`}
                aria-current={pathname === "/services/seo" ? "page" : undefined}
                onClick={closeMenu}
              >
                SEO Services
              </Link>
            </div>

            <Link
              href="/contact"
              className={`${styles.navLink} ${pathname === "/contact" ? styles.activeNavLink : ""}`}
              aria-current={pathname === "/contact" ? "page" : undefined}
              onClick={closeMenu}
            >
              Contact Us
            </Link>

            <Link
              href="/careers"
              className={`${styles.navLink} ${pathname === "/careers" ? styles.activeNavLink : ""}`}
              aria-current={pathname === "/careers" ? "page" : undefined}
              onClick={closeMenu}
            >
              Careers
            </Link>
          </div>
        </div>

        <div className={styles.panelFooter}>
          <Link
            href="/contact"
            className={`btn btn-primary ${styles.ctaButton}`}
            onClick={closeMenu}
          >
            Get in Touch
          </Link>
          <div className={styles.quickContact}>
            <span>
              Direct:{" "}
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className={styles.quickContactLink}
              >
                {siteConfig.contact.phone}
              </a>
            </span>
            <span>
              Email:{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className={styles.quickContactLink}
              >
                {siteConfig.contact.email}
              </a>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

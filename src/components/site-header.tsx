"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import styles from "./site-header.module.css";

const serviceItems = [
  {
    title: "Software Development",
    desc: "Custom engineering, web platforms & cloud systems",
    href: "/services/software-development",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  },
  {
    title: "AI Automation",
    desc: "Intelligent enterprise process & workflow engineering",
    href: "/services/ai-automation",
    icon: "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  },
  {
    title: "Custom Development",
    desc: "Web apps, SaaS, APIs and enterprise software built for you",
    href: "/services/custom-development",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  },
  {
    title: "SEO Services",
    desc: "Technical, on-page and local SEO to grow organic traffic",
    href: "/services/seo",
    icon: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5",
  },
];

export function SiteHeader() {
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

  const isServicesActive = pathname?.startsWith("/services");

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
        <Link href="/" className={styles.brand} aria-label={`${siteConfig.name} Home`}>
          <span className={styles.brandMark} aria-hidden="true">
            R
          </span>
          <span className={styles.brandText}>
            {siteConfig.name}
            <span className={styles.brandAccent}>.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === "/" ? styles.activeNavLink : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${pathname === "/about" ? styles.activeNavLink : ""}`}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About Us
          </Link>

          {/* Services Dropdown */}
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
              Services
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
                    <span className={styles.dropdownHeaderTitle}>Our Services</span>
                  </div>

                  <div className={styles.dropdownItems}>
                    {serviceItems.map((item) => {
                      const isCurrent = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`${styles.dropdownItem} ${
                            isCurrent ? styles.dropdownItemCurrent : ""
                          }`}
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={() => setServicesOpen(false)}
                        >
                          <span className={styles.dropdownItemIconBox}>
                            <svg
                              className={styles.dropdownItemIcon}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d={item.icon} />
                            </svg>
                          </span>
                          <span className={styles.dropdownItemContent}>
                            <span className={styles.dropdownItemTitle}>{item.title}</span>
                            <span className={styles.dropdownItemDesc}>{item.desc}</span>
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
                    <span className={styles.asideKicker}>Let&apos;s talk</span>
                    <p className={styles.asideTitle}>Have a project in mind?</p>
                    <p className={styles.asideText}>
                      Tell us what you need and we&apos;ll help you scope it.
                    </p>

                    <ul className={styles.asideList}>
                      <li>
                        <a href={`mailto:${siteConfig.contact.email}`} className={styles.asideRow}>
                          <span className={styles.asideIcon}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
                            </svg>
                          </span>
                          {siteConfig.contact.email}
                        </a>
                      </li>
                      <li>
                        <a href={`tel:${siteConfig.contact.phoneRaw}`} className={styles.asideRow}>
                          <span className={styles.asideIcon}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                            </svg>
                          </span>
                          {siteConfig.contact.phone}
                        </a>
                      </li>
                      <li>
                        <span className={styles.asideRow}>
                          <span className={styles.asideIcon}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zM12 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                            </svg>
                          </span>
                          Sector 63, Noida
                        </span>
                      </li>
                    </ul>
                    <Link
                      href="/contact"
                      className={styles.asideBtn}
                      onClick={() => setServicesOpen(false)}
                    >
                      Discuss Your Project <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`${styles.navLink} ${pathname === "/contact" ? styles.activeNavLink : ""}`}
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact Us
          </Link>

          <Link
            href="/careers"
            className={`${styles.navLink} ${pathname === "/careers" ? styles.activeNavLink : ""}`}
            aria-current={pathname === "/careers" ? "page" : undefined}
          >
            Careers
          </Link>
        </nav>

        {/* Action / CTA + Mobile Menu */}
        <div className={styles.actions}>
          <ThemeToggle />
          <Link href="/contact" className={`btn btn-primary ${styles.ctaBtn}`}>
            Get in Touch
          </Link>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}

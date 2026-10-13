import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Icon, type IconName } from "../services/icons";
import styles from "../services/services.module.css";

export const metadata: Metadata = {
  title: "Sitemap | Recenturesoft Infotech",
  description:
    "Browse every page of the Recenturesoft Infotech website: company information, services, contact details and more.",
  alternates: {
    canonical: "/sitemap",
  },
  openGraph: {
    title: "Sitemap | Recenturesoft Infotech",
    description:
      "Browse every page of the Recenturesoft Infotech website: company information, services, contact details and more.",
    url: "https://www.recenturesoft.com/sitemap",
  },
};

type SiteLink = { label: string; desc: string; href: string; external?: boolean };

const groups: { icon: IconName; title: string; links: SiteLink[] }[] = [
  {
    icon: "enterprise",
    title: "Company",
    links: [
      { label: "Home", desc: "Overview of what we do", href: "/" },
      { label: "About Us", desc: "Who we are and how we work", href: "/about" },
      { label: "Contact Us", desc: "Talk to our team", href: "/contact" },
      { label: "Careers", desc: "Current openings and HR contact", href: "/contact#careers" },
    ],
  },
  {
    icon: "code",
    title: "Services",
    links: [
      { label: "All Services", desc: "Our services at a glance", href: "/services" },
      {
        label: "Software Development",
        desc: "Custom software and web applications",
        href: "/services/software-development",
      },
      {
        label: "AI Automation",
        desc: "AI-powered workflow automation",
        href: "/services/ai-automation",
      },
    ],
  },
  {
    icon: "handshake",
    title: "Connect",
    links: [
      {
        label: siteConfig.contact.email,
        desc: "Email us",
        href: `mailto:${siteConfig.contact.email}`,
        external: true,
      },
      {
        label: siteConfig.contact.phone,
        desc: "Call our team",
        href: `tel:${siteConfig.contact.phoneRaw}`,
        external: true,
      },
      {
        label: "WhatsApp",
        desc: "Send us a message",
        href: siteConfig.contact.whatsappUrl,
        external: true,
      },
    ],
  },
  {
    icon: "people",
    title: "Social",
    links: [
      {
        label: "LinkedIn",
        desc: "Company updates",
        href: "https://in.linkedin.com/company/recenturesoft",
        external: true,
      },
      {
        label: "X (Twitter)",
        desc: "@recenture_soft",
        href: "https://x.com/recenture_soft",
        external: true,
      },
      {
        label: "Facebook",
        desc: "Recenturesoft Infotech",
        href: "https://www.facebook.com/recenturesoftinfotech/",
        external: true,
      },
      {
        label: "YouTube",
        desc: "Our channel",
        href: "https://www.youtube.com/channel/UCwrJM7HFZGmke0jr8y4VYXg",
        external: true,
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="sitemap-heading">
        <div className="container">
          <div className={`${styles.heroCopy} ${styles.sitemapHero}`}>
            <h1 id="sitemap-heading" className={styles.heroTitle}>
              Sitemap
            </h1>
            <p className={styles.heroText}>
              Everything on the Recenturesoft website in one place. Pick a page below to jump
              straight to it.
            </p>
          </div>
        </div>
      </section>

      {/* Link groups */}
      <section className={styles.section} aria-label="Site pages">
        <div className="container">
          <div className={styles.sitemapGrid}>
            {groups.map((group) => (
              <article key={group.title} className={styles.tile}>
                <div className={styles.iconBadge}>
                  <Icon name={group.icon} className={styles.icon} />
                </div>
                <h2 className={styles.sitemapTitle}>{group.title}</h2>
                <ul className={styles.siteList}>
                  {group.links.map((link) => {
                    const content = (
                      <>
                        <span className={styles.siteLinkText}>
                          <span className={styles.siteLinkLabel}>{link.label}</span>
                          <span className={styles.siteLinkDesc}>{link.desc}</span>
                        </span>
                        <span className={styles.siteLinkArrow} aria-hidden="true">
                          &rarr;
                        </span>
                      </>
                    );
                    return (
                      <li key={link.label}>
                        {link.external ? (
                          <a
                            href={link.href}
                            className={styles.siteLink}
                            {...(link.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {content}
                          </a>
                        ) : (
                          <Link href={link.href} className={styles.siteLink}>
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBand} aria-labelledby="sitemap-cta-heading">
        <div className={`container ${styles.closeInner}`}>
          <h2 id="sitemap-cta-heading" className={styles.closeTitle}>
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className={styles.closeText}>
            Tell us what you need and our Noida team will point you in the right direction.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>
              Contact Us <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

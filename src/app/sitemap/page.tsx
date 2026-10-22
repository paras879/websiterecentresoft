import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../services/icons";
import styles from "../services/services.module.css";
import { RouteSchema } from "@/components/route-schema";

export async function generateMetadata(): Promise<Metadata> {
  const { sitemap } = await getSiteContent();
  return pageMetadata(sitemap.meta, "/sitemap");
}

type SiteLink = { label: string; desc: string; href: string; external?: boolean };

const isIcon = (name: string): name is IconName => name in iconPaths;

export default async function SitemapPage() {
  const content = await getSiteContent();
  const info = await getSiteInfo();
  const { hero, company, services, connect, social, cta } = content.sitemap;
  const { contact } = info;

  const groups: { icon: string; title: string; links: SiteLink[] }[] = [
    { icon: company.icon, title: company.title, links: company.links },
    { icon: services.icon, title: services.title, links: services.links },
    {
      icon: connect.icon,
      title: connect.title,
      links: [
        { label: contact.email, desc: connect.emailDesc, href: `mailto:${contact.email}`, external: true },
        { label: contact.phone, desc: connect.phoneDesc, href: `tel:${contact.phoneRaw}`, external: true },
        {
          label: connect.whatsappLabel,
          desc: connect.whatsappDesc,
          href: contact.whatsappUrl,
          external: true,
        },
      ].filter((link) => link.label),
    },
    {
      icon: social.icon,
      title: social.title,
      links: social.links.map((link) => ({ ...link, external: true })),
    },
  ].filter((g) => g.links.length > 0);

  return (
    <div className={styles.page}>
      <RouteSchema path="/sitemap" />
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="sitemap-heading">
        <div className="container">
          <div className={`${styles.heroCopy} ${styles.sitemapHero}`}>
            <h1 id="sitemap-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            {hero.text ? <p className={styles.heroText}>{hero.text}</p> : null}
          </div>
        </div>
      </section>

      {/* Link groups */}
      <section className={styles.section} aria-label="Site pages">
        <div className="container">
          <div className={styles.sitemapGrid}>
            {groups.map((group, groupIndex) => (
              <article key={`${group.title}-${groupIndex}`} className={styles.tile}>
                <div className={styles.iconBadge}>
                  {isIcon(group.icon) ? <Icon name={group.icon} className={styles.icon} /> : null}
                </div>
                <h2 className={styles.sitemapTitle}>{group.title}</h2>
                <ul className={styles.siteList}>
                  {group.links.map((link, index) => {
                    const body = (
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
                      <li key={`${link.label}-${index}`}>
                        {link.external ? (
                          <a
                            href={link.href}
                            className={styles.siteLink}
                            {...(link.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {body}
                          </a>
                        ) : (
                          <Link href={link.href} className={styles.siteLink}>
                            {body}
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
            {cta.title}
          </h2>
          {cta.text ? <p className={styles.closeText}>{cta.text}</p> : null}
          {cta.buttonLabel ? (
            <div className={styles.actions}>
              <Link href={cta.buttonHref || "/contact"} className={styles.btnPrimary}>
                {cta.buttonLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

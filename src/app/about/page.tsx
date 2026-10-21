import type { Metadata } from "next";
import { StickyFit } from "@/components/sticky-fit";
import { FaqSection } from "@/components/faq-section";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../services/icons";
import styles from "../services/services.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSiteContent();
  return pageMetadata(about.meta, "/about");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const { hero, pragmatic, principles, teams, cta } = content.about;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="about-intro-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="about-intro-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            {hero.text ? <p className={styles.heroText}>{hero.text}</p> : null}
            {hero.facts.length > 0 ? (
              <div className={styles.infoGrid}>
                {hero.facts.map((item, index) => (
                  <div key={`${item.label}-${index}`}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    <p className={styles.infoValue}>{item.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {hero.image ? (
            <div className={styles.photoFrame}>
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                width={1200}
                height={896}
                priority fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 560px"
                className={styles.photo}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Isolated overlap container for Pragmatic -> Principles only */}
      <div className={styles.overlapWrapper}>
        {/* Pragmatic engineering */}
        <section className={styles.pragSection} aria-labelledby="pragmatic-heading">
          <StickyFit />
          <div className={`container ${styles.pragLayout}`}>
            <header className={styles.pragIntro}>
              <span className={styles.pragBar} aria-hidden="true" />
              <h2 id="pragmatic-heading" className={styles.pragTitle}>
                {pragmatic.title}
                {pragmatic.highlight ? (
                  <>
                    {" "}
                    <span className={styles.pragGradient}>{pragmatic.highlight}</span>
                  </>
                ) : null}
              </h2>
              {pragmatic.lead ? <p className={styles.pragLead}>{pragmatic.lead}</p> : null}
              {pragmatic.linkLabel ? (
                <Link href={pragmatic.linkHref || "/contact"} className={styles.pragLink}>
                  {pragmatic.linkLabel} <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : null}
            </header>

            {pragmatic.items.length > 0 ? (
              <ol className={styles.pragList}>
                {pragmatic.items.map((item, index) => (
                  <li key={`${item.title}-${index}`} className={styles.pragRow}>
                    <span className={styles.pragNum} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.pragBody}>
                      <h3 className={styles.pragRowTitle}>{item.title}</h3>
                      <p className={styles.body}>{item.desc}</p>
                    </div>
                    <span className={styles.pragIcon} aria-hidden="true">
                      <Glyph name={item.icon} className={styles.icon} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>

        {/* Principles */}
        <section className={styles.prinSection} aria-labelledby="principles-heading">
          <div className="container">
            <header className={styles.prinHead}>
              <h2 id="principles-heading" className={styles.prinTitle}>
                {principles.title}
              </h2>
              {principles.lead ? <p className={styles.prinLead}>{principles.lead}</p> : null}
            </header>

            {principles.items.length > 0 ? (
              <div className={styles.prinPanel}>
                {principles.items.map((item, index) => (
                  <article key={`${item.title}-${index}`} className={styles.prinItem}>
                    <span className={styles.prinLabel}>
                      {String(index + 1).padStart(2, "0")}
                      {item.label ? ` / ${item.label}` : ""}
                    </span>
                    <div className={styles.prinIcon}>
                      <Glyph name={item.icon} className={styles.icon} />
                    </div>
                    <h3 className={styles.prinItemTitle}>{item.title}</h3>
                    <p className={styles.prinText}>{item.desc}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Development pods */}
      <section className={styles.section} aria-labelledby="pods-heading">
        <div className={`container ${styles.split}`}>
          {teams.image ? (
            <div className={styles.photoFrame}>
              <Image
                src={teams.image}
                alt={teams.imageAlt}
                width={1200}
                height={896}
                sizes="(max-width: 1024px) 100vw, 560px"
                className={styles.photo}
              />
            </div>
          ) : null}

          <div className={styles.splitCopy}>
            <h2 id="pods-heading" className={styles.h2}>
              {teams.title}
            </h2>
            {teams.lead ? <p className={styles.lead}>{teams.lead}</p> : null}
            {teams.points.length > 0 ? (
              <ul className={styles.checkItems}>
                {teams.points.map((point, index) => (
                  <li key={`${point.title}-${index}`}>
                    <Icon name="check" className={`${styles.icon} ${styles.smallCheck}`} />
                    <span>
                      <strong>{point.title}</strong> {point.desc}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <FaqSection title={content.about.faq.title} items={content.about.faq.items} />

      {/* CTA */}
      <section className={`${styles.ctaBand} ${styles.ctaAbout}`} aria-labelledby="about-cta-heading">
        <div className={`container ${styles.closeInner}`}>
          <h2 id="about-cta-heading" className={styles.closeTitle}>
            {cta.title}
          </h2>
          {cta.text ? <p className={styles.closeText}>{cta.text}</p> : null}
          <div className={styles.actions}>
            {cta.primaryLabel ? (
              <Link href={cta.primaryHref || "/contact"} className={styles.btnPrimary}>
                {cta.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : null}
            {cta.secondaryLabel ? (
              <Link href={cta.secondaryHref || "/"} className={styles.btnGhost}>
                {cta.secondaryLabel} <span aria-hidden="true">&rsaquo;</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

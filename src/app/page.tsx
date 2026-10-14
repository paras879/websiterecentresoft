import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "@/app/services/icons";
import styles from "./home.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getSiteContent();
  return pageMetadata(home.meta, "/");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

export default async function HomePage() {
  const { home } = await getSiteContent();
  const info = await getSiteInfo();
  const { hero, services, about, why, approach, cta } = home;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="hero-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.actions}>
              <Link href={hero.primaryHref || "/contact"} className={styles.btnPrimary}>
                {hero.primaryLabel}
              </Link>
              {hero.secondaryLabel ? (
                <Link href={hero.secondaryHref || "/"} className={styles.btnOutline}>
                  {hero.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>

          {hero.image ? (
            <div className={styles.photoFrame}>
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                width={1200}
                height={896}
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className={styles.photo}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Services */}
      <section className={styles.services} aria-labelledby="services-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="services-heading" className={styles.h2}>
              {services.title}
            </h2>
            <p className={styles.lead}>{services.lead}</p>
          </header>

          <div className={styles.svcGrid}>
            {services.items.map((service, index) => (
              <article key={`${service.title}-${index}`} className={styles.svcBox}>
                <span className={styles.svcNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.svcIcon}>
                  <Glyph name={service.icon} className={styles.icon} />
                </div>
                <h3 className={styles.svcTitle}>{service.title}</h3>
                <p className={styles.svcText}>{service.desc}</p>
                <ul className={styles.svcList}>
                  {service.points.map((item) => (
                    <li key={item}>
                      <span className={styles.svcCheck}>
                        <Icon name="check" className={styles.icon} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className={styles.svcLink}>
                  <span>
                    {services.linkPrefix} {service.title}
                  </span>
                  <span className={styles.svcArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className={styles.about} aria-labelledby="about-heading">
        <div className={`container ${styles.aboutLayout}`}>
          <div className={styles.aboutVisual}>
            <div className={styles.aboutImgWrap}>
              {about.image ? (
                <Image
                  src={about.image}
                  alt={about.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className={styles.aboutImg}
                />
              ) : null}
              <div className={styles.aboutShade} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.aboutCopy}>
            <h2 id="about-heading" className={styles.aboutTitle}>
              {about.title}
              {about.highlight ? (
                <>
                  {" "}
                  <span className={styles.gradText}>{about.highlight}</span>
                </>
              ) : null}
            </h2>
            <p className={styles.lead}>{about.lead1}</p>
            {about.lead2 ? <p className={styles.lead}>{about.lead2}</p> : null}

            <ul className={styles.aboutList}>
              {about.points.map((point) => (
                <li key={point.title} className={styles.aboutItem}>
                  <span className={styles.aboutItemIcon}>
                    <Glyph name={point.icon} className={styles.icon} />
                  </span>
                  <span className={styles.aboutItemText}>
                    <span className={styles.aboutItemTitle}>{point.title}</span>
                    <span className={styles.aboutItemDesc}>{point.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.aboutActions}>
              <Link href={about.primaryHref || "/about"} className={styles.btnPrimary}>
                {about.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
              {about.secondaryLabel ? (
                <Link href={about.secondaryHref || "/contact"} className={styles.textLink}>
                  {about.secondaryLabel} <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className={styles.tintBand} aria-labelledby="why-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="why-heading" className={styles.h2}>
              {why.title}
            </h2>
            <p className={styles.lead}>{why.lead}</p>
          </header>

          <div className={styles.reasonsGrid}>
            {why.items.map((reason, index) => (
              <article key={`${reason.title}-${index}`} className={styles.reason}>
                <span className={styles.reasonNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.reasonIcon}>
                  <Glyph name={reason.icon} className={styles.icon} />
                </div>
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p className={styles.reasonText}>{reason.desc}</p>
                {reason.chips.length > 0 ? (
                  <ul className={styles.reasonChips} aria-label="Key points">
                    {reason.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className={styles.approach} aria-labelledby="approach-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="approach-heading" className={styles.h2}>
              {approach.title}
            </h2>
            <p className={styles.lead}>{approach.lead}</p>
          </header>

          <ol className={styles.stages}>
            {approach.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className={styles.stage}>
                <div className={styles.stageTrack} aria-hidden="true">
                  <span className={styles.stageNode}>
                    <Glyph name={item.icon} className={styles.icon} />
                  </span>
                </div>
                <div className={styles.stageBody}>
                  <span className={styles.stageLabel}>
                    {approach.stepWord} {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.stageTitle}>{item.title}</h3>
                  <p className={styles.stageText}>{item.desc}</p>
                  {item.outcome ? (
                    <p className={styles.stageOutcome}>
                      <Icon name="check" className={styles.stageCheck} />
                      <span>
                        <span className={styles.stageOutcomeLabel}>{approach.outcomeLabel}</span>
                        {item.outcome}
                      </span>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          {approach.buttonLabel ? (
            <div className={styles.approachCta}>
              <Link href={approach.buttonHref || "/contact"} className={styles.btnPrimary}>
                {approach.buttonLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Contact CTA */}
      <section className={styles.contactBand} aria-labelledby="contact-heading">
        <div className={`container ${styles.contactInner}`}>
          <h2 id="contact-heading" className={styles.contactTitle}>
            {cta.title}
          </h2>
          <p className={styles.contactText}>{cta.text}</p>
          <div className={styles.actions}>
            <Link href={cta.primaryHref || "/contact"} className={styles.btnPrimary}>
              {cta.primaryLabel}
            </Link>
            {cta.showEmail ? (
              <a href={`mailto:${info.contact.email}`} className={styles.btnGhost}>
                {info.contact.email}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

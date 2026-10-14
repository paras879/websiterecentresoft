import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../icons";
import styles from "./ai-automation.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { serviceAi } = await getSiteContent();
  return pageMetadata(serviceAi.meta, "/services/ai-automation");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

export default async function AIAutomationPage() {
  const { serviceAi: c } = await getSiteContent();
  const info = await getSiteInfo();
  const { hero, practical, process, cta } = c;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="ai-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="ai-hero-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.actions}>
              {hero.primaryLabel ? (
                <Link href={hero.primaryHref || "/contact"} className={styles.btnPrimary}>
                  <span>{hero.primaryLabel}</span>
                  <Icon name="arrowRight" className={`${styles.icon} ${styles.btnIcon}`} />
                </Link>
              ) : null}
              {hero.secondaryLabel ? (
                <a href="#practical" className={styles.btnOutline}>
                  <span>{hero.secondaryLabel}</span>
                  <Icon name="tune" className={`${styles.icon} ${styles.btnIcon}`} />
                </a>
              ) : null}
            </div>
          </div>

          {hero.image ? (
            <div className={styles.photoFrame}>
              <div className={styles.photoWrap}>
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 600px"
                  className={styles.photo}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Practical AI */}
      {practical.items.length > 0 ? (
        <section id="practical" className={styles.prac} aria-labelledby="practical-heading">
          <div className="container">
            <div className={styles.pracHead}>
              <h2 id="practical-heading" className={styles.pracTitle}>
                {practical.title}
                {practical.highlight ? (
                  <>
                    {" "}
                    <span className={styles.pracGradient}>{practical.highlight}</span>
                  </>
                ) : null}
              </h2>
              {practical.lead ? <p className={styles.pracLead}>{practical.lead}</p> : null}
            </div>

            <div className={styles.pracGrid}>
              {practical.items.map((pillar, index) => (
                <article key={`${pillar.title}-${index}`} className={styles.pracItem}>
                  {pillar.flow.length > 0 ? (
                    <div
                      className={styles.flow}
                      aria-label={`${practical.flowLabel || "Flow"}: ${pillar.flow.join(", ")}`}
                    >
                      {pillar.flow.map((step, i) => (
                        <span key={`${step}-${i}`} className={styles.flowGroup}>
                          <span className={styles.flowStep}>{step}</span>
                          {i < pillar.flow.length - 1 && (
                            <span className={styles.flowLink} aria-hidden="true" />
                          )}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className={styles.pracBody}>
                    <div className={styles.pracIcon}>
                      <Glyph name={pillar.icon} className={styles.icon} />
                    </div>
                    <h3 className={styles.pracItemTitle}>{pillar.title}</h3>
                    <p className={styles.body}>{pillar.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Implementation */}
      {process.items.length > 0 ? (
        <section className={styles.impl} aria-labelledby="process-heading">
          <div className="container">
            <div className={styles.implHead}>
              <h2 id="process-heading" className={styles.implTitle}>
                {process.title}
                {process.highlight ? (
                  <>
                    {" "}
                    <span className={styles.pracGradient}>{process.highlight}</span>
                  </>
                ) : null}
              </h2>
              {process.lead ? <p className={styles.implLead}>{process.lead}</p> : null}
            </div>

            <ol className={styles.implList}>
              {process.items.map((item, index) => (
                <li key={`${item.title}-${index}`} className={styles.implItem}>
                  <div
                    className={styles.ring}
                    style={
                      { "--p": `${((index + 1) / process.items.length) * 100}%` } as React.CSSProperties
                    }
                  >
                    <span className={styles.ringInner}>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className={styles.implItemTitle}>{item.title}</h3>
                  <p className={styles.implText}>{item.desc}</p>
                  <span className={styles.implTag}>
                    {process.phaseWord} {index + 1} {process.ofWord} {process.items.length}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className={styles.cta} aria-labelledby="ai-cta-heading">
        <div className="container">
          <div className={styles.closeInner}>
            <h2 id="ai-cta-heading" className={styles.closeTitle}>
              {cta.title}
            </h2>
            {cta.text ? <p className={styles.closeText}>{cta.text}</p> : null}
            <div className={styles.closeActions}>
              {cta.primaryLabel ? (
                <Link href={cta.primaryHref || "/contact"} className={styles.btnPrimary}>
                  <span>{cta.primaryLabel}</span>
                  <Icon name="arrowRight" className={`${styles.icon} ${styles.btnIcon}`} />
                </Link>
              ) : null}
              {cta.showPhone && info.contact.phone ? (
                <a href={`tel:${info.contact.phoneRaw}`} className={styles.btnGhost}>
                  <Icon name="phone" className={`${styles.icon} ${styles.btnIcon}`} />
                  <span>{info.contact.phone}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

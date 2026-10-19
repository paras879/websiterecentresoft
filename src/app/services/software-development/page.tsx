import type { Metadata } from "next";
import { FaqSection } from "@/components/faq-section";
import Image from "next/image";
import Link from "next/link";
import { ApproachExplorer } from "@/components/approach-explorer";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../icons";
import styles from "../services.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { serviceSoftware } = await getSiteContent();
  return pageMetadata(serviceSoftware.meta, "/services/software-development");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

export default async function SoftwareDevelopmentPage() {
  const { serviceSoftware: c } = await getSiteContent();
  const { hero, capabilities, approach, principles, hub, cta } = c;

  const steps = approach.items.map((item, index) => ({
    step: String(index + 1).padStart(2, "0"),
    title: item.title,
    desc: item.desc,
    icon: (isIcon(item.icon) ? item.icon : "check") as IconName,
    image: item.image,
    alt: item.alt,
  }));

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="software-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="software-hero-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.actions}>
              {hero.primaryLabel ? (
                <Link href={hero.primaryHref || "/contact"} className={styles.btnPrimary}>
                  {hero.primaryLabel}
                </Link>
              ) : null}
              {hero.secondaryLabel ? (
                <a href="#approach" className={styles.btnOutline}>
                  {hero.secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>

          {hero.image ? (
            <div className={styles.photoFrame}>
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                width={1376}
                height={768}
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className={styles.photo}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Capabilities */}
      {capabilities.items.length > 0 ? (
        <section className={styles.capSection} aria-labelledby="capabilities-heading">
          <div className="container">
            <header className={styles.capHead}>
              <h2 id="capabilities-heading" className={styles.capTitle}>
                {capabilities.title}
                {capabilities.highlight ? (
                  <>
                    {" "}
                    <span className={styles.capGradient}>{capabilities.highlight}</span>
                  </>
                ) : null}
              </h2>
              {capabilities.lead ? <p className={styles.capLead}>{capabilities.lead}</p> : null}
            </header>

            <div className={styles.capGrid}>
              {capabilities.items.map((item, index) => (
                <article key={`${item.title}-${index}`} className={styles.capBox}>
                  <Glyph name={item.icon} className={styles.capMark} />
                  <div className={styles.capIcon}>
                    <Glyph name={item.icon} className={styles.icon} />
                  </div>
                  <div className={styles.capBody}>
                    <h3 className={styles.capBoxTitle}>{item.title}</h3>
                    <p className={styles.body}>{item.desc}</p>
                    {item.chips.length > 0 ? (
                      <ul className={styles.capChips} aria-label={capabilities.chipsLabel}>
                        {item.chips.map((chip, i) => (
                          <li key={`${chip}-${i}`}>{chip}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Approach */}
      {steps.length > 0 ? (
        <section id="approach" className={styles.tlSection} aria-labelledby="approach-heading">
          <div className="container">
            <header className={styles.tlHead}>
              <h2 id="approach-heading" className={styles.tlTitle}>
                {approach.title}
              </h2>
              {approach.lead ? <p className={styles.tlLead}>{approach.lead}</p> : null}
            </header>

            <ApproachExplorer steps={steps} />
          </div>
        </section>
      ) : null}

      {/* Principles */}
      {principles.items.length > 0 ? (
        <section className={styles.kpSection} aria-labelledby="principles-heading">
          <div className="container">
            <header className={styles.kpHead}>
              <h2 id="principles-heading" className={styles.kpTitle}>
                {principles.title}
                {principles.highlight ? (
                  <>
                    {" "}
                    <span className={styles.kpGradient}>{principles.highlight}</span>
                  </>
                ) : null}
              </h2>
              {principles.lead ? <p className={styles.kpLead}>{principles.lead}</p> : null}
            </header>

            <div className={styles.kpRow}>
              {principles.items.map((item, index) => (
                <article key={`${item.title}-${index}`} className={styles.kpPanel} tabIndex={0}>
                  <div className={styles.kpImg} aria-hidden="true">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.alt || item.title}
                        fill
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 900px) 100vw, 420px"
                        className={styles.kpImgEl}
                      />
                    ) : null}
                  </div>
                  <span className={styles.kpNum} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.kpIcon}>
                    <Glyph name={item.icon} className={styles.icon} />
                  </span>
                  <h3 className={styles.kpPanelTitle}>{item.title}</h3>
                  <p className={styles.kpPanelText}>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Noida hub */}
      <section className={styles.section} aria-labelledby="hub-heading">
        <div className={`container ${styles.split} ${styles.splitReverse}`}>
          <div className={styles.splitCopy}>
            <h2 id="hub-heading" className={styles.h2}>
              {hub.title}
            </h2>
            {hub.lead ? <p className={styles.lead}>{hub.lead}</p> : null}
            {hub.cards.length > 0 ? (
              <div className={styles.miniGrid}>
                {hub.cards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className={styles.mini}>
                    <h3 className={styles.h3}>{card.title}</h3>
                    <p className={styles.body}>{card.desc}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {hub.image ? (
            <div className={styles.photoFrame}>
              <Image
                src={hub.image}
                alt={hub.imageAlt}
                width={1200}
                height={896}
                sizes="(max-width: 1024px) 100vw, 560px"
                className={styles.photo}
              />
            </div>
          ) : null}
        </div>
      </section>

      <FaqSection title={c.faq.title} items={c.faq.items} />

      {/* CTA */}
      <section className={`${styles.ctaBand} ${styles.ctaSoft}`} aria-labelledby="software-cta-heading">
        <div className={`container ${styles.closeInner}`}>
          <h2 id="software-cta-heading" className={styles.closeTitle}>
            {cta.title}
          </h2>
          {cta.text ? <p className={styles.closeText}>{cta.text}</p> : null}
          {cta.primaryLabel ? (
            <div className={styles.actions}>
              <Link href={cta.primaryHref || "/contact"} className={styles.btnPrimary}>
                {cta.primaryLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { SeoFaq } from "@/components/seo-faq";
import { SeoServicesExplorer } from "@/components/seo-services-explorer";
import styles from "../services.module.css";
import seo from "./seo.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { serviceSeo } = await getSiteContent();
  return pageMetadata(serviceSeo.meta, "/services/seo");
}

export default async function SeoServicesPage() {
  const content = await getSiteContent();
  const info = await getSiteInfo();
  const { hero, services, phases, why, faq, cta } = content.serviceSeo;
  const { contact } = info;

  const serviceItems = services.items.filter((item) => item.image);
  const faqItems = faq.items.filter((item) => item.q);

  // Chart geometry: the line climbs from bottom-left to top-right and passes through each phase node.
  const count = phases.items.length;
  const nodePoints = phases.items.map((_, index) => {
    const x = ((index + 0.5) / count) * 1000;
    const y = count > 1 ? 175 - index * (150 / (count - 1)) : 100;
    return { x, y };
  });
  const linePath = ["M0 200", ...nodePoints.map((p) => `L${p.x} ${p.y}`), "L1000 0"].join(" ");
  const areaPath = `${linePath} L1000 220 L0 220 Z`;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="seo-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="seo-hero-heading" className={`${styles.heroTitle} ${seo.heroTitle}`}>
              {hero.title}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.actions}>
              <Link href={hero.primaryHref || "/contact"} className={styles.btnPrimary}>
                {hero.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
              {hero.secondaryLabel ? (
                <a href={hero.secondaryHref || "#seo-services"} className={styles.btnOutline}>
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

      {/* Services: colour-field mosaic */}
      {serviceItems.length > 0 ? (
        <section id="seo-services" className={seo.services} aria-labelledby="seo-services-heading">
          <div className="container">
            <h2 id="seo-services-heading" className={seo.bigTitle}>
              {services.title}
            </h2>

            <SeoServicesExplorer services={serviceItems} linkPrefix={services.linkPrefix} />
          </div>
        </section>
      ) : null}

      {/* Framework: ascending steps */}
      {count > 0 ? (
        <section className={seo.climb} aria-labelledby="seo-framework-heading">
          <div className="container">
            <h2 id="seo-framework-heading" className={seo.bigTitle}>
              {phases.title}
            </h2>

            <div className={seo.climbWrap}>
              <div className={seo.chart} aria-hidden="true">
                <svg className={seo.chartSvg} viewBox="0 0 1000 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="seoArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className={seo.chartArea} d={areaPath} />
                  <path className={seo.chartLine} d={linePath} />
                </svg>
                {phases.items.map((phase, index) => (
                  <span
                    key={`${phase.title}-${index}`}
                    className={seo.node}
                    style={{
                      left: `${((index + 0.5) / count) * 100}%`,
                      top: `${(nodePoints[index].y / 220) * 100}%`,
                    }}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              <ol className={seo.stairs}>
                {phases.items.map((phase, index) => (
                  <li key={`${phase.title}-${index}`} className={seo.stair}>
                    <span className={seo.stairPhase}>
                      {phases.phaseWord} {index + 1}
                    </span>
                    <h3 className={seo.stairTitle}>{phase.title}</h3>
                    <p className={seo.stairText}>{phase.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* Why: dark band with photo bleeding to the edge */}
      <section className={seo.why} aria-labelledby="seo-why-heading">
        <div className={seo.whyInner}>
          <div className={seo.whyCopy}>
            <h2 id="seo-why-heading" className={seo.whyTitle}>
              {why.title}
            </h2>
            <dl className={seo.reasons}>
              {why.items.map((item, index) => (
                <div key={`${item.lead}-${index}`} className={seo.reason}>
                  <dt className={seo.reasonLead}>{item.lead}</dt>
                  <dd className={seo.reasonText}>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          {why.image ? (
            <div className={seo.whyPhoto}>
              <Image
                src={why.image === "/images/seo-dashboard.jpg" ? "/images/seo-team.webp" : why.image}
                alt={why.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className={seo.whyImg}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* FAQ */}
      <section className={seo.faq} aria-labelledby="seo-faq-heading">
        <div className={`container ${seo.faqGrid}`}>
          <div className={seo.faqIntro}>
            <div className={seo.faqIntroText}>
              <h2 id="seo-faq-heading" className={seo.bigTitle}>
                {faq.title}
              </h2>
              <p className={seo.faqLead}>
                {faq.leadText}{" "}
                <a href={`mailto:${contact.email}`} className={seo.faqLink}>
                  {contact.email}
                </a>
                .
              </p>
            </div>
            <div className={seo.faqCard}>
              <p className={seo.faqCardTitle}>{faq.cardTitle}</p>
              <p className={seo.faqCardText}>{faq.cardText}</p>
              {faq.cardButtonLabel ? (
                <Link href={faq.cardButtonHref || "/contact"} className={seo.faqCardBtn}>
                  {faq.cardButtonLabel} <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : null}
            </div>
          </div>

          {faqItems.length > 0 ? <SeoFaq items={faqItems} /> : null}
        </div>
      </section>

      {/* CTA */}
      <section className={seo.cta} aria-labelledby="seo-cta-heading">
        <span className={seo.ctaRingA} aria-hidden="true" />
        <span className={seo.ctaRingB} aria-hidden="true" />
        <span className={seo.ctaBars} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>

        <div className={`container ${seo.ctaInner}`}>
          <h2 id="seo-cta-heading" className={seo.ctaTitle}>
            {cta.title}
          </h2>
          <div className={seo.ctaSide}>
            <p className={seo.ctaText}>{cta.text}</p>
            <div className={seo.ctaActions}>
              {cta.buttonLabel ? (
                <Link href={cta.buttonHref || "/contact"} className={seo.ctaBtn}>
                  {cta.buttonLabel} <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : null}
              <a href={`tel:${contact.phoneRaw}`} className={seo.ctaBtnGhost}>
                {cta.callLabel} {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

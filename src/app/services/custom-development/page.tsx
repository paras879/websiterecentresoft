import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../icons";
import { BuildShowcase } from "@/components/build-showcase";
import { ProcessJourney } from "@/components/process-journey";
import { TechWall } from "@/components/tech-wall";
import styles from "../services.module.css";
import cd from "./custom.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { serviceCustom } = await getSiteContent();
  return pageMetadata(serviceCustom.meta, "/services/custom-development");
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const NEUTRAL_COLOR = "#475569";
const FALLBACK_ICON: IconName = "check";

const toIcon = (name: string): IconName => (name in iconPaths ? (name as IconName) : FALLBACK_ICON);

export default async function CustomDevelopmentPage() {
  const content = await getSiteContent();
  const info = await getSiteInfo();
  const { hero, build, tech, process: journey, why, experience, cta } = content.serviceCustom;
  const { contact } = info;

  const builds = build.items.map((item) => ({
    icon: toIcon(item.icon),
    title: item.title,
    desc: item.desc,
    image: item.image,
    alt: item.alt,
    tags: item.tags,
  }));
  const buildItems = builds.filter((item) => item.image);

  const groups = tech.groups
    .filter((g) => g.items.length > 0)
    .map((g) => ({
      group: g.name,
      items: g.items.map((item) => ({
        name: item.name,
        role: item.role,
        use: item.use,
        logo: item.logo || undefined,
        color: HEX_COLOR.test(item.color) ? item.color : NEUTRAL_COLOR,
      })),
    }));

  const steps = journey.items.map((item) => ({
    title: item.title,
    desc: item.desc,
    gets: item.gets,
    icon: toIcon(item.icon),
  }));

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="cd-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="cd-hero-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.actions}>
              <Link href={hero.primaryHref || "/contact"} className={styles.btnPrimary}>
                {hero.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
              {hero.secondaryLabel ? (
                <a href={hero.secondaryHref || "#cd-build"} className={styles.btnOutline}>
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

      {/* What we build: image follows the cards */}
      {buildItems.length > 0 ? (
        <section id="cd-build" className={cd.build} aria-labelledby="cd-build-heading">
          <div className="container">
            <BuildShowcase
              items={buildItems}
              intro={
                <>
                  <h2 id="cd-build-heading" className={cd.bigTitle}>
                    {build.title}
                  </h2>
                  {build.lead ? <p className={cd.lead}>{build.lead}</p> : null}
                </>
              }
            />
          </div>
        </section>
      ) : null}

      {/* Technology: interactive wall */}
      {groups.length > 0 ? (
        <section className={cd.tech} aria-labelledby="cd-tech-heading">
          <div className="container">
            <h2 id="cd-tech-heading" className={cd.bigTitleLight}>
              {tech.title}
            </h2>
            {tech.lead ? <p className={cd.techLead}>{tech.lead}</p> : null}

            <TechWall groups={groups} />
          </div>
        </section>
      ) : null}

      {/* Process: scroll journey */}
      {steps.length > 0 ? (
        <section className={cd.process} aria-labelledby="cd-process-heading">
          <div className="container">
            <h2 id="cd-process-heading" className={cd.bigTitle}>
              {journey.title}
            </h2>
            <ProcessJourney
              steps={steps}
              sideLead={journey.sideLead}
              stepWord={journey.stepWord}
              getsLabel={journey.getsLabel}
            />
          </div>
        </section>
      ) : null}

      {/* Why: promise sheet */}
      <section className={cd.pledge} aria-labelledby="cd-why-heading">
        <div className="container">
          <div className={cd.plSheet}>
            <div className={cd.plRail}>
              {why.image ? (
                <Image
                  src={why.image}
                  alt={why.imageAlt}
                  fill
                  sizes="(max-width: 1000px) 100vw, 420px"
                  className={cd.plPhoto}
                />
              ) : null}
              <span className={cd.plShade} aria-hidden="true" />
              <span className={cd.plMark} aria-hidden="true">
                R
              </span>
              <h2 id="cd-why-heading" className={cd.plHead}>
                {why.title}
              </h2>
              {why.lead ? <p className={cd.plLead}>{why.lead}</p> : null}
            </div>

            <ul className={cd.plList}>
              {why.items.map((item, index) => (
                <li key={`${item.title}-${index}`} className={cd.plRow}>
                  <span className={cd.plCheck} aria-hidden="true">
                    <Icon name="check" className={cd.plCheckSvg} />
                  </span>
                  <div className={cd.plBody}>
                    <h3 className={cd.plTitle}>{item.title}</h3>
                    <p className={cd.plText}>{item.desc}</p>
                    {item.means ? (
                      <p className={cd.plMeans}>
                        {why.forYouLabel ? <span className={cd.plMeansLabel}>{why.forYouLabel}</span> : null}
                        {item.means}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className={cd.exp} aria-labelledby="cd-exp-heading">
        <div className="container">
          <div className={cd.expBanner}>
            {experience.image ? (
              <Image
                src={experience.image}
                alt={experience.imageAlt}
                fill
                sizes="(max-width: 1000px) 100vw, 1200px"
                className={cd.expBannerImg}
              />
            ) : null}
            <div className={cd.expShade} aria-hidden="true" />
            <div className={cd.expBannerText}>
              <h2 id="cd-exp-heading" className={cd.expHeading}>
                {experience.title}
              </h2>
              {experience.lead ? <p className={cd.expLead}>{experience.lead}</p> : null}
            </div>
          </div>

          {experience.items.length > 0 ? (
            <ul className={cd.xpList}>
              {experience.items.map((item, index) => (
                <li key={`${item.title}-${index}`} className={cd.xpItem}>
                  <span className={cd.xpNum} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={cd.xpIcon}>
                    <Icon name={toIcon(item.icon)} className={cd.icon} />
                  </span>
                  <h3 className={cd.xpTitle}>{item.title}</h3>
                  <p className={cd.xpText}>{item.desc}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* CTA */}
      <section className={cd.fin} aria-labelledby="cd-cta-heading">
        <div className={`container ${cd.finGrid}`}>
          <div className={cd.finCopy}>
            <h2 id="cd-cta-heading" className={cd.finTitle}>
              {cta.title}
            </h2>
            <p className={cd.finText}>{cta.text}</p>
            {cta.buttonLabel ? (
              <Link href={cta.buttonHref || "/contact"} className={cd.finBtn}>
                {cta.buttonLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : null}
          </div>

          <div className={cd.finPanel}>
            <p className={cd.finPanelTitle}>{cta.panelTitle}</p>
            <a href={`mailto:${contact.email}`} className={cd.finRow}>
              <span className={cd.finIcon}>
                <Icon name="mailIcon" className={cd.icon} />
              </span>
              <span>
                <span className={cd.finLabel}>{cta.emailLabel}</span>
                <span className={cd.finValue}>{contact.email}</span>
              </span>
            </a>
            <a href={`tel:${contact.phoneRaw}`} className={cd.finRow}>
              <span className={cd.finIcon}>
                <Icon name="phone" className={cd.icon} />
              </span>
              <span>
                <span className={cd.finLabel}>{cta.phoneLabel}</span>
                <span className={cd.finValue}>{contact.phone}</span>
              </span>
            </a>
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className={cd.finRow}>
              <span className={cd.finIcon}>
                <Icon name="chat" className={cd.icon} />
              </span>
              <span>
                <span className={cd.finLabel}>{cta.whatsappLabel}</span>
                <span className={cd.finValue}>{cta.whatsappText}</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

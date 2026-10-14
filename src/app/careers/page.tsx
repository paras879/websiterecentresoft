import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../services/icons";
import { CareerForm } from "@/components/career-form";
import { CareerPerks, type Perk } from "@/components/career-perks";
import styles from "../services/services.module.css";
import cr from "./careers.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { careers } = await getSiteContent();
  return pageMetadata(careers.meta, "/careers");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

export default async function CareersPage() {
  const { careers } = await getSiteContent();
  const info = await getSiteInfo();
  const contact = info.contact;
  const { hero, why, areas, openingsBlock, apply, form, closing } = careers;

  const perks: Perk[] = why.items
    .filter((item) => isIcon(item.icon))
    .map((item) => ({ ...item, icon: item.icon as IconName }));
  const openings = careers.openings.filter((o) => o.active && o.title.trim());
  const count = openings.length;
  const statusText =
    count > 0
      ? apply.openStatus
          .replace("{count}", String(count))
          .replace(/roles\b/, count === 1 ? "role" : "roles")
      : apply.emptyStatus;
  const hrEmail = contact.hrEmail;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="cr-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="cr-hero-heading" className={styles.heroTitle}>
              {hero.title}
            </h1>
            {hero.text ? <p className={styles.heroText}>{hero.text}</p> : null}
            <div className={styles.actions}>
              {hero.primaryLabel ? (
                <a href={hero.primaryHref || "#cr-apply"} className={styles.btnPrimary}>
                  {hero.primaryLabel} <span aria-hidden="true">&rarr;</span>
                </a>
              ) : null}
              {hero.secondaryLabel ? (
                <a href={hero.secondaryHref || "#cr-why"} className={styles.btnOutline}>
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
                width={1200}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className={styles.photo}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Why work here */}
      <section id="cr-why" className={cr.why} aria-labelledby="cr-why-heading">
        <div className="container">
          <div className={cr.head}>
            <h2 id="cr-why-heading" className={cr.bigTitle}>
              {why.title}
            </h2>
            {why.lead ? <p className={cr.lead}>{why.lead}</p> : null}
          </div>
          {perks.length > 0 ? <CareerPerks items={perks} /> : null}
        </div>
      </section>

      {/* Where you could fit */}
      <section className={cr.areas} aria-labelledby="cr-areas-heading">
        <div className="container">
          <div className={cr.head}>
            <h2 id="cr-areas-heading" className={cr.bigTitle}>
              {areas.title}
            </h2>
            {areas.lead ? <p className={cr.lead}>{areas.lead}</p> : null}
          </div>

          {areas.items.length > 0 ? (
            <ul className={cr.fit}>
              {areas.items.map((area, index) => (
                <li key={`${area.title}-${index}`} className={cr.fitItem}>
                  <Link href={area.href || "/"} className={cr.fitLink}>
                    {area.image ? (
                      <Image
                        src={area.image}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 700px"
                        quality={85}
                        className={cr.fitImg}
                      />
                    ) : null}
                    <span className={cr.fitShade} aria-hidden="true" />
                    <span className={cr.fitNum}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={cr.fitBody}>
                      <span className={cr.fitTitle}>{area.title}</span>
                      <span className={cr.fitText}>{area.desc}</span>
                      {areas.linkLabel ? (
                        <span className={cr.fitGo}>
                          {areas.linkLabel} <span aria-hidden="true">&rarr;</span>
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Current openings */}
      {count > 0 ? (
        <section className={cr.jobs} aria-labelledby="cr-jobs-heading">
          <div className="container">
            <div className={cr.head}>
              <h2 id="cr-jobs-heading" className={cr.bigTitle}>
                {openingsBlock.title}
              </h2>
              {openingsBlock.lead ? <p className={cr.lead}>{openingsBlock.lead}</p> : null}
            </div>
            <ul className={cr.jobList}>
              {openings.map((job) => (
                <li key={job.id || job.title} className={cr.job}>
                  <h3 className={cr.jobTitle}>{job.title}</h3>
                  {[job.department, job.location, job.type, job.experience].some(Boolean) ? (
                    <ul className={cr.jobMeta}>
                      {[job.department, job.location, job.type, job.experience]
                        .filter(Boolean)
                        .map((pill) => (
                          <li key={pill} className={cr.jobPill}>
                            {pill}
                          </li>
                        ))}
                    </ul>
                  ) : null}
                  {job.summary ? <p className={cr.jobText}>{job.summary}</p> : null}
                  {job.requirements.length > 0 ? (
                    <ul className={cr.jobReqs}>
                      {job.requirements.map((req, i) => (
                        <li key={`${req}-${i}`}>{req}</li>
                      ))}
                    </ul>
                  ) : null}
                  {openingsBlock.applyLabel ? (
                    <a href="#cr-apply" className={cr.jobApply}>
                      {openingsBlock.applyLabel} <span aria-hidden="true">&rarr;</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Openings + application */}
      <section id="cr-apply" className={cr.apply} aria-labelledby="cr-apply-heading">
        <div className={`container ${cr.applyGrid}`}>
          <aside className={cr.side}>
            {statusText ? (
              <span className={cr.status}>
                <span className={cr.dot} aria-hidden="true" />
                {statusText}
              </span>
            ) : null}
            <h2 id="cr-apply-heading" className={cr.sideTitle}>
              {apply.title}
            </h2>
            {apply.text ? <p className={cr.sideText}>{apply.text}</p> : null}

            {apply.steps.length > 0 ? (
              <ol className={cr.steps}>
                {apply.steps.map((step, index) => (
                  <li key={`${step.title}-${index}`} className={cr.step}>
                    <span className={cr.stepNo}>{index + 1}</span>
                    <span>
                      <strong className={cr.stepTitle}>{step.title}</strong>
                      <span className={cr.stepText}>{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}

            {apply.directText && hrEmail ? (
              <p className={cr.direct}>
                {apply.directText}{" "}
                <a href={`mailto:${hrEmail}`} className={cr.directLink}>
                  {hrEmail}
                </a>
                .
              </p>
            ) : null}
          </aside>

          <div className={cr.panel}>
            {form.title ? <h3 className={cr.panelTitle}>{form.title}</h3> : null}
            <CareerForm
              hrEmail={hrEmail}
              areas={form.areas}
              experience={form.experience}
              openingTitles={openings.map((o) => o.title)}
              submitLabel={form.submitLabel}
              idleNote={form.idleNote}
              fallbackNote={form.fallbackNote}
              emailInsteadNote={form.emailInsteadNote}
              successText={form.successText}
              resumeLabel={form.resumeLabel}
              resumeHint={form.resumeHint}
            />
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className={cr.end} aria-labelledby="cr-end-heading">
        <div className="container">
          <div className={cr.endBox}>
            <span className={cr.endDots} aria-hidden="true" />
            <div className={cr.endCopy}>
              {closing.kicker ? <span className={cr.endKicker}>{closing.kicker}</span> : null}
              <h2 id="cr-end-heading" className={cr.endTitle}>
                {closing.title}
              </h2>
              {closing.text ? <p className={cr.endText}>{closing.text}</p> : null}
              <div className={cr.endActions}>
                {closing.primaryLabel ? (
                  <a href={closing.primaryHref || "#cr-apply"} className={cr.endBtn}>
                    {closing.primaryLabel} <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : null}
                {closing.secondaryLabel && hrEmail ? (
                  <a href={`mailto:${hrEmail}`} className={cr.endGhost}>
                    {closing.secondaryLabel}
                  </a>
                ) : null}
              </div>
            </div>

            <ul className={cr.endList}>
              {closing.showHr && hrEmail ? (
                <li>
                  <a href={`mailto:${hrEmail}`} className={cr.endRow}>
                    <span className={cr.endIcon}>
                      <Icon name="mailIcon" className={cr.endSvg} />
                    </span>
                    <span className={cr.endRowText}>
                      <span className={cr.endLabel}>{closing.hrLabel}</span>
                      <span className={cr.endValue}>{hrEmail}</span>
                    </span>
                  </a>
                </li>
              ) : null}
              {closing.showPhone && contact.phone ? (
                <li>
                  <a href={`tel:${contact.phoneRaw}`} className={cr.endRow}>
                    <span className={cr.endIcon}>
                      <Icon name="phone" className={cr.endSvg} />
                    </span>
                    <span className={cr.endRowText}>
                      <span className={cr.endLabel}>{closing.phoneLabel}</span>
                      <span className={cr.endValue}>{contact.phone}</span>
                    </span>
                  </a>
                </li>
              ) : null}
              {closing.showWhatsapp && contact.phoneRaw ? (
                <li>
                  <a
                    href={contact.whatsappUrl}
                    className={cr.endRow}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={cr.endIcon}>
                      <Icon name="chat" className={cr.endSvg} />
                    </span>
                    <span className={cr.endRowText}>
                      <span className={cr.endLabel}>{closing.whatsappLabel}</span>
                      <span className={cr.endValue}>{closing.whatsappValue}</span>
                    </span>
                  </a>
                </li>
              ) : null}
              {closing.showOffice && contact.address ? (
                <li>
                  <a
                    href={contact.mapUrl}
                    className={cr.endRow}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={cr.endIcon}>
                      <Icon name="pin" className={cr.endSvg} />
                    </span>
                    <span className={cr.endRowText}>
                      <span className={cr.endLabel}>{closing.officeLabel}</span>
                      <span className={cr.endValue}>{contact.address}</span>
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

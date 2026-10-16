import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../icons";
import { BrandIcon } from "./brand-icons";
import { JsonLd } from "@/components/json-ld";
import styles from "./app-development.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { serviceApp } = await getSiteContent();
  return pageMetadata(serviceApp.meta, "/services/app-development");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");
const toneClass: Record<string, string> = { done: "toneDone", info: "toneInfo", warn: "toneWarn" };

export default async function AppDevelopmentPage() {
  const { serviceApp: c } = await getSiteContent();
  const { hero, platforms, verticals, method, quality, stack, cta } = c;

  const pageUrl = "https://websiterecentresoft.vercel.app/services/app-development";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://websiterecentresoft.vercel.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: "https://websiterecentresoft.vercel.app/services/app-development",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Mobile App Development",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Mobile App Development Services",
      serviceType: "Mobile Application Engineering",
      description: c.meta.description,
      provider: {
        "@type": "Organization",
        name: "Recenturesoft Infotech",
        url: "https://websiterecentresoft.vercel.app",
      },
      url: pageUrl,
      areaServed: "Global",
    },
  ];

  return (
    <div className={styles.page}>
      <JsonLd data={jsonLd} />
      {/* ---------------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="app-hero-title">
        <div className={`${styles.wrap} ${styles.heroLayout}`}>
          <div className={styles.heroCopy}>
            <h1 id="app-hero-title" className={styles.heroTitle}>
              {hero.title === "From Idea to App Store. We Build Mobile Experiences That Matter." ? (
                <>
                  From Idea to App Store.
                  <br />
                  We Build Mobile Experiences
                  <br />
                  That Matter.
                </>
              ) : (
                hero.title
              )}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.actions}>
              <Link href={hero.primaryHref || "/contact"} className={styles.btnMain}>
                {hero.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
              {hero.secondaryLabel ? (
                <a href={hero.secondaryHref || "#platforms"} className={styles.btnLine}>
                  {hero.secondaryLabel}
                </a>
              ) : null}
            </div>
            {hero.points.length > 0 ? (
              <ul className={styles.heroPoints}>
                {hero.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" className={styles.pointIcon} />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className={styles.phones} aria-hidden="true">
            <div className={`${styles.phone} ${styles.phoneBack}`}>
              <span className={styles.notch} />
              <div className={styles.screen}>
                <p className={styles.screenLabel}>{hero.phoneBack.label}</p>
                <div className={styles.scanBox}>
                  <span className={styles.scanLine} />
                </div>
                {hero.phoneBack.lines.map((l) => (
                  <p key={l} className={styles.screenLine}>
                    {l}
                  </p>
                ))}
              </div>
            </div>
            <div className={`${styles.phone} ${styles.phoneFront}`}>
              <span className={styles.island} />
              <div className={styles.screen}>
                <p className={styles.screenLabel}>{hero.phoneFront.label}</p>
                <ul className={styles.rowsList}>
                  {hero.phoneFront.rows.map((r) => (
                    <li key={r.title} className={styles.screenRow}>
                      <span>{r.title}</span>
                      <span className={`${styles.tone} ${styles[toneClass[r.tone] ?? "toneInfo"]}`}>{r.value}</span>
                    </li>
                  ))}
                </ul>
                {hero.phoneFront.footer ? (
                  <p className={styles.screenFoot}>
                    <Icon name="shield" className={styles.footIcon} />
                    {hero.phoneFront.footer}
                  </p>
                ) : null}
              </div>
              <span className={styles.homeBar} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- platforms */}
      <section id="platforms" className={`${styles.section} ${styles.platformsSection}`} aria-labelledby="app-platforms-title">
        <div className={styles.wrap}>
          <header className={styles.pfHead}>
            <h2 id="app-platforms-title" className={styles.pfTitle}>
              {platforms.title}
              {platforms.titleAccent ? (
                <>
                  {" "}
                  <span className={styles.accent}>{platforms.titleAccent}</span>
                </>
              ) : null}
            </h2>
            <p className={styles.pfLead}>{platforms.lead}</p>
          </header>

          <div className={styles.pfGrid}>
            {platforms.items.map((pl, i) => {
              const words = pl.title.trim().split(" ");
              const last = words.length > 1 ? words.pop() : "";
              const android = i % 2 === 0;
              return (
                <article key={pl.title} className={`${styles.pfCol} ${android ? styles.pfAndroid : styles.pfIos}`}>
                  <div className={styles.pfMain}>
                    <div className={styles.pfCopy}>
                      <div className={styles.pfTop}>
                        <span className={styles.pfIcon}>
                          <BrandIcon name={android ? "android" : "apple"} className={styles.brandSvg} />
                        </span>
                        <h3 className={styles.pfName}>
                          {words.join(" ")}
                          {last ? (
                            <>
                              {" "}
                              <span className={styles.accentPl}>{last}</span>
                            </>
                          ) : null}
                        </h3>
                      </div>
                      <p className={styles.pfText}>{pl.desc}</p>

                      <ul className={styles.pfFeatures}>
                        {pl.features.map((f) => (
                          <li key={f.title} className={styles.pfFeature}>
                            <span className={styles.pfFIcon}>
                              <Glyph name={f.icon} className={styles.featureIcon} />
                            </span>
                            <div>
                              <h4 className={styles.pfFTitle}>{f.title}</h4>
                              <p className={styles.pfFText}>{f.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.pfStage} aria-hidden="true">
                      <span className={styles.pfBlob} />
                      <div className={`${styles.pfPhone} ${android ? styles.pfPhoneA : styles.pfPhoneI}`}>
                        <span className={android ? styles.pfCamera : styles.pfIsland} />
                        <div className={styles.pfScreen}>
                          {android ? (
                            <>
                              <div className={styles.scrHero}>
                                <span className={styles.scrGreet}>Good morning</span>
                                <span className={styles.scrTitle}>Explore the world</span>
                                <span className={styles.scrSearch}>Search destinations</span>
                              </div>
                              <div className={styles.scrCats}>
                                {["Flights", "Hotels", "Trains", "Cars"].map((c, ci) => (
                                  <span key={c} className={`${styles.scrCat} ${ci === 0 ? styles.scrCatOn : ""}`}>
                                    <i />
                                    {c}
                                  </span>
                                ))}
                              </div>
                              <p className={styles.scrHead}>Popular destinations</p>
                              <div className={styles.scrCards}>
                                <span>
                                  <b>Bali</b>
                                </span>
                                <span>
                                  <b>Paris</b>
                                </span>
                              </div>
                              <div className={styles.scrNav}>
                                <i className={styles.scrNavOn} />
                                <i />
                                <i />
                                <i />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={styles.scrCard}>
                                <span className={styles.scrGreet}>Total balance</span>
                                <span className={styles.scrAmount} />
                                <span className={styles.scrWave} />
                              </div>
                              <div className={styles.scrCats}>
                                {["Send", "Receive", "Cards", "More"].map((c) => (
                                  <span key={c} className={styles.scrCat}>
                                    <i />
                                    {c}
                                  </span>
                                ))}
                              </div>
                              <p className={styles.scrHead}>Recent activity</p>
                              <div className={styles.scrList}>
                                <span />
                                <span />
                                <span />
                              </div>
                              <div className={styles.scrNav}>
                                <i className={styles.scrNavOn} />
                                <i />
                                <i />
                                <i />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={styles.pfBadge}>
                        <BrandIcon name={android ? "googleplay" : "appstore"} className={styles.brandSvg} />
                      </span>
                    </div>
                  </div>

                  {pl.footerTitle ? (
                    <div className={styles.pfBar}>
                      <span className={styles.pfBarIcon}>
                        <Icon name="deploy" className={styles.iconSvg} />
                      </span>
                      <div className={styles.pfBarMain}>
                        <strong>{pl.footerTitle}</strong>
                        <span>{pl.footerText}</span>
                      </div>
                      {pl.chips.length > 0 ? (
                        <ul className={styles.pfChips}>
                          {pl.chips.map((c) => (
                            <li key={c}>
                              <Icon name="check" className={styles.pfTick} />
                              {c}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- verticals */}
      <section className={`${styles.section} ${styles.alt}`} aria-labelledby="app-verticals-title">
        <div className={styles.wrap}>
          <header className={styles.head}>
            <h2 id="app-verticals-title" className={styles.title}>
              {verticals.title}
            </h2>
            <p className={styles.lead}>{verticals.lead}</p>
          </header>

          <div className={styles.verticals}>
            <aside className={styles.darkCard}>
              <span className={styles.darkGlow} aria-hidden="true" />
              <span className={styles.darkIcon}>
                <Icon name="devices" className={styles.iconSvg} />
              </span>
              <h3 className={styles.darkTitle}>{verticals.panelTitle}</h3>
              <p className={styles.darkText}>{verticals.panelText}</p>
              <ul className={styles.darkList}>
                {verticals.panelPoints.map((p) => (
                  <li key={p}>
                    <Icon name="check" className={styles.pointIcon} />
                    {p}
                  </li>
                ))}
              </ul>
            </aside>

            <ul className={styles.vList}>
              {verticals.items.map((v, i) => (
                <li key={v.title} className={`${styles.vItem} ${styles[`v${i % 5}`]}`}>
                  <span className={styles.vNum}>{pad(i)}</span>
                  <span className={styles.vIcon}>
                    <Glyph name={v.icon} className={styles.iconSvg} />
                  </span>
                  <div className={styles.vBody}>
                    <h3 className={styles.vTitle}>{v.title}</h3>
                    <p className={styles.vText}>{v.desc}</p>
                    {v.tags.length > 0 ? (
                      <ul className={styles.tags}>
                        {v.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- method */}
      <section className={styles.band} aria-labelledby="app-method-title">
        <span className={styles.bandGlow} aria-hidden="true" />
        <div className={styles.wrap}>
          <header className={styles.headLight}>
            <h2 id="app-method-title" className={styles.titleLight}>
              {method.title}
            </h2>
            <p className={styles.leadLight}>{method.lead}</p>
          </header>

          <ol className={styles.pipeline}>
            {method.items.map((m, i) => (
              <li key={m.title} className={styles.pipeStep}>
                <span className={styles.pipeNum}>{pad(i)}</span>
                <h3 className={styles.pipeTitle}>{m.title}</h3>
                <p className={styles.pipeText}>{m.desc}</p>
                {m.deliverable ? (
                  <p className={styles.deliver}>
                    <span>{method.deliverableLabel}</span>
                    {m.deliverable}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- quality */}
      <section className={styles.section} aria-labelledby="app-quality-title">
        <div className={styles.wrap}>
          <header className={styles.head}>
            <h2 id="app-quality-title" className={styles.title}>
              {quality.title}
            </h2>
            <p className={styles.lead}>{quality.lead}</p>
          </header>

          <div className={styles.quality}>
            <ul className={styles.qGrid}>
              {quality.items.map((q) => (
                <li key={q.title} className={styles.qItem}>
                  <span className={styles.qIcon}>
                    <Glyph name={q.icon} className={styles.iconSvg} />
                  </span>
                  <h3 className={styles.qTitle}>{q.title}</h3>
                  <p className={styles.qText}>{q.desc}</p>
                </li>
              ))}
            </ul>

            <aside className={styles.checklist}>
              <h3 className={styles.checkTitle}>{quality.panelTitle}</h3>
              <p className={styles.checkText}>{quality.panelText}</p>
              <ul className={styles.checkItems}>
                {quality.panelItems.map((p) => (
                  <li key={p}>
                    <span className={styles.checkDot}>
                      <Icon name="check" className={styles.checkSvg} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- stack */}
      <section className={`${styles.section} ${styles.stackSection}`} aria-labelledby="app-stack-title">
        <div className={styles.wrap}>
          <header className={styles.tsHead}>
            <div className={styles.tsCopy}>
              <h2 id="app-stack-title" className={styles.tsTitle}>
                {stack.title}
                {stack.titleAccent ? (
                  <>
                    {" "}
                    <span className={styles.accent}>{stack.titleAccent}</span>
                  </>
                ) : null}
              </h2>
              <p className={styles.tsLead}>{stack.lead}</p>
            </div>
            {stack.badges.length > 0 ? (
              <ul className={styles.tsBadges}>
                {stack.badges.map((b) => (
                  <li key={b.title} className={styles.tsBadge}>
                    <span className={styles.tsBadgeIcon}>
                      <Glyph name={b.icon} className={styles.iconSvg} />
                    </span>
                    <span>
                      <strong>{b.title}</strong>
                      <span>{b.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <div className={styles.tsGrid}>
            {stack.groups.map((g, i) => (
              <article key={g.title} className={`${styles.tsCard} ${styles[`ts${i % 4}`]}`}>
                <span className={styles.tsGhost} aria-hidden="true">
                  <Glyph name={g.icon} className={styles.tsGhostSvg} />
                </span>
                <span className={styles.tsIcon}>
                  <Glyph name={g.icon} className={styles.iconSvg} />
                </span>
                <h3 className={styles.tsName}>{g.title}</h3>
                {g.desc ? <p className={styles.tsDesc}>{g.desc}</p> : null}
                {g.text ? <p className={styles.tsText}>{g.text}</p> : null}
                <ul className={styles.tsChips}>
                  {g.items.map((t) => (
                    <li key={t}>
                      <i aria-hidden="true">{t.charAt(0)}</i>
                      {t}
                    </li>
                  ))}
                </ul>
                {stack.linkLabel ? (
                  <Link href={stack.linkHref || "/contact"} className={styles.tsLink}>
                    <span className={styles.tsArrow} aria-hidden="true">
                      &rarr;
                    </span>
                    {stack.linkLabel}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- closing */}
      <section className={styles.closing} aria-labelledby="app-cta-title">
        <span className={styles.bandGlow} aria-hidden="true" />
        <span className={styles.ring1} aria-hidden="true" />
        <span className={styles.ring2} aria-hidden="true" />
        <span className={`${styles.floatTile} ${styles.ft1}`} aria-hidden="true">
          <Icon name="phone" className={styles.iconSvg} />
        </span>
        <span className={`${styles.floatTile} ${styles.ft2}`} aria-hidden="true">
          <Icon name="rocket" className={styles.iconSvg} />
        </span>
        <span className={`${styles.floatTile} ${styles.ft3}`} aria-hidden="true">
          <Icon name="devices" className={styles.iconSvg} />
        </span>
        <div className={`${styles.wrap} ${styles.closingSplit}`}>
          <div className={styles.closingCopy}>
            {cta.eyebrow ? <span className={styles.tagLight}>{cta.eyebrow}</span> : null}
            <h2 id="app-cta-title" className={styles.closingTitle2}>
              {cta.title}
            </h2>
            <p className={styles.closingText2}>{cta.text}</p>
            <div className={styles.actions}>
              <Link href={cta.primaryHref || "/contact"} className={styles.btnLight}>
                {cta.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
              {cta.secondaryLabel ? (
                <Link href={cta.secondaryHref || "/contact"} className={styles.btnGlass}>
                  {cta.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>

          {cta.notes.length > 0 ? (
            <aside className={styles.ctaCard}>
              <h3 className={styles.ctaCardTitle}>{cta.cardTitle}</h3>
              <ol className={styles.ctaSteps}>
                {cta.notes.map((n, i) => (
                  <li key={n}>
                    <span className={styles.ctaStepNum}>{i + 1}</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon, iconPaths, type IconName } from "../icons";
import styles from "./agentic-ai.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { serviceAgentic } = await getSiteContent();
  return pageMetadata(serviceAgentic.meta, "/services/agentic-ai");
}

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

const toneClass: Record<string, string> = {
  done: "statusDone",
  info: "statusInfo",
  warn: "statusWarn",
};

export default async function AgenticAiPage() {
  const { serviceAgentic: c } = await getSiteContent();
  const { hero, build, flow, services, useCases, safety, stack, delivery, cta } = c;

  return (
    <div className={styles.page}>
      {/* ------------------------------------------------------------ hero */}
      <section className={styles.hero} aria-labelledby="ag-hero-title">
        <span className={styles.heroGlow} aria-hidden="true" />
        <span className={styles.heroGrid} aria-hidden="true" />
        <div className={`${styles.wrap} ${styles.heroLayout}`}>
          <div className={styles.heroCopy}>
            <h1 id="ag-hero-title" className={styles.heroTitle}>
              {hero.titleStart}
              {hero.titleAccent ? (
                <>
                  {" "}
                  <span className={styles.heroAccent}>{hero.titleAccent}</span>
                </>
              ) : null}
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.heroActions}>
              <Link href={hero.primaryHref || "/contact"} className={styles.btnLight}>
                {hero.primaryLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
              {hero.secondaryLabel ? (
                <a href={hero.secondaryHref || "#build"} className={styles.btnGlass}>
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

          <div className={styles.console} aria-label={hero.consoleTitle}>
            <div className={styles.consoleBar}>
              <span className={styles.consoleDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.consoleTitle}>{hero.consoleTitle}</span>
              <span className={styles.live} aria-hidden="true">
                <span className={styles.liveDot} />
              </span>
            </div>
            <ul className={styles.consoleRows}>
              {hero.consoleRows.map((row) => (
                <li key={row.title} className={styles.consoleRow}>
                  <span className={styles.consoleIcon}>
                    <Glyph name={row.icon} className={styles.consoleSvg} />
                  </span>
                  <span className={styles.consoleMain}>
                    <strong>{row.title}</strong>
                    <span>{row.detail}</span>
                  </span>
                  <span className={`${styles.status} ${styles[toneClass[row.tone] ?? "statusInfo"]}`}>{row.status}</span>
                </li>
              ))}
            </ul>
            {hero.logLines.length > 0 ? (
              <ul className={styles.consoleLog}>
                {hero.logLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ build */}
      <section id="build" className={styles.section} aria-labelledby="ag-build-title">
        <div className={styles.wrap}>
          <header className={styles.head}>
            <h2 id="ag-build-title" className={styles.title}>
              {build.title}
            </h2>
            <p className={styles.lead}>{build.lead}</p>
          </header>

          <ul className={styles.threeUp}>
            {build.items.map((item, i) => (
              <li key={item.title} className={styles.tile}>
                <div className={styles.tileTop}>
                  <span className={styles.bigNum}>{pad(i)}</span>
                  <span className={styles.chip}>
                    <Glyph name={item.icon} className={styles.chipSvg} />
                  </span>
                </div>
                <h3 className={styles.tileTitle}>{item.title}</h3>
                <p className={styles.tileText}>{item.desc}</p>
                <ul className={styles.ticks}>
                  {item.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" className={styles.tickIcon} />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ flow (dark band) */}
      {flow.items.length > 0 ? (
        <section className={styles.band} aria-labelledby="ag-flow-title">
          <span className={styles.bandGlow} aria-hidden="true" />
          <div className={styles.wrap}>
            <header className={styles.headLight}>
              <h2 id="ag-flow-title" className={styles.titleLight}>
                {flow.title}
              </h2>
              <p className={styles.leadLight}>{flow.lead}</p>
            </header>

            <ol className={styles.flow}>
              {flow.items.map((step, i) => (
                <li key={step.title} className={styles.flowStep}>
                  <span className={styles.flowNode}>{pad(i)}</span>
                  {step.label ? <span className={styles.flowLabel}>{step.label}</span> : null}
                  <h3 className={styles.flowTitle}>{step.title}</h3>
                  <p className={styles.flowText}>{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ services (bento) */}
      <section className={styles.section} aria-labelledby="ag-services-title">
        <div className={styles.wrap}>
          <header className={styles.head}>
            <h2 id="ag-services-title" className={styles.title}>
              {services.title}
            </h2>
            <p className={styles.lead}>{services.lead}</p>
          </header>

          <ol className={styles.rows}>
            {services.items.map((item, i) => (
              <li key={item.title} className={styles.row}>
                <span className={styles.rowNum}>{pad(i)}</span>
                <span className={styles.rowIcon}>
                  <Glyph name={item.icon} className={styles.chipSvg} />
                </span>
                <div className={styles.rowMain}>
                  <h3 className={styles.rowTitle}>{item.title}</h3>
                  <p className={styles.rowText}>{item.desc}</p>
                </div>
                {item.tags.length > 0 ? (
                  <ul className={styles.rowTags}>
                    {item.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ use cases */}
      {useCases.items.length > 0 ? (
        <section className={`${styles.section} ${styles.alt}`} aria-labelledby="ag-use-title">
          <div className={styles.wrap}>
            <header className={styles.head}>
              <h2 id="ag-use-title" className={styles.title}>
                {useCases.title}
              </h2>
              <p className={styles.lead}>{useCases.lead}</p>
            </header>

            <ul className={styles.useGrid}>
              {useCases.items.map((item, i) => (
                <li key={item.title} className={`${styles.useItem} ${styles[`hue${i % 6}`]}`}>
                  <span className={styles.useGhost} aria-hidden="true">
                    <Glyph name={item.icon} className={styles.useGhostSvg} />
                  </span>
                  <span className={styles.useIcon}>
                    <Glyph name={item.icon} className={styles.chipSvg} />
                  </span>
                  <h3 className={styles.useTitle}>{item.title}</h3>
                  <p className={styles.useText}>{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ safety */}
      {safety.items.length > 0 ? (
        <section className={styles.section} aria-labelledby="ag-safety-title">
          <div className={styles.wrap}>
            <div className={styles.vault}>
              <span className={styles.vaultGlow} aria-hidden="true" />
              <div className={styles.vaultHead}>
                <span className={styles.vaultMark}>
                  <Icon name="shield" className={styles.vaultMarkSvg} />
                </span>
                <h2 id="ag-safety-title" className={styles.vaultTitle}>
                  {safety.title}
                </h2>
                <p className={styles.vaultLead}>{safety.lead}</p>
              </div>
              <ol className={styles.layers}>
                {safety.items.map((item, i) => (
                  <li key={item.title} className={styles.layer}>
                    <div className={styles.layerTop}>
                      <span className={styles.layerIcon}>
                        <Glyph name={item.icon} className={styles.chipSvg} />
                      </span>
                      <span className={styles.layerNum}>{`0${i + 1}`}</span>
                    </div>
                    <h3 className={styles.layerTitle}>{item.title}</h3>
                    <p className={styles.layerText}>{item.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ stack */}
      {stack.groups.length > 0 ? (
        <section className={`${styles.section} ${styles.alt}`} aria-labelledby="ag-stack-title">
          <div className={styles.wrap}>
            <header className={styles.head}>
              <h2 id="ag-stack-title" className={styles.title}>
                {stack.title}
              </h2>
              <p className={styles.lead}>{stack.lead}</p>
            </header>

            <div className={styles.shelf}>
              {stack.groups.map((g, i) => (
                <div key={g.title} className={styles.shelfRow}>
                  <div className={styles.shelfLabel}>
                    <span className={styles.shelfNum}>{pad(i)}</span>
                    <div>
                      <h3 className={styles.shelfTitle}>{g.title}</h3>
                      {g.desc ? <p className={styles.shelfText}>{g.desc}</p> : null}
                    </div>
                  </div>
                  <ul className={styles.shelfItems}>
                    {g.items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ delivery */}
      {delivery.items.length > 0 ? (
        <section className={styles.section} aria-labelledby="ag-delivery-title">
          <div className={styles.wrap}>
            <header className={styles.head}>
              <h2 id="ag-delivery-title" className={styles.title}>
                {delivery.title}
              </h2>
              <p className={styles.lead}>{delivery.lead}</p>
            </header>

            <ol className={styles.timeline}>
              {delivery.items.map((st, i) => (
                <li key={st.title} className={styles.tlItem}>
                  <span className={styles.tlDot}>{i + 1}</span>
                  <h3 className={styles.tlTitle}>{st.title}</h3>
                  <p className={styles.tlText}>{st.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ closing */}
      <section className={styles.closing} aria-labelledby="ag-cta-title">
        <span className={styles.bandGlow} aria-hidden="true" />
        <span className={styles.heroGrid} aria-hidden="true" />
        <div className={`${styles.wrap} ${styles.closingInner}`}>
          <h2 id="ag-cta-title" className={styles.closingTitle}>
            {cta.title}
          </h2>
          <p className={styles.closingText}>{cta.text}</p>
          <div className={styles.heroActions}>
            <Link href={cta.primaryHref || "/contact"} className={styles.btnLight}>
              {cta.primaryLabel} <span aria-hidden="true">&rarr;</span>
            </Link>
            {cta.secondaryLabel ? (
              <Link href={cta.secondaryHref || "/contact"} className={styles.btnGlass}>
                {cta.secondaryLabel}
              </Link>
            ) : null}
          </div>
          {cta.notes.length > 0 ? (
            <ul className={styles.notes}>
              {cta.notes.map((n) => (
                <li key={n}>
                  <Icon name="check" className={styles.pointIcon} />
                  {n}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </div>
  );
}

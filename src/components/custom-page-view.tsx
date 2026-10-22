import Image from "next/image";
import Link from "next/link";
import type { Block, CustomPage } from "@/lib/custom-pages-types";
import styles from "./custom-page.module.css";

/** Plain text with a few simple marks: a blank line starts a new paragraph, "- " makes a list, "## " a small heading. */
function RichBody({ text, className }: { text: string; className?: string }) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      out.push(<p key={`p${out.length}`}>{para.join(" ")}</p>);
      para = [];
    }
  };
  const flushBullets = () => {
    if (bullets.length) {
      out.push(
        <ul key={`u${out.length}`}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushBullets();
    } else if (line.startsWith("## ")) {
      flushPara();
      flushBullets();
      out.push(<h3 key={`h${out.length}`}>{line.slice(3)}</h3>);
    } else if (/^[-•*]\s+/.test(line)) {
      flushPara();
      bullets.push(line.replace(/^[-•*]\s+/, ""));
    } else {
      flushBullets();
      para.push(line);
    }
  }
  flushPara();
  flushBullets();
  return <div className={`${styles.rich} ${className ?? ""}`}>{out}</div>;
}

function Button({ label, href, tone = "primary" }: { label: string; href: string; tone?: "primary" | "light" }) {
  if (!label || !href) return null;
  const cls = tone === "light" ? styles.btnLight : `btn btn-primary ${styles.btn}`;
  return /^https?:/i.test(href) ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {label}
    </Link>
  );
}

function Pic({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return <Image src={src} alt={alt} width={1600} height={1067} sizes="(max-width: 900px) 100vw, 560px" className={styles.pic} priority={priority} />;
}

/** The first heading on the page is the page's main heading (h1); every other one is h2. */
function H({ lead, className, children }: { lead: boolean; className: string; children: React.ReactNode }) {
  return lead ? <h1 className={className}>{children}</h1> : <h2 className={className}>{children}</h2>;
}

function BlockView({ block, first, lead }: { block: Block; first: boolean; lead: boolean }) {
  // Lets the editor's live preview scroll to the block being edited.
  const domId = `blk-${block.id}`;
  switch (block.type) {
    case "hero": {
      const bg = block.imageSide === "background" && block.image;
      const beside = (block.imageSide === "right" || block.imageSide === "left") && block.image;
      return (
        <div id={domId} className={`${styles.hero} ${bg ? styles.heroBg : ""}`}>
          {bg ? <Image src={block.image} alt={block.imageAlt} fill priority={first} sizes="100vw" className={styles.heroBgImg} /> : null}
          {bg ? <span className={styles.heroScrim} aria-hidden="true" /> : null}
          <div className={`container ${styles.heroGrid} ${beside ? styles.heroTwo : ""} ${block.imageSide === "left" ? styles.heroFlip : ""}`}>
            <div className={styles.heroCopy}>
              {block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
              <H lead={lead} className={styles.h1}>
                {block.title}
              </H>
              {block.text ? <p className={styles.lead}>{block.text}</p> : null}
              <div className={styles.actions}>
                <Button label={block.buttonLabel} href={block.buttonHref} tone={bg ? "light" : "primary"} />
              </div>
            </div>
            {beside ? (
              <div className={styles.heroPic}>
                <Pic src={block.image} alt={block.imageAlt} priority={first} />
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    case "text":
      return (
        <div id={domId} className={`${styles.band} ${block.align === "center" ? styles.center : ""}`}>
          <div className={`container ${styles.narrow}`}>
            {block.heading ? (
              <H lead={lead} className={styles.h2}>
                {block.heading}
              </H>
            ) : null}
            <RichBody text={block.body} />
          </div>
        </div>
      );
    case "image":
      return (
        <div id={domId} className={styles.band}>
          <figure className={`container ${styles.figure} ${block.size === "small" ? styles.figSmall : block.size === "full" ? styles.figFull : styles.figMedium}`}>
            {block.image ? <Image src={block.image} alt={block.alt} width={1920} height={1280} sizes="(max-width: 1100px) 100vw, 1100px" className={styles.figImg} /> : null}
            {block.caption ? <figcaption>{block.caption}</figcaption> : null}
          </figure>
        </div>
      );
    case "imageText":
      return (
        <div id={domId} className={styles.band}>
          <div className={`container ${styles.split} ${block.side === "right" ? styles.splitFlip : ""}`}>
            {block.image ? (
              <div className={styles.splitPic}>
                <Pic src={block.image} alt={block.alt} />
              </div>
            ) : null}
            <div className={styles.splitCopy}>
              {block.heading ? (
                <H lead={lead} className={styles.h2}>
                  {block.heading}
                </H>
              ) : null}
              <RichBody text={block.body} />
              <div className={styles.actions}>
                <Button label={block.buttonLabel} href={block.buttonHref} />
              </div>
            </div>
          </div>
        </div>
      );
    case "features":
      if (block.items.length === 0) return null;
      return (
        <div id={domId} className={styles.band}>
          <div className="container">
            {block.heading ? (
              <H lead={lead} className={`${styles.h2} ${styles.centerHead}`}>
                {block.heading}
              </H>
            ) : null}
            {block.lead ? <p className={`${styles.leadSub} ${styles.centerHead}`}>{block.lead}</p> : null}
            <ul className={`${styles.grid} ${block.columns === 2 ? styles.cols2 : block.columns === 4 ? styles.cols4 : styles.cols3}`}>
              {block.items.map((item) => (
                <li key={item.id} className={styles.tile}>
                  {item.image ? (
                    <div className={styles.tilePic}>
                      <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 700px) 100vw, 380px" className={styles.tileImg} />
                    </div>
                  ) : null}
                  <h3>{item.title}</h3>
                  {item.desc ? <p>{item.desc}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "gallery":
      if (block.images.length === 0) return null;
      return (
        <div id={domId} className={styles.band}>
          <div className="container">
            {block.heading ? <h2 className={`${styles.h2} ${styles.centerHead}`}>{block.heading}</h2> : null}
            <ul className={`${styles.grid} ${block.columns === 2 ? styles.cols2 : block.columns === 4 ? styles.cols4 : styles.cols3}`}>
              {block.images.map((g) => (
                <li key={g.id} className={styles.galleryItem}>
                  <Image src={g.image} alt={g.alt} fill sizes="(max-width: 700px) 100vw, 380px" className={styles.tileImg} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "faq":
      if (block.items.length === 0) return null;
      return (
        <div id={domId} className={styles.band}>
          <div className={`container ${styles.narrow}`}>
            {block.heading ? (
              <H lead={lead} className={`${styles.h2} ${styles.centerHead}`}>
                {block.heading}
              </H>
            ) : null}
            <div className={styles.faq}>
              {block.items.map((f) => (
                <details key={f.id} className={styles.faqItem}>
                  <summary>{f.q}</summary>
                  <RichBody text={f.a} />
                </details>
              ))}
            </div>
          </div>
        </div>
      );
    case "cta":
      return (
        <div id={domId} className={styles.band}>
          <div className={`container ${styles.ctaBox}`}>
            {block.heading ? (
              <H lead={lead} className={styles.ctaTitle}>
                {block.heading}
              </H>
            ) : null}
            {block.text ? <p className={styles.ctaText}>{block.text}</p> : null}
            <div className={`${styles.actions} ${styles.actionsCenter}`}>
              <Button label={block.buttonLabel} href={block.buttonHref} tone="light" />
            </div>
          </div>
        </div>
      );
  }
}

/** The page as visitors see it. Used by the live address and by the preview in the admin panel. */
export function CustomPageView({ page }: { page: CustomPage }) {
  const headingOf = (b: Block) => (b.type === "hero" ? b.title : "heading" in b ? b.heading : "");
  const leadIndex = page.blocks.findIndex((b) => headingOf(b));
  return (
    <div className={styles.page}>
      {page.blocks.map((block, i) => (
        <BlockView key={block.id} block={block} first={i === 0} lead={i === leadIndex} />
      ))}
    </div>
  );
}

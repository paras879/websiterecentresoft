"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon, iconPaths, type IconName } from "@/app/services/icons";
import { LegalBody } from "@/components/legal-body";
import { slug } from "@/content/legal";
import type { LegalDefaults } from "@/content/legal";
import styles from "./privacy-policy.module.css";

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

interface Props {
  company: string;
  brand: string;
  email: string;
  phone: string;
  phoneRaw: string;
  address: string;
  mapUrl: string;
  whatsappUrl: string;
  content: LegalDefaults;
}

export function PrivacyPolicyView({ company, email, phone, phoneRaw, address, mapUrl, whatsappUrl, content }: Props) {
  const SECTIONS = content.sections.map((sec) => ({ id: slug(sec.title), label: sec.title, body: sec.body }));
  const lastIndex = SECTIONS.length - 1;
  const sectionKey = SECTIONS.map((x) => x.id).join("|");
  const [active, setActive] = useState(SECTIONS[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  // Highlights the section being read, and fills the thin progress line at the top.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  // The browser's print window offers "Save as PDF". The page title becomes the file name.
  const downloadPdf = () => {
    const previous = document.title;
    document.title = "Recenturesoft-Privacy-Policy";
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <div className={styles.page}>
      <div className={styles.progress} aria-hidden="true">
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <header className={styles.top}>
        <Image
          src={content.hero.image || "/images/hero.jpg"}
          alt={content.hero.imageAlt || ""}
          fill
          priority fetchPriority="high"
          sizes="100vw"
          quality={85}
          className={styles.topImg}
        />
        <span className={styles.topShade} aria-hidden="true" />
        <div className="container">
          <h1 className={styles.title}>{content.hero.title}</h1>
          <p className={styles.lead}>{content.hero.lead}</p>
          <p className={styles.printMeta}>{company} &middot; https://websiterecentresoft.vercel.app/privacy-policy</p>

          <ul className={styles.glance} aria-label="Quick links">
            {content.quick.map((g, i) => (
              <li key={`${g.title}-${i}`}>
                <a href={`#${slug(g.target || g.title)}`} className={styles.glanceTile}>
                  <span className={styles.glanceTop}>
                    <span className={styles.glanceIcon}>
                      <Glyph name={g.icon} className={styles.glanceSvg} />
                    </span>
                    <span className={styles.glanceNum}>{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className={styles.glanceTitle}>{g.title}</span>
                  <span className={styles.glanceText}>{g.text}</span>
                  <span className={styles.glanceGo}>
                    Read this section <span aria-hidden="true">&rarr;</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.side} aria-label="On this page">
          <p className={styles.sideTitle}>On this page</p>
          <nav>
            <ol className={styles.toc}>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`${styles.tocLink} ${active === s.id ? styles.tocLinkOn : ""}`} aria-current={active === s.id ? "true" : undefined}>
                    <span className={styles.tocNum}>{i + 1}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.pdfBox}>
            <button type="button" className={styles.pdfBtn} onClick={downloadPdf}>
              <Icon name="download" className={styles.pdfSvg} />
              Download as PDF
            </button>
            <p className={styles.pdfHint}>In the window that opens, choose &ldquo;Save as PDF&rdquo;.</p>
          </div>
        </aside>

        <article className={styles.doc}>
          {SECTIONS.slice(0, lastIndex).map((sec, i) => (
            <section key={sec.id} id={sec.id} className={styles.block}>
              <h2 className={styles.heading}>
                <span className={styles.num}>{i + 1}</span>
                {sec.label}
              </h2>
              <LegalBody body={sec.body} styles={styles} />
            </section>
          ))}

          <section id={SECTIONS[lastIndex]?.id} className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>{SECTIONS.length}</span>
              {SECTIONS[lastIndex]?.label}
            </h2>
            <LegalBody body={SECTIONS[lastIndex]?.body ?? ""} styles={styles} />

            <div className={styles.contactBox}>
              <div className={styles.contactHead}>
                <span className={styles.contactMark}>
                  <Icon name="shield" className={styles.contactMarkSvg} />
                </span>
                <div>
                  <p className={styles.contactName}>{content.contact.officer}</p>
                  <p className={styles.contactSub}>{company}</p>
                </div>
              </div>

              <ul className={styles.contactList}>
                <li>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
                    <span className={styles.contactIcon}>
                      <Icon name="pin" className={styles.contactSvg} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>Office</span>
                      <span className={styles.contactValue}>{address}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}?subject=Grievance%20Redressal`} className={styles.contactRow}>
                    <span className={styles.contactIcon}>
                      <Icon name="mailIcon" className={styles.contactSvg} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>Email</span>
                      <span className={styles.contactValue}>{email}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${phoneRaw}`} className={styles.contactRow}>
                    <span className={styles.contactIcon}>
                      <Icon name="phone" className={styles.contactSvg} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>Phone</span>
                      <span className={styles.contactValue}>{phone}</span>
                    </span>
                  </a>
                </li>
              </ul>

              <div className={styles.contactActions}>
                <a href={`mailto:${email}?subject=Grievance%20Redressal`} className={styles.btnMain}>
                  Email the Grievance Officer
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.btnLine}>
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </section>
        </article>

        <aside className={styles.rail} aria-label="Contact for privacy questions">
          <div className={styles.railBox}>
            <span className={styles.railMark}>
              <Icon name="shield" className={styles.railMarkSvg} />
            </span>
            <h2 className={styles.railTitle}>{content.contact.railTitle}</h2>
            <p className={styles.railText}>{content.contact.railText}</p>

            <ul className={styles.railList}>
              <li>
                <a href={`mailto:${email}?subject=Privacy%20question`} className={styles.railRow}>
                  <Icon name="mailIcon" className={styles.railSvg} />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phoneRaw}`} className={styles.railRow}>
                  <Icon name="phone" className={styles.railSvg} />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.railRow}>
                  <Icon name="pin" className={styles.railSvg} />
                  <span>{address}</span>
                </a>
              </li>
            </ul>

            <a href="#grievance" className={styles.railBtn}>
              Grievance redressal details
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

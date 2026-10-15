"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/app/services/icons";
import styles from "./terms.module.css";

const SECTIONS = [
  { id: "introduction", label: "Terms and conditions" },
  { id: "content", label: "Use of content" },
  { id: "security", label: "Security rules" },
  { id: "conduct", label: "General conduct rules" },
  { id: "indemnity", label: "Indemnity" },
  { id: "liability", label: "Liability" },
  { id: "damages", label: "Disclaimer of damages" },
  { id: "revisions", label: "Revisions to terms" },
  { id: "contact", label: "Contact information" },
];

const GLANCE = [
  {
    id: "content",
    title: "Use of content",
    text: "Trademarks, copyright and intellectual property rules",
    icon: "document" as const,
  },
  {
    id: "security",
    title: "Security rules",
    text: "Prohibitions against unauthorized access and interference",
    icon: "shield" as const,
  },
  {
    id: "conduct",
    title: "General conduct",
    text: "Rules against unlawful or infringing content transmission",
    icon: "eye" as const,
  },
  {
    id: "liability",
    title: "Liability & indemnity",
    text: "Limits of liability, indemnity and damage disclaimers",
    icon: "handshake" as const,
  },
];

interface Props {
  company: string;
  brand: string;
  email: string;
  phone: string;
  phoneRaw: string;
  address: string;
  mapUrl: string;
  whatsappUrl: string;
}

export function TermsView({ company, email, phone, phoneRaw, address, mapUrl, whatsappUrl }: Props) {
  const [active, setActive] = useState(SECTIONS[0].id);
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
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
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
  }, []);

  // The browser's print window offers "Save as PDF". The page title becomes the file name.
  const downloadPdf = () => {
    const previous = document.title;
    document.title = "Recenturesoft-Terms-and-Conditions";
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
          src="/images/hero.jpg"
          alt="Recenturesoft Infotech Terms and Conditions Hero Banner"
          fill
          priority
          sizes="100vw"
          quality={85}
          className={styles.topImg}
        />
        <span className={styles.topShade} aria-hidden="true" />
        <div className="container">
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.lead}>
            The terms, conditions and acceptable use rules governing your visit to https://websiterecentresoft.vercel.app/.
          </p>
          <p className={styles.printMeta}>{company} &middot; https://websiterecentresoft.vercel.app/terms-and-conditions</p>

          <ul className={styles.glance} aria-label="Quick links">
            {GLANCE.map((g, i) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className={styles.glanceTile}>
                  <span className={styles.glanceTop}>
                    <span className={styles.glanceIcon}>
                      <Icon name={g.icon} className={styles.glanceSvg} />
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
                  <a
                    href={`#${s.id}`}
                    className={`${styles.tocLink} ${active === s.id ? styles.tocLinkOn : ""}`}
                    aria-current={active === s.id ? "true" : undefined}
                  >
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
          <section id="introduction" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>1</span>Terms and conditions
            </h2>
            <p>
              The terms <strong>&ldquo;We&rdquo; / &ldquo;Us&rdquo; / &ldquo;Our&rdquo; / &ldquo;Company&rdquo;</strong> individually and collectively refer to <strong>{company}</strong> and the terms{" "}
              <strong>&ldquo;Visitor&rdquo; / &ldquo;User&rdquo;</strong> refer to the users.
            </p>
            <p>
              This page states the Terms and Conditions under which you (Visitor) may visit this website (&ldquo;Website&rdquo;). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this site.
            </p>
            <p className={styles.note}>
              The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website.
            </p>
          </section>

          <section id="content" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>2</span>Use of content
            </h2>
            <p>
              All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under licence, by the business and / or its associate entities who feature on this Website.
            </p>
            <p>
              The use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited.
            </p>
            <p className={styles.note}>
              You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organisation&apos;s or entity&apos;s written permission.
            </p>
          </section>

          <section id="security" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>3</span>Acceptable website use: Security rules
            </h2>
            <p>Visitors are prohibited from violating or attempting to violate the security of the Web site, including, without limitation:</p>
            <ol className={styles.clauses}>
              <li>
                <span className={styles.clauseKey}>(1)</span>
                <p>Accessing data not intended for such user or logging into a server or account which the user is not authorised to access.</p>
              </li>
              <li>
                <span className={styles.clauseKey}>(2)</span>
                <p>Attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorisation.</p>
              </li>
              <li>
                <span className={styles.clauseKey}>(3)</span>
                <p>
                  Attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus or &ldquo;Trojan horse&rdquo; to the Website, overloading, &ldquo;flooding&rdquo;, &ldquo;mail bombing&rdquo; or &ldquo;crashing&rdquo;.
                </p>
              </li>
              <li>
                <span className={styles.clauseKey}>(4)</span>
                <p>Sending unsolicited electronic mail, including promotions and/or advertising of products or services.</p>
              </li>
            </ol>
            <p className={styles.note}>
              Violations of system or network security may result in civil or criminal liability. The business and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.
            </p>
          </section>

          <section id="conduct" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>4</span>Acceptable website use: General rules
            </h2>
            <p>Visitors may not use the Web Site in order to transmit, distribute, store or destroy material:</p>
            <ol className={styles.clauses}>
              <li>
                <span className={styles.clauseKey}>(a)</span>
                <p>That could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation.</p>
              </li>
              <li>
                <span className={styles.clauseKey}>(b)</span>
                <p>In a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others or violate the privacy or publicity of other personal rights of others.</p>
              </li>
              <li>
                <span className={styles.clauseKey}>(c)</span>
                <p>That is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful.</p>
              </li>
            </ol>
          </section>

          <section id="indemnity" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>5</span>Indemnity
            </h2>
            <p className={styles.note}>
              The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use of{" "}
              <a href="https://websiterecentresoft.vercel.app/" target="_blank" rel="noopener noreferrer">
                https://websiterecentresoft.vercel.app/
              </a>{" "}
              or their breach of the terms.
            </p>
          </section>

          <section id="liability" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>6</span>Liability
            </h2>
            <p>
              User agrees that neither Company nor its group companies, directors, officers or employee shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of user&apos;s transmissions or/and data or/and arising from any other matter relating to the service, including but not limited to, damages for loss of profits or/and use or/and data or other intangible, even if Company has been advised of the possibility of such damages.
            </p>
            <p>
              User further agrees that Company shall not be liable for any damages arising from interruption, suspension or termination of service, including but not limited to direct or/and indirect or/and incidental or/and special consequential or/and exemplary damages, whether such interruption or/and suspension or/and termination was justified or not, negligent or intentional, inadvertent or advertent.
            </p>
            <p className={styles.note}>
              User agrees that Company shall not be responsible or liable to user, or anyone, for the statements or conduct of any third party of the service. In sum, in no event shall Company&apos;s total liability to the User for all damages or/and losses or/and causes of action exceed the amount paid by the User to Company, if any, that is related to the cause of action.
            </p>
          </section>

          <section id="damages" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>7</span>Disclaimer of consequential damages
            </h2>
            <p>
              In no event shall Company or any parties, organisations or entities associated with the corporate brand name us or otherwise, mentioned at this Website be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the Website and the Website material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organisation or entities were advised of the possibility of such damages.
            </p>
          </section>

          <section id="revisions" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>8</span>Revisions to terms
            </h2>
            <p>
              The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website.
            </p>
          </section>

          <section id="contact" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>9</span>Contact information
            </h2>
            <p>
              For formal legal communications, notices, or inquiries regarding these Terms and Conditions, please contact our registered office:
            </p>

            <div className={styles.contactBox}>
              <div className={styles.contactHead}>
                <span className={styles.contactMark}>
                  <Icon name="shield" className={styles.contactMarkSvg} />
                </span>
                <div>
                  <p className={styles.contactName}>Legal &amp; Compliance Department</p>
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
                  <a href={`mailto:${email}?subject=Terms%20and%20Conditions%20Inquiry`} className={styles.contactRow}>
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
                <a href={`mailto:${email}?subject=Terms%20and%20Conditions%20Inquiry`} className={styles.btnMain}>
                  Email our Legal Team
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.btnLine}>
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </section>
        </article>

        <aside className={styles.rail} aria-label="Contact for legal questions">
          <div className={styles.railBox}>
            <span className={styles.railMark}>
              <Icon name="shield" className={styles.railMarkSvg} />
            </span>
            <h2 className={styles.railTitle}>Questions about these terms?</h2>
            <p className={styles.railText}>
              Write to our legal and compliance department. All contractual and policy questions are addressed here.
            </p>

            <ul className={styles.railList}>
              <li>
                <a href={`mailto:${email}?subject=Terms%20and%20Conditions%20question`} className={styles.railRow}>
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

            <a href="#contact" className={styles.railBtn}>
              Contact details
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

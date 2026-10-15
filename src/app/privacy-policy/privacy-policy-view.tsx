"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/app/services/icons";
import styles from "./privacy-policy.module.css";

const SECTIONS = [
  { id: "introduction", label: "Introduction and acceptance" },
  { id: "information", label: "User information" },
  { id: "cookies", label: "Cookies" },
  { id: "links", label: "Links to other sites" },
  { id: "sharing", label: "Information sharing" },
  { id: "security", label: "Information security" },
  { id: "updates", label: "Policy updates" },
  { id: "grievance", label: "Grievance redressal" },
];

const GLANCE = [
  { id: "information", title: "User information", text: "What you provide to use our services", icon: "document" as const },
  { id: "cookies", title: "Cookies and logs", text: "How cookies and server logs work", icon: "eye" as const },
  { id: "sharing", title: "Information sharing", text: "The limited cases where it is disclosed", icon: "handshake" as const },
  { id: "security", title: "Information security", text: "How stored information is protected", icon: "shield" as const },
];

const COLLECTED = [
  "Legal name",
  "Email address",
  "Sex and age",
  "PIN code",
  "Payment parameters",
  "Occupation and interests",
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

export function PrivacyPolicyView({ company, email, phone, phoneRaw, address, mapUrl, whatsappUrl }: Props) {
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
  }, []);

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
          src="/images/hero.jpg"
          alt="Recenturesoft Infotech Privacy Policy Hero Banner"
          fill
          priority
          sizes="100vw"
          quality={85}
          className={styles.topImg}
        />
        <span className={styles.topShade} aria-hidden="true" />
        <div className="container">
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lead}>
            How {company} collects, uses, protects and shares information on https://websiterecentresoft.vercel.app/.
          </p>
          <p className={styles.printMeta}>{company} &middot; https://websiterecentresoft.vercel.app/privacy-policy</p>

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
          <section id="introduction" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>1</span>Introduction and acceptance
            </h2>
            <p>
              The terms <strong>&ldquo;We&rdquo; / &ldquo;Us&rdquo; / &ldquo;Our&rdquo; / &ldquo;Company&rdquo;</strong> individually and collectively refer to <strong>{company}</strong> and the terms{" "}
              <strong>&ldquo;You&rdquo; / &ldquo;Your&rdquo; / &ldquo;Yourself&rdquo;</strong> refer to the users.
            </p>
            <p>
              This Privacy Policy is an electronic record in the form of an electronic contract formed under the <strong>Information Technology Act, 2000</strong> and the rules made thereunder and the amended provisions pertaining to electronic documents / records in various
              statutes as amended by the Information Technology Act, 2000. This Privacy Policy does not require any physical, electronic or digital signature.
            </p>
            <p className={styles.note}>
              This Privacy Policy is a legally binding document between you and the Company (both the terms defined above). The terms of this Privacy Policy will be effective upon your acceptance of the same (directly or indirectly in electronic form, by clicking on the I accept tab or by
              use of the website or by other means) and will govern the relationship between you and the Company for your use of the website{" "}
              <a href="https://websiterecentresoft.vercel.app/" target="_blank" rel="noopener noreferrer">
                https://websiterecentresoft.vercel.app/
              </a>{" "}
              (referred to as &ldquo;website&rdquo; or &ldquo;site&rdquo; in this document).
            </p>
            <p>
              This document is published and shall be construed in accordance with the provisions of the{" "}
              <strong>Information Technology (Reasonable security practices and procedures and sensitive personal data of information) Rules, 2011</strong> under Information Technology Act, 2000; that require publishing of the Privacy Policy for collection, use, storage and transfer of
              sensitive personal data or information.
            </p>
            <p>
              Please read this Privacy Policy carefully by using the Website, you indicate that you understand, agree and consent to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use this Website.
            </p>
            <p>
              By providing us your Information or by making use of the facilities provided by the Website, You hereby consent to the collection, storage, processing and transfer of any or all of Your Personal Information and Non-Personal Information by us as specified under this Privacy
              Policy. You further agree that such collection, use, storage and transfer of Your Information shall not cause any loss or wrongful gain to you or any other person.
            </p>
          </section>

          <section id="information" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>2</span>User information
            </h2>
            <p>To avail certain services on our Websites, users are required to provide certain information for the registration process namely:</p>
            <ul className={styles.chips}>
              {COLLECTED.map((item, i) => (
                <li key={item} className={styles.chip}>
                  <span className={styles.chipLetter}>{String.fromCharCode(97 + i)}</span>
                  {item}
                </li>
              ))}
            </ul>
            <p>The Information as supplied by the users enables us to improve our sites and provide you the most user-friendly experience.</p>
            <p>
              All required information is service dependent and we may use the above said user information to maintain, protect, and improve our services (including advertising services) and for developing new services.
            </p>
            <p className={styles.note}>
              Such information will not be considered as sensitive if it is freely available and accessible in the public domain or is furnished under the <strong>Right to Information Act, 2005</strong> or any other law for the time being in force.
            </p>
          </section>

          <section id="cookies" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>3</span>Cookies
            </h2>
            <p>
              To improve the responsiveness of the sites for our users, we may use &ldquo;cookies&rdquo;, or similar electronic tools to collect information to assign each visitor a unique, random number as a User Identification (User ID) to understand the user&apos;s individual
              interests using the Identified Computer.
            </p>
            <p>
              Unless you voluntarily identify yourself (through registration, for example), we will have no way of knowing who you are, even if we assign a cookie to your computer. The only personal information a cookie can contain is information you supply. A cookie cannot read data off
              your hard drive. Our advertisers may also assign their own cookies to your browser (if you click on their ads), a process that we do not control.
            </p>
            <h3 className={styles.sub}>Web server access logs</h3>
            <p>
              Our web servers automatically collect limited information about your computer&apos;s connection to the Internet, including your IP address, when you visit our site. (Your IP address is a number that lets computers attached to the Internet know where to send you data
              &mdash; such as the web pages you view.) Your IP address does not identify you personally. We use this information to deliver our web pages to you upon request, to tailor our site to the interests of our users, to measure traffic within our site and let advertisers know
              the geographic locations from where our visitors come.
            </p>
          </section>

          <section id="links" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>4</span>Links to other sites
            </h2>
            <p>
              Our policy discloses the privacy practices for our own web site only. Our site provides links to other websites also that are beyond our control. We shall in no way be responsible in any way for your use of such sites.
            </p>
          </section>

          <section id="sharing" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>5</span>Information sharing
            </h2>
            <p>We share the sensitive personal information to any third party without obtaining the prior consent of the user in the following limited circumstances:</p>
            <ol className={styles.clauses}>
              <li>
                <span className={styles.clauseKey}>(a)</span>
                <p>
                  When it is requested or required by law or by any court or governmental agency or authority to disclose, for the purpose of verification of identity, or for the prevention, detection, investigation including cyber incidents, or for prosecution and punishment of offences.
                  These disclosures are made in good faith and belief that such disclosure is reasonably necessary for enforcing these Terms; for complying with the applicable laws and regulations.
                </p>
              </li>
              <li>
                <span className={styles.clauseKey}>(b)</span>
                <p>
                  We propose to share such information within its group companies and officers and employees of such group companies for the purpose of processing personal information on its behalf. We also ensure that these recipients of such information agree to process such
                  information based on our instructions and in compliance with this Privacy Policy and any other appropriate confidentiality and security measures.
                </p>
              </li>
            </ol>
          </section>

          <section id="security" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>6</span>Information security
            </h2>
            <p>
              We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. These include internal reviews of our data collection, storage and processing practices and security measures, including
              appropriate encryption and physical security measures to guard against unauthorized access to systems where we store personal data.
            </p>
            <p>
              All information gathered on our Website is securely stored within our controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited.
            </p>
            <p className={styles.note}>
              However, as effective as our security measures are, no security system is impenetrable. We cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. And, of
              course, any information you include in a posting to the discussion areas is available to anyone with Internet access.
            </p>
          </section>

          <section id="updates" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>7</span>Policy updates
            </h2>
            <p>
              However the internet is an ever evolving medium. We may change our Privacy Policy from time to time to incorporate necessary future changes. Of course, our use of any information we gather will always be consistent with the policy under which the information was
              collected, regardless of what the new policy may be.
            </p>
          </section>

          <section id="grievance" className={styles.block}>
            <h2 className={styles.heading}>
              <span className={styles.num}>8</span>Grievance redressal
            </h2>
            <p>
              Any complaints, abuse or concerns with regards to content and or comment or breach of these terms shall be immediately informed to the designated Grievance Officer as mentioned below via in writing or through email signed with the electronic signature
              (&ldquo;Grievance Officer&rdquo;).
            </p>

            <div className={styles.contactBox}>
              <div className={styles.contactHead}>
                <span className={styles.contactMark}>
                  <Icon name="shield" className={styles.contactMarkSvg} />
                </span>
                <div>
                  <p className={styles.contactName}>Grievance Officer</p>
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
            <h2 className={styles.railTitle}>Questions about this policy?</h2>
            <p className={styles.railText}>Write to our Grievance Officer. Privacy concerns are handled here.</p>

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

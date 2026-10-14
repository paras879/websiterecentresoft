import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact-form";
import { Icon, type IconName } from "../services/icons";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Recenturesoft Infotech",
  description:
    "Contact Recenturesoft Infotech Pvt Ltd in Noida for custom software development, web engineering, and enterprise AI automation inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Recenturesoft Infotech",
    description:
      "Contact Recenturesoft Infotech Pvt Ltd in Noida for custom software development, web engineering, and enterprise AI automation inquiries.",
    url: "https://www.recenturesoft.com/contact",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Recenturesoft Infotech Corporate Team",
      },
    ],
  },
};

const mapsUrl = siteConfig.contact.mapUrl;

export default function ContactPage() {
  const { contact } = siteConfig;

  const channels: {
    icon: IconName;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[] = [
    {
      icon: "mailIcon",
      label: "Official Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: "phone",
      label: "Phone Number",
      value: contact.phone,
      href: `tel:${contact.phoneRaw}`,
    },
    {
      icon: "chat",
      label: "WhatsApp",
      value: "Message us on WhatsApp",
      href: contact.whatsappUrl,
      external: true,
    },
    {
      icon: "pin",
      label: "Registered Office Address",
      value: contact.address,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="contact-heading">
        <Image
          src="/images/home-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <h1 id="contact-heading" className={styles.heroTitle}>
            Let&apos;s Build Something Great Together
          </h1>
          <p className={styles.heroText}>
            Have a custom software development or enterprise AI automation project in mind?
            Share your requirements with our technical team today.
          </p>
        </div>
      </section>

      {/* Form + channels */}
      <section className={styles.section} aria-label="Contact form and details">
        <div className={`container ${styles.mainGrid}`}>
          <ContactForm />

          <aside className={styles.side}>
            <div className={styles.channels}>
              <h2 className={styles.sideTitle}>Direct Channels</h2>
              <ul className={styles.channelList}>
                {channels.map((item) => {
                  const body = (
                    <>
                      <span className={styles.channelIcon}>
                        <Icon name={item.icon} className={styles.icon} />
                      </span>
                      <span className={styles.channelText}>
                        <span className={styles.channelLabel}>{item.label}</span>
                        <span className={styles.channelValue}>{item.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`${styles.channel} ${styles.channelLink}`}
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className={styles.channel}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={styles.office}>
              <div className={styles.officePhoto}>
                <Image
                  src="/images/services-team.jpg"
                  alt="Engineering team discussing architecture at the Noida office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className={styles.officeImage}
                />
              </div>
              <div className={styles.officeBody}>
                <div>
                  <p className={styles.officeTitle}>Noida Development Center</p>
                  <p className={styles.officeSub}>Sector 63, Noida, UP</p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.officeLink}
                >
                  Get directions <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.closing} aria-labelledby="contact-cta-heading">
        <div className="container">
          <div className={styles.closingInner}>
            <h2 id="contact-cta-heading" className={styles.closingTitle}>
              Tell Us What You&apos;re Looking to Build
            </h2>
            <p className={styles.closingText}>
              Have a custom software development or enterprise AI automation project in mind?
              Share your requirements with our technical team today.
            </p>
            <div className={styles.closingActions}>
              <a href={`tel:${contact.phoneRaw}`} className={styles.btnPrimary}>
                <Icon name="phone" className={styles.icon} />
                Call Noida Labs Now
              </a>
              <a href={`mailto:${contact.email}`} className={styles.btnGhost}>
                Email Technical Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className={styles.careers} aria-labelledby="careers-heading">
        <div className={`container ${styles.careersInner}`}>
          <div>
            <h2 id="careers-heading" className={styles.careersTitle}>
              Careers
            </h2>
            <p className={styles.careersText}>
              No current openings are listed at this time. For future opportunities, write to{" "}
              <a href="mailto:hr@recenturesoft.com" className={styles.textLink}>
                hr@recenturesoft.com
              </a>
              .
            </p>
          </div>
          <a href="mailto:hr@recenturesoft.com" className={styles.btnOutline}>
            Email HR Team <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <div className={styles.backRow}>
        <div className="container">
          <Link href="/" className={styles.textLink}>
            &larr; Back to Recenturesoft Home
          </Link>
        </div>
      </div>
    </div>
  );
}

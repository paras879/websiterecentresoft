import type { Metadata } from "next";
import { FaqSection } from "@/components/faq-section";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";
import { Icon, type IconName } from "../services/icons";
import styles from "./contact.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSiteContent();
  return pageMetadata(contact.meta, "/contact");
}

export default async function ContactPage() {
  const content = await getSiteContent();
  const info = await getSiteInfo();
  const { contact } = info;
  const { hero, form, channels: copy, office, closing, backLabel } = content.contact;

  const channels: {
    icon: IconName;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[] = [
    {
      icon: "mailIcon",
      label: copy.emailLabel,
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: "phone",
      label: copy.phoneLabel,
      value: contact.phone,
      href: `tel:${contact.phoneRaw}`,
    },
    {
      icon: "chat",
      label: copy.whatsappLabel,
      value: copy.whatsappText,
      href: contact.whatsappUrl,
      external: true,
    },
    {
      icon: "pin",
      label: copy.addressLabel,
      value: contact.address,
      href: contact.mapUrl,
      external: true,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="contact-heading">
        {hero.image ? (
          <Image src={hero.image} alt={hero.imageAlt} fill priority fetchPriority="high" sizes="100vw" className={styles.heroImage} />
        ) : null}
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <h1 id="contact-heading" className={styles.heroTitle}>
            {hero.title}
          </h1>
          {hero.text ? <p className={styles.heroText}>{hero.text}</p> : null}
        </div>
      </section>

      {/* Form + channels */}
      <section className={styles.section} aria-label="Contact form and details">
        <div className={`container ${styles.mainGrid}`}>
          <ContactForm
            services={[...content.site.header.menu.map((m) => m.title), ...form.services]}
            recipientEmail={contact.email}
          />

          <aside className={styles.side}>
            <div className={styles.channels}>
              <h2 className={styles.sideTitle}>{copy.title}</h2>
              <ul className={styles.channelList}>
                {channels
                  .filter((item) => item.value)
                  .map((item) => {
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
                      <li key={item.icon}>
                        {item.href ? (
                          <a
                            href={item.href}
                            className={`${styles.channel} ${styles.channelLink}`}
                            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
              {office.image ? (
                <div className={styles.officePhoto}>
                  <Image
                    src={office.image}
                    alt={office.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className={styles.officeImage}
                  />
                </div>
              ) : null}
              <div className={styles.officeBody}>
                <div>
                  <p className={styles.officeTitle}>{office.title}</p>
                  <p className={styles.officeSub}>{office.subtitle}</p>
                </div>
                {office.linkLabel ? (
                  <a
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.officeLink}
                  >
                    {office.linkLabel} <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <FaqSection title={content.contact.faq.title} items={content.contact.faq.items} />

      {/* CTA */}
      <section className={styles.closing} aria-labelledby="contact-cta-heading">
        <div className="container">
          <div className={styles.closingInner}>
            <h2 id="contact-cta-heading" className={styles.closingTitle}>
              {closing.title}
            </h2>
            {closing.text ? <p className={styles.closingText}>{closing.text}</p> : null}
            <div className={styles.closingActions}>
              {closing.callLabel ? (
                <a href={`tel:${contact.phoneRaw}`} className={styles.btnPrimary}>
                  <Icon name="phone" className={styles.icon} />
                  {closing.callLabel}
                </a>
              ) : null}
              {closing.emailLabel ? (
                <a href={`mailto:${contact.email}`} className={styles.btnGhost}>
                  {closing.emailLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {backLabel ? (
        <div className={styles.backRow}>
          <div className="container">
            <Link href="/" className={styles.textLink}>
              &larr; {backLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

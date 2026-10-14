import Link from "next/link";
import Image from "next/image";
import type { SiteContent } from "@/content";
import type { SiteInfo } from "@/lib/site";
import { socialIcons, type SocialIconName } from "@/lib/social-icons";
import styles from "./site-footer.module.css";

const icons = {
  location:
    "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  chat: "M21 11.5a8.5 8.5 0 01-12.6 7.4L3 20.5l1.7-5A8.5 8.5 0 1121 11.5z",
};

function StrokeIcon({ path }: { path: string }) {
  return (
    <svg className={styles.stroke} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function SiteFooter({ site, info }: { site: SiteContent["site"]; info: SiteInfo }) {
  const currentYear = new Date().getFullYear();
  const { contact } = info;
  const { footer, socials } = site;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.mainSection}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand} aria-label={`${info.name} - A Hub of IT Services`}>
              <Image
                src="/images/recenturesoft-logo.png"
                alt="Recenturesoft - A Hub of IT Services"
                width={180}
                height={60}
                className={styles.brandLogoLight}
              />
              <Image
                src="/images/logo_white.PNG"
                alt="Recenturesoft"
                width={180}
                height={60}
                className={styles.brandLogoDark}
              />
            </Link>
            <p className={styles.description}>{info.description}</p>

            {socials.length > 0 ? (
              <ul className={styles.socialList} aria-label={`${info.name} on social media`}>
                {socials.map((social) => (
                  <li key={`${social.name}-${social.href}`}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label={social.name}
                      title={social.name}
                    >
                      <svg className={styles.fillIcon} viewBox="0 0 24 24" aria-hidden="true">
                        <path d={socialIcons[social.icon as SocialIconName] ?? socialIcons.linkedin} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link columns */}
          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className={styles.colTitle}>{column.title}</h2>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div>
            <h2 className={styles.colTitle}>{footer.contactTitle}</h2>
            <ul className={styles.contactList}>
              <li>
                <a
                  href={contact.mapUrl}
                  className={styles.contactItem}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${contact.address} in Google Maps`}
                >
                  <span className={styles.contactIcon}>
                    <StrokeIcon path={icons.location} />
                  </span>
                  <span className={styles.contactText}>{contact.address}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <StrokeIcon path={icons.mail} />
                  </span>
                  <span className={styles.contactText}>{contact.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phoneRaw}`} className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <StrokeIcon path={icons.phone} />
                  </span>
                  <span className={styles.contactText}>{contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactItem} ${styles.whatsappItem}`}
                  aria-label="Chat with Recenturesoft on WhatsApp"
                >
                  <span className={`${styles.contactIcon} ${styles.whatsappIcon}`}>
                    <svg viewBox="0 0 24 24" className={styles.whatsappSvg} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M17.507 14.307l-.009.075c-.246.732-1.44 1.341-2.007 1.38-.521.036-1.198.059-3.468-1.047-2.732-1.332-4.48-4.321-4.615-4.523-.136-.201-1.11-1.635-1.11-3.118 0-1.484.708-2.214.962-2.513.255-.3.673-.448.898-.448.225 0 .45.002.646.012.207.01.482-.087.755.637.28.741.956 2.585 1.041 2.776.084.192.14.417.028.665-.113.248-.17.404-.338.622-.169.217-.355.485-.508.652-.169.186-.346.388-.149.764.197.375.877 1.597 1.88 2.593 1.293 1.282 2.383 1.68 2.723 1.868.34.188.54.16.741-.094.202-.254.863-1.11 1.094-1.492.232-.383.464-.32.781-.19.317.13 2.012 1.054 2.358 1.246.346.192.577.286.662.448.085.162.085.938-.161 1.67zM12 2a10 10 0 0 0-8.66 15L2 22l5.13-1.31A10 10 0 1 0 12 2z"
                      />
                    </svg>
                  </span>
                  <span className={`${styles.contactText} ${styles.whatsappText}`}>
                    {footer.whatsappLabel}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copy} suppressHydrationWarning>
            &copy; {currentYear} {info.legalName}. {footer.rightsText}
          </p>
          <span className={styles.officialNote}>{footer.bottomNote}</span>
        </div>
      </div>
    </footer>
  );
}

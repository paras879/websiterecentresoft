import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./site-footer.module.css";

const socials = [
  {
    name: "LinkedIn",
    href: "https://in.linkedin.com/company/recenturesoft",
    path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.84-2 3.8-2 4.06 0 4.84 2.67 4.84 6.14V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/recenture_soft",
    path: "M18.2 2.5h3.3l-7.2 8.2 8.5 11.3h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.5H8l4.7 6.2 5.5-6.2zm-1.2 17.5h1.8L7 4.4H5.1L17 20z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/recenturesoftinfotech/",
    path: "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V13h2.8v8z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCwrJM7HFZGmke0jr8y4VYXg",
    path: "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z",
  },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Sitemap", href: "/sitemap" },
];

const serviceLinks = [
  { label: "Software Development", href: "/services/software-development" },
  { label: "AI Automation", href: "/services/ai-automation" },
  { label: "Custom Development", href: "/services/custom-development" },
  { label: "SEO Services", href: "/services/seo" },
];

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

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.mainSection}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand} aria-label={`${siteConfig.name} Home`}>
              <span className={styles.brandMark} aria-hidden="true">
                R
              </span>
              <span className={styles.brandText}>
                {siteConfig.name}
                <span className={styles.brandAccent}>.</span>
              </span>
            </Link>
            <p className={styles.description}>{siteConfig.description}</p>

            <ul className={styles.socialList} aria-label="Recenturesoft on social media">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    aria-label={social.name}
                    title={social.name}
                  >
                    <svg className={styles.fillIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <nav aria-label="Company">
            <h2 className={styles.colTitle}>Company</h2>
            <ul className={styles.linkList}>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h2 className={styles.colTitle}>Services</h2>
            <ul className={styles.linkList}>
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className={styles.colTitle}>Get in Touch</h2>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <StrokeIcon path={icons.location} />
                </span>
                <span className={styles.contactText}>{contact.address}</span>
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
                  className={styles.contactItem}
                >
                  <span className={styles.contactIcon}>
                    <StrokeIcon path={icons.chat} />
                  </span>
                  <span className={styles.contactText}>Message us on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copy} suppressHydrationWarning>
            &copy; {currentYear} {siteConfig.legalName}. All rights reserved.
          </p>
          <span className={styles.officialNote}>Noida, Uttar Pradesh, India</span>
        </div>
      </div>
    </footer>
  );
}

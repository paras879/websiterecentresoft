import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={`container ${styles.container}`} aria-labelledby="notfound-heading">
      <div className={styles.card}>
        <div className={styles.badge}>Status 404 &bull; Resource Missing</div>
        <p className={styles.code} aria-hidden="true">
          404
        </p>

        <h1 id="notfound-heading" className={styles.title}>
          Page Not Found
        </h1>

        <p className={styles.description}>
          The page or corporate resource you requested could not be located. It may have been
          reorganized, renamed, or is temporarily unavailable.
        </p>

        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            Return to Homepage
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact Support &rarr;
          </Link>
        </div>

        <div className={styles.quickLinksSection}>
          <span className={styles.quickLinksTitle}>Suggested Corporate Pages</span>
          <nav className={styles.quickLinksList} aria-label="Suggested pages">
            <Link href="/" className={styles.quickLink}>
              Home
            </Link>
            <Link href="/about" className={styles.quickLink}>
              About Us
            </Link>
            <Link href="/services/software-development" className={styles.quickLink}>
              Software Development
            </Link>
            <Link href="/services/ai-automation" className={styles.quickLink}>
              AI Automation
            </Link>
            <Link href="/contact" className={styles.quickLink}>
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

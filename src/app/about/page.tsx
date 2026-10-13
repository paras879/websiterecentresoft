import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "../services/icons";
import styles from "../services/services.module.css";

export const metadata: Metadata = {
  title: "About Us | Recenturesoft Infotech",
  description:
    "Learn about Recenturesoft Infotech Pvt Ltd, our engineering capabilities, software development approach, and enterprise technology solutions.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Recenturesoft Infotech",
    description:
      "Learn about Recenturesoft Infotech Pvt Ltd, our engineering capabilities, software development approach, and enterprise technology solutions.",
    url: "https://www.recenturesoft.com/about",
    images: [
      {
        url: "/images/about.jpg",
        width: 1200,
        height: 630,
        alt: "About Recenturesoft Infotech Engineering Team",
      },
    ],
  },
};

const info = [
  { label: "Registered Office", value: "Sector 63, Noida, UP" },
  { label: "Focus", value: "Software & AI Automation" },
  { label: "Collaboration", value: "Direct access to the engineering team" },
];

const pragmatic: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "terminal",
    title: "Core Architectural Discipline",
    desc: "Built on clean modular code, predictable release cycles and transparent communication. Every system is structured for testability and straightforward maintenance.",
  },
  {
    icon: "architecture",
    title: "Direct Technical Collaboration",
    desc: "Clients work directly with the developers and architects building their applications, which keeps decisions quick and context intact.",
  },
  {
    icon: "check",
    title: "Objective Business Impact",
    desc: "We avoid speculative buzzwords. Every line of code and automation is built to solve a defined business bottleneck and reduce operational overhead.",
  },
];

const principles: { icon: IconName; label: string; title: string; desc: string }[] = [
  {
    icon: "code",
    label: "01 / ARCHITECTURE",
    title: "Maintainable Codebases",
    desc: "Documented, modular code on modern frameworks, designed for longevity and low technical debt.",
  },
  {
    icon: "database",
    label: "02 / LOGIC",
    title: "Predictable Logic",
    desc: "Reliable APIs, transactional integrity and predictable automated pipelines rather than black-box experiments.",
  },
  {
    icon: "shield",
    label: "03 / GOVERNANCE",
    title: "Security-Conscious Development",
    desc: "Security considered from schema design through production deployment.",
  },
  {
    icon: "eye",
    label: "04 / OPERATIONS",
    title: "Transparent Collaboration",
    desc: "Visibility into sprint progress, regular code walkthroughs and proactive technical updates.",
  },
];

const podPoints = [
  {
    title: "Cross-functional teams:",
    desc: "Frontend engineers, backend engineers and QA work together for quicker coordination.",
  },
  {
    title: "Whiteboard sessions:",
    desc: "Complex domain logic is mapped collaboratively before schemas are written.",
  },
  {
    title: "Clear communication:",
    desc: "Regular updates and walkthroughs keep timelines and expectations aligned.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="about-intro-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="about-intro-heading" className={styles.heroTitle}>
              Engineering Dependable Software from Sector 63, Noida
            </h1>
            <p className={styles.heroText}>
              Recenturesoft Infotech Pvt. Ltd. is a custom software engineering and AI
              automation company. We partner with organisations to build robust web
              applications, maintainable backend architectures, and practical workflow
              automation that solves real operational challenges.
            </p>
            <div className={styles.infoGrid}>
              {info.map((item) => (
                <div key={item.label}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  <p className={styles.infoValue}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/home-hero.jpg"
              alt="Engineers collaborating around architecture diagrams in a Noida office"
              width={1200}
              height={896}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Pragmatic engineering */}
      <section className={styles.pragSection} aria-labelledby="pragmatic-heading">
        <div className={`container ${styles.pragLayout}`}>
          <header className={styles.pragIntro}>
            <span className={styles.pragBar} aria-hidden="true" />
            <h2 id="pragmatic-heading" className={styles.pragTitle}>
              Pragmatic Engineering,{" "}
              <span className={styles.pragGradient}>Zero Hype</span>
            </h2>
            <p className={styles.pragLead}>
              Our approach prioritises long-term software sustainability over passing
              technology trends. We care about reliable systems and real efficiency gains for
              the people who use them.
            </p>
            <Link href="/contact" className={styles.pragLink}>
              Talk to our team <span aria-hidden="true">&rarr;</span>
            </Link>
          </header>

          <ol className={styles.pragList}>
            {pragmatic.map((item, index) => (
              <li key={item.title} className={styles.pragRow}>
                <span className={styles.pragNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.pragBody}>
                  <h3 className={styles.pragRowTitle}>{item.title}</h3>
                  <p className={styles.body}>{item.desc}</p>
                </div>
                <span className={styles.pragIcon} aria-hidden="true">
                  <Icon name={item.icon} className={styles.icon} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Principles */}
      <section className={styles.prinSection} aria-labelledby="principles-heading">
        <div className="container">
          <header className={styles.prinHead}>
            <h2 id="principles-heading" className={styles.prinTitle}>
              Our Engineering Principles
            </h2>
            <p className={styles.prinLead}>
              The standards that guide how our team designs, refactors and deploys business
              systems.
            </p>
          </header>

          <div className={styles.prinPanel}>
            {principles.map((item) => (
              <article key={item.title} className={styles.prinItem}>
                <span className={styles.prinLabel}>{item.label}</span>
                <div className={styles.prinIcon}>
                  <Icon name={item.icon} className={styles.icon} />
                </div>
                <h3 className={styles.prinItemTitle}>{item.title}</h3>
                <p className={styles.prinText}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Development pods */}
      <section className={styles.section} aria-labelledby="pods-heading">
        <div className={`container ${styles.split}`}>
          <div className={styles.photoFrame}>
            <Image
              src="/images/services-team.jpg"
              alt="Engineers discussing microservices architecture at a whiteboard"
              width={1200}
              height={896}
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>

          <div className={styles.splitCopy}>
            <h2 id="pods-heading" className={styles.h2}>
              Our Development Teams in Noida
            </h2>
            <p className={styles.lead}>
              Our engineering and automation teams work out of Sector 63, Noida. Keeping
              design, development and quality engineering close together supports quick
              turnaround and shared understanding of your project.
            </p>
            <ul className={styles.checkItems}>
              {podPoints.map((point) => (
                <li key={point.title}>
                  <Icon name="check" className={`${styles.icon} ${styles.smallCheck}`} />
                  <span>
                    <strong>{point.title}</strong> {point.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.ctaBand} ${styles.ctaAbout}`} aria-labelledby="about-cta-heading">
        <div className={`container ${styles.closeInner}`}>
          <h2 id="about-cta-heading" className={styles.closeTitle}>
            Ready to discuss your software or automation requirements?
          </h2>
          <p className={styles.closeText}>
            Connect with our Noida team. We&apos;ll review your existing setup, discuss
            architecture options, and agree clear timelines.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>
              Discuss Your Project <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/services/software-development" className={styles.btnGhost}>
              Explore Services <span aria-hidden="true">&rsaquo;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Recenturesoft | Software Engineering & AI Automation",
  description:
    "Recenturesoft Infotech delivers custom software engineering, enterprise web applications, and AI-powered workflow automation from Noida, India.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Recenturesoft | Software Engineering & AI Automation",
    description:
      "Custom software engineering, enterprise web applications, and AI-powered workflow automation from Noida, India.",
    url: "https://www.recenturesoft.com",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft Software Engineering & AI Automation",
      },
    ],
  },
};

const services = [
  {
    title: "Software Development",
    desc: "Custom software engineering for enterprise systems and modern web applications.",
    items: [
      "Custom software engineered around your business logic",
      "Enterprise web applications built for reliability",
      "Scalable business systems and backend architecture",
    ],
    href: "/services/software-development",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  },
  {
    title: "AI Automation",
    desc: "AI-powered workflow automation integrated directly into the way your teams already work.",
    items: [
      "Workflow automation that removes manual, repetitive effort",
      "AI-powered operations and data pipeline integration",
      "Automated routing and triage for business processes",
    ],
    href: "/services/ai-automation",
    icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1",
  },  {
    title: "Custom Development",
    desc: "Tailored digital solutions built around your workflows, from web platforms to integrations.",
    items: [
      "Custom web applications and enterprise portals",
      "API development and third-party integrations",
      "Legacy system modernisation, done in phases",
    ],
    href: "/services/custom-development",
    icon: "M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z",
  },
  {
    title: "SEO Services",
    desc: "Data-led search optimisation that builds visibility and a steady organic pipeline for your business.",
    items: [
      "Technical SEO, crawlability and Core Web Vitals",
      "On-page, off-page and keyword research",
      "Local SEO and detailed SEO audits",
    ],
    href: "/services/seo",
    icon: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3",
  },
];

const aboutPoints = [
  {
    title: "Custom software development",
    desc: "Built around your workflows and business goals.",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  },
  {
    title: "Enterprise web applications",
    desc: "Reliable, maintainable and ready to grow with you.",
    icon: "M3 4h18v14H3zM3 9h18M7 6.5h.01M10 6.5h.01M8 22h8M12 18v4",
  },
  {
    title: "AI-powered workflow automation",
    desc: "Less manual effort and faster day-to-day execution.",
    icon: "M5 4h6v5H5zM13 15h6v5h-6zM8 9v4a2 2 0 002 2h3",
  },
];

const reasons = [
  {
    num: "01",
    chips: ["Modular code", "Testing"],
    title: "Maintainable Engineering",
    desc: "Clean, modular codebases with testing built in, so your software stays easy to extend.",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  },
  {
    num: "02",
    chips: ["Growth-ready", "Modular"],
    title: "Scalable Architecture",
    desc: "Systems designed to grow with your users, data and business requirements.",
    icon: "M3 3v18h18M7 14l4-4 4 4 5-6",
  },
  {
    num: "03",
    chips: ["Secure by design", "Reviewed"],
    title: "Security-Conscious Development",
    desc: "Security considered from design through deployment, not added at the end.",
    icon: "M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3z",
  },
  {
    num: "04",
    chips: ["Milestones", "Clear updates"],
    title: "Transparent Delivery",
    desc: "Milestone-based delivery with clear communication and documentation throughout.",
    icon: "M3 5h18v14H3zM3 9h18M8 3v4M16 3v4",
  },
];

const approach = [
  {
    step: "01",
    title: "Discover",
    desc: "We study your goals, users and constraints to define a clear scope and roadmap.",
    outcome: "Clear scope & roadmap",
    icon: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5",
  },
  {
    step: "02",
    title: "Design",
    desc: "Architecture, data models and interfaces are planned before development begins.",
    outcome: "Architecture & data models",
    icon: "M4 20h4L18 10l-4-4L4 16v4zM14 6l4 4",
  },
  {
    step: "03",
    title: "Build",
    desc: "Iterative development with regular reviews, testing and early visibility.",
    outcome: "Reviewed, tested releases",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  },
  {
    step: "04",
    title: "Deliver",
    desc: "Deployment, handover of code and documentation, and technical support.",
    outcome: "Handover & support",
    icon: "M5 15c-1.5 1-2 4-2 6 2 0 5-.5 6-2M14 4c3-1 6-1 7-1 0 1 0 4-1 7l-6 6-5-5 5-7zM9 10l5 5",
  },
];

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="hero-heading" className={styles.heroTitle}>
              Engineering Scalable Software &amp; Intelligent AI Automation
            </h1>
            <p className={styles.heroText}>
              Recenturesoft delivers custom software engineering, enterprise web
              applications, and AI-powered workflow automation designed to solve complex
              operational challenges with precision, security, and scale.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.btnPrimary}>
                Discuss Your Project
              </Link>
              <Link href="/services/software-development" className={styles.btnOutline}>
                Explore Our Services
              </Link>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/home-hero.jpg"
              alt="Engineers reviewing system architecture diagrams and code together in an office"
              width={1200}
              height={896}
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={styles.services} aria-labelledby="services-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="services-heading" className={styles.h2}>
              Our Services
            </h2>
            <p className={styles.lead}>
              Four capabilities, delivered with the same engineering discipline.
            </p>
          </header>

          <div className={styles.svcGrid}>
            {services.map((service, index) => (
              <article key={service.title} className={styles.svcBox}>
                <span className={styles.svcNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.svcIcon}>
                  <Icon path={service.icon} className={styles.icon} />
                </div>
                <h3 className={styles.svcTitle}>{service.title}</h3>
                <p className={styles.svcText}>{service.desc}</p>
                <ul className={styles.svcList}>
                  {service.items.map((item) => (
                    <li key={item}>
                      <span className={styles.svcCheck}>
                        <Icon path="M20 6L9 17l-5-5" className={styles.icon} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className={styles.svcLink}>
                  <span>Learn more about {service.title}</span>
                  <span className={styles.svcArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className={styles.about} aria-labelledby="about-heading">
        <div className={`container ${styles.aboutLayout}`}>
          <div className={styles.aboutVisual}>
            <div className={styles.aboutImgWrap}>
              <Image
                src="/images/services-team.jpg"
                alt="Engineering team discussing system architecture at the Noida office"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className={styles.aboutImg}
              />
              <div className={styles.aboutShade} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.aboutCopy}>
            <h2 id="about-heading" className={styles.aboutTitle}>
              Software Engineering and AI Automation,{" "}
              <span className={styles.gradText}>Built in Noida</span>
            </h2>
            <p className={styles.lead}>
              {siteConfig.legalName} is a software development company based in Sector 63,
              Noida, offering custom software development, web application engineering and
              AI-driven automation.
            </p>
            <p className={styles.lead}>
              Clean, maintainable code and transparent communication guide how our team
              works with yours.
            </p>

            <ul className={styles.aboutList}>
              {aboutPoints.map((point) => (
                <li key={point.title} className={styles.aboutItem}>
                  <span className={styles.aboutItemIcon}>
                    <Icon path={point.icon} className={styles.icon} />
                  </span>
                  <span className={styles.aboutItemText}>
                    <span className={styles.aboutItemTitle}>{point.title}</span>
                    <span className={styles.aboutItemDesc}>{point.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.aboutActions}>
              <Link href="/about" className={styles.btnPrimary}>
                More about Recenturesoft <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/contact" className={styles.textLink}>
                Contact Us <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className={styles.tintBand} aria-labelledby="why-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="why-heading" className={styles.h2}>
              Why Choose Recenturesoft
            </h2>
            <p className={styles.lead}>
              Practical engineering principles that keep your software dependable over time.
            </p>
          </header>

          <div className={styles.reasonsGrid}>
            {reasons.map((reason) => (
              <article key={reason.title} className={styles.reason}>
                <span className={styles.reasonNum} aria-hidden="true">
                  {reason.num}
                </span>
                <div className={styles.reasonIcon}>
                  <Icon path={reason.icon} className={styles.icon} />
                </div>
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p className={styles.reasonText}>{reason.desc}</p>
                <ul className={styles.reasonChips} aria-label="Key points">
                  {reason.chips.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className={styles.approach} aria-labelledby="approach-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="approach-heading" className={styles.h2}>
              Our Approach
            </h2>
            <p className={styles.lead}>
              A clear four-step process from first conversation to delivery.
            </p>
          </header>

          <ol className={styles.stages}>
            {approach.map((item) => (
              <li key={item.step} className={styles.stage}>
                <div className={styles.stageTrack} aria-hidden="true">
                  <span className={styles.stageNode}>
                    <Icon path={item.icon} className={styles.icon} />
                  </span>
                </div>
                <div className={styles.stageBody}>
                  <span className={styles.stageLabel}>Step {item.step}</span>
                  <h3 className={styles.stageTitle}>{item.title}</h3>
                  <p className={styles.stageText}>{item.desc}</p>
                  <p className={styles.stageOutcome}>
                    <Icon path="M20 6L9 17l-5-5" className={styles.stageCheck} />
                    <span>
                      <span className={styles.stageOutcomeLabel}>Outcome</span>
                      {item.outcome}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.approachCta}>
            <Link href="/contact" className={styles.btnPrimary}>
              Start Your Project <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className={styles.contactBand} aria-labelledby="contact-heading">
        <div className={`container ${styles.contactInner}`}>
          <h2 id="contact-heading" className={styles.contactTitle}>
            Let&apos;s build something dependable together
          </h2>
          <p className={styles.contactText}>
            Tell us what you&apos;re building. We&apos;ll help you scope your next software or AI
            automation initiative.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>
              Discuss Your Project
            </Link>
            <a href={`mailto:${siteConfig.contact.email}`} className={styles.btnGhost}>
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

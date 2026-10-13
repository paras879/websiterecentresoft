import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Icon, type IconName } from "./icons";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services | Recenturesoft Infotech",
  description:
    "Custom software engineering, enterprise web applications and practical AI workflow automation from Recenturesoft Infotech, Noida.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | Recenturesoft Infotech",
    description:
      "Custom software engineering, enterprise web applications and practical AI workflow automation from Recenturesoft Infotech, Noida.",
    url: "https://www.recenturesoft.com/services",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft services",
      },
    ],
  },
};

type Item = { icon: IconName; title: string; desc: string };

const softwareItems: Item[] = [
  {
    icon: "web",
    title: "Custom Web Application Development",
    desc: "Responsive web applications built with modern frameworks and well-structured APIs.",
  },
  {
    icon: "enterprise",
    title: "Enterprise Software Solutions",
    desc: "Business management systems and domain-specific platforms engineered for dependability.",
  },
  {
    icon: "architecture",
    title: "Scalable & Maintainable Architecture",
    desc: "Clean, modular systems that are straightforward to extend and operate.",
  },
  {
    icon: "devices",
    title: "Responsive User Experiences",
    desc: "Intuitive interfaces designed to perform across desktop, tablet and mobile.",
  },
];

const aiItems: Item[] = [
  {
    icon: "workflow",
    title: "AI-Powered Workflow Automation",
    desc: "Automated handoffs and rule-driven execution that replace repetitive manual tasks.",
  },
  {
    icon: "improve",
    title: "Business Process Improvement",
    desc: "Process-level optimisations that shorten turnaround times and reduce manual errors.",
  },
  {
    icon: "integrate",
    title: "AI Integration in Applications",
    desc: "Adding AI capabilities to the internal tools and applications your teams already use.",
  },
  {
    icon: "repeat",
    title: "Repetitive Task Automation",
    desc: "Structured data intake, validation and automated notifications.",
  },
];

const together: Item[] = [
  {
    icon: "code",
    title: "Unified Codebases",
    desc: "Custom software and automation built on the same engineering standards, which keeps long-term maintenance simpler.",
  },
  {
    icon: "deploy",
    title: "Predictable Deployment",
    desc: "A consistent release process with staging verification before changes reach production.",
  },
  {
    icon: "handshake",
    title: "Transparent Collaboration",
    desc: "Direct communication with the engineering team through planning, delivery and handover.",
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="services-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="services-heading" className={styles.heroTitle}>
              Purpose-Built Software Engineering &amp; Practical AI Automation
            </h1>
            <p className={styles.heroText}>
              Explore how Recenturesoft designs, builds, and deploys scalable custom software
              and intelligent automated workflows tailored to organisational needs.
            </p>
            <div className={styles.actions}>
              <Link href="/services/software-development" className={styles.btnPrimary}>
                Explore Software Development <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/services/ai-automation" className={styles.btnOutline}>
                Explore AI Automation <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/services-overview.jpg"
              alt="Engineer working at a multi-monitor workstation with architecture diagrams and code"
              width={1376}
              height={768}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Software */}
      <section className={styles.section} aria-labelledby="software-heading">
        <div className={`container ${styles.split}`}>
          <div className={styles.splitCopy}>
            <h2 id="software-heading" className={styles.h2}>
              Custom Software &amp; Enterprise Web Applications
            </h2>
            <p className={styles.lead}>
              We architect and build tailored software with clean, maintainable codebases and
              modular services designed for long-term scalability.
            </p>
            <div className={styles.miniGrid}>
              {softwareItems.map((item) => (
                <div key={item.title} className={styles.mini}>
                  <div className={styles.iconBadge}>
                    <Icon name={item.icon} className={styles.icon} />
                  </div>
                  <h3 className={styles.h3}>{item.title}</h3>
                  <p className={styles.body}>{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/services/software-development" className={styles.btnOutline}>
              View Software Development Capabilities <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/services-software.jpg"
              loading="eager"
              alt="Ultra-wide monitor showing a software architecture diagram next to code"
              width={1376}
              height={768}
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* AI automation */}
      <section
        className={`${styles.section} ${styles.sectionAlt}`}
        aria-labelledby="ai-heading"
      >
        <div className={`container ${styles.split} ${styles.splitReverse}`}>
          <div className={styles.splitCopy}>
            <h2 id="ai-heading" className={styles.h2}>
              AI-Powered Workflow Automation
            </h2>
            <p className={styles.lead}>
              Practical, reliable automation that streamlines repetitive processes, structures
              unstructured data, and fits into your existing software stack.
            </p>
            <div className={styles.miniGrid}>
              {aiItems.map((item) => (
                <div key={item.title} className={styles.mini}>
                  <div className={styles.iconBadge}>
                    <Icon name={item.icon} className={styles.icon} />
                  </div>
                  <h3 className={styles.h3}>{item.title}</h3>
                  <p className={styles.body}>{item.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/services/ai-automation" className={styles.btnOutline}>
              Explore AI Automation Solutions <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/services-ai.jpg"
              alt="Team reviewing automated data pipeline dashboards in a technology office"
              width={1376}
              height={768}
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Integrated */}
      <section className={styles.tintBand} aria-labelledby="together-heading">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.centered}`}>
            <h2 id="together-heading" className={styles.h2}>
              Cohesive Engineering &amp; Automation
            </h2>
            <p className={styles.lead}>
              Recenturesoft connects custom software systems with intelligent automation, so
              your transactional systems and day-to-day operations work together instead of
              in silos.
            </p>
          </header>
          <div className={styles.grid3}>
            {together.map((item) => (
              <article key={item.title} className={styles.tile}>
                <div className={styles.iconBadge}>
                  <Icon name={item.icon} className={styles.icon} />
                </div>
                <h3 className={styles.h3}>{item.title}</h3>
                <p className={styles.body}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBand} aria-labelledby="services-cta-heading">
        <div className={`container ${styles.closeInner}`}>
          <h2 id="services-cta-heading" className={styles.closeTitle}>
            Discuss Your Technical Requirements
          </h2>
          <p className={styles.closeText}>
            Connect with our engineering team in Noida to evaluate your software architecture
            or automation needs.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>
              Discuss Your Project
            </Link>
            <a href={`tel:${siteConfig.contact.phoneRaw}`} className={styles.btnGhost}>
              <Icon name="phone" className={styles.icon} />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

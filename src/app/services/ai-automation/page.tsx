import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Icon, type IconName } from "../icons";
import styles from "./ai-automation.module.css";

export const metadata: Metadata = {
  title: "AI Automation Services | Recenturesoft Infotech",
  description:
    "Explore AI workflow automation, repetitive task minimization, and process engineering solutions by Recenturesoft Infotech Pvt Ltd.",
  alternates: {
    canonical: "/services/ai-automation",
  },
  openGraph: {
    title: "AI Automation Services | Recenturesoft Infotech",
    description:
      "Explore AI workflow automation, repetitive task minimization, and process engineering solutions by Recenturesoft Infotech Pvt Ltd.",
    url: "https://www.recenturesoft.com/services/ai-automation",
    images: [
      {
        url: "/images/ai-automation.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft AI Automation Services",
      },
    ],
  },
};

const pillars: { icon: IconName; title: string; desc: string; flow: string[] }[] = [
  {
    icon: "workflow",
    flow: ["CRM", "Webhook", "ERP"],
    title: "Targeted Workflow Automation",
    desc: "Connecting disparate software systems to trigger automated, error-free tasks. We eliminate manual handoffs between CRM, ERP, and bespoke customer databases through hardened webhook pipelines.",
  },
  {
    icon: "document",
    flow: ["Invoices & forms", "Extract", "Validate"],
    title: "Intelligent Document Processing",
    desc: "Extracting, categorizing, and validating information from invoices, onboarding forms, and business records with multi-stage schema validation and confidence scoring thresholds.",
  },
  {
    icon: "assist",
    flow: ["Summarise", "Classify", "Validate"],
    title: "Integrated AI Assistive Features",
    desc: "Embedding smart summarization, classification, and validation directly into your daily enterprise tools so your personnel make faster, data-backed decisions without leaving their primary interface.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discover",
    desc: "Mapping current operational workflows and identifying high-friction manual bottlenecks.",
  },
  {
    step: "02",
    title: "Assess",
    desc: "Evaluating technical feasibility, ROI projections, and security requirements.",
  },
  {
    step: "03",
    title: "Design",
    desc: "Architecting API connections, schemas, and human-in-the-loop review gates.",
  },
  {
    step: "04",
    title: "Integrate",
    desc: "Deploying automation modules and connecting core enterprise software environments.",
  },
  {
    step: "05",
    title: "Validate",
    desc: "Testing accuracy with historical datasets and running monitored production rollouts.",
  },
];

export default function AIAutomationPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="ai-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="ai-hero-heading" className={styles.heroTitle}>
              Make Workflows Smarter with AI Automation
            </h1>
            <p className={styles.heroText}>
              Recenturesoft implements practical AI and intelligent automation solutions to
              eliminate repetitive manual bottlenecks, accelerate document handling, and
              improve operational accuracy.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.btnPrimary}>
                <span>Discuss Automation Opportunities</span>
                <Icon
                  name="arrowRight"
                  className={`${styles.icon} ${styles.btnIcon}`}
                />
              </Link>
              <a href="#practical" className={styles.btnOutline}>
                <span>Explore Practical Use Cases</span>
                <Icon name="tune" className={`${styles.icon} ${styles.btnIcon}`} />
              </a>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <div className={styles.photoWrap}>
              <Image
                src="/images/services-ai.jpg"
                alt="Enterprise AI workflow automation control room"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 600px"
                className={styles.photo}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Practical AI */}
      <section id="practical" className={styles.prac} aria-labelledby="practical-heading">
        <div className="container">
          <div className={styles.pracHead}>
            <h2 id="practical-heading" className={styles.pracTitle}>
              What We Mean by{" "}
              <span className={styles.pracGradient}>Practical AI Automation</span>
            </h2>
            <p className={styles.pracLead}>
              We focus exclusively on grounded, realistic software systems. Rather than
              pursuing speculative hype or unchecked autonomy, our implementations solve
              tangible operational friction across verified business pipelines.
            </p>
          </div>

          <div className={styles.pracGrid}>
            {pillars.map((pillar) => (
              <article key={pillar.title} className={styles.pracItem}>
                <div className={styles.flow} aria-label={`Flow: ${pillar.flow.join(", ")}`}>
                  {pillar.flow.map((step, i) => (
                    <span key={step} className={styles.flowGroup}>
                      <span className={styles.flowStep}>{step}</span>
                      {i < pillar.flow.length - 1 && (
                        <span className={styles.flowLink} aria-hidden="true" />
                      )}
                    </span>
                  ))}
                </div>

                <div className={styles.pracBody}>
                  <div className={styles.pracIcon}>
                    <Icon name={pillar.icon} className={styles.icon} />
                  </div>
                  <h3 className={styles.pracItemTitle}>{pillar.title}</h3>
                  <p className={styles.body}>{pillar.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className={styles.impl} aria-labelledby="process-heading">
        <div className="container">
          <div className={styles.implHead}>
            <h2 id="process-heading" className={styles.implTitle}>
              Implementation <span className={styles.pracGradient}>Process</span>
            </h2>
            <p className={styles.implLead}>
              A structured 5-stage framework to ensure reliable delivery and immediate
              operational value.
            </p>
          </div>

          <ol className={styles.implList}>
            {steps.map((item, index) => (
              <li key={item.step} className={styles.implItem}>
                <div
                  className={styles.ring}
                  style={{ "--p": `${((index + 1) / steps.length) * 100}%` } as React.CSSProperties}
                >
                  <span className={styles.ringInner}>{item.step}</span>
                </div>
                <h3 className={styles.implItemTitle}>{item.title}</h3>
                <p className={styles.implText}>{item.desc}</p>
                <span className={styles.implTag}>
                  Phase {index + 1} of {steps.length}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta} aria-labelledby="ai-cta-heading">
        <div className="container">
          <div className={styles.closeInner}>
            <h2 id="ai-cta-heading" className={styles.closeTitle}>
              Transform Your Repetitive Workflows
            </h2>
            <p className={styles.closeText}>
              Speak directly with our automation engineers in Noida to identify high-impact
              processes ready for automation.
            </p>
            <div className={styles.closeActions}>
              <Link href="/contact" className={styles.btnPrimary}>
                <span>Discuss Automation Opportunities</span>
                <Icon name="arrowRight" className={`${styles.icon} ${styles.btnIcon}`} />
              </Link>
              <a href={`tel:${siteConfig.contact.phoneRaw}`} className={styles.btnGhost}>
                <Icon name="phone" className={`${styles.icon} ${styles.btnIcon}`} />
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

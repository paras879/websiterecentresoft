import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApproachExplorer } from "@/components/approach-explorer";
import { Icon, type IconName } from "../icons";
import styles from "../services.module.css";

export const metadata: Metadata = {
  title: "Software Development Services | Recenturesoft Infotech",
  description:
    "Custom software development, web application engineering, and enterprise digital solutions tailored to operational requirements by Recenturesoft Infotech.",
  alternates: {
    canonical: "/services/software-development",
  },
  openGraph: {
    title: "Software Development Services | Recenturesoft Infotech",
    description:
      "Custom software development, web application engineering, and enterprise digital solutions tailored to operational requirements by Recenturesoft Infotech.",
    url: "https://www.recenturesoft.com/services/software-development",
    images: [
      {
        url: "/images/software.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft Custom Software Development",
      },
    ],
  },
};

type Item = { icon: IconName; title: string; desc: string };

const capabilities: (Item & { chips: string[] })[] = [
  {
    icon: "web",
    title: "Custom Web Applications",
    desc: "Responsive applications built with React, Next.js and TypeScript, engineered for speed and clarity.",
    chips: ["React", "Next.js", "TypeScript"],
  },
  {
    icon: "enterprise",
    title: "Enterprise Software Solutions",
    desc: "Multi-tier systems that integrate with your existing databases and services.",
    chips: ["Multi-tier", "Integrations"],
  },
  {
    icon: "database",
    title: "API & Backend Architecture",
    desc: "Well-documented APIs backed by scalable relational and document datastores.",
    chips: ["Documented APIs", "Scalable data"],
  },
  {
    icon: "modernize",
    title: "Application Modernisation",
    desc: "Refactoring legacy applications into clean, maintainable modules with a modern UI.",
    chips: ["Refactoring", "Modern UI"],
  },
];

const approach: { step: string; title: string; desc: string; icon: IconName; image: string }[] = [
  {
    step: "01",
    title: "Discover",
    desc: "Requirements gathering, technical feasibility, domain modelling and a project roadmap.",
    image: "/images/services-team.jpg",
    icon: "search",
  },
  {
    step: "02",
    title: "Design",
    desc: "System architecture, database schema design and responsive UI wireframes.",
    image: "/images/services-overview.jpg",
    icon: "architecture",
  },
  {
    step: "03",
    title: "Develop",
    desc: "Clean, modular code, sprint-based iterations and regular code reviews.",
    image: "/images/services-software.jpg",
    icon: "terminal",
  },
  {
    step: "04",
    title: "Test",
    desc: "Automated unit and integration tests, regression checks and code quality reviews.",
    image: "/images/services-ai.jpg",
    icon: "check",
  },
  {
    step: "05",
    title: "Deliver",
    desc: "Production deployment, documentation handover and ongoing support.",
    image: "/images/home-hero.jpg",
    icon: "rocket",
  },
];

const principleImages = [
  { src: "/images/services-software.jpg", alt: "Developer workstation showing clean, structured code" },
  { src: "/images/services-overview.jpg", alt: "Multi-monitor setup with system architecture diagrams" },
  { src: "/images/services-team.jpg", alt: "Team discussing an interface design together" },
  { src: "/images/services-ai.jpg", alt: "Engineers reviewing dashboards in a technology office" },
];

const principles: Item[] = [
  {
    icon: "code",
    title: "Maintainable Codebases",
    desc: "Clean standards and clear documentation that make future changes easier.",
  },
  {
    icon: "scale",
    title: "Scalable Architecture",
    desc: "Systems designed to grow steadily with user load and data volume.",
  },
  {
    icon: "touch",
    title: "Usability-Focused Design",
    desc: "Intuitive, accessible interfaces that reduce friction for your teams.",
  },
  {
    icon: "shield",
    title: "Security-Conscious Practices",
    desc: "Security considered from architecture through deployment.",
  },
];

export default function SoftwareDevelopmentPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="software-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="software-hero-heading" className={styles.heroTitle}>
              Software Built for Your Business
            </h1>
            <p className={styles.heroText}>
              Recenturesoft engineers dependable custom software and enterprise web
              applications designed around your workflows, operational demands, and long-term
              business goals.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.btnPrimary}>
                Discuss Your Project
              </Link>
              <a href="#approach" className={styles.btnOutline}>
                View Development Approach
              </a>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/services-software.jpg"
              alt="Ultra-wide monitor showing a software architecture diagram next to code"
              width={1376}
              height={768}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className={styles.capSection} aria-labelledby="capabilities-heading">
        <div className="container">
          <header className={styles.capHead}>
            <h2 id="capabilities-heading" className={styles.capTitle}>
              Our Software Development{" "}
              <span className={styles.capGradient}>Capabilities</span>
            </h2>
            <p className={styles.capLead}>
              From bespoke internal platforms to customer-facing web applications, our
              engineering standards prioritise stability and maintainability.
            </p>
          </header>

          <div className={styles.capGrid}>
            {capabilities.map((item) => (
              <article key={item.title} className={styles.capBox}>
                <Icon name={item.icon} className={styles.capMark} />
                <div className={styles.capIcon}>
                  <Icon name={item.icon} className={styles.icon} />
                </div>
                <div className={styles.capBody}>
                  <h3 className={styles.capBoxTitle}>{item.title}</h3>
                  <p className={styles.body}>{item.desc}</p>
                  <ul className={styles.capChips} aria-label="Key technologies and focus">
                    {item.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className={styles.tlSection} aria-labelledby="approach-heading">
        <div className="container">
          <header className={styles.tlHead}>
            <h2 id="approach-heading" className={styles.tlTitle}>
              Our Engineering Approach
            </h2>
            <p className={styles.tlLead}>
              A clear, transparent delivery process from initial scoping to deployment.
            </p>
          </header>

          <ApproachExplorer steps={approach} />
        </div>
      </section>

      {/* Principles */}
      <section className={styles.kpSection} aria-labelledby="principles-heading">
        <div className="container">
          <header className={styles.kpHead}>
            <h2 id="principles-heading" className={styles.kpTitle}>
              Key Engineering <span className={styles.kpGradient}>Principles</span>
            </h2>
            <p className={styles.kpLead}>
              Dependable outcomes come from building with maintainability, reliability, and
              security at the core.
            </p>
          </header>

          <div className={styles.kpRow}>
            {principles.map((item, index) => (
              <article key={item.title} className={styles.kpPanel} tabIndex={0}>
                <div className={styles.kpImg} aria-hidden="true">
                  <Image
                    src={principleImages[index].src}
                    alt=""
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 900px) 100vw, 420px"
                    className={styles.kpImgEl}
                  />
                </div>
                <span className={styles.kpNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.kpIcon}>
                  <Icon name={item.icon} className={styles.icon} />
                </span>
                <h3 className={styles.kpPanelTitle}>{item.title}</h3>
                <p className={styles.kpPanelText}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Noida hub */}
      <section className={styles.section} aria-labelledby="hub-heading">
        <div className={`container ${styles.split} ${styles.splitReverse}`}>
          <div className={styles.splitCopy}>
            <h2 id="hub-heading" className={styles.h2}>
              Dedicated Engineering From Sector 63, Noida
            </h2>
            <p className={styles.lead}>
              Our software development team works from Sector 63, Noida. We emphasise
              transparent sprint planning, proactive technical communication, and scheduled
              code walkthroughs to keep your engineering objectives aligned.
            </p>
            <div className={styles.miniGrid}>
              <div className={styles.mini}>
                <h3 className={styles.h3}>Direct Collaboration</h3>
                <p className={styles.body}>Structured sprint cadence and regular deliverables.</p>
              </div>
              <div className={styles.mini}>
                <h3 className={styles.h3}>Documented Handover</h3>
                <p className={styles.body}>
                  Code and documentation delivered at the end of each engagement.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/home-hero.jpg"
              alt="Engineering team collaborating around architecture diagrams"
              width={1200}
              height={896}
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.ctaBand} ${styles.ctaSoft}`} aria-labelledby="software-cta-heading">
        <div className={`container ${styles.closeInner}`}>
          <h2 id="software-cta-heading" className={styles.closeTitle}>
            Ready to Build Software That Lasts?
          </h2>
          <p className={styles.closeText}>
            Schedule an introductory engineering consultation with our team in Sector 63,
            Noida.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>
              Discuss Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

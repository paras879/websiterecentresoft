import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Icon, type IconName } from "../icons";
import { BuildShowcase } from "@/components/build-showcase";
import { ProcessJourney } from "@/components/process-journey";
import { TechWall } from "@/components/tech-wall";
import styles from "../services.module.css";
import cd from "./custom.module.css";

export const metadata: Metadata = {
  title: "Custom Development Services | Recenturesoft Infotech",
  description:
    "Custom web applications, enterprise software, SaaS products, API development, business process automation and legacy modernisation from Recenturesoft Infotech, Noida.",
  alternates: {
    canonical: "/services/custom-development",
  },
  openGraph: {
    title: "Custom Development Services | Recenturesoft Infotech",
    description:
      "Custom web applications, enterprise software, SaaS products, API development, business process automation and legacy modernisation.",
    url: "https://www.recenturesoft.com/services/custom-development",
    images: [
      {
        url: "/images/custom-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft custom development",
      },
    ],
  },
};

const builds: { icon: IconName; title: string; desc: string; image: string; alt: string; tags: string[] }[] = [
  {
    icon: "web",
    title: "Custom Web Application Development",
    desc: "Modern, high-performance web platforms built on responsive architecture and secure frameworks.",
    image: "/images/custom-hero.jpg",
    alt: "Developer workstation with code editors and an architecture diagram",
    tags: ["Portals", "Dashboards", "Customer platforms"],
  },
  {
    icon: "enterprise",
    title: "Enterprise Software Solutions",
    desc: "Business systems designed to streamline complex workflows and data management.",
    image: "/images/services-software.jpg",
    alt: "Ultra-wide monitor showing a software architecture diagram next to code",
    tags: ["Workflows", "Data management", "Integrations"],
  },
  {
    icon: "deploy",
    title: "SaaS Product Development",
    desc: "Scalable, multi-tenant cloud products taken from first MVP to a mature platform.",
    image: "/images/custom-work.jpg",
    alt: "Laptop showing an operations dashboard",
    tags: ["Multi-tenant", "MVP to scale", "Subscriptions"],
  },
  {
    icon: "integrate",
    title: "API Development & Integration",
    desc: "REST and GraphQL services, plus secure connections to the third-party tools you already use.",
    image: "/images/services-overview.jpg",
    alt: "Multi-monitor workstation with system dashboards",
    tags: ["REST", "GraphQL", "Third-party tools"],
  },
  {
    icon: "workflow",
    title: "Business Process Automation",
    desc: "Automated workflows that remove manual bottlenecks and repetitive work.",
    image: "/images/services-ai.jpg",
    alt: "Team reviewing automated workflow dashboards",
    tags: ["Workflow automation", "Less manual work"],
  },
  {
    icon: "modernize",
    title: "Legacy System Modernisation",
    desc: "Refactoring older systems into maintainable, cloud-ready services, planned to limit disruption.",
    image: "/images/services-team.jpg",
    alt: "Engineering team discussing system architecture",
    tags: ["Refactoring", "Cloud-ready", "Phased move"],
  },
];

const stack = [
  {
    group: "Frontend",
    items: [
      { name: "React", role: "UI library", use: "Interactive, component-based user interfaces for web applications.", icon: "react", color: "#61DAFB" },
      { name: "Next.js", role: "React framework", use: "Fast, search-friendly web apps with server rendering and routing built in.", icon: "nextdotjs", color: "#111827" },
      { name: "TypeScript", role: "Typed JavaScript", use: "Typed code that catches mistakes early and keeps large projects maintainable.", icon: "typescript", color: "#3178C6" },
      { name: "Vue.js", role: "UI framework", use: "Lightweight, approachable interfaces for dashboards and portals.", icon: "vuedotjs", color: "#4FC08D" },
      { name: "Tailwind CSS", role: "Utility-first styling", use: "Consistent, responsive styling built quickly from reusable utilities.", icon: "tailwindcss", color: "#06B6D4" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", role: "JavaScript runtime", use: "Fast APIs and real-time services written in JavaScript.", icon: "nodedotjs", color: "#5FA04E" },
      { name: "Python", role: "General-purpose language", use: "Backend services, automation scripts and data processing.", icon: "python", color: "#3776AB" },
      { name: "Java", role: "Enterprise language", use: "Robust, long-lived enterprise systems.", icon: "openjdk", color: "#ED8B00" },
      { name: "Go", role: "Fast, compiled language", use: "High-performance services that handle many requests at once.", icon: "go", color: "#00ADD8" },
      { name: ".NET Core", role: "Cross-platform framework", use: "Secure, cross-platform business applications and APIs.", icon: "dotnet", color: "#512BD4" },
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      { name: "AWS", role: "Cloud platform", use: "Hosting, storage and scalable infrastructure in the cloud.", icon: "amazonwebservices", color: "#FF9900" },
      { name: "Google Cloud", role: "Cloud platform", use: "Cloud hosting, data services and managed infrastructure.", icon: "googlecloud", color: "#4285F4" },
      { name: "Docker", role: "Containers", use: "Packaging applications so they run the same everywhere.", icon: "docker", color: "#2496ED" },
      { name: "Kubernetes", role: "Container orchestration", use: "Running and scaling containers reliably in production.", icon: "kubernetes", color: "#326CE5" },
      { name: "CI/CD", role: "Automated build and release", use: "Automated testing and releases so updates ship safely and often.", color: "#1D4ED8" },
    ],
  },
  {
    group: "Databases",
    items: [
      { name: "PostgreSQL", role: "Relational database", use: "Reliable relational data for transactions and reporting.", icon: "postgresql", color: "#4169E1" },
      { name: "MongoDB", role: "Document database", use: "Flexible document storage for fast-changing data.", icon: "mongodb", color: "#47A248" },
      { name: "Redis", role: "In-memory data store", use: "Caching and fast lookups that keep applications responsive.", icon: "redis", color: "#FF4438" },
      { name: "MySQL", role: "Relational database", use: "Proven relational storage for business applications.", icon: "mysql", color: "#4479A1" },
    ],
  },
];

const journey: { title: string; desc: string; gets: string; icon: IconName }[] = [
  {
    title: "Discover",
    desc: "Requirements gathering, technical feasibility and an architecture roadmap.",
    gets: "A clear scope and roadmap",
    icon: "search",
  },
  {
    title: "Design",
    desc: "System structure, database modelling and UX prototypes.",
    gets: "Architecture and prototypes to review",
    icon: "architecture",
  },
  {
    title: "Develop",
    desc: "Agile sprints, clean modular code and continuous automated testing.",
    gets: "Working software at every sprint",
    icon: "code",
  },
  {
    title: "Deploy & Improve",
    desc: "Cloud deployment, monitoring and ongoing improvements.",
    gets: "A live, monitored system",
    icon: "rocket",
  },
];

const reasons: { icon: IconName; title: string; desc: string; means: string }[] = [
  {
    icon: "architecture",
    title: "Tailored Solutions",
    desc: "Built around your business model and workflows, not a generic template.",
    means: "Software that fits the way you already work.",
  },
  {
    icon: "scale",
    title: "Scalable Architecture",
    desc: "Systems designed to keep working as your data and traffic grow.",
    means: "No rebuild when your business grows.",
  },
  {
    icon: "code",
    title: "Maintainable Code",
    desc: "Typed, modular, documented code that follows clean software principles.",
    means: "Any developer can pick it up and carry on.",
  },
  {
    icon: "shield",
    title: "Security-Conscious",
    desc: "Security considered from design through deployment, with regular reviews.",
    means: "Fewer unpleasant surprises after launch.",
  },
  {
    icon: "handshake",
    title: "Transparent Collaboration",
    desc: "Direct access to the engineers and clear sprint reporting.",
    means: "You always know where your project stands.",
  },
  {
    icon: "rocket",
    title: "Long-Term Support",
    desc: "Ongoing maintenance and continued improvement after launch.",
    means: "Help is still there after go-live.",
  },
];

const experience: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "eye",
    title: "Business Operations & Executive Dashboards",
    desc: "Live views of workflow bottlenecks, with role-based analytics.",
  },
  {
    icon: "people",
    title: "B2B Customer & Vendor Portals",
    desc: "Self-service portals with secure, authenticated access.",
  },
  {
    icon: "deploy",
    title: "Cloud SaaS Platforms",
    desc: "Subscription platforms built for many users at once, with automated billing.",
  },
  {
    icon: "repeat",
    title: "Internal Workflow Automations",
    desc: "Task dispatching and ERP synchronisation systems.",
  },
];

export default function CustomDevelopmentPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="cd-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="cd-hero-heading" className={styles.heroTitle}>
              Custom Software Built Around Your Business.
            </h1>
            <p className={styles.heroText}>
              We design and develop tailored digital solutions that streamline operations,
              solve complex challenges, and help your business scale with confidence.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.btnPrimary}>
                Discuss Your Project <span aria-hidden="true">&rarr;</span>
              </Link>
              <a href="#cd-build" className={styles.btnOutline}>
                Explore Our Expertise
              </a>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/custom-hero.jpg"
              alt="Developer workstation with code editors and a system architecture diagram"
              width={1376}
              height={768}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* What we build: image follows the cards */}
      <section id="cd-build" className={cd.build} aria-labelledby="cd-build-heading">
        <div className="container">
          <BuildShowcase
            items={builds}
            intro={
              <>
                <h2 id="cd-build-heading" className={cd.bigTitle}>
                  What We Build
                </h2>
                <p className={cd.lead}>
                  End-to-end custom engineering built for reliability, efficiency and growth.
                </p>
              </>
            }
          />
        </div>
      </section>

      {/* Technology: interactive wall */}
      <section className={cd.tech} aria-labelledby="cd-tech-heading">
        <div className="container">
          <h2 id="cd-tech-heading" className={cd.bigTitleLight}>
            Our Technology Expertise
          </h2>
          <p className={cd.techLead}>
            Pick a layer to see the technologies we work with, from what your users see down to where your data lives.
          </p>

          <TechWall groups={stack} />
        </div>
      </section>

      {/* Process: scroll journey */}
      <section className={cd.process} aria-labelledby="cd-process-heading">
        <div className="container">
          <h2 id="cd-process-heading" className={cd.bigTitle}>
            Our Development Process
          </h2>
          <ProcessJourney steps={journey} />
        </div>
      </section>

      {/* Why: promise sheet */}
      <section className={cd.pledge} aria-labelledby="cd-why-heading">
        <div className="container">
          <div className={cd.plSheet}>
            <div className={cd.plRail}>
              <Image
                src="/images/team-meeting.webp"
                alt="Team reviewing project plans together around a table"
                fill
                sizes="(max-width: 1000px) 100vw, 420px"
                className={cd.plPhoto}
              />
              <span className={cd.plShade} aria-hidden="true" />
              <span className={cd.plMark} aria-hidden="true">
                R
              </span>
              <h2 id="cd-why-heading" className={cd.plHead}>
                Why Choose Recenturesoft
              </h2>
              <p className={cd.plLead}>
                Six promises we keep on every custom project, and what each one means for you.
              </p>
            </div>

            <ul className={cd.plList}>
              {reasons.map((item) => (
                <li key={item.title} className={cd.plRow}>
                  <span className={cd.plCheck} aria-hidden="true">
                    <Icon name="check" className={cd.plCheckSvg} />
                  </span>
                  <div className={cd.plBody}>
                    <h3 className={cd.plTitle}>{item.title}</h3>
                    <p className={cd.plText}>{item.desc}</p>
                    <p className={cd.plMeans}>
                      <span className={cd.plMeansLabel}>For you</span>
                      {item.means}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className={cd.exp} aria-labelledby="cd-exp-heading">
        <div className="container">
          <div className={cd.expBanner}>
            <Image
              src="/images/custom-work.jpg"
              alt="Laptop showing a workflow automation and operations dashboard"
              fill
              sizes="(max-width: 1000px) 100vw, 1200px"
              className={cd.expBannerImg}
            />
            <div className={cd.expShade} aria-hidden="true" />
            <div className={cd.expBannerText}>
              <h2 id="cd-exp-heading" className={cd.expHeading}>
                Featured Development Experience
              </h2>
              <p className={cd.expLead}>
                The kinds of solutions we build to give your operations real leverage.
              </p>
            </div>
          </div>

          <ul className={cd.xpList}>
            {experience.map((item, index) => (
              <li key={item.title} className={cd.xpItem}>
                <span className={cd.xpNum} aria-hidden="true">
                  0{index + 1}
                </span>
                <span className={cd.xpIcon}>
                  <Icon name={item.icon} className={cd.icon} />
                </span>
                <h3 className={cd.xpTitle}>{item.title}</h3>
                <p className={cd.xpText}>{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className={cd.fin} aria-labelledby="cd-cta-heading">
        <div className={`container ${cd.finGrid}`}>
          <div className={cd.finCopy}>
            <h2 id="cd-cta-heading" className={cd.finTitle}>
              Have an idea? Let&apos;s build it together.
            </h2>
            <p className={cd.finText}>
              Tell us about your business challenge and we&apos;ll explore the right custom
              solution with you.
            </p>
            <Link href="/contact" className={cd.finBtn}>
              Start Your Project <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className={cd.finPanel}>
            <p className={cd.finPanelTitle}>Or reach us directly</p>
            <a href={`mailto:${siteConfig.contact.email}`} className={cd.finRow}>
              <span className={cd.finIcon}>
                <Icon name="mailIcon" className={cd.icon} />
              </span>
              <span>
                <span className={cd.finLabel}>Email</span>
                <span className={cd.finValue}>{siteConfig.contact.email}</span>
              </span>
            </a>
            <a href={`tel:${siteConfig.contact.phoneRaw}`} className={cd.finRow}>
              <span className={cd.finIcon}>
                <Icon name="phone" className={cd.icon} />
              </span>
              <span>
                <span className={cd.finLabel}>Phone</span>
                <span className={cd.finValue}>{siteConfig.contact.phone}</span>
              </span>
            </a>
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cd.finRow}
            >
              <span className={cd.finIcon}>
                <Icon name="chat" className={cd.icon} />
              </span>
              <span>
                <span className={cd.finLabel}>WhatsApp</span>
                <span className={cd.finValue}>Message us</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

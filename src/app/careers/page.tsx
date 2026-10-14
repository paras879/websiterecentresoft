import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { CareerForm } from "@/components/career-form";
import { CareerPerks, type Perk } from "@/components/career-perks";
import styles from "../services/services.module.css";
import cr from "./careers.module.css";

export const metadata: Metadata = {
  title: "Careers | Recenturesoft Infotech",
  description:
    "Build your career with Recenturesoft Infotech, Noida. Send us your profile for software development, AI automation, custom development and SEO roles.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers | Recenturesoft Infotech",
    description:
      "Build your career with Recenturesoft Infotech, Noida. Send us your profile for future roles.",
    url: "https://www.recenturesoft.com/careers",
  },
};

const perks: Perk[] = [
  {
    icon: "rocket",
    title: "Meaningful projects",
    desc: "You work on software, automation and search work that real businesses rely on every day, not practice exercises.",
    points: ["Real client work", "Web, AI and SEO"],
    image: "/images/custom-work.jpg",
    alt: "Engineers working on a custom software project",
  },
  {
    icon: "improve",
    title: "Continuous learning",
    desc: "Our work spans several disciplines, so your skills keep widening.",
    points: ["Cross-discipline", "New tools"],
    image: "/images/services-overview.jpg",
    alt: "Team reviewing work across disciplines",
  },
  {
    icon: "people",
    title: "Collaborative culture",
    desc: "A small team where people talk directly and share feedback openly.",
    points: ["Direct talk", "Open feedback"],
    image: "/images/services-team.jpg",
    alt: "Team collaborating around a table",
  },
  {
    icon: "scale",
    title: "Room to grow",
    desc: "Take ownership of real work early, and grow into larger responsibility as your projects and confidence grow.",
    points: ["Early ownership", "Mentoring from seniors"],
    image: "/images/home-hero.jpg",
    alt: "Colleagues working together in the office",
  },
];

const areas = [
  {
    title: "Software Development",
    desc: "Web applications and business software, built to last.",
    href: "/services/software-development",
    image: "/images/services-software.jpg",
  },
  {
    title: "AI Automation",
    desc: "Workflow automation and intelligent assistants for real processes.",
    href: "/services/ai-automation",
    image: "/images/services-ai.jpg",
  },
  {
    title: "Custom Development",
    desc: "Tailored platforms, integrations and modernisation projects.",
    href: "/services/custom-development",
    image: "/images/custom-hero.jpg",
  },
  {
    title: "SEO Services",
    desc: "Technical, on-page and local search work for client sites.",
    href: "/services/seo",
    image: "/images/seo-hero.jpg",
  },
];

const steps = [
  { title: "Share your details", text: "Fill in the short form below, it takes about two minutes." },
  { title: "Your email opens", text: "Your mail app opens with everything pre-filled, addressed to our HR team." },
  { title: "Attach and send", text: "Add your resume to the email and send. We write back when a role fits." },
];

export default function CareersPage() {
  const { contact } = siteConfig;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="cr-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="cr-hero-heading" className={styles.heroTitle}>
              Build Your Future With Us.
            </h1>
            <p className={styles.heroText}>
              Join a team of curious minds, passionate builders and problem-solvers creating
              technology that makes a difference for businesses.
            </p>
            <div className={styles.actions}>
              <a href="#cr-apply" className={styles.btnPrimary}>
                Apply Now <span aria-hidden="true">&rarr;</span>
              </a>
              <a href="#cr-why" className={styles.btnOutline}>
                Why Recenturesoft
              </a>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/team-meeting.webp"
              alt="The Recenturesoft team in a meeting"
              width={1200}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Why work here */}
      <section id="cr-why" className={cr.why} aria-labelledby="cr-why-heading">
        <div className="container">
          <div className={cr.head}>
            <h2 id="cr-why-heading" className={cr.bigTitle}>
              Why work at Recenturesoft?
            </h2>
            <p className={cr.lead}>
              Honest work, direct conversations and room to grow, in an engineering team based in
              Sector 63, Noida.
            </p>
          </div>
          <CareerPerks items={perks} />
        </div>
      </section>

      {/* Where you could fit */}
      <section className={cr.areas} aria-labelledby="cr-areas-heading">
        <div className="container">
          <div className={cr.head}>
            <h2 id="cr-areas-heading" className={cr.bigTitle}>
              Where you could fit in
            </h2>
            <p className={cr.lead}>Four practice areas, each with its own kind of work.</p>
          </div>

          <ul className={cr.fit}>
            {areas.map((area, index) => (
              <li key={area.title} className={cr.fitItem}>
                <Link href={area.href} className={cr.fitLink}>
                  <Image
                    src={area.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 700px"
                    quality={85}
                    className={cr.fitImg}
                  />
                  <span className={cr.fitShade} aria-hidden="true" />
                  <span className={cr.fitNum}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={cr.fitBody}>
                    <span className={cr.fitTitle}>{area.title}</span>
                    <span className={cr.fitText}>{area.desc}</span>
                    <span className={cr.fitGo}>
                      View this area <span aria-hidden="true">&rarr;</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Openings + application */}
      <section id="cr-apply" className={cr.apply} aria-labelledby="cr-apply-heading">
        <div className={`container ${cr.applyGrid}`}>
          <aside className={cr.side}>
            <span className={cr.status}>
              <span className={cr.dot} aria-hidden="true" />
              No openings listed right now
            </span>
            <h2 id="cr-apply-heading" className={cr.sideTitle}>
              Send us your profile
            </h2>
            <p className={cr.sideText}>
              We hire as our projects grow. Share your details and we will keep them on file and
              write to you when a role matches your skills.
            </p>

            <ol className={cr.steps}>
              {steps.map((step, index) => (
                <li key={step.title} className={cr.step}>
                  <span className={cr.stepNo}>{index + 1}</span>
                  <span>
                    <strong className={cr.stepTitle}>{step.title}</strong>
                    <span className={cr.stepText}>{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className={cr.direct}>
              Prefer email? Write to{" "}
              <a href="mailto:hr@recenturesoft.com" className={cr.directLink}>
                hr@recenturesoft.com
              </a>
              .
            </p>
          </aside>

          <div className={cr.panel}>
            <h3 className={cr.panelTitle}>Candidate application</h3>
            <CareerForm />
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className={cr.end} aria-labelledby="cr-end-heading">
        <div className="container">
          <div className={cr.endBox}>
            <h2 id="cr-end-heading" className={cr.endTitle}>
              Ready to build something remarkable?
            </h2>
            <p className={cr.endText}>
              Write to our team or call us, and we will tell you what to expect.
            </p>
            <div className={cr.endActions}>
              <a href="mailto:hr@recenturesoft.com" className={cr.endBtn}>
                Contact the talent team <span aria-hidden="true">&rarr;</span>
              </a>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={cr.endGhost}>
                {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

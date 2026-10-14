import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { SeoFaq } from "@/components/seo-faq";
import { SeoServicesExplorer } from "@/components/seo-services-explorer";
import styles from "../services.module.css";
import seo from "./seo.module.css";

export const metadata: Metadata = {
  title: "SEO Services | Recenturesoft Infotech",
  description:
    "Technical SEO, on-page SEO, off-page SEO, keyword research, local SEO and SEO audits from Recenturesoft Infotech, Noida.",
  alternates: {
    canonical: "/services/seo",
  },
  openGraph: {
    title: "SEO Services | Recenturesoft Infotech",
    description:
      "Technical SEO, on-page SEO, off-page SEO, keyword research, local SEO and SEO audits from Recenturesoft Infotech, Noida.",
    url: "https://www.recenturesoft.com/services/seo",
    images: [
      {
        url: "/images/seo-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft SEO Services",
      },
    ],
  },
};

const services = [
  {
    title: "Technical SEO",
    desc: "Site architecture, crawlability, Core Web Vitals, mobile responsiveness and schema markup, so search engines can reach and understand every page.",
    includes: ["Site architecture", "Crawlability", "Core Web Vitals", "Mobile responsiveness", "Schema markup"],
    image: "/images/seo-hero.jpg",
  },
  {
    title: "On-Page SEO",
    desc: "Metadata, semantic content structure, internal linking and alignment with what people actually search for.",
    includes: ["Metadata", "Content structure", "Internal linking", "Search intent"],
    image: "/images/seo-dashboard.jpg",
  },
  {
    title: "Off-Page SEO",
    desc: "Quality backlink outreach, brand citations and digital PR that build domain trust.",
    includes: ["Backlink outreach", "Brand citations", "Digital PR"],
    image: "/images/services-team.jpg",
  },
  {
    title: "Keyword Research",
    desc: "Topic mapping, competitor gap analysis, keyword clustering and a review of where the real opportunities sit.",
    includes: ["Topic mapping", "Competitor gaps", "Keyword clustering"],
    image: "/images/services-overview.jpg",
  },
  {
    title: "Local SEO",
    desc: "Google Business Profile management, consistent citations and geo-targeted landing pages for nearby customers.",
    includes: ["Business Profile", "Local citations", "Geo-targeted pages"],
    image: "/images/home-hero.jpg",
  },
  {
    title: "SEO Audits",
    desc: "Technical diagnostics, competitor benchmarking and link profile checks, ending in a prioritised list of fixes.",
    includes: ["Technical diagnostics", "Competitor benchmarking", "Link profile check", "Fix list"],
    image: "/images/services-software.jpg",
  },
];

const phases = [
  {
    title: "Audit",
    desc: "A technical crawl, indexation review and a benchmark against your search competitors.",
  },
  {
    title: "Strategy",
    desc: "A keyword architecture, content gap analysis and a clear execution plan.",
  },
  {
    title: "Implementation",
    desc: "Technical fixes, on-page optimisation and authority building, delivered in phases.",
  },
  {
    title: "Optimisation",
    desc: "Ongoing monitoring of rankings and traffic, with regular refinements.",
  },
];

const reasons = [
  {
    lead: "Data decides the roadmap.",
    text: "Search data, not guesswork, chooses what we work on first.",
  },
  {
    lead: "You see every report.",
    text: "Clear reporting on crawling, indexing, rankings and conversions, with no vanity metrics.",
  },
  {
    lead: "White-hat only.",
    text: "Methods aimed at rankings that hold up through algorithm updates.",
  },
  {
    lead: "Built around your business.",
    text: "Roadmaps shaped around your market, tech stack and competitors, not a generic template.",
  },
];

const faqs = [
  {
    q: "How long does SEO take to show results?",
    a: "SEO is gradual. Technical fixes can be picked up within weeks, while content and authority work usually takes a few months to show in rankings. We agree the timeline with you after the audit.",
  },
  {
    q: "Do you guarantee a number one ranking?",
    a: "No one can honestly guarantee a ranking, because search engines make that decision. We focus on the work that improves your chances and report on it openly.",
  },
  {
    q: "What do you need from us to start?",
    a: "Access to your website and, if you have it, your search and analytics accounts. We handle the audit and planning from there.",
  },
  {
    q: "Can you work with our existing website?",
    a: "Yes. We build websites ourselves, so we can make technical changes directly or work with your developers.",
  },
  {
    q: "Do you only work with businesses in Noida?",
    a: "No. We are based in Sector 63, Noida, but we work with businesses across locations and can also set up local SEO for your area.",
  },
];

export default function SeoServicesPage() {
  const { contact } = siteConfig;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="seo-hero-heading">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="seo-hero-heading" className={`${styles.heroTitle} ${seo.heroTitle}`}>
              Grow Your Visibility. Win More Search Traffic.
            </h1>
            <p className={styles.heroText}>
              Data-led search engine optimisation to strengthen your brand authority, reach
              people searching for what you offer, and build a steady organic pipeline.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.btnPrimary}>
                Book an SEO Consultation <span aria-hidden="true">&rarr;</span>
              </Link>
              <a href="#seo-services" className={styles.btnOutline}>
                Explore Our SEO Services
              </a>
            </div>
          </div>

          <div className={styles.photoFrame}>
            <Image
              src="/images/seo-hero.jpg"
              alt="Ultra-wide monitor showing a search performance dashboard"
              width={1376}
              height={768}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.photo}
            />
          </div>
        </div>
      </section>

      {/* Services: colour-field mosaic */}
      <section
        id="seo-services"
        className={seo.services}
        aria-labelledby="seo-services-heading"
      >
        <div className="container">
          <h2 id="seo-services-heading" className={seo.bigTitle}>
            Six ways we move you up the results page
          </h2>

          <SeoServicesExplorer services={services} />
        </div>
      </section>

      {/* Framework: ascending steps */}
      <section className={seo.climb} aria-labelledby="seo-framework-heading">
        <div className="container">
          <h2 id="seo-framework-heading" className={seo.bigTitle}>
            A four-phase climb, one step at a time
          </h2>

          <div className={seo.climbWrap}>
            <div className={seo.chart} aria-hidden="true">
              <svg className={seo.chartSvg} viewBox="0 0 1000 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="seoArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className={seo.chartArea} d="M0 200 L125 175 L375 125 L625 75 L875 25 L1000 0 L1000 220 L0 220 Z" />
                <path className={seo.chartLine} d="M0 200 L125 175 L375 125 L625 75 L875 25 L1000 0" />
              </svg>
              {phases.map((phase, index) => (
                <span
                  key={phase.title}
                  className={seo.node}
                  style={{
                    left: `${12.5 + index * 25}%`,
                    top: `${((175 - index * 50) / 220) * 100}%`,
                  }}
                >
                  {index + 1}
                </span>
              ))}
            </div>

            <ol className={seo.stairs}>
              {phases.map((phase, index) => (
                <li key={phase.title} className={seo.stair}>
                  <span className={seo.stairPhase}>Phase {index + 1}</span>
                  <h3 className={seo.stairTitle}>{phase.title}</h3>
                  <p className={seo.stairText}>{phase.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Why: dark band with photo bleeding to the edge */}
      <section className={seo.why} aria-labelledby="seo-why-heading">
        <div className={seo.whyInner}>
          <div className={seo.whyCopy}>
            <h2 id="seo-why-heading" className={seo.whyTitle}>
              Why teams choose Recenturesoft
            </h2>
            <dl className={seo.reasons}>
              {reasons.map((item) => (
                <div key={item.lead} className={seo.reason}>
                  <dt className={seo.reasonLead}>{item.lead}</dt>
                  <dd className={seo.reasonText}>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={seo.whyPhoto}>
            <Image
              src="/images/seo-dashboard.jpg"
              alt="Laptop showing a search performance dashboard"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={seo.whyImg}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={seo.faq} aria-labelledby="seo-faq-heading">
        <div className={`container ${seo.faqGrid}`}>
          <div className={seo.faqIntro}>
            <h2 id="seo-faq-heading" className={seo.bigTitle}>
              Questions we hear most
            </h2>
            <p className={seo.faqLead}>
              Can&apos;t find your answer? Write to{" "}
              <a href={`mailto:${contact.email}`} className={seo.faqLink}>
                {contact.email}
              </a>
              .
            </p>
            <div className={seo.faqCard}>
              <p className={seo.faqCardTitle}>Still have questions?</p>
              <p className={seo.faqCardText}>
                Tell us about your website and we will suggest where to start.
              </p>
              <Link href="/contact" className={seo.faqCardBtn}>
                Talk to our team <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <SeoFaq items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className={seo.cta} aria-labelledby="seo-cta-heading">
        <span className={seo.ctaRingA} aria-hidden="true" />
        <span className={seo.ctaRingB} aria-hidden="true" />
        <span className={seo.ctaBars} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>

        <div className={`container ${seo.ctaInner}`}>
          <h2 id="seo-cta-heading" className={seo.ctaTitle}>
            Ready to grow your organic traffic?
          </h2>
          <div className={seo.ctaSide}>
            <p className={seo.ctaText}>
              Talk to our team about an SEO audit or a long-term plan for your website.
            </p>
            <div className={seo.ctaActions}>
              <Link href="/contact" className={seo.ctaBtn}>
                Consult an SEO Specialist <span aria-hidden="true">&rarr;</span>
              </Link>
              <a href={`tel:${contact.phoneRaw}`} className={seo.ctaBtnGhost}>
                Call {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { defineModule, group, image, list, longtext, seoFields, strings, text, url } from "./fields";

const defaults = {
  meta: {
    title: "Technical & Local SEO Services | Recenturesoft Infotech",
    description:
      "Technical SEO, on-page SEO, off-page SEO, keyword research, local SEO and SEO audits from Recenturesoft Infotech, Noida.",
    image: "/images/seo-hero.jpg",
  },
  hero: {
    title: "Grow Your Visibility. Win More Search Traffic.",
    text: "Data-led search engine optimisation to strengthen your brand authority, reach people searching for what you offer, and build a steady organic pipeline.",
    primaryLabel: "Book an SEO Consultation",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our SEO Services",
    secondaryHref: "#seo-services",
    image: "/images/seo-hero.jpg",
    imageAlt: "Ultra-wide monitor showing a search performance dashboard",
  },
  services: {
    title: "Six ways we move you up the results page",
    linkPrefix: "Ask about",
    items: [
      {
        title: "Technical SEO",
        desc: "Site architecture, crawlability, Core Web Vitals, mobile responsiveness and schema markup, so search engines can reach and understand every page.",
        includes: ["Site architecture", "Crawlability", "Core Web Vitals", "Mobile responsiveness", "Schema markup"],
        image: "/images/seo-technical.jpg",
      },
      {
        title: "On-Page SEO",
        desc: "Metadata, semantic content structure, internal linking and alignment with what people actually search for.",
        includes: ["Metadata", "Content structure", "Internal linking", "Search intent"],
        image: "/images/seo-onpage.jpg",
      },
      {
        title: "Off-Page SEO",
        desc: "Quality backlink outreach, brand citations and digital PR that build domain trust.",
        includes: ["Backlink outreach", "Brand citations", "Digital PR"],
        image: "/images/seo-offpage.jpg",
      },
      {
        title: "Keyword Research",
        desc: "Topic mapping, competitor gap analysis, keyword clustering and a review of where the real opportunities sit.",
        includes: ["Topic mapping", "Competitor gaps", "Keyword clustering"],
        image: "/images/seo-keywords.jpg",
      },
      {
        title: "Local SEO",
        desc: "Google Business Profile management, consistent citations and geo-targeted landing pages for nearby customers.",
        includes: ["Business Profile", "Local citations", "Geo-targeted pages"],
        image: "/images/seo-local.jpg",
      },
      {
        title: "SEO Audits",
        desc: "Technical diagnostics, competitor benchmarking and link profile checks, ending in a prioritised list of fixes.",
        includes: ["Technical diagnostics", "Competitor benchmarking", "Link profile check", "Fix list"],
        image: "/images/seo-audit.jpg",
      },
    ],
  },
  phases: {
    title: "A four-phase climb, one step at a time",
    phaseWord: "Phase",
    items: [
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
    ],
  },
  why: {
    title: "Why teams choose Recenturesoft",
    image: "/images/seo-why.jpg",
    imageAlt: "Two colleagues discussing search strategy over a table in a city office",
    items: [
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
    ],
  },
  faq: {
    title: "Questions we hear most",
    leadText: "Can't find your answer? Write to",
    cardTitle: "Still have questions?",
    cardText: "Tell us about your website and we will suggest where to start.",
    cardButtonLabel: "Talk to our team",
    cardButtonHref: "/contact",
    items: [
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
    ],
  },
  cta: {
    title: "Ready to grow your organic traffic?",
    text: "Talk to our team about an SEO audit or a long-term plan for your website.",
    buttonLabel: "Consult an SEO Specialist",
    buttonHref: "/contact",
    callLabel: "Call",
  },
};

export const seoModule = defineModule({
  id: "serviceSeo",
  title: "SEO Services",
  route: "/services/seo",
  group: "Services",
  defaults,
  sections: [
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
    {
      id: "hero",
      title: "Top banner",
      fields: [
        group("hero", "Top banner", [
          text("title", "Heading", { max: 120 }),
          longtext("text", "Introduction", { max: 400, rows: 3 }),
          text("primaryLabel", "Main button text", { max: 40 }),
          url("primaryHref", "Main button link"),
          text("secondaryLabel", "Second button text", { max: 40, help: "Leave empty to hide the second button." }),
          url("secondaryHref", "Second button link", { help: "Use #seo-services to scroll to the next section." }),
          image("image", "Banner image"),
          text("imageAlt", "Image description", { max: 200, help: "Read aloud by screen readers and shown if the image cannot load." }),
        ]),
      ],
    },
    {
      id: "services",
      title: "SEO services",
      fields: [
        group("services", "SEO services", [
          text("title", "Section heading", { max: 100 }),
          text("linkPrefix", "Link text before the service name", { max: 30, help: "Shows as Ask about Technical SEO." }),
          list(
            "items",
            "Services",
            "service",
            [
              text("title", "Title", { max: 60 }),
              longtext("desc", "Description", { max: 400, rows: 3 }),
              strings("includes", "What it includes", { addLabel: "Add item", max: 10 }),
              image("image", "Image"),
            ],
            { titleKey: "title", max: 12 },
          ),
        ]),
      ],
    },
    {
      id: "phases",
      title: "Our phases",
      fields: [
        group("phases", "Our phases", [
          text("title", "Section heading", { max: 100 }),
          text("phaseWord", "Word before the phase number", { max: 20, help: "Shows as Phase 1, Phase 2 and so on." }),
          list(
            "items",
            "Phases",
            "phase",
            [text("title", "Title", { max: 60 }), longtext("desc", "Description", { max: 300, rows: 3 })],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "why",
      title: "Why choose us",
      fields: [
        group("why", "Why choose us", [
          text("title", "Heading", { max: 100 }),
          image("image", "Side image"),
          text("imageAlt", "Image description", { max: 200 }),
          list(
            "items",
            "Reasons",
            "reason",
            [text("lead", "Bold opening line", { max: 80 }), longtext("text", "Explanation", { max: 300, rows: 3 })],
            { titleKey: "lead", max: 10 },
          ),
        ]),
      ],
    },
    {
      id: "faq",
      title: "Questions and answers",
      fields: [
        group("faq", "Questions and answers", [
          text("title", "Heading", { max: 100 }),
          text("leadText", "Text before the email address", { max: 120, help: "The email address itself is set under Site settings." }),
          text("cardTitle", "Help box title", { max: 60 }),
          longtext("cardText", "Help box text", { max: 200, rows: 2 }),
          text("cardButtonLabel", "Help box button text", { max: 40 }),
          url("cardButtonHref", "Help box button link"),
          list(
            "items",
            "Questions",
            "question",
            [text("q", "Question", { max: 150 }), longtext("a", "Answer", { max: 800, rows: 4 })],
            { titleKey: "q", max: 20 },
          ),
        ]),
      ],
    },
    {
      id: "cta",
      title: "Closing call-to-action",
      fields: [
        group("cta", "Closing call-to-action", [
          text("title", "Heading", { max: 100 }),
          longtext("text", "Text", { max: 300, rows: 3 }),
          text("buttonLabel", "Button text", { max: 40 }),
          url("buttonHref", "Button link"),
          text("callLabel", "Word before the phone number", { max: 20, help: "The phone number itself is set under Site settings." }),
        ]),
      ],
    },
  ],
});

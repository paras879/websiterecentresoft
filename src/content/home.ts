import { defineModule, group, icon, image, list, longtext, seoFields, strings, text, toggle, url } from "./fields";

const defaults = {
  meta: {
    title: "Recenturesoft | Software Engineering & AI Automation",
    description:
      "Recenturesoft Infotech delivers custom software engineering, enterprise web applications, and AI-powered workflow automation from Noida, India.",
    image: "/images/hero.jpg",
  },
  hero: {
    title: "Engineering Scalable Software & Intelligent AI Automation",
    text: "Recenturesoft delivers custom software engineering, enterprise web applications, and AI-powered workflow automation designed to solve complex operational challenges with precision, security, and scale.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our Services",
    secondaryHref: "/services/software-development",
    image: "/images/home-hero.jpg",
    imageAlt: "Engineers reviewing system architecture diagrams and code together in an office",
  },
  services: {
    title: "Our Services",
    lead: "Four capabilities, delivered with the same engineering discipline.",
    linkPrefix: "Learn more about",
    items: [
      {
        title: "Software Development",
        desc: "Custom software engineering for enterprise systems and modern web applications.",
        points: [
          "Custom software engineered around your business logic",
          "Enterprise web applications built for reliability",
          "Scalable business systems and backend architecture",
        ],
        href: "/services/software-development",
        icon: "code",
      },
      {
        title: "AI Automation",
        desc: "AI-powered workflow automation integrated directly into the way your teams already work.",
        points: [
          "Workflow automation that removes manual, repetitive effort",
          "AI-powered operations and data pipeline integration",
          "Automated routing and triage for business processes",
        ],
        href: "/services/ai-automation",
        icon: "gear",
      },
      {
        title: "Custom Development",
        desc: "Tailored digital solutions built around your workflows, from web platforms to integrations.",
        points: [
          "Custom web applications and enterprise portals",
          "API development and third-party integrations",
          "Legacy system modernisation, done in phases",
        ],
        href: "/services/custom-development",
        icon: "wrench",
      },
      {
        title: "SEO Services",
        desc: "Data-led search optimisation that builds visibility and a steady organic pipeline for your business.",
        points: [
          "Technical SEO, crawlability and Core Web Vitals",
          "On-page, off-page and keyword research",
          "Local SEO and detailed SEO audits",
        ],
        href: "/services/seo",
        icon: "search",
      },
    ],
  },
  about: {
    title: "Software Engineering and AI Automation,",
    highlight: "Built in Noida",
    lead1:
      "Recenturesoft Infotech Pvt Ltd is a software development company based in Sector 63, Noida, offering custom software development, web application engineering and AI-driven automation.",
    lead2: "Clean, maintainable code and transparent communication guide how our team works with yours.",
    image: "/images/services-team.jpg",
    imageAlt: "Engineering team discussing system architecture at the Noida office",
    points: [
      {
        title: "Custom software development",
        desc: "Built around your workflows and business goals.",
        icon: "code",
      },
      {
        title: "Enterprise web applications",
        desc: "Reliable, maintainable and ready to grow with you.",
        icon: "web",
      },
      {
        title: "AI-powered workflow automation",
        desc: "Less manual effort and faster day-to-day execution.",
        icon: "workflow",
      },
    ],
    primaryLabel: "More about Recenturesoft",
    primaryHref: "/about",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
  },
  why: {
    title: "Why Choose Recenturesoft",
    lead: "Practical engineering principles that keep your software dependable over time.",
    items: [
      {
        title: "Maintainable Engineering",
        desc: "Clean, modular codebases with testing built in, so your software stays easy to extend.",
        chips: ["Modular code", "Testing"],
        icon: "code",
      },
      {
        title: "Scalable Architecture",
        desc: "Systems designed to grow with your users, data and business requirements.",
        chips: ["Growth-ready", "Modular"],
        icon: "scale",
      },
      {
        title: "Security-Conscious Development",
        desc: "Security considered from design through deployment, not added at the end.",
        chips: ["Secure by design", "Reviewed"],
        icon: "shield",
      },
      {
        title: "Transparent Delivery",
        desc: "Milestone-based delivery with clear communication and documentation throughout.",
        chips: ["Milestones", "Clear updates"],
        icon: "calendar",
      },
    ],
  },
  approach: {
    title: "Our Approach",
    lead: "A clear four-step process from first conversation to delivery.",
    stepWord: "Step",
    outcomeLabel: "Outcome",
    items: [
      {
        title: "Discover",
        desc: "We study your goals, users and constraints to define a clear scope and roadmap.",
        outcome: "Clear scope & roadmap",
        icon: "search",
      },
      {
        title: "Design",
        desc: "Architecture, data models and interfaces are planned before development begins.",
        outcome: "Architecture & data models",
        icon: "pen",
      },
      {
        title: "Build",
        desc: "Iterative development with regular reviews, testing and early visibility.",
        outcome: "Reviewed, tested releases",
        icon: "code",
      },
      {
        title: "Deliver",
        desc: "Deployment, handover of code and documentation, and technical support.",
        outcome: "Handover & support",
        icon: "rocket",
      },
    ],
    buttonLabel: "Start Your Project",
    buttonHref: "/contact",
  },
  cta: {
    title: "Let's build something dependable together",
    text: "Tell us what you're building. We'll help you scope your next software or AI automation initiative.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
    showEmail: true,
  },
};

export const homeModule = defineModule({
  id: "home",
  title: "Home",
  route: "/",
  group: "Pages",
  defaults,
  sections: [
    {
      id: "hero",
      title: "Top banner",
      description: "The first thing visitors see.",
      fields: [
        group("hero", "Top banner", [
          text("title", "Headline", { required: true, max: 120 }),
          longtext("text", "Supporting text", { rows: 4 }),
          text("primaryLabel", "Main button text"),
          url("primaryHref", "Main button link"),
          text("secondaryLabel", "Second button text"),
          url("secondaryHref", "Second button link"),
          image("image", "Banner image"),
          text("imageAlt", "Image description", { help: "Read aloud by screen readers and shown if the image fails." }),
        ]),
      ],
    },
    {
      id: "services",
      title: "Our services",
      description: "The four service cards.",
      fields: [
        group("services", "Our services", [
          text("title", "Section heading"),
          text("lead", "Section lead-in"),
          text("linkPrefix", "Card link text", { help: 'Shown before the service name, e.g. "Learn more about".' }),
          list(
            "items",
            "Service cards",
            "service",
            [
              text("title", "Name", { required: true }),
              longtext("desc", "Description", { rows: 3 }),
              strings("points", "Key points", { addLabel: "Add point", max: 6 }),
              url("href", "Link to", { required: true }),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "about",
      title: "About the company",
      fields: [
        group("about", "About the company", [
          text("title", "Heading", { help: "The first part of the heading." }),
          text("highlight", "Highlighted words", { help: "Shown in colour after the heading." }),
          longtext("lead1", "First paragraph", { rows: 4 }),
          longtext("lead2", "Second paragraph", { rows: 3 }),
          image("image", "Image"),
          text("imageAlt", "Image description"),
          list(
            "points",
            "Highlights",
            "highlight",
            [text("title", "Title", { required: true }), text("desc", "Description"), icon("icon")],
            { titleKey: "title", max: 6 },
          ),
          text("primaryLabel", "Button text"),
          url("primaryHref", "Button link"),
          text("secondaryLabel", "Text link"),
          url("secondaryHref", "Text link target"),
        ]),
      ],
    },
    {
      id: "why",
      title: "Why choose us",
      fields: [
        group("why", "Why choose us", [
          text("title", "Section heading"),
          text("lead", "Section lead-in"),
          list(
            "items",
            "Reasons",
            "reason",
            [
              text("title", "Title", { required: true }),
              longtext("desc", "Description", { rows: 3 }),
              strings("chips", "Small tags", { addLabel: "Add tag", max: 4 }),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "approach",
      title: "Our approach",
      fields: [
        group("approach", "Our approach", [
          text("title", "Section heading"),
          text("lead", "Section lead-in"),
          text("stepWord", "Step label", { help: 'Shown before each number, e.g. "Step".' }),
          text("outcomeLabel", "Outcome label"),
          list(
            "items",
            "Steps",
            "step",
            [
              text("title", "Title", { required: true }),
              longtext("desc", "Description", { rows: 3 }),
              text("outcome", "Outcome"),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
          text("buttonLabel", "Button text"),
          url("buttonHref", "Button link"),
        ]),
      ],
    },
    {
      id: "cta",
      title: "Closing banner",
      fields: [
        group("cta", "Closing banner", [
          text("title", "Heading"),
          longtext("text", "Text", { rows: 3 }),
          text("primaryLabel", "Button text"),
          url("primaryHref", "Button link"),
          toggle("showEmail", "Show the company email next to the button"),
        ]),
      ],
    },
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
  ],
});

import { faqSection, defineModule, group, icon, image, list, longtext, seoFields, strings, text, toggle, url } from "./fields";

const defaults = {
  meta: {
    title: "Recenturesoft | Software Engineering & AI Automation",
    description:
      "Recenturesoft Infotech delivers custom software engineering, enterprise web applications, and AI-powered workflow automation from Noida, India.",
    image: "/images/hero.jpg",
  },
  hero: {
    title: "Software, Apps & Intelligent AI Agents Built Around Your Business",
    text: "Recenturesoft delivers custom software, mobile apps, AI agents and workflow automation, plus the search visibility to be found, designed to solve real operational challenges with precision, security and scale.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our Services",
    secondaryHref: "/services/software-development",
    image: "/images/home-hero.jpg",
    imageAlt: "Engineers reviewing system architecture diagrams and code together in an office",
  },
  services: {
    title: "Our Services",
    lead: "Enterprise capabilities, delivered with the same engineering discipline.",
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
        title: "AI - Agentic",
        desc: "Autonomous enterprise agents, multi-agent swarms, and verified human-in-the-loop workflows.",
        points: [
          "Autonomous goal reasoning and tool execution via MCP",
          "Multi-agent swarm coordination and supervisory routing",
          "Enterprise RBAC, PII sanitization and human audit gates",
        ],
        href: "/services/agentic-ai",
        icon: "assist",
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
        title: "App Development",
        desc: "Native Android and iOS apps, from first idea to the App Store and Google Play.",
        points: [
          "Native Swift and Kotlin, or cross-platform when it fits",
          "Secure sign-in, offline sync and smooth performance",
          "Release support for Apple and Google stores",
        ],
        href: "/services/app-development",
        icon: "phone",
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
    title: "Software, Apps and AI Automation,",
    highlight: "Built in Noida",
    lead1:
      "Recenturesoft Infotech Pvt Ltd is a software development company based in Sector 63, Noida, offering custom software development, mobile apps, AI agents, workflow automation and SEO.",
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
        title: "Mobile apps for Android and iOS",
        desc: "Native apps built for speed, security and the app stores.",
        icon: "phone",
      },
      {
        title: "AI agents and workflow automation",
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
        tagline: "Scoping & Technical Strategy",
        chips: ["Roadmap", "Feasibility", "Architecture"],
        desc: "We analyze your business workflows, user needs, and legacy system bottlenecks to engineer a future-ready technical blueprint, complete with accurate milestone scoping, risk assessment, and clear ROI roadmap.",
        outcome: "Comprehensive scope, technical blueprint & ROI roadmap",
        icon: "search",
      },
      {
        title: "Design",
        tagline: "System Schemas & Prototyping",
        chips: ["UI/UX Wireframes", "Microservices", "Database"],
        desc: "Our solution architects plan secure microservices architecture, optimized database schemas, and modern UI/UX wireframes to guarantee high-performance, responsive design, and frictionless user journeys.",
        outcome: "Scalable system architecture & interactive prototypes",
        icon: "pen",
      },
      {
        title: "Build",
        tagline: "Agile Engineering & QA",
        chips: ["Clean Code", "2-Week Sprints", "Automated QA"],
        desc: "Engineers build your product through disciplined two-week agile sprints, clean modular codebases, automated unit testing, and rigorous code reviews to deliver reliable, enterprise-grade releases.",
        outcome: "Thoroughly tested, secure & sprint-reviewed releases",
        icon: "code",
      },
      {
        title: "Deliver",
        tagline: "Cloud Launch & Support",
        chips: ["CI/CD Pipelines", "Code Handover", "24/7 SLA"],
        desc: "Seamless cloud deployment via automated CI/CD pipelines, complete source code & documentation handover, post-launch performance monitoring, and dedicated maintenance support.",
        outcome: "Production deployment, full code handover & 24/7 SLA support",
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
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What does Recenturesoft Infotech do?",
        a: "Recenturesoft Infotech is a software company based in Noida, India. We build custom software, mobile apps, AI automation and agentic AI systems, and we offer SEO services.",
      },
      {
        q: "Where is your office?",
        a: "Our office is at A-125, 1st Floor, Sector-63, Noida, Uttar Pradesh 201301. You can open it in Google Maps from the Contact page.",
      },
      {
        q: "How do I start a project with you?",
        a: "Send us a message from the Contact page, write to us by email or call us. Tell us what you want to build and we will reply with the next steps.",
      },
      {
        q: "Which services can I ask about?",
        a: "Custom software development, mobile app development, AI automation, agentic AI and SEO. Each service has its own page with more detail.",
      },
    ],
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
              text("tagline", "Quick tagline / subtitle"),
              strings("chips", "Tech pills / highlights"),
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
    faqSection(),
  ],
});

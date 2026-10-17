import { defineModule, group, icon, image, list, longtext, seoFields, strings, text, url } from "./fields";

const defaults = {
  meta: {
    title: "Software Development Services | Recenturesoft Infotech",
    description:
      "Custom software development, web application engineering, and enterprise digital solutions tailored to operational requirements by Recenturesoft Infotech.",
    image: "/images/software.jpg",
  },
  hero: {
    title: "Software Built for Your Business",
    text: "Recenturesoft engineers dependable custom software and enterprise web applications designed around your workflows, operational demands, and long-term business goals.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
    secondaryLabel: "View Development Approach",
    image: "/images/software.jpg",
    imageAlt: "Three monitors showing code, a monitoring dashboard and test results at a developer workstation",
  },
  capabilities: {
    title: "Our Software Development",
    highlight: "Capabilities",
    lead: "From bespoke internal platforms to customer-facing web applications, our engineering standards prioritise stability and maintainability.",
    chipsLabel: "Key technologies and focus",
    items: [
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
    ],
  },
  approach: {
    title: "Our Engineering Approach",
    lead: "A clear, transparent delivery process from initial scoping to deployment.",
    items: [
      {
        title: "Discover",
        desc: "Requirements gathering, technical feasibility, domain modelling and a project roadmap.",
        image: "/images/software-discover.jpg",
        icon: "search",
      },
      {
        title: "Design",
        desc: "System architecture, database schema design and responsive UI wireframes.",
        image: "/images/software-design.jpg",
        icon: "architecture",
      },
      {
        title: "Develop",
        desc: "Clean, modular code, sprint-based iterations and regular code reviews.",
        image: "/images/software-develop.jpg",
        icon: "terminal",
      },
      {
        title: "Test",
        desc: "Automated unit and integration tests, regression checks and code quality reviews.",
        image: "/images/software-test.jpg",
        icon: "check",
      },
      {
        title: "Deliver",
        desc: "Production deployment, documentation handover and ongoing support.",
        image: "/images/software-deliver.jpg",
        icon: "rocket",
      },
    ],
  },
  principles: {
    title: "Key Engineering",
    highlight: "Principles",
    lead: "Dependable outcomes come from building with maintainability, reliability, and security at the core.",
    items: [
      {
        icon: "code",
        title: "Maintainable Codebases",
        desc: "Clean standards and clear documentation that make future changes easier.",
        image: "/images/software-maintainable.jpg",
      },
      {
        icon: "scale",
        title: "Scalable Architecture",
        desc: "Systems designed to grow steadily with user load and data volume.",
        image: "/images/software-scalable.jpg",
      },
      {
        icon: "touch",
        title: "Usability-Focused Design",
        desc: "Intuitive, accessible interfaces that reduce friction for your teams.",
        image: "/images/software-usability.jpg",
      },
      {
        icon: "shield",
        title: "Security-Conscious Practices",
        desc: "Security considered from architecture through deployment.",
        image: "/images/software-security.jpg",
      },
    ],
  },
  hub: {
    title: "Dedicated Engineering From Sector 63, Noida",
    lead: "Our software development team works from Sector 63, Noida. We emphasise transparent sprint planning, proactive technical communication, and scheduled code walkthroughs to keep your engineering objectives aligned.",
    cards: [
      {
        title: "Direct Collaboration",
        desc: "Structured sprint cadence and regular deliverables.",
      },
      {
        title: "Documented Handover",
        desc: "Code and documentation delivered at the end of each engagement.",
      },
    ],
    image: "/images/services-software.jpg",
    imageAlt: "Ultra-wide monitor showing a software architecture diagram next to code",
  },
  cta: {
    title: "Ready to Build Software That Lasts?",
    text: "Schedule an introductory engineering consultation with our team in Sector 63, Noida.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        q: "How long does custom software development take?",
        a: "The timeline depends on the scope of the project. After we understand your requirements we can share an estimate, so please contact us with the details.",
      },
      {
        q: "Do you sign an NDA before we discuss the project?",
        a: "If you need an NDA, tell us when you get in touch and we will discuss it with you before you share sensitive details.",
      },
      {
        q: "Who owns the source code after the project?",
        a: "Ownership of the code is agreed in the project contract. Please raise it at the start so that it is written down clearly.",
      },
      {
        q: "Can you take over an existing codebase?",
        a: "Yes. We start with a code audit to assess quality and risk, then present a refactoring or migration plan before touching anything.",
      },
      {
        q: "What technologies do you use?",
        a: "We default to React, Next.js, TypeScript, Node.js, and PostgreSQL, but we choose the stack that fits your requirements, not just what we prefer.",
      },
    ],
  },
};

export const softwareModule = defineModule({
  id: "serviceSoftware",
  title: "Software Development",
  route: "/services/software-development",
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
          longtext("text", "Intro text", { rows: 4 }),
          text("primaryLabel", "Main button text", { max: 60 }),
          url("primaryHref", "Main button link"),
          text("secondaryLabel", "Second button text", {
            max: 60,
            help: "This button scrolls down to the approach section of the page. Leave empty to hide it.",
          }),
          image("image", "Image"),
          text("imageAlt", "Image description", {
            help: "Read aloud by screen readers and shown if the image cannot load.",
          }),
        ]),
      ],
    },
    {
      id: "capabilities",
      title: "Capabilities",
      fields: [
        group("capabilities", "Capabilities", [
          text("title", "Heading (first part)", { max: 120 }),
          text("highlight", "Heading (highlighted part)", {
            max: 60,
            help: "Shown in colour at the end of the heading.",
          }),
          longtext("lead", "Intro text", { rows: 3 }),
          text("chipsLabel", "Tag list description", {
            help: "Read aloud by screen readers for the small tags on each card.",
          }),
          list(
            "items",
            "Capabilities",
            "capability",
            [
              text("title", "Title", { required: true, max: 80 }),
              longtext("desc", "Description", { rows: 3 }),
              strings("chips", "Small tags", { addLabel: "Add tag", max: 6 }),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "approach",
      title: "Engineering approach",
      description: "Step numbers are added automatically in the order listed.",
      fields: [
        group("approach", "Engineering approach", [
          text("title", "Section heading", { max: 120 }),
          text("lead", "Intro text"),
          list(
            "items",
            "Steps",
            "step",
            [
              text("title", "Title", { required: true, max: 60 }),
              longtext("desc", "Description", { rows: 3 }),
              image("image", "Image"),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "principles",
      title: "Engineering principles",
      description: "Numbers are added automatically in the order listed.",
      fields: [
        group("principles", "Engineering principles", [
          text("title", "Heading (first part)", { max: 120 }),
          text("highlight", "Heading (highlighted part)", {
            max: 60,
            help: "Shown in colour at the end of the heading.",
          }),
          longtext("lead", "Intro text", { rows: 3 }),
          list(
            "items",
            "Principles",
            "principle",
            [
              text("title", "Title", { required: true, max: 80 }),
              longtext("desc", "Description", { rows: 3 }),
              image("image", "Background image", { help: "A decorative picture behind the card." }),
              icon("icon"),
            ],
            { titleKey: "title", max: 6 },
          ),
        ]),
      ],
    },
    {
      id: "hub",
      title: "Noida team",
      fields: [
        group("hub", "Noida team", [
          text("title", "Heading", { max: 120 }),
          longtext("lead", "Intro text", { rows: 4 }),
          list(
            "cards",
            "Small cards",
            "card",
            [text("title", "Title", { required: true, max: 60 }), longtext("desc", "Description", { rows: 2 })],
            { titleKey: "title", max: 4 },
          ),
          image("image", "Image"),
          text("imageAlt", "Image description"),
        ]),
      ],
    },
    {
      id: "cta",
      title: "Closing banner",
      fields: [
        group("cta", "Closing banner", [
          text("title", "Heading", { max: 120 }),
          longtext("text", "Text", { rows: 3 }),
          text("primaryLabel", "Button text", { max: 60 }),
          url("primaryHref", "Button link"),
        ]),
      ],
    },
    {
      id: "faq",
      title: "Frequently asked questions",
      fields: [
        group("faq", "Frequently asked questions", [
          text("title", "Section heading", { max: 100 }),
          list(
            "items",
            "Questions",
            "question",
            [text("q", "Question", { max: 150 }), longtext("a", "Answer", { max: 800, rows: 4 })],
            { titleKey: "q", max: 15 },
          ),
        ]),
      ],
    },
  ],
});

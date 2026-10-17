import { faqSection, defineModule, group, icon, image, list, longtext, seoFields, text, url } from "./fields";

const defaults = {
  meta: {
    title: "About Recenturesoft Infotech | Custom Software Engineering",
    description:
      "Learn about Recenturesoft Infotech Pvt Ltd, our engineering capabilities, software development approach, and enterprise technology solutions.",
    image: "/images/about.jpg",
  },
  hero: {
    title: "Engineering Dependable Software from Sector 63, Noida",
    text: "Recenturesoft Infotech Pvt. Ltd. is a custom software engineering and AI automation company. We partner with organisations to build robust web applications, maintainable backend architectures, and practical workflow automation that solves real operational challenges.",
    facts: [
      { label: "Registered Office", value: "Sector 63, Noida, UP" },
      { label: "Focus", value: "Software & AI Automation" },
      { label: "Collaboration", value: "Direct access to the engineering team" },
    ],
    image: "/images/home-hero.jpg",
    imageAlt: "Engineers collaborating around architecture diagrams in a Noida office",
  },
  pragmatic: {
    title: "Pragmatic Engineering,",
    highlight: "Zero Hype",
    lead: "Our approach prioritises long-term software sustainability over passing technology trends. We care about reliable systems and real efficiency gains for the people who use them.",
    linkLabel: "Talk to our team",
    linkHref: "/contact",
    items: [
      {
        title: "Core Architectural Discipline",
        desc: "Built on clean modular code, predictable release cycles and transparent communication. Every system is structured for testability and straightforward maintenance.",
        icon: "terminal",
      },
      {
        title: "Direct Technical Collaboration",
        desc: "Clients work directly with the developers and architects building their applications, which keeps decisions quick and context intact.",
        icon: "architecture",
      },
      {
        title: "Objective Business Impact",
        desc: "We avoid speculative buzzwords. Every line of code and automation is built to solve a defined business bottleneck and reduce operational overhead.",
        icon: "check",
      },
    ],
  },
  principles: {
    title: "Our Engineering Principles",
    lead: "The standards that guide how our team designs, refactors and deploys business systems.",
    items: [
      {
        label: "ARCHITECTURE",
        title: "Maintainable Codebases",
        desc: "Documented, modular code on modern frameworks, designed for longevity and low technical debt.",
        icon: "code",
      },
      {
        label: "LOGIC",
        title: "Predictable Logic",
        desc: "Reliable APIs, transactional integrity and predictable automated pipelines rather than black-box experiments.",
        icon: "database",
      },
      {
        label: "GOVERNANCE",
        title: "Security-Conscious Development",
        desc: "Security considered from schema design through production deployment.",
        icon: "shield",
      },
      {
        label: "OPERATIONS",
        title: "Transparent Collaboration",
        desc: "Visibility into sprint progress, regular code walkthroughs and proactive technical updates.",
        icon: "eye",
      },
    ],
  },
  teams: {
    title: "Our Development Teams in Noida",
    lead: "Our engineering and automation teams work out of Sector 63, Noida. Keeping design, development and quality engineering close together supports quick turnaround and shared understanding of your project.",
    image: "/images/services-team.jpg",
    imageAlt: "Engineers discussing microservices architecture at a whiteboard",
    points: [
      {
        title: "Cross-functional teams:",
        desc: "Frontend engineers, backend engineers and QA work together for quicker coordination.",
      },
      {
        title: "Whiteboard sessions:",
        desc: "Complex domain logic is mapped collaboratively before schemas are written.",
      },
      {
        title: "Clear communication:",
        desc: "Regular updates and walkthroughs keep timelines and expectations aligned.",
      },
    ],
  },
  cta: {
    title: "Ready to discuss your software or automation requirements?",
    text: "Connect with our Noida team. We'll review your existing setup, discuss architecture options, and agree clear timelines.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Services",
    secondaryHref: "/services/software-development",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What kind of company is Recenturesoft Infotech?",
        a: "Recenturesoft Infotech Pvt Ltd is a software company in Noida, India. We design and build software and help businesses use AI in their everyday work.",
      },
      {
        q: "What do you build?",
        a: "Custom web and enterprise software, mobile apps, AI automation and agentic AI systems. We also provide SEO services.",
      },
      {
        q: "How can I talk to the team?",
        a: "Use the Contact page to send a message, or email or call us using the details listed there.",
      },
      {
        q: "Are you hiring?",
        a: "Open roles and the areas we hire for are listed on our Careers page.",
      },
    ],
  },
};

export const aboutModule = defineModule({
  id: "about",
  title: "About Us",
  route: "/about",
  group: "Pages",
  defaults,
  sections: [
    {
      id: "hero",
      title: "Top banner",
      description: "The first thing visitors see on the About page.",
      fields: [
        group("hero", "Top banner", [
          text("title", "Headline", { required: true, max: 120 }),
          longtext("text", "Introduction", { rows: 5 }),
          list(
            "facts",
            "Quick facts",
            "fact",
            [text("label", "Label", { required: true, max: 40 }), text("value", "Value", { max: 100 })],
            { titleKey: "label", max: 6 },
          ),
          image("image", "Banner image"),
          text("imageAlt", "Image description", { help: "Read aloud by screen readers and shown if the image fails." }),
        ]),
      ],
    },
    {
      id: "pragmatic",
      title: "Our approach",
      description: "The numbered list of working principles. Numbers (01, 02...) are added automatically.",
      fields: [
        group("pragmatic", "Our approach", [
          text("title", "Heading", { help: "The first part of the heading." }),
          text("highlight", "Highlighted words", { help: "Shown in colour after the heading." }),
          longtext("lead", "Introduction", { rows: 4 }),
          text("linkLabel", "Link text"),
          url("linkHref", "Link target"),
          list(
            "items",
            "Numbered points",
            "point",
            [text("title", "Title", { required: true }), longtext("desc", "Description", { rows: 4 }), icon("icon")],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "principles",
      title: "Engineering principles",
      fields: [
        group("principles", "Engineering principles", [
          text("title", "Section heading"),
          longtext("lead", "Section lead-in", { rows: 3 }),
          list(
            "items",
            "Principles",
            "principle",
            [
              text("label", "Small label", { max: 24, help: "Shown in capitals above the title, after an automatic number." }),
              text("title", "Title", { required: true }),
              longtext("desc", "Description", { rows: 3 }),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "teams",
      title: "Our teams",
      fields: [
        group("teams", "Our teams", [
          text("title", "Heading"),
          longtext("lead", "Introduction", { rows: 4 }),
          image("image", "Image"),
          text("imageAlt", "Image description"),
          list(
            "points",
            "Checklist",
            "point",
            [text("title", "Bold lead-in", { required: true }), longtext("desc", "Description", { rows: 3 })],
            { titleKey: "title", max: 8 },
          ),
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
          text("primaryLabel", "Main button text"),
          url("primaryHref", "Main button link"),
          text("secondaryLabel", "Second button text"),
          url("secondaryHref", "Second button link"),
        ]),
      ],
    },
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
    faqSection(),
  ],
});

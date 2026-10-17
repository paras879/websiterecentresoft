import { faqSection, defineModule, group, icon, image, list, longtext, seoFields, strings, text, url } from "./fields";

const defaults = {
  meta: {
    title: "Custom Development Services | Recenturesoft Infotech",
    description:
      "Custom web applications, enterprise software, SaaS products, APIs, and business automation solutions from Recenturesoft Infotech, Noida.",
    image: "/images/custom-hero.jpg",
  },
  hero: {
    title: "Custom Software Built Around Your Business.",
    text: "We design and develop tailored digital solutions that streamline operations, solve complex challenges, and help your business scale with confidence.",
    primaryLabel: "Discuss Your Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our Expertise",
    secondaryHref: "#cd-build",
    image: "/images/custom-hero.jpg",
    imageAlt: "Developer workstation with code editors and a system architecture diagram",
  },
  build: {
    title: "What We Build",
    lead: "End-to-end custom engineering built for reliability, efficiency and growth.",
    items: [
      {
        icon: "web",
        title: "Custom Web Application Development",
        desc: "Modern, high-performance web platforms built on responsive architecture and secure frameworks.",
        image: "/images/custom-web-apps.jpg",
        alt: "Designer reviewing a web application on a desktop monitor",
        tags: ["Portals", "Dashboards", "Customer platforms"],
      },
      {
        icon: "enterprise",
        title: "Enterprise Software Solutions",
        desc: "Business systems designed to streamline complex workflows and data management.",
        image: "/images/custom-enterprise.jpg",
        alt: "Modern glass corporate office building",
        tags: ["Workflows", "Data management", "Integrations"],
      },
      {
        icon: "deploy",
        title: "SaaS Product Development",
        desc: "Scalable, multi-tenant cloud products taken from first MVP to a mature platform.",
        image: "/images/custom-saas.jpg",
        alt: "Laptop showing a product analytics dashboard",
        tags: ["Multi-tenant", "MVP to scale", "Subscriptions"],
      },
      {
        icon: "integrate",
        title: "API Development & Integration",
        desc: "REST and GraphQL services, plus secure connections to the third-party tools you already use.",
        image: "/images/custom-api.jpg",
        alt: "Close-up of source code on a screen",
        tags: ["REST", "GraphQL", "Third-party tools"],
      },
      {
        icon: "workflow",
        title: "Business Process Automation",
        desc: "Automated workflows that remove manual bottlenecks and repetitive work.",
        image: "/images/custom-automation.jpg",
        alt: "Person drawing a process flowchart on a whiteboard",
        tags: ["Workflow automation", "Less manual work"],
      },
      {
        icon: "modernize",
        title: "Legacy System Modernisation",
        desc: "Refactoring older systems into maintainable, cloud-ready services, planned to limit disruption.",
        image: "/images/custom-legacy.jpg",
        alt: "Circuit board close-up representing legacy systems",
        tags: ["Refactoring", "Cloud-ready", "Phased move"],
      },
    ],
  },
  tech: {
    title: "Our Technology Expertise",
    lead: "Pick a layer to see the technologies we work with, from what your users see down to where your data lives.",
    groups: [
      {
        name: "Frontend",
        items: [
          { name: "React", role: "UI library", use: "Interactive, component-based user interfaces for web applications.", logo: "/tech/react.svg", color: "#61DAFB" },
          { name: "Next.js", role: "React framework", use: "Fast, search-friendly web apps with server rendering and routing built in.", logo: "/tech/nextdotjs.svg", color: "#111827" },
          { name: "TypeScript", role: "Typed JavaScript", use: "Typed code that catches mistakes early and keeps large projects maintainable.", logo: "/tech/typescript.svg", color: "#3178C6" },
          { name: "Vue.js", role: "UI framework", use: "Lightweight, approachable interfaces for dashboards and portals.", logo: "/tech/vuedotjs.svg", color: "#4FC08D" },
          { name: "Tailwind CSS", role: "Utility-first styling", use: "Consistent, responsive styling built quickly from reusable utilities.", logo: "/tech/tailwindcss.svg", color: "#06B6D4" },
        ],
      },
      {
        name: "Backend",
        items: [
          { name: "Node.js", role: "JavaScript runtime", use: "Fast APIs and real-time services written in JavaScript.", logo: "/tech/nodedotjs.svg", color: "#5FA04E" },
          { name: "Python", role: "General-purpose language", use: "Backend services, automation scripts and data processing.", logo: "/tech/python.svg", color: "#3776AB" },
          { name: "Java", role: "Enterprise language", use: "Robust, long-lived enterprise systems.", logo: "/tech/openjdk.svg", color: "#ED8B00" },
          { name: "Go", role: "Fast, compiled language", use: "High-performance services that handle many requests at once.", logo: "/tech/go.svg", color: "#00ADD8" },
          { name: ".NET Core", role: "Cross-platform framework", use: "Secure, cross-platform business applications and APIs.", logo: "/tech/dotnet.svg", color: "#512BD4" },
        ],
      },
      {
        name: "Cloud & DevOps",
        items: [
          { name: "AWS", role: "Cloud platform", use: "Hosting, storage and scalable infrastructure in the cloud.", logo: "/tech/amazonwebservices.svg", color: "#FF9900" },
          { name: "Google Cloud", role: "Cloud platform", use: "Cloud hosting, data services and managed infrastructure.", logo: "/tech/googlecloud.svg", color: "#4285F4" },
          { name: "Docker", role: "Containers", use: "Packaging applications so they run the same everywhere.", logo: "/tech/docker.svg", color: "#2496ED" },
          { name: "Kubernetes", role: "Container orchestration", use: "Running and scaling containers reliably in production.", logo: "/tech/kubernetes.svg", color: "#326CE5" },
          { name: "CI/CD", role: "Automated build and release", use: "Automated testing and releases so updates ship safely and often.", logo: "", color: "#1D4ED8" },
        ],
      },
      {
        name: "Databases",
        items: [
          { name: "PostgreSQL", role: "Relational database", use: "Reliable relational data for transactions and reporting.", logo: "/tech/postgresql.svg", color: "#4169E1" },
          { name: "MongoDB", role: "Document database", use: "Flexible document storage for fast-changing data.", logo: "/tech/mongodb.svg", color: "#47A248" },
          { name: "Redis", role: "In-memory data store", use: "Caching and fast lookups that keep applications responsive.", logo: "/tech/redis.svg", color: "#FF4438" },
          { name: "MySQL", role: "Relational database", use: "Proven relational storage for business applications.", logo: "/tech/mysql.svg", color: "#4479A1" },
        ],
      },
    ],
  },
  process: {
    title: "Our Development Process",
    sideLead: "From first call to a live system, in four clear steps.",
    stepWord: "Step",
    getsLabel: "You get",
    items: [
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
    ],
  },
  why: {
    title: "Why Choose Recenturesoft",
    lead: "Six promises we keep on every custom project, and what each one means for you.",
    image: "/images/custom-why.jpg",
    imageAlt: "Team members discussing a project around a laptop in a bright office",
    forYouLabel: "For you",
    items: [
      {
        title: "Tailored Solutions",
        desc: "Built around your business model and workflows, not a generic template.",
        means: "Software that fits the way you already work.",
      },
      {
        title: "Scalable Architecture",
        desc: "Systems designed to keep working as your data and traffic grow.",
        means: "No rebuild when your business grows.",
      },
      {
        title: "Maintainable Code",
        desc: "Typed, modular, documented code that follows clean software principles.",
        means: "Any developer can pick it up and carry on.",
      },
      {
        title: "Security-Conscious",
        desc: "Security considered from design through deployment, with regular reviews.",
        means: "Fewer unpleasant surprises after launch.",
      },
      {
        title: "Transparent Collaboration",
        desc: "Direct access to the engineers and clear sprint reporting.",
        means: "You always know where your project stands.",
      },
      {
        title: "Long-Term Support",
        desc: "Ongoing maintenance and continued improvement after launch.",
        means: "Help is still there after go-live.",
      },
    ],
  },
  experience: {
    title: "Featured Development Experience",
    lead: "The kinds of solutions we build to give your operations real leverage.",
    image: "/images/custom-work.jpg",
    imageAlt: "Laptop showing a workflow automation and operations dashboard",
    items: [
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
    ],
  },
  cta: {
    title: "Have an idea? Let's build it together.",
    text: "Tell us about your business challenge and we'll explore the right custom solution with you.",
    buttonLabel: "Start Your Project",
    buttonHref: "/contact",
    panelTitle: "Or reach us directly",
    emailLabel: "Email",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    whatsappText: "Message us",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What kinds of custom software do you build?",
        a: "Custom web applications, enterprise software, SaaS products, API development and integration, business process automation and legacy system modernisation.",
      },
      {
        q: "Can you improve or modernise our existing system?",
        a: "Yes. Legacy system modernisation is one of our services. We start by understanding what you have today before suggesting changes.",
      },
      {
        q: "What technologies do you work with?",
        a: "Our technology expertise covers frontend, backend, cloud and DevOps, and database tools. The full list is on this page, and we choose what fits your requirements.",
      },
      {
        q: "How do I get an estimate?",
        a: "Contact us with your requirements. Cost and timeline depend on the scope, so we discuss the project with you before giving an estimate.",
      },
    ],
  },
};

export const customModule = defineModule({
  id: "serviceCustom",
  title: "Custom Development",
  route: "/services/custom-development",
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
          url("secondaryHref", "Second button link", { help: "Use #cd-build to scroll to the next section." }),
          image("image", "Banner image"),
          text("imageAlt", "Image description", { max: 200, help: "Read aloud by screen readers and shown if the image cannot load." }),
        ]),
      ],
    },
    {
      id: "build",
      title: "What we build",
      fields: [
        group("build", "What we build", [
          text("title", "Section heading", { max: 80 }),
          longtext("lead", "Introduction", { max: 400, rows: 3 }),
          list(
            "items",
            "Things we build",
            "item",
            [
              icon("icon"),
              text("title", "Title", { max: 80 }),
              longtext("desc", "Description", { max: 300, rows: 3 }),
              image("image", "Image"),
              text("alt", "Image description", { max: 200 }),
              strings("tags", "Short tags", { addLabel: "Add tag", max: 8 }),
            ],
            { titleKey: "title", max: 12 },
          ),
        ]),
      ],
    },
    {
      id: "tech",
      title: "Technology expertise",
      fields: [
        group("tech", "Technology expertise", [
          text("title", "Section heading", { max: 80 }),
          longtext("lead", "Introduction", { max: 400, rows: 3 }),
          list(
            "groups",
            "Technology groups",
            "group",
            [
              text("name", "Group name", { max: 40 }),
              list(
                "items",
                "Technologies",
                "technology",
                [
                  text("name", "Name", { max: 40 }),
                  text("role", "Short description", { max: 60 }),
                  longtext("use", "How we use it", { max: 200, rows: 2 }),
                  image("logo", "Logo", { help: "A logo file from the /tech/ folder. Leave empty to show a generic icon." }),
                  text("color", "Brand colour", { max: 7, help: "Brand colour, e.g. #61DAFB" }),
                ],
                { titleKey: "name", max: 20 },
              ),
            ],
            { titleKey: "name", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "process",
      title: "Development process",
      fields: [
        group("process", "Development process", [
          text("title", "Section heading", { max: 80 }),
          text("sideLead", "Side note", { max: 160 }),
          text("stepWord", "Word before the step number", { max: 20, help: "Shows as Step 1, Step 2 and so on." }),
          text("getsLabel", "Label before the result", { max: 30 }),
          list(
            "items",
            "Steps",
            "step",
            [
              icon("icon"),
              text("title", "Title", { max: 60 }),
              longtext("desc", "Description", { max: 300, rows: 3 }),
              text("gets", "What you get", { max: 120 }),
            ],
            { titleKey: "title", max: 10 },
          ),
        ]),
      ],
    },
    {
      id: "why",
      title: "Why choose us",
      fields: [
        group("why", "Why choose us", [
          text("title", "Heading", { max: 80 }),
          longtext("lead", "Introduction", { max: 300, rows: 3 }),
          image("image", "Side image"),
          text("imageAlt", "Image description", { max: 200 }),
          text("forYouLabel", "Label before the benefit", { max: 30 }),
          list(
            "items",
            "Promises",
            "promise",
            [
              text("title", "Title", { max: 60 }),
              longtext("desc", "Description", { max: 300, rows: 3 }),
              text("means", "What it means for the customer", { max: 160 }),
            ],
            { titleKey: "title", max: 12 },
          ),
        ]),
      ],
    },
    {
      id: "experience",
      title: "Featured experience",
      fields: [
        group("experience", "Featured experience", [
          text("title", "Heading", { max: 80 }),
          longtext("lead", "Introduction", { max: 300, rows: 3 }),
          image("image", "Banner image"),
          text("imageAlt", "Image description", { max: 200 }),
          list(
            "items",
            "Examples",
            "example",
            [
              icon("icon"),
              text("title", "Title", { max: 80 }),
              longtext("desc", "Description", { max: 300, rows: 3 }),
            ],
            { titleKey: "title", max: 12 },
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
          text("panelTitle", "Contact box title", { max: 60 }),
          text("emailLabel", "Email label", { max: 30, help: "The email address itself is set under Site settings." }),
          text("phoneLabel", "Phone label", { max: 30, help: "The phone number itself is set under Site settings." }),
          text("whatsappLabel", "WhatsApp label", { max: 30 }),
          text("whatsappText", "WhatsApp line", { max: 40 }),
        ]),
      ],
    },
    faqSection(),
  ],
});

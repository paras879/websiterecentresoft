import { defineModule, group, icon, id, image, list, longtext, select, seoFields, strings, text, toggle, url } from "./fields";

export interface Opening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  requirements: string[];
  active: boolean;
}

const defaults = {
  meta: {
    title: "Careers at Recenturesoft | Engineering and Tech Jobs",
    description:
      "Build your career with Recenturesoft Infotech, Noida. Send us your profile for software development, AI automation, custom development and SEO roles.",
    image: "",
  },
  hero: {
    title: "Build Your Future With Us.",
    text: "Join a team of curious minds, passionate builders and problem-solvers creating technology that makes a difference for businesses.",
    primaryLabel: "Apply Now",
    primaryHref: "#cr-apply",
    secondaryLabel: "Why Recenturesoft",
    secondaryHref: "#cr-why",
    image: "/images/team-meeting.webp",
    imageAlt: "The Recenturesoft team in a meeting",
  },
  why: {
    title: "Why work at Recenturesoft?",
    lead: "Honest work, direct conversations and room to grow, in an engineering team based in Sector 63, Noida.",
    items: [
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
    ],
  },
  areas: {
    title: "Where you could fit in",
    lead: "Six practice areas, each with its own kind of work.",
    linkLabel: "View this area",
    items: [
      {
        title: "Software Development",
        desc: "Web applications and business software, built to last.",
        href: "/services/software-development",
        image: "/images/services-software.jpg",
      },
      {
        title: "Agentic AI",
        desc: "Autonomous enterprise agents, multi-agent swarms and tool integrations.",
        href: "/services/agentic-ai",
        image: "/images/services-agentic.jpg",
      },
      {
        title: "App Development",
        desc: "Native iOS and Android apps, cross-platform mobile engineering.",
        href: "/services/app-development",
        image: "/images/services-app.jpg",
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
    ],
  },
  openingsBlock: {
    title: "Current openings",
    lead: "Roles we are hiring for right now.",
    applyLabel: "Apply for this role",
  },
  openings: [] as Opening[],
  apply: {
    emptyStatus: "No openings listed right now",
    openStatus: "{count} open roles",
    title: "Send us your profile",
    text: "We hire as our projects grow. Share your details and we will keep them on file and write to you when a role matches your skills.",
    steps: [
      { title: "Share your details", text: "Fill in the short form below, it takes about two minutes." },
      { title: "Your application reaches us", text: "It goes straight to our HR team, with your resume if you attach one." },
      { title: "We write back", text: "We contact you when a role fits." },
    ],
    directText: "Prefer email? Write to",
  },
  form: {
    title: "Candidate application",
    submitLabel: "Submit application",
    idleNote: "Your application goes straight to our HR team.",
    errorText:
      "We could not send your application right now. Please try again in a moment, or write to {email}.",
    successText: "Thank you, your application has been received. Our team will contact you if there is a suitable role.",
    resumeLabel: "Resume",
    resumeHint: "up to 600 KB here; larger files: share a link or email it to us",
    areas: ["Something else"],
    experience: ["Fresher", "1–3 years", "4–6 years", "7+ years"],
  },
  closing: {
    kicker: "Join our team",
    title: "Ready to build something remarkable?",
    text: "Send us your profile or just say hello. Our team reads every message and will tell you what to expect.",
    primaryLabel: "Apply now",
    primaryHref: "#cr-apply",
    secondaryLabel: "Email the talent team",
    showHr: true,
    hrLabel: "HR team",
    showPhone: true,
    phoneLabel: "Call us",
    showWhatsapp: true,
    whatsappLabel: "WhatsApp",
    whatsappValue: "Message us",
    showOffice: true,
    officeLabel: "Office · open in Maps",
  },
};

export const careersModule = defineModule({
  id: "careers",
  title: "Careers",
  route: "/careers",
  group: "Pages",
  defaults,
  sections: [
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
    {
      id: "hero",
      title: "Top banner",
      description: "The first thing visitors see.",
      fields: [
        group("hero", "Top banner", [
          text("title", "Headline", { required: true, max: 120 }),
          longtext("text", "Supporting text", { rows: 4 }),
          text("primaryLabel", "Main button text", { max: 40 }),
          url("primaryHref", "Main button link", { help: "Use #cr-apply to jump to the application form." }),
          text("secondaryLabel", "Second button text", { max: 40 }),
          url("secondaryHref", "Second button link", { help: "Use #cr-why to jump to the next section." }),
          image("image", "Banner image"),
          text("imageAlt", "Image description", { help: "Read aloud by screen readers and shown if the image fails." }),
        ]),
      ],
    },
    {
      id: "why",
      title: "Why work here",
      fields: [
        group("why", "Why work here", [
          text("title", "Section heading", { max: 100 }),
          longtext("lead", "Section lead-in", { rows: 3 }),
          list(
            "items",
            "Reason tiles",
            "reason",
            [
              icon("icon"),
              text("title", "Title", { required: true, max: 60 }),
              longtext("desc", "Description", { rows: 3 }),
              strings("points", "Short points", { addLabel: "Add point", max: 60 }),
              image("image", "Photo"),
              text("alt", "Photo description", { help: "Read aloud by screen readers and shown if the image fails." }),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "areas",
      title: "Where you could fit in",
      fields: [
        group("areas", "Where you could fit in", [
          text("title", "Section heading", { max: 100 }),
          text("lead", "Section lead-in"),
          text("linkLabel", "Card link text", { help: "Shown at the bottom of each card.", max: 40 }),
          list(
            "items",
            "Areas",
            "area",
            [
              text("title", "Name", { required: true, max: 60 }),
              longtext("desc", "Description", { rows: 2 }),
              url("href", "Link to", { required: true }),
              image("image", "Photo"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "openings",
      title: "Job openings",
      description:
        'Add a role here and a "Current openings" list appears on the Careers page. With no active roles, the page shows the "no openings" message instead.',
      fields: [
        group("openingsBlock", "Openings list heading", [
          text("title", "Heading", { max: 80 }),
          text("lead", "Lead-in"),
          text("applyLabel", "Apply link text", { max: 40 }),
        ]),
        list(
          "openings",
          "Open roles",
          "role",
          [
            id(),
            text("title", "Job title", { required: true, max: 100 }),
            text("department", "Team or department", { max: 60 }),
            text("location", "Location", { max: 60 }),
            select("type", "Job type", [
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Internship", label: "Internship" },
              { value: "Contract", label: "Contract" },
            ]),
            text("experience", "Experience needed", { max: 60, help: 'For example "2–4 years" or "Fresher".' }),
            longtext("summary", "About the role", { rows: 4 }),
            strings("requirements", "Requirements", { addLabel: "Add requirement", max: 200 }),
            toggle("active", "Show on the website", { initial: true, help: "Switch off to hide the role without deleting it." }),
          ],
          { titleKey: "title", max: 30 },
        ),
      ],
    },
    {
      id: "apply",
      title: "Application section",
      fields: [
        group("apply", "Application section", [
          text("emptyStatus", "Status when there are no openings", { max: 60 }),
          text("openStatus", "Status when there are openings", {
            max: 60,
            help: "Write {count} where the number of open roles should appear.",
          }),
          text("title", "Heading", { max: 100 }),
          longtext("text", "Text", { rows: 4 }),
          list(
            "steps",
            "Steps",
            "step",
            [text("title", "Step title", { required: true, max: 60 }), longtext("text", "Step text", { rows: 2 })],
            { titleKey: "title", max: 6 },
          ),
          text("directText", "Email line", {
            help: "Shown before the HR email address, which comes from Site settings.",
            max: 80,
          }),
        ]),
      ],
    },
    {
      id: "form",
      title: "Application form",
      fields: [
        group("form", "Application form", [
          text("title", "Form heading", { max: 80 }),
          text("submitLabel", "Send button text", { max: 40 }),
          longtext("idleNote", "Note under the button", { rows: 2 }),
          longtext("errorText", "Message when sending fails", {
            rows: 2,
            help: "Write {email} where the HR email address should appear.",
          }),
          longtext("successText", "Thank-you message", { rows: 2 }),
          text("resumeLabel", "Resume upload label", { max: 40 }),
          text("resumeHint", "Resume size hint", { max: 160 }),
          strings("areas", "Extra areas of interest", {
            addLabel: "Add area",
            max: 60,
            help: "Open roles and every service in your Services menu are listed first automatically. Add any other choices here.",
          }),
          strings("experience", "Experience choices", { addLabel: "Add choice", max: 40 }),
        ]),
      ],
    },
    {
      id: "closing",
      title: "Closing banner",
      fields: [
        group("closing", "Closing banner", [
          text("kicker", "Small label", { max: 40 }),
          text("title", "Heading", { max: 100 }),
          longtext("text", "Text", { rows: 3 }),
          text("primaryLabel", "Main button text", { max: 40 }),
          url("primaryHref", "Main button link"),
          text("secondaryLabel", "Email button text", {
            max: 40,
            help: "This button writes to the HR email in Site settings.",
          }),
          toggle("showHr", "Show HR email row"),
          text("hrLabel", "HR email row label", { max: 40 }),
          toggle("showPhone", "Show phone row"),
          text("phoneLabel", "Phone row label", { max: 40 }),
          toggle("showWhatsapp", "Show WhatsApp row"),
          text("whatsappLabel", "WhatsApp row label", { max: 40 }),
          text("whatsappValue", "WhatsApp row text", { max: 40 }),
          toggle("showOffice", "Show office row"),
          text("officeLabel", "Office row label", { max: 60 }),
        ]),
      ],
    },
  ],
});

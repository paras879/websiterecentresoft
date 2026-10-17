import { defineModule, group, icon, list, longtext, seoFields, text, url } from "./fields";

const links = () =>
  list(
    "links",
    "Links",
    "link",
    [
      text("label", "Name", { required: true }),
      text("desc", "Short description"),
      url("href", "Link to", { required: true }),
    ],
    { titleKey: "label", max: 12 },
  );

const defaults = {
  meta: {
    title: "Website Sitemap | Recenturesoft Infotech Pages Index",
    description:
      "Browse every page of the Recenturesoft Infotech website: company information, engineering services, contact details, legal policies and more.",
    image: "",
  },
  hero: {
    title: "Sitemap",
    text: "Everything on the Recenturesoft website in one place. Pick a page below to jump straight to it.",
  },
  company: {
    title: "Company",
    icon: "enterprise",
    links: [
      { label: "Home", desc: "Overview of what we do", href: "/" },
      { label: "About Us", desc: "Who we are and how we work", href: "/about" },
      { label: "Contact Us", desc: "Talk to our team", href: "/contact" },
      { label: "Careers", desc: "Join the team and send your profile", href: "/careers" },
      { label: "Privacy Policy", desc: "How we protect and use your data", href: "/privacy-policy" },
      { label: "Terms & Conditions", desc: "Rules and terms governing website access", href: "/terms-and-conditions" },
    ],
  },
  services: {
    title: "Services",
    icon: "code",
    links: [
      {
        label: "Software Development",
        desc: "Custom software and web applications",
        href: "/services/software-development",
      },
      {
        label: "Agentic AI",
        desc: "Autonomous enterprise agents, multi-agent swarms & MCP workflows",
        href: "/services/agentic-ai",
      },
      {
        label: "App Development",
        desc: "Native Android and iOS apps, from idea to the app stores",
        href: "/services/app-development",
      },
      { label: "AI Automation", desc: "AI-powered workflow automation", href: "/services/ai-automation" },
      {
        label: "Custom Development",
        desc: "Web apps, SaaS, APIs and enterprise software",
        href: "/services/custom-development",
      },
      { label: "SEO Services", desc: "Technical, on-page and local SEO", href: "/services/seo" },
    ],
  },
  connect: {
    title: "Connect",
    icon: "handshake",
    emailDesc: "Email us",
    phoneDesc: "Call our team",
    whatsappLabel: "WhatsApp",
    whatsappDesc: "Send us a message",
  },
  social: {
    title: "Social",
    icon: "people",
    links: [
      { label: "LinkedIn", desc: "Company updates", href: "https://in.linkedin.com/company/recenturesoft" },
      { label: "X (Twitter)", desc: "@recenture_soft", href: "https://x.com/recenture_soft" },
      { label: "Facebook", desc: "Recenturesoft Infotech", href: "https://www.facebook.com/recenturesoftinfotech/" },
      { label: "YouTube", desc: "Our channel", href: "https://www.youtube.com/channel/UCwrJM7HFZGmke0jr8y4VYXg" },
    ],
  },
  cta: {
    title: "Can't find what you're looking for?",
    text: "Tell us what you need and our Noida team will point you in the right direction.",
    buttonLabel: "Contact Us",
    buttonHref: "/contact",
  },
};

export const sitemapModule = defineModule({
  id: "sitemap",
  title: "Sitemap",
  route: "/sitemap",
  group: "Pages",
  defaults,
  sections: [
    {
      id: "hero",
      title: "Top banner",
      fields: [
        group("hero", "Top banner", [
          text("title", "Headline", { required: true }),
          longtext("text", "Supporting text", { rows: 3 }),
        ]),
      ],
    },
    {
      id: "company",
      title: "Company links",
      fields: [group("company", "Company links", [text("title", "Group heading"), icon("icon"), links()])],
    },
    {
      id: "services",
      title: "Services links",
      fields: [group("services", "Services links", [text("title", "Group heading"), icon("icon"), links()])],
    },
    {
      id: "connect",
      title: "Connect links",
      description: "The email address, phone number and WhatsApp link come from Site settings.",
      fields: [
        group("connect", "Connect links", [
          text("title", "Group heading"),
          icon("icon"),
          text("emailDesc", "Email description"),
          text("phoneDesc", "Phone description"),
          text("whatsappLabel", "WhatsApp name"),
          text("whatsappDesc", "WhatsApp description"),
        ]),
      ],
    },
    {
      id: "social",
      title: "Social links",
      fields: [group("social", "Social links", [text("title", "Group heading"), icon("icon"), links()])],
    },
    {
      id: "cta",
      title: "Closing banner",
      fields: [
        group("cta", "Closing banner", [
          text("title", "Heading"),
          longtext("text", "Text", { rows: 3 }),
          text("buttonLabel", "Button text"),
          url("buttonHref", "Button link"),
        ]),
      ],
    },
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
  ],
});

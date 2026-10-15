import {
  defineModule,
  email,
  group,
  icon,
  image,
  list,
  longtext,
  phone,
  select,
  seoFields,
  text,
  toggle,
  url,
} from "./fields";
import { socialOptions } from "@/lib/social-icons";

const defaults = {
  brand: {
    name: "Recenturesoft",
    legalName: "Recenturesoft Infotech Pvt Ltd",
    tagline: "Software Engineering & AI Automation",
    description:
      "Recenturesoft Infotech Pvt Ltd is a premier software development company offering custom software development, web application engineering, and AI-driven automation solutions.",
  },
  contact: {
    email: "info@recenturesoft.com",
    hrEmail: "hr@recenturesoft.com",
    phone: "+91 777 000 3288",
    whatsappMessage: "Hi",
    address: "A-125, 1st Floor, Sector-63, Noida, Uttar Pradesh, 201301, India",
    shortLocation: "Sector 63, Noida, UP",
    officeHours: "",
  },
  socials: [
    { name: "LinkedIn", href: "https://in.linkedin.com/company/recenturesoft", icon: "linkedin" },
    { name: "X (Twitter)", href: "https://x.com/recenture_soft", icon: "x" },
    { name: "Facebook", href: "https://www.facebook.com/recenturesoftinfotech/", icon: "facebook" },
    {
      name: "YouTube",
      href: "https://www.youtube.com/channel/UCwrJM7HFZGmke0jr8y4VYXg",
      icon: "youtube",
    },
  ],
  header: {
    items: [
      { label: "Home", href: "/", hasMenu: false },
      { label: "About Us", href: "/about", hasMenu: false },
      { label: "Services", href: "/services/software-development", hasMenu: true },
      { label: "Contact Us", href: "/contact", hasMenu: false },
      { label: "Careers", href: "/careers", hasMenu: false },
    ],
    menuTitle: "Our Services",
    menu: [
      {
        title: "Software Development",
        desc: "Custom engineering, web platforms & cloud systems",
        href: "/services/software-development",
        icon: "code",
      },
      {
        title: "AI Automation",
        desc: "Intelligent enterprise process & workflow engineering",
        href: "/services/ai-automation",
        icon: "assist",
      },
      {
        title: "Custom Development",
        desc: "Web apps, SaaS, APIs and enterprise software built for you",
        href: "/services/custom-development",
        icon: "code",
      },
      {
        title: "SEO Services",
        desc: "Technical, on-page and local SEO to grow organic traffic",
        href: "/services/seo",
        icon: "search",
      },
    ],
    asideImage: "/images/services-overview.jpg",
    asideKicker: "Let's talk",
    asideTitle: "Have a project in mind?",
    asideText: "Tell us what you need and we'll help you scope it.",
    asideButton: "Discuss Your Project",
    asideButtonHref: "/contact",
    ctaLabel: "Get in Touch",
    ctaHref: "/contact",
  },
  footer: {
    columns: [
      {
        title: "Company",
        links: [
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Contact Us", href: "/contact" },
          { label: "Careers", href: "/careers" },
          { label: "Sitemap", href: "/sitemap" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms & Conditions", href: "/terms-and-conditions" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Software Development", href: "/services/software-development" },
          { label: "AI Automation", href: "/services/ai-automation" },
          { label: "Custom Development", href: "/services/custom-development" },
          { label: "SEO Services", href: "/services/seo" },
        ],
      },
    ],
    contactTitle: "Get in Touch",
    whatsappLabel: "Message us on WhatsApp",
    rightsText: "All rights reserved.",
    bottomNote: "Noida, Uttar Pradesh, India",
  },
  meta: {
    title: "Recenturesoft | Software Development & AI Automation",
    description:
      "Recenturesoft Infotech Pvt Ltd is a premier software development company offering custom software development, web application engineering, and AI-driven automation solutions.",
    image: "/images/hero.jpg",
  },
};

export type SiteModule = typeof defaults;

export const siteModule = defineModule({
  id: "site",
  title: "Site-wide settings",
  group: "Site",
  defaults,
  sections: [
    {
      id: "brand",
      title: "Brand",
      description: "Your company name and the short description used across the site and on Google.",
      fields: [
        group("brand", "Brand", [
          text("name", "Short name", { required: true, help: "Shown in the header, footer and tab titles." }),
          text("legalName", "Registered company name", { required: true }),
          text("tagline", "Tagline"),
          longtext("description", "Company description", {
            rows: 4,
            help: "Used in the footer and as the default description on Google.",
          }),
        ]),
      ],
    },
    {
      id: "contact",
      title: "Contact details",
      description: "Used in the header, footer, Contact page, Careers page and the buttons across the site.",
      fields: [
        group("contact", "Contact details", [
          email("email", "General email", { required: true }),
          email("hrEmail", "HR / careers email", { help: "Shown on the Careers page." }),
          phone("phone", "Phone number", { required: true, help: "Include the country code, e.g. +91 777 000 3288." }),
          text("whatsappMessage", "WhatsApp first message", {
            help: "The message that is pre-filled when someone taps the WhatsApp button.",
          }),
          longtext("address", "Full address", { rows: 3, required: true }),
          text("shortLocation", "Short location", { help: "A short form of the address, e.g. Sector 63, Noida, UP." }),
          text("officeHours", "Office hours", {
            help: "Optional. Leave empty to hide it, e.g. Monday to Friday, 9:30 AM to 6:30 PM IST.",
          }),
        ]),
      ],
    },
    {
      id: "header",
      title: "Header & menu",
      description: "The links at the top of every page, and the Services dropdown.",
      fields: [
        group("header", "Header", [
          list(
            "items",
            "Menu links",
            "link",
            [
              text("label", "Label", { required: true }),
              url("href", "Link to", { required: true }),
              toggle("hasMenu", "Open the Services dropdown on hover"),
            ],
            { titleKey: "label", max: 8 },
          ),
          text("menuTitle", "Dropdown heading"),
          list(
            "menu",
            "Dropdown items",
            "item",
            [
              text("title", "Title", { required: true }),
              text("desc", "Short description"),
              url("href", "Link to", { required: true }),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
          image("asideImage", "Side panel: background picture", {
            help: "Shown softly behind the blue side panel of the Services menu.",
          }),
          text("asideKicker", "Side panel: small label"),
          text("asideTitle", "Side panel: heading"),
          longtext("asideText", "Side panel: text", { rows: 2 }),
          text("asideButton", "Side panel: button text"),
          url("asideButtonHref", "Side panel: button link"),
          text("ctaLabel", "Header button text"),
          url("ctaHref", "Header button link"),
        ]),
      ],
    },
    {
      id: "footer",
      title: "Footer",
      description: "Link columns and small print at the bottom of every page.",
      fields: [
        group("footer", "Footer", [
          list(
            "columns",
            "Link columns",
            "column",
            [
              text("title", "Column heading", { required: true }),
              list(
                "links",
                "Links",
                "link",
                [text("label", "Label", { required: true }), url("href", "Link to", { required: true })],
                { titleKey: "label", max: 12 },
              ),
            ],
            { titleKey: "title", max: 4 },
          ),
          text("contactTitle", "Contact column heading"),
          text("whatsappLabel", "WhatsApp link text"),
          text("rightsText", "Copyright text", { help: "Shown after © year and the company name." }),
          text("bottomNote", "Bottom-right note"),
        ]),
      ],
    },
    {
      id: "socials",
      title: "Social links",
      description: "Shown as round buttons in the footer. Leave the list empty to hide them.",
      fields: [
        list(
          "socials",
          "Social links",
          "link",
          [
            text("name", "Name", { required: true }),
            url("href", "Profile link", { required: true }),
            select("icon", "Icon", socialOptions),
          ],
          { titleKey: "name", max: 8 },
        ),
      ],
    },
    {
      id: "meta",
      title: "Default search & sharing",
      description: "Used when a page does not set its own.",
      fields: [seoFields()],
    },
  ],
});


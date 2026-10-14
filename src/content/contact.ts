import { defineModule, group, image, longtext, seoFields, strings, text } from "./fields";

const defaults = {
  meta: {
    title: "Contact Us | Recenturesoft Infotech",
    description:
      "Contact Recenturesoft Infotech Pvt Ltd in Noida for custom software development, web engineering, and enterprise AI automation inquiries.",
    image: "/images/hero.jpg",
  },
  hero: {
    title: "Let's Build Something Great Together",
    text: "Have a custom software development or enterprise AI automation project in mind? Share your requirements with our technical team today.",
    image: "/images/home-hero.jpg",
  },
  form: {
    services: ["Software Development", "AI Automation", "General Engineering Inquiry"],
  },
  channels: {
    title: "Direct Channels",
    emailLabel: "Official Email",
    phoneLabel: "Phone Number",
    whatsappLabel: "WhatsApp",
    whatsappText: "Message us on WhatsApp",
    addressLabel: "Registered Office Address",
  },
  office: {
    image: "/images/services-team.jpg",
    imageAlt: "Engineering team discussing architecture at the Noida office",
    title: "Noida Development Center",
    subtitle: "Sector 63, Noida, UP",
    linkLabel: "Get directions",
  },
  closing: {
    title: "Tell Us What You're Looking to Build",
    text: "Have a custom software development or enterprise AI automation project in mind? Share your requirements with our technical team today.",
    callLabel: "Call Noida Labs Now",
    emailLabel: "Email Technical Team",
  },
  careers: {
    title: "Careers",
    text: "No current openings are listed at this time. For future opportunities, write to",
    buttonLabel: "Email HR Team",
  },
  backLabel: "Back to Recenturesoft Home",
};

export const contactModule = defineModule({
  id: "contact",
  title: "Contact Us",
  route: "/contact",
  group: "Pages",
  defaults,
  sections: [
    {
      id: "hero",
      title: "Top banner",
      fields: [
        group("hero", "Top banner", [
          text("title", "Headline", { required: true, max: 120 }),
          longtext("text", "Supporting text", { rows: 3 }),
          image("image", "Background image"),
        ]),
      ],
    },
    {
      id: "form",
      title: "Enquiry form",
      description: "The form fields are fixed. Here you choose what people can pick in the service list.",
      fields: [
        group("form", "Enquiry form", [
          strings("services", "Service choices", {
            addLabel: "Add choice",
            max: 80,
            help: "The first one is selected by default. Keep at least one.",
          }),
        ]),
      ],
    },
    {
      id: "channels",
      title: "Direct channels",
      description: "The email, phone and address themselves are edited under Site settings.",
      fields: [
        group("channels", "Direct channels", [
          text("title", "Heading"),
          text("emailLabel", "Email label"),
          text("phoneLabel", "Phone label"),
          text("whatsappLabel", "WhatsApp label"),
          text("whatsappText", "WhatsApp text"),
          text("addressLabel", "Address label"),
        ]),
      ],
    },
    {
      id: "office",
      title: "Office card",
      fields: [
        group("office", "Office card", [
          image("image", "Photo"),
          text("imageAlt", "Photo description", { help: "Read aloud by screen readers and shown if the image fails." }),
          text("title", "Title"),
          text("subtitle", "Location line"),
          text("linkLabel", "Directions link text", { help: "Opens the office address in Google Maps." }),
        ]),
      ],
    },
    {
      id: "closing",
      title: "Closing banner",
      fields: [
        group("closing", "Closing banner", [
          text("title", "Heading"),
          longtext("text", "Text", { rows: 3 }),
          text("callLabel", "Call button text"),
          text("emailLabel", "Email button text"),
        ]),
      ],
    },
    {
      id: "careers",
      title: "Careers note",
      description: "The HR email address is edited under Site settings.",
      fields: [
        group("careers", "Careers note", [
          text("title", "Heading"),
          longtext("text", "Text", { rows: 3, help: "The HR email address is added after this text automatically." }),
          text("buttonLabel", "Button text"),
        ]),
      ],
    },
    { id: "back", title: "Back link", fields: [text("backLabel", "Back link text")] },
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
  ],
});

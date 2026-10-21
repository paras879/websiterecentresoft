import { faqSection, defineModule, group, image, longtext, seoFields, strings, text } from "./fields";

const defaults = {
  meta: {
    title: "Contact Recenturesoft Infotech | Software Project Inquiries",
    description:
      "Contact Recenturesoft Infotech Pvt Ltd in Noida for custom software development, web engineering, and enterprise AI automation inquiries.",
    image: "/images/contact-us.webp",
  },
  hero: {
    title: "Let's Build Something Great Together",
    text: "Have a custom software development or enterprise AI automation project in mind? Share your requirements with our technical team today.",
    image: "/images/contact-us.webp",
    imageAlt: "Person in a suit tapping a tablet with message, phone and email icons",
  },
  form: {
    services: ["General Engineering Inquiry"],
  },
  channels: {
    title: "Direct Channels",
    emailLabel: "Official Email",
    phoneLabel: "Mobile Number",
    whatsappLabel: "WhatsApp",
    whatsappText: "Message us on WhatsApp",
    addressLabel: "Registered Office Address",
  },
  office: {
    image: "/images/address.webp",
    imageAlt: "Hand holding a phone with a glowing map and location pins above a laptop",
    title: "Noida Development Center",
    subtitle: "Sector 63, Noida, UP",
    linkLabel: "Get directions",
  },
  backLabel: "Back to Recenturesoft Home",
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "How can I contact Recenturesoft Infotech?",
        a: "You can send a message with the form on this page, email us, call us or message us on WhatsApp. All the details are listed on this page.",
      },
      {
        q: "What should I include in my message?",
        a: "A short description of what you want to build or improve, who it is for, and any deadline you have in mind. The more detail you share, the easier it is for us to reply usefully.",
      },
      {
        q: "Where is your office?",
        a: "A-125, 1st Floor, Sector-63, Noida, Uttar Pradesh 201301, India. A map link is on this page.",
      },
      {
        q: "I want to work with you. Where do I apply?",
        a: "Please use the Careers page, which lists the open roles and has an application form.",
      },
    ],
  },
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
          text("imageAlt", "Image description", { max: 125, help: "Describes the picture for screen readers and Google Images." }),
        ]),
      ],
    },
    {
      id: "form",
      title: "Enquiry form",
      description: "Every service in your Services menu (Site-wide, Header & menu) is offered automatically. Add any extra choices here.",
      fields: [
        group("form", "Enquiry form", [
          strings("services", "Extra choices", {
            addLabel: "Add choice",
            max: 80,
            help: "Shown after your services in the list, e.g. General Engineering Inquiry.",
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
          text("phoneLabel", "Mobile number label"),
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
    { id: "back", title: "Back link", fields: [text("backLabel", "Back link text")] },
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
    faqSection(),
  ],
});

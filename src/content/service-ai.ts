import { faqSection, defineModule, group, icon, image, list, longtext, seoFields, strings, text, toggle, url } from "./fields";

const defaults = {
  meta: {
    title: "Enterprise AI Automation Services | Recenturesoft Infotech",
    description:
      "Explore AI workflow automation, repetitive task minimization, and process engineering solutions by Recenturesoft Infotech Pvt Ltd.",
    image: "/images/ai-automation.jpg",
  },
  hero: {
    title: "Make Workflows Smarter with AI Automation",
    text: "Recenturesoft implements practical AI and intelligent automation solutions to eliminate repetitive manual bottlenecks, accelerate document handling, and improve operational accuracy.",
    primaryLabel: "Discuss Automation Opportunities",
    primaryHref: "/contact",
    secondaryLabel: "Explore Practical Use Cases",
    image: "/images/services-ai.jpg",
    imageAlt: "Enterprise AI workflow automation control room",
  },
  practical: {
    title: "What We Mean by",
    highlight: "Practical AI Automation",
    lead: "We focus exclusively on grounded, realistic software systems. Rather than pursuing speculative hype or unchecked autonomy, our implementations solve tangible operational friction across verified business pipelines.",
    flowLabel: "Flow",
    items: [
      {
        icon: "workflow",
        flow: ["CRM", "Webhook", "ERP"],
        title: "Targeted Workflow Automation",
        desc: "Connecting disparate software systems to trigger automated, error-free tasks. We eliminate manual handoffs between CRM, ERP, and bespoke customer databases through hardened webhook pipelines.",
      },
      {
        icon: "document",
        flow: ["Invoices & forms", "Extract", "Validate"],
        title: "Intelligent Document Processing",
        desc: "Extracting, categorizing, and validating information from invoices, onboarding forms, and business records with multi-stage schema validation and confidence scoring thresholds.",
      },
      {
        icon: "assist",
        flow: ["Summarise", "Classify", "Validate"],
        title: "Integrated AI Assistive Features",
        desc: "Embedding smart summarization, classification, and validation directly into your daily enterprise tools so your personnel make faster, data-backed decisions without leaving their primary interface.",
      },
    ],
  },
  process: {
    title: "Implementation",
    highlight: "Process",
    lead: "A structured 5-stage framework to ensure reliable delivery and immediate operational value.",
    phaseWord: "Phase",
    ofWord: "of",
    items: [
      {
        title: "Discover",
        desc: "Mapping current operational workflows and identifying high-friction manual bottlenecks.",
      },
      {
        title: "Assess",
        desc: "Evaluating technical feasibility, ROI projections, and security requirements.",
      },
      {
        title: "Design",
        desc: "Architecting API connections, schemas, and human-in-the-loop review gates.",
      },
      {
        title: "Integrate",
        desc: "Deploying automation modules and connecting core enterprise software environments.",
      },
      {
        title: "Validate",
        desc: "Testing accuracy with historical datasets and running monitored production rollouts.",
      },
    ],
  },
  cta: {
    title: "Transform Your Repetitive Workflows",
    text: "Speak directly with our automation engineers in Noida to identify high-impact processes ready for automation.",
    primaryLabel: "Discuss Automation Opportunities",
    primaryHref: "/contact",
    showPhone: true,
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What is AI automation?",
        a: "AI automation uses software and AI models to take over repetitive work such as moving data between systems, reading documents and sorting requests, so that your team can focus on work that needs a person.",
      },
      {
        q: "Which tasks are good candidates for automation?",
        a: "Tasks that are repetitive, follow clear rules and involve a lot of manual copying or checking. Document handling, data entry between systems and routine classification are common examples.",
      },
      {
        q: "Will automation replace my team?",
        a: "Our approach is to automate the repetitive steps and keep a person in the loop for decisions that need judgement. We agree where that line sits with you.",
      },
      {
        q: "How do I get started?",
        a: "Contact us and describe the process you want to improve. We will discuss it with you and suggest where automation can help.",
      },
    ],
  },
};

export const aiModule = defineModule({
  id: "serviceAi",
  title: "AI Automation",
  route: "/services/ai-automation",
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
            help: "This button scrolls down to the practical use cases section. Leave empty to hide it.",
          }),
          image("image", "Image"),
          text("imageAlt", "Image description", {
            help: "Read aloud by screen readers and shown if the image cannot load.",
          }),
        ]),
      ],
    },
    {
      id: "practical",
      title: "Practical AI automation",
      fields: [
        group("practical", "Practical AI automation", [
          text("title", "Heading (first part)", { max: 120 }),
          text("highlight", "Heading (highlighted part)", {
            max: 80,
            help: "Shown in colour after the first part.",
          }),
          longtext("lead", "Intro text", { rows: 4 }),
          text("flowLabel", "Flow description word", {
            help: "Read aloud by screen readers before the flow steps, for example Flow.",
          }),
          list(
            "items",
            "Use cases",
            "use case",
            [
              text("title", "Title", { required: true, max: 80 }),
              longtext("desc", "Description", { rows: 4 }),
              strings("flow", "Flow steps", {
                addLabel: "Add step",
                max: 5,
                help: "The short chain shown at the top of the card, in order.",
              }),
              icon("icon"),
            ],
            { titleKey: "title", max: 8 },
          ),
        ]),
      ],
    },
    {
      id: "process",
      title: "Implementation process",
      description: "Step numbers and phase counts are added automatically in the order listed.",
      fields: [
        group("process", "Implementation process", [
          text("title", "Heading (first part)", { max: 120 }),
          text("highlight", "Heading (highlighted part)", {
            max: 60,
            help: "Shown in colour after the first part.",
          }),
          longtext("lead", "Intro text", { rows: 3 }),
          text("phaseWord", "Phase label word", { help: "Shown as Phase 1 of 5. This is the word Phase." }),
          text("ofWord", "Phase label joining word", { help: "Shown as Phase 1 of 5. This is the word of." }),
          list(
            "items",
            "Steps",
            "step",
            [text("title", "Title", { required: true, max: 60 }), longtext("desc", "Description", { rows: 3 })],
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
          text("title", "Heading", { max: 120 }),
          longtext("text", "Text", { rows: 3 }),
          text("primaryLabel", "Button text", { max: 60 }),
          url("primaryHref", "Button link"),
          toggle("showPhone", "Show phone button", {
            help: "Shows the company phone number as a second button.",
          }),
        ]),
      ],
    },
    faqSection(),
  ],
});

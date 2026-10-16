import { defineModule, group, icon, list, longtext, select, seoFields, strings, text, url } from "./fields";

const defaults = {
  meta: {
    title: "AI Agentic Development Services | Recenturesoft",
    description:
      "We design and develop intelligent AI agents that use business tools, connect systems and carry out multi-step workflows, with people kept in control where it matters.",
    image: "",
  },
  hero: {
    eyebrow: "Agentic AI",
    titleStart: "Build AI Agents That Turn",
    titleAccent: "Complex Work Into Action.",
    text: "We design and build AI agents that use your business tools, connect your systems and carry out multi-step work, with people kept in control where it matters.",
    primaryLabel: "Discuss Your AI Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our Solutions",
    secondaryHref: "#build",
    points: ["Enterprise security and RBAC", "Human-in-the-loop control", "Model Context Protocol (MCP)"],
    consoleTitle: "Example workflow",
    consoleRows: [
      { title: "Inbound Triage Agent", detail: "Reads the request in your CRM", status: "Schema validated", tone: "info", icon: "triage" },
      { title: "Knowledge Retrieval Agent", detail: "Searches your documents", status: "Context retrieved", tone: "done", icon: "database" },
      { title: "Disbursement Agent", detail: "Checks the approval limit", status: "Approval required", tone: "warn", icon: "shield" },
    ],
    logLines: ["Request classified and validated", "Relevant documents retrieved", "Waiting for a person to approve"],
  },
  build: {
    title: "Three ways we build agents",
    lead: "Every business problem needs a different amount of autonomy. We pick the structure that fits the job and the risk.",
    items: [
      {
        title: "Single Autonomous Agents",
        desc: "Focused agents for one job. They use your tools, remember context during a task and check their reasoning before they answer.",
        points: ["Task-focused reasoning", "Structured, validated outputs", "Good for: classification, lookups, triage"],
        icon: "assist",
      },
      {
        title: "Multi-Agent Orchestration",
        desc: "Teams of specialist agents that split a bigger problem, hand work to each other and review results before anything is final.",
        points: ["Supervisor and worker agents", "Cross-checking between agents", "Good for: contract review, due diligence, code review"],
        icon: "people",
      },
      {
        title: "AI Workflow Automation",
        desc: "AI decisions inside your existing processes, with clear limits, fallbacks and human approval where the stakes are high.",
        points: ["Fallbacks and circuit breakers", "Connects to ERP, CRM and more", "Good for: IT provisioning, finance ops, fulfilment"],
        icon: "workflow",
      },
    ],
  },
  flow: {
    title: "How an agent gets work done",
    lead: "Every run follows the same controlled path, from the first trigger to a recorded result.",
    items: [
      { label: "Trigger", title: "Business event", desc: "A ticket, a schedule or a webhook starts the work." },
      { label: "Reasoning", title: "Agent plans", desc: "The agent understands the goal, breaks it into steps and picks the right tools." },
      { label: "Integration", title: "Tools and systems", desc: "It reads and writes in your systems through controlled, typed connections." },
      { label: "Governance", title: "Human gate", desc: "Low-risk steps go through. High-stakes steps wait for a person to approve." },
      { label: "Output", title: "Action taken", desc: "The result is saved to your systems and every step is logged." },
    ],
  },
  services: {
    title: "End-to-end agent engineering",
    lead: "From a single task agent to a full multi-agent system, built to run reliably in your environment.",
    items: [
      {
        title: "Custom AI Agent Development",
        desc: "Goal-driven agents built around your own processes, with memory and clear, testable outputs.",
        tags: ["LangGraph", "Python", "Memory"],
        icon: "assist",
      },
      {
        title: "Multi-Agent Systems",
        desc: "Networks of specialist agents that divide work, cross-check each other and finish composite tasks.",
        tags: ["CrewAI", "AutoGen", "Supervisor routing"],
        icon: "people",
      },
      {
        title: "AI Workflow Automation",
        desc: "Reliable automation that mixes AI reasoning with strict business rules and approval steps.",
        tags: ["Temporal", "Celery", "Approvals"],
        icon: "workflow",
      },
      {
        title: "Enterprise Knowledge Agents",
        desc: "Search and answer over your documents and data, with sources shown and access kept separate for each team.",
        tags: ["RAG", "pgvector", "LlamaIndex"],
        icon: "database",
      },
      {
        title: "Customer Support Operations",
        desc: "Support agents that check identity, draft replies from your knowledge base and hand over to people when needed.",
        tags: ["Zendesk", "Salesforce", "Human hand-off"],
        icon: "chat",
      },
      {
        title: "Tool and API Integration (MCP)",
        desc: "Secure connectors that let agents use your databases and internal services with scoped access.",
        tags: ["MCP", "OpenAPI", "Scoped credentials"],
        icon: "terminal",
      },
    ],
  },
  useCases: {
    title: "Where agents help most",
    lead: "Practical scenarios where agents take on the repetitive steps and people keep the final say.",
    items: [
      { title: "Customer support", desc: "Checks details against your knowledge base and prepares draft replies for staff sign-off.", icon: "chat" },
      { title: "Research and market intelligence", desc: "Pulls earnings notes, filings and CRM notes into short briefings before partner calls.", icon: "search" },
      { title: "Document review and compliance", desc: "Reads long agreements, flags unusual clauses and returns a short summary of changes.", icon: "document" },
      { title: "Internal operations and IT access", desc: "Handles onboarding access and licence requests using approvals and least-privilege rules.", icon: "people" },
      { title: "Engineering assistance", desc: "Reviews pull requests, writes missing tests and checks dependencies for known issues.", icon: "code" },
      { title: "Reporting and BI", desc: "Turns business questions into checked queries and sends a weekly briefing to leaders.", icon: "improve" },
    ],
  },
  safety: {
    title: "Built with trust, safety and control",
    lead: "Every agent works inside clear limits, with access you control and a record of everything it does.",
    items: [
      { title: "Human checkpoints", desc: "Set the limits for money, bulk changes or sensitive actions. Above them, a person signs off first.", icon: "people" },
      { title: "Scoped access", desc: "Agents get time-limited, role-based access, only to the systems a task needs.", icon: "shield" },
      { title: "Sensitive data protection", desc: "Personal and confidential details are masked before they reach the model.", icon: "eye" },
      { title: "Complete audit trail", desc: "Every plan, tool call and result is logged so it can be reviewed later.", icon: "document" },
    ],
  },
  stack: {
    title: "Tools we work with",
    lead: "We use well-known agent frameworks, models and vector stores, so you are not tied to a proprietary stack. This gives you flexibility, better performance and long-term maintainability.",
    groups: [
      { title: "Orchestration", desc: "Control flow, state and coordination for multi-agent systems.", items: ["LangGraph", "CrewAI", "AutoGen", "LlamaIndex", "Semantic Kernel"] },
      { title: "Models", desc: "Leading hosted and open models for diverse use cases.", items: ["OpenAI", "Anthropic Claude", "Google Gemini", "Meta Llama", "Mistral"] },
      { title: "Memory and vectors", desc: "Retrieval and long-term memory for context-aware agents.", items: ["Postgres pgvector", "Pinecone", "Qdrant", "Weaviate", "Redis"] },
      { title: "Cloud and monitoring", desc: "Hosting, observability and evaluation for reliable operations.", items: ["AWS Bedrock", "Azure AI Foundry", "LangSmith", "Arize Phoenix", "OpenTelemetry"] },
    ],
  },
  delivery: {
    title: "How we deliver",
    lead: "A clear, step-by-step path from the first conversation to a monitored production system.",
    items: [
      { title: "Discovery", desc: "Define the scope, the acceptable risk and how success will be measured." },
      { title: "Architecture", desc: "Design the agent structure, tools, memory and approval points." },
      { title: "Development", desc: "Build the reasoning, retrieval and connectors in small, tested steps." },
      { title: "Evaluation", desc: "Test against edge cases and tune where the agent should hand over." },
      { title: "Deployment and ops", desc: "Roll out gradually and monitor cost, speed and quality." },
    ],
  },
  cta: {
    title: "Ready to put AI agents to work?",
    text: "Let's look at your workflows, check what agents can safely take on and plan a system around your goals.",
    primaryLabel: "Discuss Your AI Project",
    primaryHref: "/contact",
    secondaryLabel: "Schedule an Assessment",
    secondaryHref: "/contact",
    notes: ["Talk directly with our team", "Confidential feasibility review"],
  },
};

const toneOptions = [
  { value: "done", label: "Green (done)" },
  { value: "info", label: "Blue (info)" },
  { value: "warn", label: "Amber (needs a person)" },
];

export const agenticModule = defineModule({
  id: "serviceAgentic",
  title: "Agentic AI",
  route: "/services/agentic-ai",
  group: "Services",
  defaults,
  sections: [
    { id: "meta", title: "Search & sharing", fields: [seoFields()] },
    {
      id: "hero",
      title: "Top banner",
      description: "The dark banner at the top of the page, with the example workflow card.",
      fields: [
        group("hero", "Top banner", [
          text("eyebrow", "Small label", { max: 40 }),
          text("titleStart", "Headline (first part)", { required: true, max: 80 }),
          text("titleAccent", "Headline (coloured part)", { max: 80 }),
          longtext("text", "Supporting text", { rows: 4 }),
          text("primaryLabel", "Main button text"),
          url("primaryHref", "Main button link"),
          text("secondaryLabel", "Second button text"),
          url("secondaryHref", "Second button link", { help: "Use #build to scroll to the next section." }),
          strings("points", "Highlights under the buttons", { addLabel: "Add highlight", max: 4 }),
          text("consoleTitle", "Example card title", { max: 40 }),
          list(
            "consoleRows",
            "Example card rows",
            "row",
            [
              text("title", "Agent name", { required: true }),
              text("detail", "What it does"),
              text("status", "Status text"),
              select("tone", "Status colour", toneOptions),
              icon("icon"),
            ],
            { titleKey: "title", max: 4 },
          ),
          strings("logLines", "Activity lines", { addLabel: "Add line", max: 4 }),
        ]),
      ],
    },
    {
      id: "build",
      title: "Ways we build agents",
      fields: [
        group("build", "Ways we build agents", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "items",
            "Cards",
            "card",
            [
              text("title", "Title", { required: true }),
              longtext("desc", "Description", { rows: 3 }),
              strings("points", "Key points", { addLabel: "Add point", max: 5 }),
              icon("icon"),
            ],
            { titleKey: "title", max: 6 },
          ),
        ]),
      ],
    },
    {
      id: "flow",
      title: "How an agent works",
      fields: [
        group("flow", "How an agent works", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "items",
            "Steps",
            "step",
            [text("label", "Small label"), text("title", "Title", { required: true }), longtext("desc", "Description", { rows: 2 })],
            { titleKey: "title", max: 7 },
          ),
        ]),
      ],
    },
    {
      id: "services",
      title: "Services",
      fields: [
        group("services", "Services", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "items",
            "Service cards",
            "service",
            [
              text("title", "Title", { required: true }),
              longtext("desc", "Description", { rows: 3 }),
              strings("tags", "Small tags", { addLabel: "Add tag", max: 5 }),
              icon("icon"),
            ],
            { titleKey: "title", max: 9 },
          ),
        ]),
      ],
    },
    {
      id: "useCases",
      title: "Use cases",
      fields: [
        group("useCases", "Use cases", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "items",
            "Use cases",
            "use case",
            [text("title", "Title", { required: true }), longtext("desc", "Description", { rows: 2 }), icon("icon")],
            { titleKey: "title", max: 9 },
          ),
        ]),
      ],
    },
    {
      id: "safety",
      title: "Safety and control",
      fields: [
        group("safety", "Safety and control", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "items",
            "Points",
            "point",
            [text("title", "Title", { required: true }), longtext("desc", "Description", { rows: 2 }), icon("icon")],
            { titleKey: "title", max: 6 },
          ),
        ]),
      ],
    },
    {
      id: "stack",
      title: "Tools we work with",
      fields: [
        group("stack", "Tools we work with", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "groups",
            "Groups",
            "group",
            [
              text("title", "Group name", { required: true }),
              text("desc", "Short description"),
              strings("items", "Tools", { addLabel: "Add tool", max: 12 }),
            ],
            { titleKey: "title", max: 6 },
          ),
        ]),
      ],
    },
    {
      id: "delivery",
      title: "How we deliver",
      fields: [
        group("delivery", "How we deliver", [
          text("title", "Heading"),
          longtext("lead", "Lead-in", { rows: 2 }),
          list(
            "items",
            "Steps",
            "step",
            [text("title", "Title", { required: true }), longtext("desc", "Description", { rows: 2 })],
            { titleKey: "title", max: 7 },
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
          strings("notes", "Small notes under the buttons", { addLabel: "Add note", max: 4 }),
        ]),
      ],
    },
  ],
});


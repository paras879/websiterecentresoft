/**
 * Pictures that replaced an older default. Saved content keeps the picture it had, so each row says: if the
 * saved value is still the old default (nobody changed it in the admin), use the new picture and its description.
 * A picture someone chose in the admin never matches an old default, so it is left alone.
 */
interface Upgrade {
  at: string;
  image: string;
  to: string;
  altKey: string | null;
  altFrom: string;
  altTo: string;
}

const UPGRADES: Upgrade[] = [
  {
    "at": "home.about",
    "image": "/images/services-team.jpg",
    "to": "/images/home-img.webp",
    "altKey": "imageAlt",
    "altFrom": "Engineering team discussing system architecture at the Noida office",
    "altTo": "Colleagues working at desks with large monitors in a bright open-plan office"
  },
  {
    "at": "about.hero",
    "image": "/images/about.jpg",
    "to": "/images/about-us.webp",
    "altKey": "imageAlt",
    "altFrom": "Engineers presenting a cloud architecture diagram to colleagues in a modern office",
    "altTo": "Team at a meeting table with laptops, with a software deployment diagram on the whiteboard"
  },
  {
    "at": "contact.hero",
    "image": "/images/services-aside-developer.jpg",
    "to": "/images/contact-us.webp",
    "altKey": "imageAlt",
    "altFrom": "Developer at a workstation in the Recenturesoft engineering office",
    "altTo": "Person in a suit tapping a tablet with message, phone and email icons"
  },
  {
    "at": "contact.office",
    "image": "/images/contact-office.jpg",
    "to": "/images/address.webp",
    "altKey": "imageAlt",
    "altFrom": "Meeting room inside a brick-walled office",
    "altTo": "Hand holding a phone with a glowing map and location pins above a laptop"
  },
  {
    "at": "careers.why.items.1",
    "image": "/images/careers-learning.jpg",
    "to": "/images/continuous-learning.webp",
    "altKey": "alt",
    "altFrom": "Laptop with programming books on a lap, representing continuous learning",
    "altTo": "Developer working on a laptop surrounded by stacks of books"
  },
  {
    "at": "serviceAi.hero",
    "image": "/images/ai-automation.jpg",
    "to": "/images/ai-automation.webp",
    "altKey": "imageAlt",
    "altFrom": "Enterprise AI workflow automation control room",
    "altTo": "Laptop showing analytics dashboards beside a white robotic hand"
  },
  {
    "at": "serviceSoftware.hero",
    "image": "/images/software.jpg",
    "to": "/images/software-development.webp",
    "altKey": "imageAlt",
    "altFrom": "Three monitors showing code, a monitoring dashboard and test results at a developer workstation",
    "altTo": "Developer seen from behind at a desk with monitors of code in a colourful night office"
  },
  {
    "at": "serviceCustom.hero",
    "image": "/images/custom-hero.jpg",
    "to": "/images/custom-development.webp",
    "altKey": "imageAlt",
    "altFrom": "Developer workstation with code editors and a system architecture diagram",
    "altTo": "Developer desk with three monitors showing code in front of a brick wall"
  },
  {
    "at": "serviceCustom.build.items.0",
    "image": "/images/custom-web-apps.jpg",
    "to": "/images/custom-development-features-development.webp",
    "altKey": "alt",
    "altFrom": "Designer reviewing a web application on a desktop monitor",
    "altTo": "Team around a table with laptops and a whiteboard planning an application"
  },
  {
    "at": "serviceCustom.build.items.1",
    "image": "/images/custom-enterprise.jpg",
    "to": "/images/custom-development-enterprise.webp",
    "altKey": "alt",
    "altFrom": "Modern glass corporate office building",
    "altTo": "Monitor showing a system architecture diagram in a warmly lit office"
  },
  {
    "at": "serviceCustom.build.items.2",
    "image": "/images/custom-saas.jpg",
    "to": "/images/custom-development-saas.webp",
    "altKey": "alt",
    "altFrom": "Laptop showing a product analytics dashboard",
    "altTo": "Hands typing on a laptop with glowing SaaS, cloud and code icons"
  },
  {
    "at": "serviceCustom.build.items.3",
    "image": "/images/custom-api.jpg",
    "to": "/images/custom-development-api.webp",
    "altKey": "alt",
    "altFrom": "Close-up of source code on a screen",
    "altTo": "Hands typing on a laptop with a glowing API symbol and related icons"
  },
  {
    "at": "serviceCustom.build.items.4",
    "image": "/images/custom-automation.jpg",
    "to": "/images/custom-development-business.webp",
    "altKey": "alt",
    "altFrom": "Person drawing a process flowchart on a whiteboard",
    "altTo": "Finger on a laptop trackpad with glowing icons for robotic process automation"
  },
  {
    "at": "serviceCustom.build.items.5",
    "image": "/images/custom-legacy.jpg",
    "to": "/images/custom-development-legacy.webp",
    "altKey": "alt",
    "altFrom": "Circuit board close-up representing legacy systems",
    "altTo": "Person using a tablet with glowing icons for security, cloud, servers and analytics"
  },
  {
    "at": "serviceSeo.hero",
    "image": "/images/seo-hero.jpg",
    "to": "/images/seo.webp",
    "altKey": "imageAlt",
    "altFrom": "Ultra-wide monitor showing a search performance dashboard",
    "altTo": "Person in a suit with floating SEO, search and analytics icons"
  },
  {
    "at": "serviceSeo.services.items.0",
    "image": "/images/seo-technical.jpg",
    "to": "/images/seo-technical.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceSeo.services.items.1",
    "image": "/images/seo-onpage.jpg",
    "to": "/images/seo-on-page-seo.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceSeo.services.items.2",
    "image": "/images/seo-offpage.jpg",
    "to": "/images/off-page-seo.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceSeo.services.items.3",
    "image": "/images/seo-keywords.jpg",
    "to": "/images/off-page-keyword.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceSeo.services.items.5",
    "image": "/images/seo-audit.jpg",
    "to": "/images/seo-audit.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceAgentic.hero",
    "image": "",
    "to": "/images/agentic-ai-home.webp",
    "altKey": "imageAlt",
    "altFrom": "",
    "altTo": "White humanoid robot head beside the words Agentic AI and glowing digital icons"
  },
  {
    "at": "serviceApp.hero",
    "image": "",
    "to": "/images/app-development.webp",
    "altKey": "imageAlt",
    "altFrom": "",
    "altTo": "Person holding a phone showing code, with monitors of code in the background"
  },
  {
    "at": "about.meta",
    "image": "/images/about.jpg",
    "to": "/images/about-us.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "contact.meta",
    "image": "/images/services-aside-developer.jpg",
    "to": "/images/contact-us.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceAi.meta",
    "image": "/images/ai-automation.jpg",
    "to": "/images/ai-automation.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceSoftware.meta",
    "image": "/images/software.jpg",
    "to": "/images/software-development.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceCustom.meta",
    "image": "/images/custom-hero.jpg",
    "to": "/images/custom-development.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  },
  {
    "at": "serviceSeo.meta",
    "image": "/images/seo-hero.jpg",
    "to": "/images/seo.webp",
    "altKey": null,
    "altFrom": "",
    "altTo": ""
  }
];

/** Wording that changed: kept only when the saved text is still the old default. */
const TEXT_UPGRADES: { at: string; key: string; from: string; to: string }[] = [
  { at: "contact.channels", key: "phoneLabel", from: "Phone Number", to: "Mobile Number" },
  { at: "serviceCustom.cta", key: "phoneLabel", from: "Phone", to: "Mobile" },
];

type Node = Record<string, unknown> | unknown[] | undefined;

function walk(root: unknown, path: string): Record<string, unknown> | null {
  let node: Node = root as Node;
  for (const key of path.split(".")) {
    if (node === undefined || node === null || typeof node !== "object") return null;
    node = (node as Record<string, Node>)[key];
  }
  return node && typeof node === "object" && !Array.isArray(node) ? (node as Record<string, unknown>) : null;
}

export function applyImageUpgrades<T>(content: T): T {
  for (const u of UPGRADES) {
    const target = walk(content, u.at);
    if (!target || target.image !== u.image) continue;
    target.image = u.to;
    // The old description belongs to the old picture, so it is replaced together with it.
    if (u.altKey) target[u.altKey] = u.altTo;
  }
  for (const t of TEXT_UPGRADES) {
    const target = walk(content, t.at);
    if (target && target[t.key] === t.from) target[t.key] = t.to;
  }
  return content;
}

import type { Knowledge } from "./assistant-kb";

const HINGLISH =
  /\b(kya|kaise|kaha|kahan|kitna|kitne|hai|hain|ho|hoon|hu|mujhe|mera|meri|aap|apka|aapka|batao|bata|bataiye|chahiye|karo|karna|karte|nahi|nhi|kab|kaun|koi|ka|ki|ke|se|pe|par|wala|wali|milega|milegi|kar)\b/i;

const has = (q: string, re: RegExp) => re.test(q);

const GREETING = /^(hi+|hello+|hey+|namaste|namaskar|good (morning|afternoon|evening))[\s!.?]*$/;
const CAREERS = /\b(careers?|jobs?|hiring|vacanc\w*|openings?|intern(ship)?s?|apply|resume|cv|naukri|joining)\b/;
const PRICE = /\b(price|pricing|cost|costs|quote|quotation|charges?|budget|rate|rates|fees?|paisa|paise)\b|kitna lagega|kitne ka/;
const EMAIL = /(e-?mail|\bmail\b|gmail)/;
const WHATSAPP = /whats\s?app/;
const PHONE =
  /(phone|call (us|me|you)|calling|contact (no|number)|mobile (no|number)|your (number|no\b)|ka number|number (do|batao|dijiye|chahiye|kya)|\bdial\b)/;
const ADDRESS = /(address|location|where (is|are)|your office|office (address|location)|\bmap\b|directions?|situated|kaha|kahan|\bpata\b)/;
const ABOUT =
  /(about (the |your |this )?(company|firm|business|organi[sz]ation|recenturesoft)|who are you|who is recenturesoft|tell me about|what is recenturesoft|introduce|company (ke )?(bare|baare)|company (kya|kaun)|(iss|is|is) company|kaun ho|aap kaun|apne bare|apke bare|aapke bare|hamare bare)/;
const SERVICES =
  /(services?|konsi|kaun si|kaun kaun|kya kya|what (do you|can you|all)|offer|provide|provides|solutions?|kya (kaam|karte|karta|dete|deta|banate|banata)|kaam|products?)/;
const GENERIC = new Set(["services", "service", "development", "solutions", "solution", "software"]);
const HOURS = /(office hours|working hours|business hours|opening hours|timings?|open (on|at|till)|kab tak|kitne baje|sunday|saturday)/;

/**
 * Exact facts the website states (email, phone, address, hours, WhatsApp, hello). Answered straight away
 * without calling the AI, so these never wait and never use up the AI limit.
 */
export function quickAnswer(question: string, kb: Knowledge): string | null {
  return answer(question, kb, true);
}

/** Short answers from the facts alone, used when the AI is not set up or is busy. */
export function basicAnswer(question: string, kb: Knowledge): string {
  return answer(question, kb, false) as string;
}

function answer(question: string, kb: Knowledge, onlySimple: boolean): string | null {
  const q = question.toLowerCase().trim();
  const hi = HINGLISH.test(q);
  const f = kb.facts;
  const t = (en: string, hing: string) => (hi ? hing : en);
  const formLine = t(
    "For anything else, please fill in our Contact form: /contact",
    "Baaki kisi bhi sawal ke liye kripya hamara Contact form bhar dein: /contact",
  );

  if (has(q, GREETING)) {
    return t(
      `Hello! I'm the ${f.name} assistant. Ask me about our services, careers, contact details or location.`,
      `Namaste! Main ${f.name} ka assistant hoon. Aap hamari services, careers, contact details ya location ke baare me pooch sakte hain.`,
    );
  }
  if (has(q, EMAIL) && !has(q, CAREERS)) {
    return t(`Our email is ${f.email}. For careers, write to ${f.hrEmail}.`, `Hamara email ${f.email} hai. Careers ke liye ${f.hrEmail} par likhein.`);
  }
  if (has(q, WHATSAPP)) {
    return t(`You can message us on WhatsApp: ${f.whatsappUrl}`, `Aap hume WhatsApp par message kar sakte hain: ${f.whatsappUrl}`);
  }
  if (has(q, PHONE)) {
    return t(`You can call us on ${f.phone}.`, `Aap hume ${f.phone} par call kar sakte hain.`);
  }
  if (has(q, ADDRESS)) {
    return t(`Our office: ${f.address}. Map: ${f.mapUrl}`, `Hamara office: ${f.address}. Map: ${f.mapUrl}`);
  }
  if (has(q, HOURS)) {
    return f.officeHours
      ? t(`Office hours: ${f.officeHours}`, `Office ka samay: ${f.officeHours}`)
      : t(
          `Office hours are not published on our website. Please call ${f.phone} or email ${f.email}.`,
          `Office ka samay website par nahi diya gaya. Kripya ${f.phone} par call karein ya ${f.email} par mail karein.`,
        );
  }

  if (onlySimple) return null;

  if (has(q, ABOUT)) {
    const list = f.services.map((s) => s.title).join(", ");
    return t(
      `${f.legalName} is a software company based in Noida, India. ${f.about}
Our services: ${list}.
Office: ${f.address}
Email: ${f.email} | Phone: ${f.phone}`,
      `${f.legalName} Noida, India ki ek software company hai. ${f.about}
Hamari services: ${list}.
Office: ${f.address}
Email: ${f.email} | Phone: ${f.phone}`,
    );
  }

  if (has(q, CAREERS)) {
    return t(
      `You can see open roles and apply on our Careers page: /careers. HR email: ${f.hrEmail}.`,
      `Open roles dekhne aur apply karne ke liye Careers page dekhein: /careers. HR email: ${f.hrEmail}.`,
    );
  }
  if (has(q, PRICE)) {
    return t(
      `We share costs only after understanding your project. Please send the details through our Contact form (/contact) or email ${f.email}.`,
      `Cost project samajhne ke baad hi bataya jata hai. Kripya Contact form (/contact) bharein ya ${f.email} par mail karein.`,
    );
  }
  const specific = f.services.find((s) => {
    const words = s.title
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 2 && !GENERIC.has(w));
    return words.some((w) => new RegExp(`\\b${w}\\b`).test(q));
  });
  if (specific) {
    return `${specific.title}: ${specific.desc}. ${t("More:", "Zyada jaankari:")} ${specific.href}`;
  }
  if (has(q, SERVICES)) {
    const list = f.services.map((s) => `- ${s.title}: ${s.desc}`).join("\n");
    return `${t("Here is what we offer:", "Hum ye services dete hain:")}\n${list}\n${t("Ask about any of them for more details.", "Kisi bhi service ke baare me pooch sakte hain.")}`;
  }
  return t(
    `I can only answer questions about ${f.name}, our services, careers, and how to reach us. ${formLine}\nEmail: ${f.email} | Phone: ${f.phone}`,
    `Main sirf ${f.name}, hamari services, careers aur contact ke baare me bata sakta hoon. ${formLine}\nEmail: ${f.email} | Phone: ${f.phone}`,
  );
}

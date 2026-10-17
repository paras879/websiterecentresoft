import { cache } from "react";
import { getSiteContent } from "./content";

/** Contact and brand details in the shape the pages use, derived from the editable content. */
export interface SiteInfo {
  name: string;
  legalName: string;
  tagline: string;
  logoAlt: string;
  description: string;
  contact: {
    email: string;
    hrEmail: string;
    phone: string;
    phoneRaw: string;
    whatsappUrl: string;
    address: string;
    shortLocation: string;
    mapUrl: string;
    officeHours: string;
  };
}

export function buildSiteInfo(site: Awaited<ReturnType<typeof getSiteContent>>["site"]): SiteInfo {
  const { brand, contact } = site;
  const digits = contact.phone.replace(/[^\d]/g, "");
  const phoneRaw = digits ? `+${digits}` : "";
  return {
    name: brand.name,
    legalName: brand.legalName,
    tagline: brand.tagline,
    logoAlt: brand.logoAlt || `${brand.name} - A Hub of IT Services`,
    description: brand.description,
    contact: {
      email: contact.email,
      hrEmail: contact.hrEmail || contact.email,
      phone: contact.phone,
      phoneRaw,
      whatsappUrl: `https://api.whatsapp.com/send?phone=${phoneRaw}&text=${encodeURIComponent(contact.whatsappMessage || "Hi")}`,
      address: contact.address,
      shortLocation: contact.shortLocation,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
      officeHours: contact.officeHours,
    },
  };
}

export const getSiteInfo = cache(async (): Promise<SiteInfo> => buildSiteInfo((await getSiteContent()).site));

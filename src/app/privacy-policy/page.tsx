import type { Metadata } from "next";
import { getSiteInfo } from "@/lib/site";
import { PrivacyPolicyView } from "./privacy-policy-view";

export const metadata: Metadata = {
  title: "Privacy Policy | Recenturesoft Infotech Pvt Ltd",
  description:
    "Official Privacy Policy of Recenturesoft Infotech Pvt Ltd explaining how we collect, protect, and use user information on websiterecentresoft.vercel.app.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Recenturesoft Infotech Pvt Ltd",
    description:
      "Official Privacy Policy of Recenturesoft Infotech Pvt Ltd explaining how we collect, protect, and use user information on websiterecentresoft.vercel.app.",
    type: "website",
    url: "https://websiterecentresoft.vercel.app/privacy-policy",
  },
};

export default async function PrivacyPolicyPage() {
  const { name, legalName, contact } = await getSiteInfo();
  return (
    <PrivacyPolicyView
      company={legalName}
      brand={name}
      email={contact.email}
      phone={contact.phone}
      phoneRaw={contact.phoneRaw}
      address={contact.address}
      mapUrl={contact.mapUrl}
      whatsappUrl={contact.whatsappUrl}
    />
  );
}

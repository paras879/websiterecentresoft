import type { Metadata } from "next";
import { getSiteInfo } from "@/lib/site";
import { PrivacyPolicyView } from "./privacy-policy-view";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Recenturesoft Infotech Pvt Ltd collects, uses, protects and shares information on www.recenturesoft.com, and how to reach our Grievance Officer.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Recenturesoft Infotech Pvt Ltd",
    description:
      "How Recenturesoft Infotech Pvt Ltd collects, uses, protects and shares information on www.recenturesoft.com.",
    type: "website",
    url: "https://www.recenturesoft.com/privacy-policy",
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

import type { Metadata } from "next";
import { getSiteInfo } from "@/lib/site";
import { TermsView } from "./terms-view";

export const metadata: Metadata = {
  title: "Terms & Conditions | Recenturesoft Infotech Pvt Ltd",
  description:
    "Official Terms and Conditions of Recenturesoft Infotech Pvt Ltd governing website access, acceptable use, intellectual property, security rules, and limitation of liability.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Recenturesoft Infotech Pvt Ltd",
    description:
      "Read the terms, acceptable use policies, intellectual property rights, and legal guidelines governing your access to Recenturesoft Infotech Pvt Ltd.",
    type: "website",
    url: "https://websiterecentresoft.vercel.app/terms-and-conditions",
  },
};

export default async function TermsAndConditionsPage() {
  const { name, legalName, contact } = await getSiteInfo();
  return (
    <TermsView
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


import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PrivacyPolicyView } from "./privacy-policy-view";
import { RouteSchema } from "@/components/route-schema";

export async function generateMetadata(): Promise<Metadata> {
  const { privacy } = await getSiteContent();
  return pageMetadata(privacy.meta, "/privacy-policy");
}

export default async function PrivacyPolicyPage() {
  const { privacy: content } = await getSiteContent();
  const { name, legalName, contact } = await getSiteInfo();
  return (
    <>
      <RouteSchema path="/privacy-policy" />
      <PrivacyPolicyView
        company={legalName}
        brand={name}
        email={contact.email}
        phone={contact.phone}
        phoneRaw={contact.phoneRaw}
        address={contact.address}
        mapUrl={contact.mapUrl}
        whatsappUrl={contact.whatsappUrl}
        content={content}
      />
    </>
  );
}

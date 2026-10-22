import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { getSiteInfo } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { TermsView } from "./terms-view";
import { RouteSchema } from "@/components/route-schema";

export async function generateMetadata(): Promise<Metadata> {
  const { terms } = await getSiteContent();
  return pageMetadata(terms.meta, "/terms-and-conditions");
}

export default async function TermsAndConditionsPage() {
  const { terms: content } = await getSiteContent();
  const { name, legalName, contact } = await getSiteInfo();
  return (
    <>
      <RouteSchema path="/terms-and-conditions" />
      <TermsView
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


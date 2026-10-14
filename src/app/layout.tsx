import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { buildSiteInfo } from "@/lib/site";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "./theme-hcl.css";

// Page content comes from the admin panel, so pages are rendered on request instead of at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();
  const info = buildSiteInfo(site);
  const title = site.meta.title || `${info.name} | Software Development & AI Automation`;
  const description = site.meta.description || info.description;
  const image = site.meta.image || "/images/hero.jpg";

  return {
    title: {
      default: title,
      template: `%s | ${info.name}`,
    },
    description,
    metadataBase: new URL("https://www.recenturesoft.com"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://www.recenturesoft.com",
      siteName: info.legalName,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: info.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@recenture_soft",
      title,
      description,
      images: [image],
    },
  };
}

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('recenturesoft-theme');
      var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
    } catch (e) {}
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const { site } = content;
  const info = buildSiteInfo(site);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: info.name,
    legalName: info.legalName,
    url: "https://www.recenturesoft.com",
    logo: "https://www.recenturesoft.com/images/hero.jpg",
    description: info.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "A-125, 1st Floor, Sector-63",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: info.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: site.socials.map((s) => s.href),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SiteShell
            header={<SiteHeader site={site} info={info} />}
            footer={<SiteFooter site={site} info={info} />}
          >
            {children}
          </SiteShell>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

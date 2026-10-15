import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import { buildSiteInfo } from "@/lib/site";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";
import "./theme-hcl.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

// Revalidate cached pages on edge every 60s or on-demand via admin panel
export const revalidate = 60;

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
    metadataBase: new URL("https://websiterecentresoft.vercel.app"),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://websiterecentresoft.vercel.app",
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
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.png", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
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

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://websiterecentresoft.vercel.app/#organization",
        name: info.name,
        legalName: info.legalName,
        url: "https://websiterecentresoft.vercel.app",
        logo: "https://websiterecentresoft.vercel.app/images/recenturesoft-logo.png",
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
      },
      {
        "@type": "WebSite",
        "@id": "https://websiterecentresoft.vercel.app/#website",
        url: "https://websiterecentresoft.vercel.app",
        name: info.name,
        description: info.description,
        publisher: {
          "@id": "https://websiterecentresoft.vercel.app/#organization",
        },
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <SmoothScroll />
        <ThemeProvider>
          <SiteShell
            header={<SiteHeader site={site} info={info} />}
            footer={<SiteFooter site={site} info={info} />}
            whatsappUrl={info.contact.whatsappUrl}
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

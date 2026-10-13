import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "./theme-hcl.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Software Development & AI Automation`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL("https://www.recenturesoft.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.recenturesoft.com",
    siteName: siteConfig.legalName,
    title: `${siteConfig.name} | Software Development & AI Automation`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Recenturesoft Software Engineering and AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@recenture_soft",
    title: `${siteConfig.name} | Software Development & AI Automation`,
    description: siteConfig.description,
    images: ["/images/hero.jpg"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: "https://www.recenturesoft.com",
  logo: "https://www.recenturesoft.com/images/hero.jpg",
  description: siteConfig.description,
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
      telephone: "+91 777 000 3288",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  sameAs: [
    "https://in.linkedin.com/company/recenturesoft",
    "https://x.com/recenture_soft",
    "https://www.facebook.com/recenturesoftinfotech/",
    "https://www.youtube.com/channel/UCwrJM7HFZGmke0jr8y4VYXg",
  ],
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <div className="app-shell">
            <SiteHeader />
            <main id="main-content" className="site-main">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

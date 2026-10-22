import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { buildSiteInfo } from "@/lib/site";
import { buildPageSchemas, buildSiteGraph } from "@/lib/schema";
import { publishedPages, withCustomPageLinks } from "@/lib/custom-pages";
import { PageSchema } from "@/components/page-schema";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";
import "./theme-hcl.css";

// Inter is a variable font, so one file covers every weight. Listing the weights would add a separate
// set of font rules to every page for each of them.
const inter = Inter({
  subsets: ["latin"],
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
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
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
  const info = buildSiteInfo(content.site);
  // Pages made in the admin panel can ask to be in the menu; the links are added here and never saved with the content.
  const site = withCustomPageLinks(content.site, await publishedPages());

  const structuredData = buildSiteGraph(content, info);
  const pageSchemas = buildPageSchemas(content);

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
        <PageSchema pages={pageSchemas} />
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

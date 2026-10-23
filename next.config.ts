import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  poweredByHeader: false,
  experimental: {
    // Styles ship inside the page, so the browser does not wait for six stylesheet downloads before painting.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [75, 85, 90],
  },
  async headers() {
    // Pictures and logos in /public are not fingerprinted, so they are cached for a day and
    // refreshed quietly in the background for a week. Repeat visits then load them instantly.
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    // What the pages may load or do. Scripts and frames are allowed only from this site and Google reCAPTCHA (the "I'm not
    // a robot" box). Nothing else can be embedded, no other site can frame these pages, and forms can only post back here.
    // Inline scripts and styles stay allowed because Next.js writes its own page data and styles inline.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.gstatic.com https://www.google.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google.com/recaptcha/",
      "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      // Only in the live build: the development server needs looser rules to work.
      ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
    ];
    // The two logo files almost never change (a new logo would get a new file name), so they are kept for a year.
    const logoCache = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/:path*", headers: security },
      { source: "/images/:path*", headers: cache },
      { source: "/tech/:path*", headers: cache },
      { source: "/images/recenturesoft-logo.png", headers: logoCache },
      { source: "/images/logo_white.PNG", headers: logoCache },
    ];
  },
};

export default nextConfig;

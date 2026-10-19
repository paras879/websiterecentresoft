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
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/images/:path*", headers: cache },
      { source: "/tech/:path*", headers: cache },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [75, 85, 90],
  },
  async headers() {
    // Pictures and logos in /public are not fingerprinted, so they are cached for a day and
    // refreshed quietly in the background for a week. Repeat visits then load them instantly.
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/images/:path*", headers: cache },
      { source: "/tech/:path*", headers: cache },
    ];
  },
};

export default nextConfig;

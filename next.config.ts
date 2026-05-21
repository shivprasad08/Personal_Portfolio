import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "media-exp1.licdn.com" },
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

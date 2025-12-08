import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "framer-motion",
    ],
  },
  // 👇 BU KISIM HAYATİ ÖNEM TAŞIYOR.
  // Bu ayar olmadan bcryptjs ve storage kütüphaneleri derlenirken patlar.
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "bcryptjs",
    "@google-cloud/storage",
    "nodemailer"
  ],

  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "storage.googleapis.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Only add HSTS in non-CI environments to prevent Lighthouse CI issues
          ...(process.env.CI ? [] : [{
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          }]),
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
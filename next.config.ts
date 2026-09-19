import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "motion/react"],
  },
  // Compiler options for production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable React strict mode
  reactStrictMode: true,
};

export default withNextIntl(withPWAConfig(bundleAnalyzer(nextConfig)));
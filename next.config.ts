import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_TARGET === "ios" ? "export" : "standalone",
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Turbopack: alias native-only Capacitor plugins to empty for static export
  ...(process.env.BUILD_TARGET === "ios" ? {
    turbopack: {
      resolveAlias: {
        '@capacitor-community/admob': './src/lib/empty-module.ts',
        '@revenuecat/purchases-capacitor': './src/lib/empty-module.ts',
      },
    },
  } : {}),
};

export default nextConfig;

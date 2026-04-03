import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Exclude API routes from static export (served from pokopal.com)
  trailingSlash: true,
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

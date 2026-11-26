import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT_EXPORT === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
  transpilePackages: ["three"],
  images: {
    unoptimized: true,
  },
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;

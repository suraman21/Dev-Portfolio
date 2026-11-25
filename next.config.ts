import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
  transpilePackages: ["three"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

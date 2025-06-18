import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs']
  },
  // Ensure middleware runs in Node.js runtime for better compatibility
  runtime: 'nodejs',
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This is a wildcard that allows ALL https domains
      },
    ],
  },
};

export default nextConfig;

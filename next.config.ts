import type { NextConfig } from "next";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.89.211.92",
        pathname: "/storage/categories/**",
      },
      {
        protocol: "http",
        hostname: new URL(BACKEND_URL!).hostname,
        pathname: "/storage/categories/**",
      },
      {
        protocol: "https",
        hostname: "getcover-production-s3.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${BACKEND_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

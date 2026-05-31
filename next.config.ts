import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: "http://localhost:9001/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;

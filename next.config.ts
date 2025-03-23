import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://dubaiusedfurniture.ae",
        "http://localhost:3000",
      ],
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

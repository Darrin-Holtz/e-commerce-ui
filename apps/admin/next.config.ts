import type { NextConfig } from "next";

const allowedOrigins = process.env.CODESPACE_NAME
  ? [
      `${process.env.CODESPACE_NAME}-3001.app.github.dev`,
      "localhost:3001",
    ]
  : [];

const nextConfig: NextConfig = {
  transpilePackages: ["@e-commerce-ui/types", "@e-commerce-ui/ui"],
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"images.pexels.com",
      },
      {
        protocol:"https",
        hostname:"img.clerk.com",
      },
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
      }
    ]
  }
};

export default nextConfig;

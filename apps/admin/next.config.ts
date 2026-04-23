import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@e-commerce-ui/types", "@e-commerce-ui/ui"],
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"images.pexels.com",
      }
    ]
  }
};

export default nextConfig;

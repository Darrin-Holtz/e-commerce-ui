import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: [
				"*.app.github.dev",
				"*.github.dev",
				"localhost:3000",
				"e-commerce-ui-client-three.vercel.app",
				"*.vercel.app",
			],
		},
	},
	allowedDevOrigins: ["*.app.github.dev", "*.github.dev"],
	transpilePackages: ["@e-commerce-ui/types", "@e-commerce-ui/ui"],
	images:{
    remotePatterns:[    
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

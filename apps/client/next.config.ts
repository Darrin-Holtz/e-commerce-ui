import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["*.app.github.dev", "*.github.dev", "localhost:3000"],
		},
	},
	allowedDevOrigins: ["*.app.github.dev", "*.github.dev"],
	transpilePackages: ["@e-commerce-ui/types", "@e-commerce-ui/ui"],
};

export default nextConfig;

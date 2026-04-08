import type { NextConfig } from "next";

// next.config.ts
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://api.firstlegoleague.win/:path*",
            },
        ];
    },
};

export default nextConfig;
export default nextConfig;

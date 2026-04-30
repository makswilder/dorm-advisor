import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    // In Docker: API_URL=http://backend:8080 (server-side, internal network)
    // Locally:   falls back to NEXT_PUBLIC_API_URL=http://localhost:8080
    const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/photos/**",
      },
      {
        // Next.js image optimisation fetches from the backend container
        protocol: "http",
        hostname: "backend",
        port: "8080",
        pathname: "/api/photos/**",
      },
    ],
  },
};

export default nextConfig;
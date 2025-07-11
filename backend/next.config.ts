import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // This disables Next.js image optimization entirely
  },
  async headers() {
    return [
      {
        source: "/extension/(.*)", // Matches all paths starting with /extension/
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow requests from ALL origins
          },
        ],
      },
    ];
  },
};

export default nextConfig;

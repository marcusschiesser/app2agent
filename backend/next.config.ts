import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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

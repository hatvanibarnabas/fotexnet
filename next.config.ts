import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exam.api.fotex.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

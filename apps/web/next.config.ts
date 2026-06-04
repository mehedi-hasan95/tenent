import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      { hostname: "0itertanyb.ufs.sh", protocol: "https" },
      { hostname: "github.com", protocol: "https" },
      { hostname: "images.unsplash.com", protocol: "https" },
    ],
  },
}

export default nextConfig

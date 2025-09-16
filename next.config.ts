import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.snapshot = {
      ...config,
      managedPaths : [/^(.+?[\\/]node_modules[\\/])/]
    }

    return config
  }
};

export default nextConfig;

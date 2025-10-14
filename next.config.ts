import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],

  images: {
    domains: ["*"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Completely ignore problematic files from @libsql packages
    config.module.rules.push({
      test: /node_modules\/@libsql\/.*\.(md|LICENSE)$/,
      use: "null-loader",
    });

    config.module.rules.push({
      test: /node_modules\/@prisma\/adapter-libsql\/.*\.(md|LICENSE)$/,
      use: "null-loader",
    });

    // Fallback for any .md or LICENSE files
    config.module.rules.push({
      test: /\.(md|LICENSE)$/,
      type: "asset/source",
    });

    return config;
  },
  turbopack: {
    rules: {},
  },
};

export default nextConfig;

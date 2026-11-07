import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Admin forms upload several photos (up to 12 MB each) in one action.
    serverActions: { bodySizeLimit: "100mb" },
  },
  partialPrefetching: true,
  images: {
    // AVIF first (sharper at the same weight), WebP for browsers without it.
    formats: ["image/avif", "image/webp"],
    // Every photo is served at quality 90 (Next's default is 75, which smears renders and fine facade detail).
    // Components leave `quality` unset and the closest allowed value, 90, is used.
    qualities: [90],
    // Optimized copies are kept a month: the sources rarely change, and uploads get new names.
    minimumCacheTTL: 2678400,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

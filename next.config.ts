import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Admin forms upload several photos (up to 12 MB each) in one action.
    serverActions: { bodySizeLimit: "100mb" },
  },
  partialPrefetching: true,
  async headers() {
    // Public files are served with max-age=0 by default, so every visit asked the server about every
    // picture again (193 hero frames among them).
    const week = "public, max-age=604800, stale-while-revalidate=2592000";
    return [
      // Versioned folder (the hero changes only under a new name): cache for good.
      { source: "/hero/:version/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      ...["assets", "directions", "showroom", "sogdiana", "team", "textures", "urgut", "vatan", "yangi-urgut"].map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: week }],
      })),
    ];
  },
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

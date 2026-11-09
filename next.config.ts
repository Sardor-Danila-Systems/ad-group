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
      // Pre-encoded pictures, named by their content.
      { source: "/_img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      ...["assets", "directions", "showroom", "sogdiana", "team", "textures", "urgut", "vatan", "yangi-urgut"].map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: week }],
      })),
    ];
  },
  images: {
    // Pictures are pre-encoded by scripts/optimize-images.mjs (WebP, several widths) and served as static
    // files: no on-the-fly optimisation, which was slow from Central Asia and smeared detail as AVIF.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
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

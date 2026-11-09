import { execFileSync } from "node:child_process";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";

/*
 * Pictures are pre-encoded by scripts/optimize-images.mjs into public/_img (not committed). Running it
 * here makes every build and dev server have them, whatever build command the host is set to; it only
 * encodes pictures that are new or changed (the rest come from .next/cache/img).
 */
function prepareImages(phase: string) {
  if (phase !== PHASE_PRODUCTION_BUILD && phase !== PHASE_DEVELOPMENT_SERVER) return;
  if (process.env.AD_IMAGES_READY) return; // build workers load this file again
  execFileSync(process.execPath, ["scripts/optimize-images.mjs"], { stdio: "inherit" });
  process.env.AD_IMAGES_READY = "1";
}

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

export default function config(phase: string): NextConfig {
  prepareImages(phase);
  return nextConfig;
}

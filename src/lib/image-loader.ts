"use client";

import manifest from "./image-manifest.json";

/*
 * next/image loader: pictures listed in the manifest (made by scripts/optimize-images.mjs) are served as
 * pre-encoded WebP files straight from the CDN, at the smallest prepared width that covers the request.
 * Anything else (uploads from the admin, already WebP at ≤ 2400 px) is served as it is.
 */
const images = manifest as Record<string, { k: string; w: number[] }>;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const entry = images[src];
  if (!entry) return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  const w = entry.w.find((x) => x >= width) ?? entry.w[entry.w.length - 1];
  return `/_img/${entry.k}/${w}.webp`;
}

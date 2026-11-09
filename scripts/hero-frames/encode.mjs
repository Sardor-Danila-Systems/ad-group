// Encodes the hero frames used by the scroll hero (src/components/site/hero.tsx) from a folder of PNGs:
// the ×2 upscaled frames from upscale.mjs (or the extracted frames as they are).
// usage: node scripts/hero-frames/encode.mjs <png-dir> [version=v3]
// Writes public/hero/<version>/:
//   d/NNNN.avif  1920 px, every frame (larger screens)
//   m/NNNN.avif  1080 px, every frame (phones)
//   m/NNNN.webp  WebP, every second frame and the last, for browsers without AVIF
//   first.jpg    the first frame (1920 px), shown by the server before the frames arrive; first-m.jpg 1280 px
// The folder is cached for a year: use a new version name whenever the frames change.
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [src, version = "v3"] = process.argv.slice(2);
if (!src) throw new Error("usage: node scripts/hero-frames/encode.mjs <png-dir> [version]");
const out = `public/hero/${version}`;
await rm(out, { recursive: true, force: true });
await mkdir(`${out}/d`, { recursive: true });
await mkdir(`${out}/m`, { recursive: true });

/** AVIF quality (sharp's scale): high enough to keep the concrete and railing texture on large screens. */
const Q = Number(process.env.Q ?? 62);
/** Phones: a smaller screen hides a little more compression, and the download stays modest. */
const QM = Number(process.env.QM ?? 54);
const all = (await readdir(src)).filter((f) => f.endsWith(".png")).sort();
// A light unsharp mask restores the crispness lost when the frame is scaled down to the target width.
const frame = (f, width) => sharp(path.join(src, f)).removeAlpha().resize({ width, kernel: "lanczos3" }).sharpen({ sigma: 0.6, m1: 0.4, m2: 1.2 });
const sizes = { d: 0, m: 0, w: 0 };
for (const [i, f] of all.entries()) {
  const n = String(i).padStart(4, "0");
  await frame(f, 1920).avif({ quality: Q, effort: 4 }).toFile(`${out}/d/${n}.avif`);
  sizes.d += (await stat(`${out}/d/${n}.avif`)).size;
  await frame(f, 1080).avif({ quality: QM, effort: 4 }).toFile(`${out}/m/${n}.avif`);
  sizes.m += (await stat(`${out}/m/${n}.avif`)).size;
  // The WebP fallback (old browsers only) keeps every second frame; the hero blends across the gaps.
  if (i % 2 === 0 || i === all.length - 1) {
    await frame(f, 1080).webp({ quality: 78, effort: 5 }).toFile(`${out}/m/${n}.webp`);
    sizes.w += (await stat(`${out}/m/${n}.webp`)).size;
  }
}
await frame(all[0], 1920).jpeg({ quality: 88, mozjpeg: true }).toFile(`${out}/first.jpg`);
await frame(all[0], 1280).jpeg({ quality: 88, mozjpeg: true }).toFile(`${out}/first-m.jpg`);
const mb = (b) => (b / 1024 / 1024).toFixed(1) + " MB";
console.log(`${all.length} frames: desktop ${mb(sizes.d)}, phone ${mb(sizes.m)} (WebP fallback ${mb(sizes.w)})`);

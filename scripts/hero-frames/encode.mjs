// Encodes the hero frames used by the scroll hero (src/components/site/hero.tsx) from a folder of PNGs:
// the ×2 upscaled frames from upscale.mjs (or the extracted frames as they are).
// usage: node scripts/hero-frames/encode.mjs <png-dir> [version=v2]
// Writes public/hero/<version>/:
//   d/NNNN.avif  1920 px, every frame (larger screens)
//   m/NNNN.avif  1080 px, every second frame and the last one (phones)
//   m/NNNN.webp  the same in WebP, for browsers without AVIF
//   first.jpg    the first frame, rendered by the server before the frames arrive
// The folder is cached for a year: use a new version name whenever the frames change.
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [src, version = "v2"] = process.argv.slice(2);
if (!src) throw new Error("usage: node scripts/hero-frames/encode.mjs <png-dir> [version]");
const out = `public/hero/${version}`;
await rm(out, { recursive: true, force: true });
await mkdir(`${out}/d`, { recursive: true });
await mkdir(`${out}/m`, { recursive: true });

const all = (await readdir(src)).filter((f) => f.endsWith(".png")).sort();
// A light unsharp mask restores the crispness lost when the frame is scaled down to the target width.
const frame = (f, width) => sharp(path.join(src, f)).removeAlpha().resize({ width, kernel: "lanczos3" }).sharpen({ sigma: 0.6, m1: 0.4, m2: 1.2 });
const sizes = { d: 0, m: 0, w: 0 };
for (const [i, f] of all.entries()) {
  const n = String(i).padStart(4, "0");
  await frame(f, 1920).avif({ quality: 58, effort: 4 }).toFile(`${out}/d/${n}.avif`);
  sizes.d += (await stat(`${out}/d/${n}.avif`)).size;
  // Keep the original frame number in the name so both sets index the same timeline.
  if (i % 2 === 0 || i === all.length - 1) {
    await frame(f, 1080).avif({ quality: 58, effort: 4 }).toFile(`${out}/m/${n}.avif`);
    await frame(f, 1080).webp({ quality: 80, effort: 6 }).toFile(`${out}/m/${n}.webp`);
    sizes.m += (await stat(`${out}/m/${n}.avif`)).size;
    sizes.w += (await stat(`${out}/m/${n}.webp`)).size;
  }
}
await frame(all[0], 1920).jpeg({ quality: 88, mozjpeg: true }).toFile(`${out}/first.jpg`);
const mb = (b) => (b / 1024 / 1024).toFixed(1) + " MB";
console.log(`${all.length} frames: desktop ${mb(sizes.d)}, phone ${mb(sizes.m)} (WebP fallback ${mb(sizes.w)})`);

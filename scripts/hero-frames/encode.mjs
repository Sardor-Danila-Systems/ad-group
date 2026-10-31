// Encodes extracted PNG frames into the WebP sequence used by the scroll hero.
// usage: node scripts/hero-frames/encode.mjs <png-dir> [quality] [crop-bottom-px] [max-width] [out-subdir] [every-nth]
// Desktop set: public/hero/frames (full size). Phone set: public/hero/frames-m (smaller, every 2nd frame).
// crop-bottom-px trims the bottom edge of every frame (used to remove the generator watermark).
// Writes public/hero/frames/NNNN.webp, plus public/hero/first.jpg and public/hero/last.jpg
// (the first frame doubles as the server-rendered poster, the last as the final screen without JS).
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [src, q = "60", cropArg = "0", widthArg = "0", sub = "frames", nthArg = "1"] = process.argv.slice(2);
const nth = Number(nthArg);
const cropBottom = Number(cropArg);
const maxWidth = Number(widthArg);
if (!src) throw new Error("usage: node scripts/hero-frames/encode.mjs <png-dir> [quality]");
const out = `public/hero/${sub}`;
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const all = (await readdir(src)).filter((f) => f.endsWith(".png")).sort();
// Keep the original frame number in the file name so both sets index the same timeline.
const picked = all.map((f, i) => [f, i]).filter(([, i]) => i % nth === 0 || i === all.length - 1);
const meta0 = await sharp(path.join(src, all[0])).metadata();
const box = { left: 0, top: 0, width: meta0.width, height: meta0.height - cropBottom };
const frame = (f) => {
  const img = sharp(path.join(src, f)).extract(box);
  return maxWidth && box.width > maxWidth ? img.resize({ width: maxWidth }) : img;
};
let total = 0;
for (const [f, i] of picked) {
  const target = path.join(out, `${String(i).padStart(4, "0")}.webp`);
  await frame(f).webp({ quality: Number(q), effort: 6 }).toFile(target);
  total += (await stat(target)).size;
}
if (sub === "frames") {
  await frame(all[0]).jpeg({ quality: 86, mozjpeg: true }).toFile("public/hero/first.jpg");
  await frame(all.at(-1)).jpeg({ quality: 88, mozjpeg: true }).toFile("public/hero/last.jpg");
}
const out0 = await sharp(path.join(out, "0000.webp")).metadata();
console.log(`${picked.length} frames, ${out0.width}x${out0.height}, ${(total / 1024 / 1024).toFixed(1)} MB, avg ${(total / picked.length / 1024).toFixed(0)} KB`);

// Encodes extracted PNG frames into the WebP sequence used by the scroll hero.
// usage: node scripts/hero-frames/encode.mjs <png-dir> [quality] [crop-bottom-px]
// crop-bottom-px trims the bottom edge of every frame (used to remove the generator watermark).
// Writes public/hero/frames/NNNN.webp, plus public/hero/first.jpg and public/hero/last.jpg
// (the first frame doubles as the server-rendered poster, the last as the final screen without JS).
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [src, q = "60", cropArg = "0"] = process.argv.slice(2);
const cropBottom = Number(cropArg);
if (!src) throw new Error("usage: node scripts/hero-frames/encode.mjs <png-dir> [quality]");
const out = "public/hero/frames";
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const files = (await readdir(src)).filter((f) => f.endsWith(".png")).sort();
const meta0 = await sharp(path.join(src, files[0])).metadata();
const box = { left: 0, top: 0, width: meta0.width, height: meta0.height - cropBottom };
const frame = (f) => sharp(path.join(src, f)).extract(box);
let total = 0;
for (const [i, f] of files.entries()) {
  const target = path.join(out, `${String(i).padStart(4, "0")}.webp`);
  await frame(f).webp({ quality: Number(q), effort: 6 }).toFile(target);
  total += (await stat(target)).size;
}
await frame(files[0]).jpeg({ quality: 82, mozjpeg: true }).toFile("public/hero/first.jpg");
await frame(files.at(-1)).jpeg({ quality: 86, mozjpeg: true }).toFile("public/hero/last.jpg");
console.log(`${files.length} frames, ${box.width}x${box.height}, ${(total / 1024 / 1024).toFixed(1)} MB, avg ${(total / files.length / 1024).toFixed(0)} KB`);

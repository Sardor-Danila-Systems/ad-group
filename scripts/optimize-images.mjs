// Pre-encodes every picture the site shows through next/image, so visitors get ready files from the CDN
// instead of images optimised on the fly (which took up to 1.3 s per picture from Central Asia, and whose
// AVIF smeared the fine detail of the renders).
//
// For each source under public/<DIRS> it writes WebP at a few widths, named by the content:
//   public/_img/<key>/<width>.webp   (cached for a year: a changed picture gets a new key)
//   src/lib/image-manifest.json      (source path → key and widths; read by src/lib/image-loader.ts)
// The WebP files are not committed. `npm run build` and `npm run dev` make them, and keep them in
// .next/cache/img (kept between Vercel builds), so only new or changed pictures are encoded again.
// The manifest is committed; it only changes when a picture or the settings below change.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const DIRS = ["assets", "directions", "showroom", "sogdiana", "team", "urgut", "vatan", "yangi-urgut"];
/** Widths shipped; a picture also gets its own width (at most the last one) when it is narrower. */
const WIDTHS = [480, 828, 1200, 1680, 2400];
/** WebP quality: 86 keeps the texture of the renders (rain, facade grids) that AVIF at Next's setting lost. */
const QUALITY = 86;
const VERSION = `webp-q${QUALITY}-${WIDTHS.join(".")}`;
const CACHE = ".next/cache/img";
const OUT = "public/_img";
const MANIFEST = "src/lib/image-manifest.json";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const sources = [];
for (const d of DIRS) if (existsSync(`public/${d}`)) sources.push(...(await walk(`public/${d}`)));
// Full-size showroom panoramas go straight to the 360° viewer; pages only show their light (-m) copies.
const used = sources.filter((f) => !f.startsWith("public/showroom/") || f.endsWith("-m.jpg")).sort();

const manifest = {};
let encoded = 0;
async function one(file) {
  const buf = await readFile(file);
  const key = createHash("sha1").update(buf).update(VERSION).digest("hex").slice(0, 12);
  const meta = await sharp(buf).metadata();
  const max = Math.min(meta.width, WIDTHS.at(-1));
  const widths = [...new Set([...WIDTHS.filter((w) => w < max), max])];
  for (const w of widths) {
    const cached = path.join(CACHE, key, `${w}.webp`);
    if (!existsSync(cached)) {
      await mkdir(path.dirname(cached), { recursive: true });
      const png = meta.format === "png";
      await sharp(buf)
        .rotate()
        .resize({ width: w, kernel: "lanczos3", withoutEnlargement: true })
        .webp(png ? { quality: 92, alphaQuality: 100, effort: 5 } : { quality: QUALITY, effort: 5, smartSubsample: true })
        .toFile(cached);
      encoded++;
    }
    const out = path.join(OUT, key, `${w}.webp`);
    if (!existsSync(out)) {
      await mkdir(path.dirname(out), { recursive: true });
      await copyFile(cached, out);
    }
  }
  manifest["/" + path.relative("public", file).split(path.sep).join("/")] = { k: key, w: widths };
}

// A few pictures at a time; sharp itself uses several threads per picture.
const queue = [...used];
await Promise.all(Array.from({ length: Math.max(2, Math.floor(os.cpus().length / 2)) }, async () => { while (queue.length) await one(queue.shift()); }));

const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
const text = JSON.stringify(sorted, null, 1) + "\n";
const old = existsSync(MANIFEST) ? await readFile(MANIFEST, "utf8") : "";
if (old !== text) await writeFile(MANIFEST, text);
console.log(`images: ${used.length} pictures, ${encoded} files encoded${old !== text ? ", manifest updated" : ""}`);

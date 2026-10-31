// Copies a folder of renders into public/<target>, resized to at most 2400 px and re-encoded as JPEG,
// and prints the gallery entries (src, w, h) for src/lib/seed.ts.
// usage: node scripts/import-photos.mjs <source-dir> <public-subdir> [first-file]
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [src, target, first] = process.argv.slice(2);
const files = (await readdir(src)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (first) files.unshift(...files.splice(files.indexOf(first), 1));
const out = path.join("public", target);
await mkdir(out, { recursive: true });
const rows = [];
for (const [i, f] of files.entries()) {
  const name = `${String(i + 1).padStart(2, "0")}.jpg`;
  const info = await sharp(path.join(src, f)).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, name));
  rows.push([name, info.width, info.height, f]);
}
console.log(JSON.stringify(rows));

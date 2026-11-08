// Upscales the extracted hero frames ×2 with Apple's super-resolution (see upscale.swift), for sharper
// frames on large and Retina screens. Each frame is cut into two overlapping halves (the scaler takes at
// most 960 px), upscaled, joined with a soft seam, and given back the original's colour and tone: the
// scaler only adds detail, its YUV path shifts brightness a little.
// usage: node scripts/hero-frames/upscale.mjs <png-dir> <out-dir> <upscale-binary>
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [src, out, bin] = process.argv.slice(2);
if (!bin) throw new Error("usage: node scripts/hero-frames/upscale.mjs <png-dir> <out-dir> <upscale-binary>");
const files = readdirSync(src).filter((f) => f.endsWith(".png")).sort();
const { width: w, height: h } = await sharp(path.join(src, files[0])).metadata();
const OVERLAP = 100; // px in the source; the seam blends over twice that after upscaling
const half = Math.ceil(w / 2) + OVERLAP / 2; // width of each half
if (half > 960 || h > 960) throw new Error(`frame ${w}×${h} is too large for two tiles`);
const tiles = path.join(out, ".tiles"), up = path.join(out, ".up");
for (const d of [out, tiles, up]) mkdirSync(d, { recursive: true });

for (const f of files) {
  const n = f.replace(".png", "");
  await sharp(path.join(src, f)).extract({ left: 0, top: 0, width: half, height: h }).png().toFile(path.join(tiles, `${n}-L.png`));
  await sharp(path.join(src, f)).extract({ left: w - half, top: 0, width: half, height: h }).png().toFile(path.join(tiles, `${n}-R.png`));
}
execFileSync(bin, [tiles, up, "2"], { stdio: "inherit" });

const W = w * 2, H = h * 2, HW = half * 2, rStart = (w - half) * 2, seamFrom = rStart, seamTo = HW;
for (const f of files) {
  const n = f.replace(".png", "");
  const L = await sharp(path.join(up, `${n}-L.png`)).removeAlpha().raw().toBuffer();
  const R = await sharp(path.join(up, `${n}-R.png`)).removeAlpha().raw().toBuffer();
  const sr = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 3;
      if (x < seamFrom) L.copy(sr, o, (y * HW + x) * 3, (y * HW + x) * 3 + 3);
      else if (x >= seamTo) R.copy(sr, o, (y * HW + x - rStart) * 3, (y * HW + x - rStart) * 3 + 3);
      else {
        const t = (x - seamFrom) / (seamTo - seamFrom), i = (y * HW + x) * 3, j = (y * HW + x - rStart) * 3;
        for (let c = 0; c < 3; c++) sr[o + c] = Math.round(L[i + c] * (1 - t) + R[j + c] * t);
      }
    }
  }
  // detail from the upscale, colour and tone (everything below a 3 px blur) from the original
  const raw = { raw: { width: W, height: H, channels: 3 } };
  const base = await sharp(path.join(src, f)).removeAlpha().resize(W, H, { kernel: "lanczos3" }).raw().toBuffer();
  const blurSr = await sharp(sr, raw).blur(3).raw().toBuffer();
  const blurBase = await sharp(base, raw).blur(3).raw().toBuffer();
  for (let i = 0; i < sr.length; i++) sr[i] = Math.max(0, Math.min(255, sr[i] - blurSr[i] + blurBase[i]));
  await sharp(sr, raw).png({ compressionLevel: 3 }).toFile(path.join(out, f));
}
rmSync(tiles, { recursive: true, force: true });
rmSync(up, { recursive: true, force: true });
console.log(`${files.length} frames upscaled to ${W}×${H}`);

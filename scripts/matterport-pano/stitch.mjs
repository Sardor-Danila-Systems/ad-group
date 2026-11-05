import { readFileSync } from "node:fs";
import { sharp, loadRGB, sample, faceFiles, cubeSampler, renderEquirect } from "./lib.mjs";
const [dir, out, Warg] = process.argv.slice(2);
const W = Number(Warg || 4096), H = W / 2;
const meta = JSON.parse(readFileSync(`${dir}/hires/poses.json`, "utf8"));
const { f, mats } = JSON.parse(readFileSync(`${dir}/align.json`, "utf8"));
const photos = await Promise.all(meta.images.map((p) => loadRGB(p)));
// Optional exclude.json: {"<photo index>": [[x0, y0, x1, y1], ...]} — pixel boxes (in that photo) not to use,
// e.g. a person who walked into one shot; the other photos fill the spot where they see it.
let exclude = {};
try { exclude = JSON.parse(readFileSync(`${dir}/exclude.json`, "utf8")); } catch {}
/** 1 = use this pixel, 0 = skip it; boxes fade over 30 px at their edges so the swap leaves no seam. */
const keep = (k, px, py) => {
  let f = 1;
  for (const [x0, y0, x1, y1] of exclude[k] ?? []) {
    const d = Math.min(px - x0, x1 - px, py - y0, y1 - py);
    if (d > 0) f = Math.min(f, Math.max(0, 1 - d / 30));
  }
  return f;
};
const faces = await Promise.all(faceFiles(dir).map((p) => loadRGB(p)));
const poles = JSON.parse(readFileSync(`${dir}/poles.json`, "utf8"));
const fallback = cubeSampler(faces, poles.up, poles.down);
const acc = new Float64Array(3), tmp = new Float64Array(3), fb = new Float64Array(3);
const FEATHER = 260; // px at full resolution
const buf = renderEquirect(W, H, (rx, ry, rz, o) => {
  let wsum = 0, maxE = 0; acc[0] = acc[1] = acc[2] = 0;
  for (let k = 0; k < mats.length; k++) {
    const A = mats[k];
    const X = A[0] * rx + A[1] * ry + A[2] * rz, Y = A[3] * rx + A[4] * ry + A[5] * rz, Z = A[6] * rx + A[7] * ry + A[8] * rz;
    if (Z <= 0.05) continue;
    const P = photos[k];
    const px = (X / Z) * f + P.w / 2, py = (Y / Z) * f + P.h / 2;
    if (px < 0 || py < 0 || px >= P.w - 1 || py >= P.h - 1) continue;
    const kf = keep(k, px, py);
    if (kf === 0) continue;
    const e = Math.min(px, py, P.w - 1 - px, P.h - 1 - py) + 1;
    if (e > maxE) maxE = e;
    // strongly prefer the photo that sees this point closest to its centre: narrow seams, no ghosting
    const wgt = (e / 100) ** 6 * kf;
    sample(P, px, py, tmp, 0);
    acc[0] += tmp[0] * wgt; acc[1] += tmp[1] * wgt; acc[2] += tmp[2] * wgt; wsum += wgt;
  }
  const t = Math.min(1, maxE / FEATHER);
  if (t >= 1) { o[0] = acc[0] / wsum; o[1] = acc[1] / wsum; o[2] = acc[2] / wsum; return; }
  // near the edge of coverage (ceiling/floor centres) fade into Matterport's own fill
  fallback(rx, ry, rz, fb, 0);
  if (wsum === 0) { o[0] = fb[0]; o[1] = fb[1]; o[2] = fb[2]; return; }
  o[0] = (acc[0] / wsum) * t + fb[0] * (1 - t); o[1] = (acc[1] / wsum) * t + fb[1] * (1 - t); o[2] = (acc[2] / wsum) * t + fb[2] * (1 - t);
});
await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
console.log("ok", out);

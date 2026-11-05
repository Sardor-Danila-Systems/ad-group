import { readFileSync, writeFileSync } from "node:fs";
import { loadRGB } from "./lib.mjs";
const [dir] = process.argv.slice(2);
const meta = JSON.parse(readFileSync(`${dir}/hires/poses.json`, "utf8"));
const SC = 16;
const gray = (img) => { const g = new Float32Array(img.w * img.h); for (let i = 0; i < g.length; i++) g[i] = 0.299 * img.data[i * 3] + 0.587 * img.data[i * 3 + 1] + 0.114 * img.data[i * 3 + 2]; return { g, w: img.w, h: img.h }; };
const RW = 1024, RH = 512;
const R = gray(await loadRGB(`${dir}/ref.jpg`, RW, RH));
const photos = await Promise.all(meta.images.map(async (p) => gray(await loadRGB(p, 4032 / SC, 3024 / SC))));
// camera axes (rows) in ref space from optical-axis lon/lat and roll: ref -> cam
function axes(lon, lat, roll) {
  const f = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  const r = [Math.cos(lon), 0, -Math.sin(lon)];
  const u = [-Math.sin(lat) * Math.sin(lon), Math.cos(lat), -Math.sin(lat) * Math.cos(lon)];
  const c = Math.cos(roll), s = Math.sin(roll);
  const x = [0, 1, 2].map((i) => c * r[i] + s * u[i]);
  const y = [0, 1, 2].map((i) => -(-s * r[i] + c * u[i]));
  return [...x, ...y, ...f];
}
function score(P, A, f, step) {
  const fs = f / SC;
  let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
  for (let gy = 2; gy < P.h - 2; gy += step) for (let gx = 2; gx < P.w - 2; gx += step) {
    const x = (gx - P.w / 2) / fs, y = (gy - P.h / 2) / fs;
    const dx = A[0] * x + A[3] * y + A[6], dy = A[1] * x + A[4] * y + A[7], dz = A[2] * x + A[5] * y + A[8];
    const lat = Math.asin(dy / Math.hypot(dx, dy, dz));
    if (Math.abs(lat) > 1.0) continue;
    const lon = Math.atan2(dx, dz);
    const b = R.g[Math.min(RH - 1, (((Math.PI / 2 - lat) / Math.PI) * RH) | 0) * RW + Math.min(RW - 1, (((lon + Math.PI) / (2 * Math.PI)) * RW) | 0)];
    const a = P.g[gy * P.w + gx];
    n++; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b;
  }
  if (n < 40) return -1;
  const cov = sab / n - (sa / n) * (sb / n), va = saa / n - (sa / n) ** 2, vb = sbb / n - (sb / n) ** 2;
  return cov / Math.sqrt(va * vb + 1e-9);
}
const D = Math.PI / 180;
let f = Number(process.env.F || 1525);
const params = [];
for (let k = 0; k < photos.length; k++) {
  const P = photos[k];
  let best = { s: -2 };
  for (let lon = 0; lon < 360; lon += 4) for (let lat = -40; lat <= 40; lat += 4) for (let roll = 0; roll < 360; roll += 6) {
    const s = score(P, axes(lon * D, lat * D, roll * D), f, 9);
    if (s > best.s) best = { s, p: [lon * D, lat * D, roll * D] };
  }
  // refine
  let p = best.p;
  for (const st of [2, 1, 0.5, 0.25, 0.1].map((x) => x * D)) {
    for (let pass = 0; pass < 3; pass++) for (let i = 0; i < 3; i++) for (const d of [st, -st]) {
      for (;;) { const q = [...p]; q[i] += d; const s = score(P, axes(...q), f, 4); const cur = score(P, axes(...p), f, 4); if (s > cur + 1e-5) p = q; else break; }
    }
  }
  params.push(p);
  console.log(k, "lon", (p[0] / D).toFixed(1), "lat", (p[1] / D).toFixed(1), "roll", (p[2] / D).toFixed(1), "ncc", score(P, axes(...p), f, 4).toFixed(3));
}
// shared focal length, then a final small refinement
const total = () => params.reduce((s, p, k) => s + score(photos[k], axes(...p), f, 4), 0) / params.length;
for (const st of [60, 20, 5]) { for (const d of [st, -st]) { for (;;) { const t0 = total(); f += d; if (total() <= t0 + 1e-5) { f -= d; break; } } } }
for (let k = 0; k < params.length; k++) for (const st of [0.25, 0.1].map((x) => x * D)) for (let i = 0; i < 3; i++) for (const d of [st, -st]) {
  for (;;) { const q = [...params[k]]; q[i] += d; if (score(photos[k], axes(...q), f, 4) > score(photos[k], axes(...params[k]), f, 4) + 1e-5) params[k] = q; else break; }
}
console.log("f", f.toFixed(0), "per", params.map((p, k) => score(photos[k], axes(...p), f, 4).toFixed(3)).join(" "));
writeFileSync(`${dir}/align.json`, JSON.stringify({ f, mats: params.map((p) => axes(...p)), params }));

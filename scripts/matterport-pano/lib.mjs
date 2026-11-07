// Shared helpers for turning Matterport phone captures into panoramas (see README.md).
import { readdirSync } from "node:fs";
import sharpModule from "sharp";
export const sharp = sharpModule;

/**
 * Saves raw RGB pixels. A .png keeps every pixel (use it between steps, so stitching, turning and patching
 * do not stack JPEG losses); a .jpg is the final, high-quality file the site serves.
 */
export function saveRGB(data, width, height, out) {
  const img = sharp(data, { raw: { width, height, channels: 3 } });
  return (out.endsWith(".png") ? img.png({ compressionLevel: 3 }) : img.jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })).toFile(out);
}

export async function loadRGB(path, w, h) {
  let img = sharp(path);
  if (w) img = img.resize(w, h, { fit: "fill" });
  const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
export function faceFiles(dir) {
  const sp = readdirSync(dir).find((d) => !d.startsWith(".") && d !== "hires" && !d.includes("."));
  const sd = `${dir}/${sp}/SweepProcessorData`;
  return [0, 1, 2, 3, 4, 5].map((i) => `${sd}/${readdirSync(sd).find((f) => new RegExp(`^[0-9a-f]{8}-[0-9a-f-]+_skybox${i}\\.jpg$`).test(f))}`);
}
// bilinear sample, returns [r,g,b]
export function sample(img, x, y, out, o) {
  const { data, w, h } = img;
  x = Math.min(Math.max(x, 0), w - 1.001); y = Math.min(Math.max(y, 0), h - 1.001);
  const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0;
  const i00 = (y0 * w + x0) * 3, i10 = i00 + 3, i01 = i00 + w * 3, i11 = i01 + 3;
  for (let c = 0; c < 3; c++) {
    const a = data[i00 + c] * (1 - fx) + data[i10 + c] * fx;
    const b = data[i01 + c] * (1 - fx) + data[i11 + c] * fx;
    out[o + c] = a * (1 - fy) + b * fy;
  }
}
// face-local (u,v) in [-1,1] with orientation op (0..7: rot k*90, flip) -> pixel
export function orient(u, v, op) {
  if (op & 4) u = -u;
  for (let k = 0; k < (op & 3); k++) { const t = u; u = -v; v = t; }
  return [u, v];
}
/** Direction (y up, z forward at lon 0, x right) for a cube made of Matterport faces; returns sampler. */
export function cubeSampler(faces, upOp, downOp) {
  const S = faces[1].w;
  const lonc = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  return (dx, dy, dz, out, o) => {
    const ax = Math.abs(dx), ay = Math.abs(dy), az = Math.abs(dz);
    if (ay >= ax && ay >= az) {
      let u = dx / ay, v = (dy > 0 ? dz : -dz) / ay;
      [u, v] = orient(u, v, dy > 0 ? upOp : downOp);
      sample(dy > 0 ? faces[0] : faces[5], ((u + 1) / 2) * S, ((v + 1) / 2) * S, out, o);
      return;
    }
    // side faces: rotate direction so the face is in front
    const lon = Math.atan2(dx, dz);
    let k = Math.round(((lon < 0 ? lon + 2 * Math.PI : lon)) / (Math.PI / 2)) % 4;
    const a = -lonc[k];
    const x = dx * Math.cos(a) + dz * Math.sin(a), z = -dx * Math.sin(a) + dz * Math.cos(a);
    const u = x / z, v = -dy / z;
    sample(faces[1 + k], ((u + 1) / 2) * S, ((v + 1) / 2) * S, out, o);
  };
}
export function renderEquirect(W, H, fn) {
  const out = Buffer.alloc(W * H * 3);
  const tmp = new Float64Array(3);
  for (let y = 0; y < H; y++) {
    const lat = Math.PI / 2 - ((y + 0.5) / H) * Math.PI;
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let x = 0; x < W; x++) {
      const lon = ((x + 0.5) / W) * 2 * Math.PI - Math.PI;
      if (fn(cl * Math.sin(lon), sl, cl * Math.cos(lon), tmp, 0) === false) continue;
      const o = (y * W + x) * 3;
      out[o] = tmp[0]; out[o + 1] = tmp[1]; out[o + 2] = tmp[2];
    }
  }
  return out;
}

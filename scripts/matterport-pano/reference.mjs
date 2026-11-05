import { writeFileSync } from "node:fs";
import { sharp, loadRGB, faceFiles, cubeSampler, renderEquirect } from "./lib.mjs";
const [dir, out] = process.argv.slice(2);
const faces = await Promise.all(faceFiles(dir).map((f) => loadRGB(f)));
// Orientation of the ceiling and floor faces: it differs between captures, so it is found from seam
// continuity with the wall faces and saved for stitch.mjs.
const best = { up: 0, down: 0 };
{
  for (const which of ["up", "down"]) {
    let bestScore = Infinity;
    for (let op = 0; op < 8; op++) {
      const s = cubeSampler(faces, which === "up" ? op : 0, which === "down" ? op : 0);
      const a = new Float64Array(3), b = new Float64Array(3);
      let score = 0;
      for (let i = 0; i < 720; i++) {
        const lon = (i / 720) * 2 * Math.PI;
        // the cube edge between side and pole is at |y| = max(|x|,|z|); sample both sides of it
        const t = Math.max(Math.abs(Math.sin(lon)), Math.abs(Math.cos(lon)));
        const edgeLat = Math.atan(t);
        const sgn = which === "up" ? 1 : -1;
        for (const [lat, buf] of [[edgeLat + 0.02, a], [edgeLat - 0.02, b]]) {
          const l = sgn * lat;
          s(Math.cos(l) * Math.sin(lon), Math.sin(l), Math.cos(l) * Math.cos(lon), buf, 0);
        }
        score += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      }
      if (score < bestScore) { bestScore = score; best[which] = op; }
    }
  }
}
console.log("pole orientation", best);
writeFileSync(`${dir}/poles.json`, JSON.stringify(best));
const s = cubeSampler(faces, best.up, best.down);
const buf = renderEquirect(2048, 1024, s);
await sharp(buf, { raw: { width: 2048, height: 1024, channels: 3 } }).jpeg({ quality: 88 }).toFile(out);

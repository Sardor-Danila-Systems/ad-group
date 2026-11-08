// Evens out the motion of the hero video. The client's render repeats a frame every few frames and then
// jumps twice as far, which reads as a stutter when the video is played by the scroll (worst at the end,
// where the camera moves fast). This drops the repeated frames and fills every jump that is clearly
// larger than the motion around it with in-between frames from Apple's optical-flow interpolation
// (interpolate.swift), and gives the fast parts (the end) more frames, so no frame jumps far. Output frames are numbered 0000… again; set FRAME_COUNT in hero.tsx to their count.
// usage: node scripts/hero-frames/retime.mjs <png-dir> <out-dir> <interpolate-binary>
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [src, out, bin] = process.argv.slice(2);
if (!bin) throw new Error("usage: node scripts/hero-frames/retime.mjs <png-dir> <out-dir> <interpolate-binary>");
const files = readdirSync(src).filter((f) => f.endsWith(".png")).sort();
const thumb = (f) => sharp(path.join(src, f)).removeAlpha().resize(160, 114).greyscale().raw().toBuffer();
const diff = (a, b) => { let d = 0; for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k]); return d / a.length; };

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };
/** Largest motion one frame may show (mean grey difference of 160 px thumbnails); faster parts get more frames. */
const MAX_STEP = 1.5;

// 1. Drop frames that barely differ from the last kept one (a repeat, relative to the motion around it).
const thumbs = await Promise.all(files.map(thumb));
const raw = thumbs.slice(1).map((t, i) => diff(thumbs[i], t));
const kept = [0];
for (let i = 1; i < files.length; i++) {
  const around = median(raw.slice(Math.max(0, i - 7), i + 6));
  if (diff(thumbs[i], thumbs[kept.at(-1)]) >= Math.max(0.5, 0.35 * around) || i === files.length - 1) kept.push(i);
}

// 2. Motion between kept frames, and the usual motion around each step (median of its neighbours).
const steps = kept.slice(1).map((k, j) => diff(thumbs[kept[j]], thumbs[k]));
const plan = []; // [from, to, phase] or [frame]
const jobs = [];
const work = path.join(out, ".mid");
rmSync(out, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
let inserted = 0;
for (let j = 0; j < kept.length; j++) {
  plan.push({ frame: kept[j] });
  if (j === kept.length - 1) break;
  const local = median(steps.slice(Math.max(0, j - 6), j + 7));
  // A jump clearly larger than the motion around it, or larger than MAX_STEP, gets in-between frames.
  const n = Math.max(steps[j] / local >= 1.6 ? Math.round(steps[j] / local) - 1 : 0, steps[j] > MAX_STEP * 1.15 ? Math.ceil(steps[j] / MAX_STEP) - 1 : 0);
  for (let m = 1; m <= n; m++) {
    const name = path.join(work, `${kept[j]}-${m}.png`);
    jobs.push(`${path.join(src, files[kept[j]])} ${path.join(src, files[kept[j + 1]])} ${(m / (n + 1)).toFixed(4)} ${name}`);
    plan.push({ mid: name });
    inserted++;
  }
}
if (jobs.length) {
  writeFileSync(path.join(work, "jobs.txt"), jobs.join("\n"));
  execFileSync(bin, [path.join(work, "jobs.txt")], { stdio: "inherit" });
}
plan.forEach((p, i) => copyFileSync(p.mid ?? path.join(src, files[p.frame]), path.join(out, `${String(i).padStart(4, "0")}.png`)));
rmSync(work, { recursive: true, force: true });
console.log(`${files.length} frames → dropped ${files.length - kept.length} repeats, added ${inserted} in-betweens → ${plan.length} frames`);

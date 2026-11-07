import { saveRGB, sharp } from "./lib.mjs";
// Covers a box of a panorama with a copy of a nearby box (soft edges), e.g. to remove a person.
// usage: node patch.mjs <in> <out> <x> <y> <w> <h> <dx> <dy> [feather=10]   (source box = target + (dx, dy))
const [inp, out, ...n] = process.argv.slice(2);
const [x, y, w, h, dx, dy, feather = 10] = n.map(Number);
const { data, info } = await sharp(inp).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const res = Buffer.from(data);
for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
  const e = Math.min(i, j, w - 1 - i, h - 1 - j);
  const a = Math.min(1, e / feather);
  const t = ((y + j) * W + (x + i)) * 3, s = ((y + dy + j) * W + (x + dx + i)) * 3;
  for (let c = 0; c < 3; c++) res[t + c] = Math.round(data[s + c] * a + data[t + c] * (1 - a));
}
await saveRGB(res, W, info.height, out);
console.log("patched", out);

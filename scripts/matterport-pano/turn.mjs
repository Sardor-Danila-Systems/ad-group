import { sharp } from "./lib.mjs";
// Turns an equirectangular panorama by `deg` degrees: what was at yaw y ends up at yaw y + deg.
const [inp, out, degArg] = process.argv.slice(2);
const deg = Number(degArg);
const { data, info } = await sharp(inp).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const shift = Math.round((((deg % 360) + 360) % 360) / 360 * W);
const res = Buffer.alloc(data.length);
for (let y = 0; y < H; y++) {
  const row = y * W * 3;
  // new[x] = old[x - shift]
  data.copy(res, row + shift * 3, row, row + (W - shift) * 3);
  data.copy(res, row, row + (W - shift) * 3, row + W * 3);
}
await sharp(res, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
console.log(out, deg, shift);

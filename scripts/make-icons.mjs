// Makes the site icons from the AD Group mark (the "ΛD" of public/assets/logo-ad-gold.png, traced to a path):
//   src/app/icon.svg          browser tab, any size (Next adds <link rel="icon" type="image/svg+xml">)
//   src/app/favicon.ico       16, 32 and 48 px, served at the stable /favicon.ico (Google results, old browsers)
//   src/app/apple-icon.png    180×180, iPhone "Add to Home Screen" (iOS rounds the corners itself)
//   public/icons/icon-*.png   192 and 512 for the web manifest (src/app/manifest.ts), plus a maskable 512
// Run `node scripts/make-icons.mjs` after changing the mark or the colours; the outputs are committed.
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const INK = "#1c1915"; // --ink in globals.css
const GOLD = "#b8924f"; // --gold, the colour of the logo
/** The mark, 310.6 × 158 units, traced from logo-ad-gold.png (outline within half a pixel of the original). */
const MARK =
  "M76.8 0H111L187.8 158H153.3L93.9 35.75L34.4 158H0Z" +
  "M143.2 0H230C274.3 0 310.6 19.75 310.6 79C310.6 142.2 269.5 158 236 158H211.25L199 133.5H236C252.3 133.5 282.5 125.3 282.5 79C282.5 46.3 266.75 24.5 230 24.5H155.55Z";
const MARK_W = 310.6;
const MARK_H = 158;

/**
 * Square icon on a 512 grid: the mark `width` units wide, centred, gold on ink.
 * `radius` rounds the background (0 for icons the platform masks itself).
 */
function svg({ width, radius }) {
  const k = width / MARK_W;
  const x = (512 - width) / 2;
  const y = (512 - MARK_H * k) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">` +
    `<rect width="512" height="512" rx="${radius}" fill="${INK}"/>` +
    `<path transform="translate(${+x.toFixed(2)} ${+y.toFixed(2)}) scale(${+k.toFixed(5)})" d="${MARK}" fill="${GOLD}"/>` +
    `</svg>\n`
  );
}

// Tab icon: rounded square, the mark fills most of it so it stays readable at 16 px.
const tab = svg({ width: 432, radius: 96 });
// Home-screen icons: full square (the platform cuts the corners), more room around the mark.
const home = svg({ width: 360, radius: 0 });
// Maskable: the mark inside the central 80 % circle Android may crop to.
const maskable = svg({ width: 300, radius: 0 });

const png = (s, size) => sharp(Buffer.from(s), { density: 72 * (size / 512) * 4 }).resize(size, size).png().toBuffer();

/** ICO with PNG entries (supported by every current browser and by Google's favicon crawler). */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2); // no palette
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

await mkdir("public/icons", { recursive: true });
await writeFile("src/app/icon.svg", tab);
await writeFile(
  "src/app/favicon.ico",
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tab, size) })))),
);
await writeFile("src/app/apple-icon.png", await png(home, 180));
await writeFile("public/icons/icon-192.png", await png(home, 192));
await writeFile("public/icons/icon-512.png", await png(home, 512));
await writeFile("public/icons/icon-maskable-512.png", await png(maskable, 512));
console.log("icons written");

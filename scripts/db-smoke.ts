/** Writes a throw-away project with a photo to the real database, or removes it. Run: npm run db:smoke -- up|down */
import sharp from "sharp";
import { pgStore as s } from "../src/lib/server/pg-store";

async function main() {
  if (process.argv[2] === "down") {
    await s.deleteProject("smoke-test");
    console.log("removed");
    process.exit(0);
  }
  const png = await sharp({ create: { width: 400, height: 300, channels: 3, background: "#b8924f" } }).png().toBuffer();
  const img = await s.saveImage(new File([new Uint8Array(png)], "smoke.png", { type: "image/png" }));
  const base = (await s.loadContent()).projects[0];
  await s.saveProject({ ...base, id: "smoke-test", featured: false, name: { ru: "Smoke", uz: "Smoke", en: "Smoke" }, cover: img.src, gallery: [] });
  console.log(img.src);
  process.exit(0);
}
main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});

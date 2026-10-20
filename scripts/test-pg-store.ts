/**
 * Exercises the Postgres store against an in-memory Postgres (PGlite), no external database needed.
 * Run: npm run test:store
 */
import { strict as assert } from "node:assert";
import { PGlite } from "@electric-sql/pglite";
import sharp from "sharp";
import { __useDb, type Db } from "../src/lib/server/db";
import { pgStore as s } from "../src/lib/server/pg-store";

async function main() {
const pg = new PGlite();
const rows = (r: { rows: unknown[]; affectedRows?: number }) => ({ rows: r.rows as never[], rowCount: r.affectedRows ?? r.rows.length });
const adapter: Db = {
  query: async (t, p) => rows(await pg.query(t, p)),
  exec: async (t) => void (await pg.exec(t)),
  tx: (fn) => pg.transaction((tx) => fn(async (t, p) => rows(await tx.query(t, p)))),
};
__useDb(adapter);

const step = async (name: string, fn: () => Promise<void>) => {
  await fn();
  console.log("ok  ", name);
};

await step("seeds on first load", async () => {
  const c = await s.loadContent();
  assert.deepEqual(c.projects.map((p) => p.id), ["vatan", "urgut-tower"]);
  assert.equal(c.vacancies.length, 3);
  assert.equal(c.news.length, 3);
  assert.ok(c.settings.founder.name.ru);
});

await step("concurrent first loads seed once", async () => {
  const again = await s.loadContent();
  assert.equal(again.projects.length, 2);
});

await step("project upsert and delete (no reseed after delete)", async () => {
  const c = await s.loadContent();
  const p = { ...c.projects[1], id: "test-project", name: { ru: "Тест", uz: "Test", en: "Test" } };
  await s.saveProject(p);
  assert.equal((await s.loadContent()).projects.length, 3);
  await s.saveProject({ ...p, desc: { ru: "Новое", uz: "Yangi", en: "New" } });
  const after = (await s.loadContent()).projects;
  assert.equal(after.length, 3);
  assert.equal(after[2].desc.ru, "Новое");
  await s.deleteProject("test-project");
  await s.deleteProject("vatan");
  assert.deepEqual((await s.loadContent()).projects.map((x) => x.id), ["urgut-tower"]);
});

await step("images: save, read, remove with the project", async () => {
  const png = await sharp({ create: { width: 64, height: 48, channels: 3, background: "#b8924f" } }).png().toBuffer();
  const saved = await s.saveImage(new File([new Uint8Array(png)], "x.png", { type: "image/png" }));
  assert.match(saved.src, /^\/uploads\/[\w-]+\.webp$/);
  assert.equal(saved.w, 64);
  const name = saved.src.replace("/uploads/", "");
  const data = await s.readUpload(name);
  assert.ok(data && data.length > 0);
  assert.equal((await sharp(data).metadata()).format, "webp");
  const c = await s.loadContent();
  await s.saveProject({ ...c.projects[0], id: "with-photo", cover: saved.src });
  await s.deleteProject("with-photo");
  assert.equal(await s.readUpload(name), null);
  assert.equal(await s.readUpload("../etc/passwd"), null);
  await assert.rejects(() => s.saveImage(new File(["not an image"], "x.txt", { type: "text/plain" })));
});

await step("news, vacancies, settings", async () => {
  await s.saveNews({ id: "n9", date: "2026-10-21", title: { ru: "a", uz: "a", en: "a" }, text: { ru: "b", uz: "b", en: "b" } });
  assert.equal((await s.loadContent()).news.length, 4);
  await s.deleteNews("n9");
  const c = await s.loadContent();
  await s.saveVacancy({ ...c.vacancies[0], id: "v-new", open: false });
  assert.equal((await s.loadContent()).vacancies.find((v) => v.id === "v-new")?.open, false);
  await s.deleteVacancy("v-new");
  await s.saveSettings({ ...c.settings, contacts: { ...c.settings.contacts, phone: "+998 90 111 22 33" } });
  assert.equal((await s.loadContent()).settings.contacts.phone, "+998 90 111 22 33");
});

await step("leads", async () => {
  await s.addLead({ name: "Тест", phone: "+998 90 000 00 00", interest: "Vatan", message: "m", source: "popup" });
  await s.addLead({ name: "Второй", phone: "+998 91 000 00 00", interest: "", message: "", source: "home" });
  const leads = await s.listLeads();
  assert.equal(leads.length, 2);
  assert.ok(leads[0].createdAt.endsWith("Z"));
  await s.deleteLead(leads[0].id);
  assert.equal((await s.listLeads()).length, 1);
});

console.log("all passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

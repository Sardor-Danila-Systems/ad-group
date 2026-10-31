/**
 * Data migrations against an old-shaped database (in-memory Postgres) and an old content.json.
 * Run: npm run test:migrations
 */
import { strict as assert } from "node:assert";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { __useDb, type Db } from "../src/lib/server/db";
import { SEED_NEWS, SEED_PROJECTS, SEED_SETTINGS, SEED_VACANCIES } from "../src/lib/seed";

const OLD = (s: string) => s.replace(/AD Group/g, "AD Express"); // pretend the stored data predates the rename
const step = async (name: string, fn: () => Promise<void>) => {
  await fn();
  console.log("ok  ", name);
};

async function main() {
  // The state of a database created before DEV-39/DEV-41: two projects, the second called Urgut Tower with /urgut/ renders.
  const sog = SEED_PROJECTS.find((p) => p.id === "sogdiana-diamond-house")!;
  const oldUrgut = {
    ...JSON.parse(OLD(JSON.stringify(sog)).replace(/Sogdiana Diamond House/g, "Urgut Tower").replace(/\/sogdiana\//g, "/urgut/")),
    id: "urgut-tower",
    logo: "/urgut/logo.jpg",
  };
  const oldProjects = [SEED_PROJECTS.find((p) => p.id === "vatan")!, oldUrgut];
  const oldNews = JSON.parse(OLD(JSON.stringify(SEED_NEWS)).replace(/New project: Sogdiana Diamond House/, "New project: Urgut Tower"));

  await step("postgres: an old database is migrated once, edits made later survive", async () => {
    const pg = new PGlite();
    const rows = (r: { rows: unknown[]; affectedRows?: number }) => ({ rows: r.rows as never[], rowCount: r.affectedRows ?? r.rows.length });
    const adapter: Db = {
      query: async (t, p) => rows(await pg.query(t, p)),
      exec: async (t) => void (await pg.exec(t)),
      tx: (fn) => pg.transaction((tx) => fn(async (t, p) => rows(await tx.query(t, p)))),
    };
    // Shape of a database created before migrations existed: seeded, no "migrations" key.
    await pg.exec(`
      create table meta (key text primary key, value text not null);
      create table projects (id text primary key, data jsonb not null, created_at timestamptz not null default clock_timestamp());
      create table news (id text primary key, data jsonb not null, created_at timestamptz not null default clock_timestamp());
      create table vacancies (id text primary key, data jsonb not null, created_at timestamptz not null default clock_timestamp());
      create table settings (id int primary key check (id = 1), data jsonb not null);
      insert into meta values ('seeded', '1');`);
    for (const [i, p] of oldProjects.entries()) await pg.query("insert into projects values ($1, $2, now() + $3 * interval '1 second')", [p.id, JSON.stringify(p), i]);
    for (const [i, n] of oldNews.entries()) await pg.query("insert into news values ($1, $2, now() + $3 * interval '1 second')", [n.id, JSON.stringify(n), i]);
    for (const [i, v] of SEED_VACANCIES.entries()) await pg.query("insert into vacancies values ($1, $2, now() + $3 * interval '1 second')", [v.id, JSON.stringify(v), i]);
    await pg.query("insert into settings values (1, $1)", [JSON.stringify(SEED_SETTINGS)]);
    __useDb(adapter);
    const { pgStore: s } = await import("../src/lib/server/pg-store");

    const c = await s.loadContent();
    const all = JSON.stringify(c);
    assert.ok(!all.includes("AD Express"), "no AD Express left");
    assert.ok(!all.includes("AD Group (AD Group)"));
    assert.deepEqual(c.projects.map((p) => p.id), ["vatan", "sogdiana-diamond-house", "urgut-tower", "yangi-urgut-tower"], "renamed and new projects in order");
    const sd = c.projects.find((p) => p.id === "sogdiana-diamond-house")!;
    assert.equal(sd.name.ru, "Sogdiana Diamond House");
    assert.ok(sd.gallery.length === 8 && sd.gallery.every((g) => g.src.startsWith("/sogdiana/")) && sd.cover === "/sogdiana/01.jpg", "renders moved");
    assert.equal(sd.logo, undefined, "old logo dropped");
    assert.ok(!JSON.stringify(sd).includes("Urgut"), "no Urgut left in the renamed card");
    const ut = c.projects.find((p) => p.id === "urgut-tower")!;
    assert.equal(ut.gallery.length, 0, "new Urgut Tower is a separate, empty card");
    assert.equal(c.news.find((n) => n.id === "n2")?.title.en, "New project: Sogdiana Diamond House");
    assert.equal(c.news.length, oldNews.length);

    // A later edit that mentions the old name is not touched again.
    await s.saveNews({ ...c.news[0], text: { ru: "AD Express", uz: "AD Express", en: "AD Express" } });
    const again = await s.loadContent();
    assert.equal(again.news.find((n) => n.id === c.news[0].id)?.text.ru, "AD Express");
    const meta = (await pg.query<{ value: string }>("select value from meta where key = 'migrations'")).rows[0].value;
    assert.ok(JSON.parse(meta).length >= 1);
  });

  await step("file store: an old content.json is migrated and written back", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "adg-"));
    process.env.DATA_DIR = dir;
    await writeFile(path.join(dir, "content.json"), JSON.stringify({ version: 2, projects: oldProjects, news: oldNews, vacancies: SEED_VACANCIES, settings: SEED_SETTINGS }));
    const { fileStore } = await import("../src/lib/server/file-store");
    const c = await fileStore.loadContent();
    assert.ok(!JSON.stringify(c).includes("AD Express"));
    const disk = JSON.parse(await readFile(path.join(dir, "content.json"), "utf8"));
    assert.ok(Array.isArray(disk.migrations) && disk.migrations.length >= 1, "applied list persisted");
    assert.ok(!JSON.stringify(disk).includes("AD Express"));
  });

  console.log("all passed");
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

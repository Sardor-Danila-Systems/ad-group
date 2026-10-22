import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/server/db";
import { isUploadName, processImage, type ImageKind } from "@/lib/server/images";
import type { Content, Store } from "@/lib/server/types";
import { SEED_NEWS, SEED_PROJECTS, SEED_SETTINGS, SEED_VACANCIES } from "@/lib/seed";
import { upgradeSettings } from "@/lib/settings-upgrade";
import type { Lead, NewsItem, Project, Settings, Vacancy } from "@/lib/types";

/**
 * Postgres storage (Neon). Documents are kept as jsonb rows, one row per project / news item / vacancy,
 * so saving one thing never overwrites another. Uploaded photos live in a bytea table and are served by /uploads/[name].
 */
const SCHEMA = `
create table if not exists meta (key text primary key, value text not null);
create table if not exists projects (id text primary key, data jsonb not null, created_at timestamptz not null default clock_timestamp());
create table if not exists news (id text primary key, data jsonb not null, created_at timestamptz not null default clock_timestamp());
create table if not exists vacancies (id text primary key, data jsonb not null, created_at timestamptz not null default clock_timestamp());
create table if not exists settings (id int primary key check (id = 1), data jsonb not null);
create table if not exists leads (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  interest text not null default '',
  message text not null default '',
  source text not null default ''
);
create index if not exists leads_created_idx on leads (created_at desc);
create table if not exists uploads (name text primary key, data bytea not null, size int not null, created_at timestamptz not null default now());
`;

let ready: Promise<void> | undefined;

/** Creates tables and seeds them exactly once (the first caller to claim the `seeded` flag does it, in a transaction). */
function ensure(): Promise<void> {
  ready ??= (async () => {
    await db.exec(SCHEMA);
    await db.tx(async (q) => {
      const claimed = await q("insert into meta (key, value) values ('seeded', '1') on conflict (key) do nothing returning key");
      if (claimed.rowCount === 0) return;
      // Explicit one-millisecond steps keep the seed order stable even when the clock does not tick between inserts.
      const seed = async (table: "projects" | "news" | "vacancies", items: { id: string }[]) => {
        for (const [i, item] of items.entries()) {
          await q(`insert into ${table} (id, data, created_at) values ($1, $2, clock_timestamp() + $3 * interval '1 millisecond') on conflict (id) do nothing`, [item.id, JSON.stringify(item), i]);
        }
      };
      await seed("projects", SEED_PROJECTS);
      await seed("news", SEED_NEWS);
      await seed("vacancies", SEED_VACANCIES);
      await q("insert into settings (id, data) values (1, $1) on conflict (id) do nothing", [JSON.stringify(SEED_SETTINGS)]);
    });
  })().catch((e) => {
    ready = undefined; // retry on the next request instead of caching a failure
    throw e;
  });
  return ready;
}

const docs = async <T>(table: "projects" | "news" | "vacancies"): Promise<T[]> =>
  (await db.query<{ data: T }>(`select data from ${table} order by created_at, id`)).rows.map((r) => r.data);

async function upsert(table: "projects" | "news" | "vacancies", id: string, data: unknown) {
  await ensure();
  await db.query(`insert into ${table} (id, data) values ($1, $2) on conflict (id) do update set data = excluded.data`, [id, JSON.stringify(data)]);
}

export async function loadContent(): Promise<Content> {
  await ensure();
  const [projects, news, vacancies, settings] = await Promise.all([
    docs<Project>("projects"),
    docs<NewsItem>("news"),
    docs<Vacancy>("vacancies"),
    db.query<{ data: Settings }>("select data from settings where id = 1"),
  ]);
  const stored = settings.rows[0]?.data;
  if (!stored) return { version: 2, projects, news, vacancies, settings: structuredClone(SEED_SETTINGS) };
  const { settings: upgraded, changed } = upgradeSettings(stored);
  if (changed) await db.query("update settings set data = $1 where id = 1", [JSON.stringify(upgraded)]); // persist the migration once
  return { version: 2, projects, news, vacancies, settings: upgraded };
}

export async function removeUploads(srcs: (string | undefined)[]) {
  const names = srcs.filter((s): s is string => Boolean(s?.startsWith("/uploads/"))).map((s) => s.slice("/uploads/".length)).filter(isUploadName);
  if (names.length === 0) return;
  await ensure();
  await db.query("delete from uploads where name = any($1::text[])", [names]);
}

export async function saveImage(file: File, kind: ImageKind = "photo"): Promise<{ src: string; w: number; h: number }> {
  const img = await processImage(file, kind);
  await ensure();
  await db.query("insert into uploads (name, data, size) values ($1, $2, $3)", [img.name, img.data, img.data.length]);
  return { src: `/uploads/${img.name}`, w: img.w, h: img.h };
}

export async function readUpload(name: string): Promise<Buffer | null> {
  if (!isUploadName(name)) return null;
  await ensure();
  const r = await db.query<{ data: Buffer | Uint8Array }>("select data from uploads where name = $1", [name]);
  const row = r.rows[0];
  return row ? Buffer.from(row.data) : null;
}

export const pgStore: Store = {
  loadContent,
  saveProject: (p) => upsert("projects", p.id, p),
  async deleteProject(id) {
    await ensure();
    const old = (await db.query<{ data: Project }>("delete from projects where id = $1 returning data", [id])).rows[0]?.data;
    if (old) await removeUploads([old.cover, old.logo, ...old.gallery.map((g) => g.src), ...(old.showroom ?? []).map((sc) => sc.image)]);
  },
  saveNews: (n) => upsert("news", n.id, n),
  async deleteNews(id) {
    await ensure();
    const old = (await db.query<{ data: NewsItem }>("delete from news where id = $1 returning data", [id])).rows[0]?.data;
    if (old) await removeUploads([old.image]);
  },
  saveVacancy: (v) => upsert("vacancies", v.id, v),
  async deleteVacancy(id) {
    await ensure();
    await db.query("delete from vacancies where id = $1", [id]);
  },
  async saveSettings(settings) {
    await ensure();
    const prev = (await db.query<{ data: Settings }>("select data from settings where id = 1")).rows[0]?.data;
    const old = [prev?.founder?.photo, prev?.ceo?.photo];
    await db.query("insert into settings (id, data) values (1, $1) on conflict (id) do update set data = excluded.data", [JSON.stringify(settings)]);
    await removeUploads(old.filter((o) => o && o !== settings.founder.photo && o !== settings.ceo.photo));
  },
  async listLeads() {
    await ensure();
    const r = await db.query<{ id: string; created_at: Date | string; name: string; phone: string; interest: string; message: string; source: string }>(
      "select id, created_at, name, phone, interest, message, source from leads order by created_at desc, id",
    );
    return r.rows.map((l): Lead => ({ id: l.id, createdAt: new Date(l.created_at).toISOString(), name: l.name, phone: l.phone, interest: l.interest, message: l.message, source: l.source }));
  },
  async addLead(input) {
    await ensure();
    await db.query("insert into leads (id, name, phone, interest, message, source) values ($1, $2, $3, $4, $5, $6)", [
      randomBytes(6).toString("hex"), input.name, input.phone, input.interest, input.message, input.source,
    ]);
  },
  async deleteLead(id) {
    await ensure();
    await db.query("delete from leads where id = $1", [id]);
  },
  saveImage,
  removeUploads,
  readUpload,
};

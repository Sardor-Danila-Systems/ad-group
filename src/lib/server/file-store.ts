import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isUploadName, processImage } from "@/lib/server/images";
import type { Content, Store } from "@/lib/server/types";
import { SEED_NEWS, SEED_PROJECTS, SEED_SETTINGS, SEED_VACANCIES } from "@/lib/seed";
import type { Lead, NewsItem, Project, Settings, Vacancy } from "@/lib/types";

/**
 * File-based storage: content.json, leads.json and uploads/ under DATA_DIR.
 * Needs a persistent disk (VPS, Docker volume). Swap this module for a database
 * and object storage to deploy on serverless hosting.
 */
const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");

const CONTENT_VERSION = 2;

function seedContent(): Content {
  return structuredClone({ version: CONTENT_VERSION, projects: SEED_PROJECTS, news: SEED_NEWS, vacancies: SEED_VACANCIES, settings: SEED_SETTINGS });
}

// Serialises writes so concurrent admin actions cannot clobber each other.
let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(/*turbopackIgnore: true*/ DATA_DIR, file), "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw e;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(/*turbopackIgnore: true*/ DATA_DIR, file);
  const tmp = `${target}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

/** Reads content.json, creating it from the seed on first run (and migrating an older shape). Call inside the lock. */
async function readOrInit(): Promise<Content> {
  let existing: Partial<Content> | null = null;
  try {
    existing = JSON.parse(await fs.readFile(path.join(/*turbopackIgnore: true*/ DATA_DIR, "content.json"), "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
  if (existing?.version === CONTENT_VERSION) return existing as Content;

  if (existing) {
    // Older shape: keep a copy so nothing is lost, then start from the current seed.
    try {
      await fs.copyFile(path.join(/*turbopackIgnore: true*/ DATA_DIR, "content.json"), path.join(/*turbopackIgnore: true*/ DATA_DIR, `content.v${existing.version ?? 1}.${Date.now()}.bak.json`));
    } catch {}
  }
  const fresh = seedContent();
  try {
    await writeJson("content.json", fresh);
  } catch {
    // Read-only disk (for example during a build): serve the seed without persisting it.
  }
  return fresh;
}

export function loadContent(): Promise<Content> {
  return exclusive(readOrInit);
}

export function saveProject(project: Project) {
  return exclusive(async () => {
    const c = await readOrInit();
    const i = c.projects.findIndex((p) => p.id === project.id);
    if (i === -1) c.projects.push(project);
    else c.projects[i] = project;
    await writeJson("content.json", c);
  });
}

export function deleteProject(id: string) {
  return exclusive(async () => {
    const c = await readOrInit();
    const removed = c.projects.find((p) => p.id === id);
    c.projects = c.projects.filter((p) => p.id !== id);
    await writeJson("content.json", c);
    if (removed) await removeUploads([removed.cover, removed.logo, ...removed.gallery.map((g) => g.src)]);
  });
}

export function saveNews(item: NewsItem) {
  return exclusive(async () => {
    const c = await readOrInit();
    const i = c.news.findIndex((n) => n.id === item.id);
    if (i === -1) c.news.push(item);
    else c.news[i] = item;
    await writeJson("content.json", c);
  });
}

export function deleteNews(id: string) {
  return exclusive(async () => {
    const c = await readOrInit();
    const removed = c.news.find((n) => n.id === id);
    c.news = c.news.filter((n) => n.id !== id);
    await writeJson("content.json", c);
    if (removed) await removeUploads([removed.image]);
  });
}

export function saveVacancy(item: Vacancy) {
  return exclusive(async () => {
    const c = await readOrInit();
    const i = c.vacancies.findIndex((v) => v.id === item.id);
    if (i === -1) c.vacancies.push(item);
    else c.vacancies[i] = item;
    await writeJson("content.json", c);
  });
}

export function deleteVacancy(id: string) {
  return exclusive(async () => {
    const c = await readOrInit();
    c.vacancies = c.vacancies.filter((v) => v.id !== id);
    await writeJson("content.json", c);
  });
}

export function saveSettings(settings: Settings) {
  return exclusive(async () => {
    const c = await readOrInit();
    const old = c.settings.founder.photo;
    c.settings = settings;
    await writeJson("content.json", c);
    if (old && old !== settings.founder.photo) await removeUploads([old]);
  });
}

export async function listLeads(): Promise<Lead[]> {
  const leads = await readJson<Lead[]>("leads.json", []);
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addLead(input: Omit<Lead, "id" | "createdAt">) {
  return exclusive(async () => {
    const leads = await readJson<Lead[]>("leads.json", []);
    leads.push({ ...input, id: randomBytes(6).toString("hex"), createdAt: new Date().toISOString() });
    await writeJson("leads.json", leads);
  });
}

export function deleteLead(id: string) {
  return exclusive(async () => {
    const leads = await readJson<Lead[]>("leads.json", []);
    await writeJson("leads.json", leads.filter((l) => l.id !== id));
  });
}

/* ---------- uploads ---------- */

export async function saveImage(file: File): Promise<{ src: string; w: number; h: number }> {
  const img = await processImage(file);
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, img.name), img.data);
  return { src: `/uploads/${img.name}`, w: img.w, h: img.h };
}

export async function removeUploads(srcs: (string | undefined)[]) {
  for (const src of srcs) {
    if (!src?.startsWith("/uploads/")) continue;
    const name = path.basename(src);
    if (isUploadName(name)) await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), { force: true });
  }
}

export async function readUpload(name: string): Promise<Buffer | null> {
  if (!isUploadName(name)) return null;
  try {
    return await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
  } catch {
    return null;
  }
}

export const fileStore: Store = {
  loadContent, saveProject, deleteProject, saveNews, deleteNews, saveVacancy, deleteVacancy, saveSettings,
  listLeads, addLead, deleteLead, saveImage, removeUploads, readUpload,
};

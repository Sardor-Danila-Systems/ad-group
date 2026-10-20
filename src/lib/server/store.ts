import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp, { type OutputInfo } from "sharp";
import { SEED_NEWS, SEED_PROJECTS } from "@/lib/seed";
import type { Lead, NewsItem, Project } from "@/lib/types";

/**
 * File-based storage: content.json, leads.json and uploads/ under DATA_DIR.
 * Needs a persistent disk (VPS, Docker volume). Swap this module for a database
 * and object storage to deploy on serverless hosting.
 */
const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");

interface Content {
  projects: Project[];
  news: NewsItem[];
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

export async function loadContent(): Promise<Content> {
  return readJson<Content>("content.json", { projects: SEED_PROJECTS, news: SEED_NEWS });
}

export function saveProject(project: Project) {
  return exclusive(async () => {
    const c = await loadContent();
    const i = c.projects.findIndex((p) => p.id === project.id);
    if (i === -1) c.projects.push(project);
    else c.projects[i] = project;
    await writeJson("content.json", c);
  });
}

export function deleteProject(id: string) {
  return exclusive(async () => {
    const c = await loadContent();
    const removed = c.projects.find((p) => p.id === id);
    c.projects = c.projects.filter((p) => p.id !== id);
    await writeJson("content.json", c);
    if (removed) await removeUploads([removed.cover, ...removed.gallery.map((g) => g.src)]);
  });
}

export function saveNews(item: NewsItem) {
  return exclusive(async () => {
    const c = await loadContent();
    const i = c.news.findIndex((n) => n.id === item.id);
    if (i === -1) c.news.push(item);
    else c.news[i] = item;
    await writeJson("content.json", c);
  });
}

export function deleteNews(id: string) {
  return exclusive(async () => {
    const c = await loadContent();
    const removed = c.news.find((n) => n.id === id);
    c.news = c.news.filter((n) => n.id !== id);
    await writeJson("content.json", c);
    if (removed) await removeUploads([removed.image]);
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

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 12 * 1024 * 1024;

export class UploadError extends Error {}

/** Validates, strips metadata, caps the size and stores an image as WebP. Returns its public URL and size. */
export async function saveImage(file: File): Promise<{ src: string; w: number; h: number }> {
  if (!ALLOWED.has(file.type)) throw new UploadError("type");
  if (file.size > MAX_BYTES) throw new UploadError("size");
  const input = Buffer.from(await file.arrayBuffer());
  let out: { data: Buffer; info: OutputInfo };
  try {
    out = await sharp(input).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  } catch {
    throw new UploadError("decode");
  }
  const name = `${Date.now().toString(36)}-${randomBytes(5).toString("hex")}.webp`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), out.data);
  return { src: `/uploads/${name}`, w: out.info.width, h: out.info.height };
}

export async function removeUploads(srcs: (string | undefined)[]) {
  for (const src of srcs) {
    if (!src?.startsWith("/uploads/")) continue;
    const file = path.basename(src);
    await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, file), { force: true });
  }
}

export async function readUpload(name: string): Promise<Buffer | null> {
  if (name !== path.basename(name) || !/^[\w.-]+$/.test(name)) return null;
  try {
    return await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
  } catch {
    return null;
  }
}

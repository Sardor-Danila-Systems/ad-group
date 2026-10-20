"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin, checkPassword, endSession, startSession, adminEnabled } from "@/lib/server/auth";
import * as store from "@/lib/server/store";
import type { Fact, GalleryPhoto, L10n, NewsItem, Project, ProjectKind, Settings, Status, Vacancy, VacancyType } from "@/lib/types";

export interface FormState {
  error?: string;
  saved?: boolean;
}

const str = (v: FormDataEntryValue | null, max = 5000) => String(v ?? "").trim().slice(0, max);

/** Reads `${prefix}_ru|uz|en`; empty translations fall back to Russian so no page renders blank. */
function l10n(fd: FormData, prefix: string, max = 5000): L10n {
  const ru = str(fd.get(`${prefix}_ru`), max);
  return { ru, uz: str(fd.get(`${prefix}_uz`), max) || ru, en: str(fd.get(`${prefix}_en`), max) || ru };
}

function jsonArray(fd: FormData, key: string): unknown[] {
  try {
    const v = JSON.parse(str(fd.get(key), 100_000));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function asL10n(v: unknown): L10n {
  const o = (v ?? {}) as Record<string, unknown>;
  const ru = String(o.ru ?? "").trim().slice(0, 400);
  return { ru, uz: String(o.uz ?? "").trim().slice(0, 400) || ru, en: String(o.en ?? "").trim().slice(0, 400) || ru };
}

function uploads(fd: FormData, key: string): File[] {
  return fd.getAll(key).filter((f): f is File => f instanceof File && f.size > 0);
}

function uploadMessage(e: unknown): string {
  if (e instanceof store.UploadError) {
    return { type: "Допустимы только JPG, PNG, WebP и AVIF.", size: "Файл больше 12 МБ.", decode: "Не удалось прочитать изображение." }[e.message] ?? "Ошибка загрузки.";
  }
  throw e;
}

function refresh(paths: string[]) {
  updateTag("content");
  for (const p of paths) revalidatePath(p);
}

/* ---------- session ---------- */

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!adminEnabled()) return { error: "Админка выключена: задайте ADMIN_PASSWORD и SESSION_SECRET." };
  if (!checkPassword(str(fd.get("password"), 200))) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "Неверный пароль." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ---------- projects ---------- */

const CATS = ["residential", "commercial"] as const;
const STATUSES: Status[] = ["build", "done", "plan"];
const KINDS: ProjectKind[] = ["vatan", "tower", "slab", "stepped", "blocks"];

export async function saveProject(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const isNew = str(fd.get("isNew"), 2) === "1";
  const id = str(fd.get("id"), 60).toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) return { error: "Адрес страницы: только латиница, цифры и дефис (например my-project)." };
  const name = l10n(fd, "name", 120);
  if (!name.ru) return { error: "Укажите название (русский)." };

  const existing = (await store.loadContent()).projects.find((p) => p.id === id);
  if (isNew && existing) return { error: "Проект с таким адресом уже есть." };
  if (!isNew && !existing) return { error: "Проект не найден." };

  const cat = CATS.find((c) => c === str(fd.get("cat"), 20)) ?? "residential";
  const status = STATUSES.find((s) => s === str(fd.get("status"), 20)) ?? "build";
  const kind = KINDS.find((k) => k === str(fd.get("kind"), 20)) ?? "blocks";
  const year = parseInt(str(fd.get("year"), 6), 10);
  const price = parseInt(str(fd.get("price"), 8), 10);

  // Cover
  let cover = str(fd.get("coverCurrent"), 300) || undefined;
  const removedAssets: (string | undefined)[] = [];
  try {
    const [newCover] = uploads(fd, "cover");
    if (newCover) {
      removedAssets.push(cover);
      cover = (await store.saveImage(newCover)).src;
    } else if (str(fd.get("removeCover"), 2) === "1") {
      removedAssets.push(cover);
      cover = undefined;
    }
  } catch (e) {
    return { error: uploadMessage(e) };
  }

  // Logo (same rules as the cover)
  let logo = str(fd.get("logoCurrent"), 300) || undefined;
  try {
    const [newLogo] = uploads(fd, "logo");
    if (newLogo) {
      removedAssets.push(logo);
      logo = (await store.saveImage(newLogo)).src;
    } else if (str(fd.get("removeLogo"), 2) === "1") {
      removedAssets.push(logo);
      logo = undefined;
    }
  } catch (e) {
    return { error: uploadMessage(e) };
  }

  // Gallery: kept photos (client sends the remaining list, in order) + new uploads
  const keptRaw = jsonArray(fd, "gallery") as Partial<GalleryPhoto>[];
  const previous = existing?.gallery ?? [];
  const kept: GalleryPhoto[] = keptRaw
    .filter((g) => typeof g.src === "string" && previous.some((p) => p.src === g.src))
    .map((g) => {
      const p = previous.find((x) => x.src === g.src)!;
      return { ...p, alt: g.alt ? asL10n(g.alt) : p.alt };
    });
  removedAssets.push(...previous.filter((p) => !kept.some((k) => k.src === p.src)).map((p) => p.src));
  const gallery = [...kept];
  try {
    for (const f of uploads(fd, "newPhotos")) {
      const saved = await store.saveImage(f);
      gallery.push({ src: saved.src, w: saved.w, h: saved.h });
    }
  } catch (e) {
    return { error: uploadMessage(e) };
  }

  const facts: Fact[] = (jsonArray(fd, "facts") as { label?: unknown; value?: unknown }[])
    .map((f) => ({ label: asL10n(f.label), value: String(f.value ?? "").trim().slice(0, 60) }))
    .filter((f) => f.label.ru && f.value);
  const features: L10n[] = (jsonArray(fd, "features") as unknown[]).map(asL10n).filter((f) => f.ru);

  const longText = l10n(fd, "long", 4000);
  const project: Project = {
    id,
    cat,
    status,
    kind,
    year: Number.isFinite(year) ? year : undefined,
    price: Number.isFinite(price) ? price : undefined,
    cover,
    logo,
    tagline: l10n(fd, "tagline", 160).ru ? l10n(fd, "tagline", 160) : undefined,
    gallery,
    name,
    desc: l10n(fd, "desc", 200),
    long: longText.ru ? longText : undefined,
    facts,
    features,
    featured: str(fd.get("featured"), 2) === "1",
  };
  await store.saveProject(project);
  await store.removeUploads(removedAssets);
  refresh(["/", "/projects", `/projects/${id}`]);
  redirect("/admin/projects");
}

export async function deleteProject(fd: FormData) {
  await assertAdmin();
  await store.deleteProject(str(fd.get("id"), 60));
  refresh(["/", "/admin/projects"]);
}

/* ---------- news ---------- */

export async function saveNews(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const isNew = str(fd.get("isNew"), 2) === "1";
  const id = str(fd.get("id"), 40) || `n${Date.now().toString(36)}`;
  if (!/^[a-z0-9-]+$/i.test(id)) return { error: "Некорректный идентификатор." };
  const title = l10n(fd, "title", 200);
  if (!title.ru) return { error: "Укажите заголовок (русский)." };
  const date = str(fd.get("date"), 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Укажите дату." };

  const existing = (await store.loadContent()).news.find((n) => n.id === id);
  if (isNew && existing) return { error: "Новость с таким идентификатором уже есть." };

  let image = str(fd.get("imageCurrent"), 300) || undefined;
  const removed: (string | undefined)[] = [];
  try {
    const [file] = uploads(fd, "image");
    if (file) {
      removed.push(image);
      image = (await store.saveImage(file)).src;
    } else if (str(fd.get("removeImage"), 2) === "1") {
      removed.push(image);
      image = undefined;
    }
  } catch (e) {
    return { error: uploadMessage(e) };
  }

  const item: NewsItem = { id, date, title, text: l10n(fd, "text", 4000), image };
  await store.saveNews(item);
  await store.removeUploads(removed);
  refresh(["/"]);
  redirect("/admin/news");
}

export async function deleteNews(fd: FormData) {
  await assertAdmin();
  await store.deleteNews(str(fd.get("id"), 40));
  refresh(["/", "/admin/news"]);
}

/* ---------- leads ---------- */

export async function deleteLead(fd: FormData) {
  await assertAdmin();
  await store.deleteLead(str(fd.get("id"), 40));
  revalidatePath("/admin/leads");
}


/* ---------- vacancies ---------- */

const VTYPES: VacancyType[] = ["full", "part", "remote", "contract"];

export async function saveVacancy(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const isNew = str(fd.get("isNew"), 2) === "1";
  const id = str(fd.get("id"), 60) || `v${Date.now().toString(36)}`;
  if (!/^[a-z0-9-]+$/i.test(id)) return { error: "Некорректный идентификатор." };
  const title = l10n(fd, "title", 120);
  if (!title.ru) return { error: "Укажите название вакансии (русский)." };

  const existing = (await store.loadContent()).vacancies.find((v) => v.id === id);
  if (isNew && existing) return { error: "Вакансия с таким идентификатором уже есть." };

  const vacancy: Vacancy = {
    id,
    title,
    dept: l10n(fd, "dept", 80),
    city: l10n(fd, "city", 80),
    type: VTYPES.find((t) => t === str(fd.get("type"), 20)) ?? "full",
    summary: l10n(fd, "summary", 1500),
    requirements: (jsonArray(fd, "requirements") as unknown[]).map(asL10n).filter((r) => r.ru),
    open: str(fd.get("open"), 2) === "1",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await store.saveVacancy(vacancy);
  refresh(["/vacancies"]);
  redirect("/admin/vacancies");
}

export async function deleteVacancy(fd: FormData) {
  await assertAdmin();
  await store.deleteVacancy(str(fd.get("id"), 60));
  refresh(["/vacancies", "/admin/vacancies"]);
}

/* ---------- settings ---------- */

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const current = (await store.loadContent()).settings;
  const name = l10n(fd, "fname", 80);
  if (!name.ru) return { error: "Укажите имя руководителя (русский)." };

  let photo = str(fd.get("photoCurrent"), 300) || undefined;
  try {
    const [file] = uploads(fd, "photo");
    if (file) photo = (await store.saveImage(file)).src;
    else if (str(fd.get("removePhoto"), 2) === "1") photo = undefined;
  } catch (e) {
    return { error: uploadMessage(e) };
  }
  // Only the stored photo may be kept; never trust a path coming from the form.
  if (photo && photo !== current.founder.photo && !photo.startsWith("/uploads/")) photo = current.founder.photo;

  const handle = (v: FormDataEntryValue | null) => str(v, 60).replace(/^@/, "").replace(/[^\w.]/g, "");
  const settings: Settings = {
    founder: { name, role: l10n(fd, "frole", 120), quote: l10n(fd, "fquote", 400), p1: l10n(fd, "fp1", 800), p2: l10n(fd, "fp2", 800), photo },
    contacts: {
      phone: str(fd.get("phone"), 40),
      email: str(fd.get("email"), 120),
      address: l10n(fd, "address", 200),
      hours: str(fd.get("hours"), 60),
      instagram: handle(fd.get("instagram")),
      telegram: handle(fd.get("telegram")),
    },
  };
  await store.saveSettings(settings);
  refresh(["/", "/vacancies", "/admin/settings"]);
  return { saved: true };
}

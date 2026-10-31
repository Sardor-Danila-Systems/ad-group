"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { instagramUrl } from "@/lib/instagram";
import { parseVideo } from "@/lib/video";
import { assertAdmin, checkPassword, endSession, startSession, adminEnabled } from "@/lib/server/auth";
import * as store from "@/lib/server/store";
import type { DirectionId, DirectionMedia, Fact, GalleryPhoto, L10n, NewsItem, Person, Project, ProjectKind, Settings, ShowroomScene, Status, Vacancy, VacancyType } from "@/lib/types";

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
    return (
      {
        type: "Допустимы только JPG, PNG, WebP и AVIF.",
        size: "Файл слишком большой.",
        decode: "Не удалось прочитать изображение.",
        ratio: "Нужна панорама 360° с пропорциями 2:1 (например, 6000×3000).",
      }[e.message] ?? "Ошибка загрузки."
    );
  }
  throw e;
}

/** Cleans the showroom scenes that arrive from the form: ids, targets, angles and image paths are all checked. */
function readShowroom(raw: unknown[], previous: ShowroomScene[] | undefined): ShowroomScene[] | { error: string } {
  if (raw.length > 40) return { error: "В шоуруме не больше 40 комнат." };
  const known = new Set((previous ?? []).map((sc) => sc.image));
  const ids = new Set<string>();
  const scenes: ShowroomScene[] = [];
  for (const item of raw as Record<string, unknown>[]) {
    const id = String(item?.id ?? "");
    const image = String(item?.image ?? "");
    if (!/^[\w-]{1,24}$/.test(id) || ids.has(id)) return { error: "Некорректный идентификатор комнаты." };
    // Only panoramas uploaded through the admin (or already stored) may be used.
    if (!/^\/uploads\/[\w.-]+\.webp$/.test(image) && !known.has(image)) return { error: "Некорректная панорама." };
    ids.add(id);
    scenes.push({ id, name: asL10n(item.name), image, links: [] });
  }
  for (const [i, item] of (raw as Record<string, unknown>[]).entries()) {
    const links = Array.isArray(item.links) ? (item.links as Record<string, unknown>[]) : [];
    scenes[i].links = links
      .slice(0, 8)
      .map((l) => ({ to: String(l?.to ?? ""), yaw: Number(l?.yaw), pitch: Number(l?.pitch) }))
      .filter((l) => ids.has(l.to) && l.to !== scenes[i].id && Number.isFinite(l.yaw) && Number.isFinite(l.pitch))
      .map((l) => ({ to: l.to, yaw: Math.atan2(Math.sin(l.yaw), Math.cos(l.yaw)), pitch: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, l.pitch)) }));
  }
  return scenes;
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

  const videoRaw = str(fd.get("video"), 500);
  if (videoRaw && !parseVideo(videoRaw)) return { error: "Не удалось распознать ссылку на видео. Нужна ссылка YouTube, Vimeo или файл .mp4/.webm." };

  const showroomRaw = jsonArray(fd, "showroom");
  const showroom = readShowroom(showroomRaw, existing?.showroom);
  if ("error" in showroom) return { error: showroom.error };
  removedAssets.push(...(existing?.showroom ?? []).filter((sc) => !showroom.some((n) => n.image === sc.image)).map((sc) => sc.image));

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
    video: videoRaw || undefined,
    showroom: showroom.length > 0 ? showroom : undefined,
    name,
    desc: l10n(fd, "desc", 200),
    long: longText.ru ? longText : undefined,
    facts,
    features,
    featured: str(fd.get("featured"), 2) === "1",
  };
  await store.saveProject(project);
  await store.removeUploads(removedAssets);
  refresh(["/", "/projects", `/projects/${id}`, `/projects/${id}/showroom`]);
  redirect("/admin/projects");
}

/** Uploads one panorama right away (separate request, so a project save never carries several large files). */
export async function uploadPanorama(fd: FormData): Promise<{ src: string } | { error: string }> {
  await assertAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Файл не выбран." };
  try {
    const { src } = await store.saveImage(file, "panorama");
    return { src };
  } catch (e) {
    return { error: uploadMessage(e) };
  }
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

/** Reads one person block (founder or CEO) whose form fields start with `prefix`. */
async function readPerson(fd: FormData, prefix: string, current: Person): Promise<Person | { error: string }> {
  const name = l10n(fd, `${prefix}name`, 80);
  if (!name.ru) return { error: "Укажите имя (русский)." };
  let photo = str(fd.get(`${prefix}photoCurrent`), 300) || undefined;
  try {
    const [file] = uploads(fd, `${prefix}photo`);
    if (file) photo = (await store.saveImage(file)).src;
    else if (str(fd.get(`${prefix}removePhoto`), 2) === "1") photo = undefined;
  } catch (e) {
    return { error: uploadMessage(e) };
  }
  // Only the stored photo or a fresh upload may be used; never trust a path coming from the form.
  if (photo && photo !== current.photo && !photo.startsWith("/uploads/")) photo = current.photo;
  return { name, role: l10n(fd, `${prefix}role`, 120), quote: l10n(fd, `${prefix}quote`, 400), p1: l10n(fd, `${prefix}p1`, 800), p2: l10n(fd, `${prefix}p2`, 800), photo };
}

const DIRECTION_IDS: DirectionId[] = ["construction", "service", "logistics"];
const DIRECTION_NAMES: Record<DirectionId, string> = { construction: "Строительство", service: "Сервис и услуги", logistics: "Логистика" };

/** Photo and Instagram link of one direction; form fields are prefixed with `d_<id>_`. */
async function readDirection(fd: FormData, id: DirectionId, current: DirectionMedia | undefined): Promise<DirectionMedia | { error: string }> {
  const p = `d_${id}_`;
  let photo = str(fd.get(`${p}photoCurrent`), 300) || undefined;
  try {
    const [file] = uploads(fd, `${p}photo`);
    if (file) photo = (await store.saveImage(file)).src;
    else if (str(fd.get(`${p}removePhoto`), 2) === "1") photo = undefined;
  } catch (e) {
    return { error: uploadMessage(e) };
  }
  if (photo && photo !== current?.photo && !photo.startsWith("/uploads/")) photo = current?.photo;
  const rawInstagram = str(fd.get(`${p}instagram`), 300);
  const instagram = instagramUrl(rawInstagram);
  if (rawInstagram && !instagram) return { error: "Не похоже на ссылку на Instagram-аккаунт (например, https://www.instagram.com/adgroup/ или @adgroup)." };
  return { ...(photo ? { photo } : {}), ...(instagram ? { instagram } : {}) };
}

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const current = (await store.loadContent()).settings;
  const founder = await readPerson(fd, "f", current.founder);
  if ("error" in founder) return { error: `Руководитель: ${founder.error}` };
  const ceo = await readPerson(fd, "c", current.ceo);
  if ("error" in ceo) return { error: `CEO: ${ceo.error}` };

  const directions: Settings["directions"] = {};
  for (const id of DIRECTION_IDS) {
    const d = await readDirection(fd, id, current.directions?.[id]);
    if ("error" in d) return { error: `${DIRECTION_NAMES[id]}: ${d.error}` };
    if (d.photo || d.instagram) directions[id] = d;
  }

  const handle = (v: FormDataEntryValue | null) => str(v, 60).replace(/^@/, "").replace(/[^\w.]/g, "");
  const settings: Settings = {
    founder,
    ceo,
    directions,
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
  refresh(["/", "/vacancies", "/directions", "/admin/settings"]);
  return { saved: true };
}

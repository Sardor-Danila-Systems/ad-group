import { SEED_DIRECTIONS, SEED_PROJECTS } from "@/lib/seed";
import { instagramList } from "@/lib/instagram";
import type { NewsItem, Project, Settings, Vacancy } from "@/lib/types";

/** The documents a data migration may change. */
export interface MigratableContent {
  projects: Project[];
  news: NewsItem[];
  vacancies: Vacancy[];
  settings: Settings;
}

/**
 * One-off data changes for databases created by an earlier version of the site.
 * Each runs once per database (its id is recorded) and must leave content alone when there is nothing to change,
 * so edits made in the admin panel are never overwritten. A fresh database is seeded with current data and
 * records every migration as already applied.
 */
export interface Migration {
  id: string;
  run(c: MigratableContent): void;
}

/** Replaces text in every string inside a JSON-like value. */
export function replaceStrings<T>(value: T, fn: (s: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((v) => replaceStrings(v, fn)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceStrings(v, fn)])) as T;
  }
  return value;
}

export const MIGRATIONS: Migration[] = [
  {
    // DEV-39: the developer brand is AD Group everywhere.
    id: "2026-10-31-ad-express-to-ad-group",
    run(c) {
      const fix = (s: string) => s.replace(/AD Express \(AD Group\)/g, "AD Group").replace(/AD Express/g, "AD Group");
      c.projects = replaceStrings(c.projects, fix);
      c.news = replaceStrings(c.news, fix);
      c.vacancies = replaceStrings(c.vacancies, fix);
      c.settings = replaceStrings(c.settings, fix);
      // The old Urgut Tower logo says "by AD Express" inside the image itself, so it is taken off the site.
      for (const p of c.projects) if (p.logo === "/urgut/logo.jpg") delete p.logo;
    },
  },
  {
    // DEV-41: the card with the wave-facade renders is Sogdiana Diamond House; Urgut Tower and Yangi Urgut Tower are new projects.
    id: "2026-10-31-sogdiana-and-urgut-projects",
    run(c) {
      const old = c.projects.find((p) => p.id === "urgut-tower" && p.name.en === "Urgut Tower" && p.gallery.some((g) => g.src.startsWith("/urgut/")));
      if (old && !c.projects.some((p) => p.id === "sogdiana-diamond-house")) {
        const renamed = replaceStrings(old, (s) => s.replace(/Urgut Tower/g, "Sogdiana Diamond House").replace(/^\/urgut\//, "/sogdiana/"));
        renamed.id = "sogdiana-diamond-house";
        if (renamed.logo?.startsWith("/sogdiana/logo")) delete renamed.logo;
        c.projects[c.projects.indexOf(old)] = renamed;
      }
      // Add the two new projects right after it (or at the end), unless someone already created them.
      const at = c.projects.findIndex((p) => p.id === "sogdiana-diamond-house");
      const fresh = SEED_PROJECTS.filter((p) => (p.id === "urgut-tower" || p.id === "yangi-urgut-tower") && !c.projects.some((x) => x.id === p.id));
      c.projects.splice(at === -1 ? c.projects.length : at + 1, 0, ...structuredClone(fresh));
      for (const n of c.news) {
        if (n.title.en === "New project: Urgut Tower") n.title = replaceStrings(n.title, (s) => s.replace("Urgut Tower", "Sogdiana Diamond House"));
      }
    },
  },
  {
    // Materials from the client (31.10): photos and texts for Urgut Tower and Yangi Urgut Tower,
    // figures from the Sogdiana Diamond House brochure. Only cards still holding the placeholders are filled.
    id: "2026-10-31-project-materials",
    run(c) {
      const seed = (id: string) => structuredClone(SEED_PROJECTS.find((p) => p.id === id)!);
      for (const id of ["urgut-tower", "yangi-urgut-tower"]) {
        const i = c.projects.findIndex((p) => p.id === id);
        if (i === -1 || c.projects[i].gallery.length > 0 || c.projects[i].cover) continue;
        const { showroom, video, featured } = c.projects[i];
        c.projects[i] = { ...seed(id), ...(showroom ? { showroom } : {}), ...(video ? { video } : {}), ...(featured ? { featured } : {}) };
      }
      const sog = c.projects.find((p) => p.id === "sogdiana-diamond-house");
      if (sog && sog.long?.ru.startsWith("Sogdiana Diamond House — жилой дом от AD Group")) {
        const fresh = seed("sogdiana-diamond-house");
        Object.assign(sog, { year: fresh.year, tagline: fresh.tagline, desc: fresh.desc, long: fresh.long, facts: fresh.facts, features: fresh.features });
      }
    },
  },
  {
    // Location facts were not translatable (one value for all languages); the location is in the description.
    id: "2026-10-31-drop-location-facts",
    run(c) {
      for (const p of c.projects) {
        if (["sogdiana-diamond-house", "urgut-tower", "yangi-urgut-tower"].includes(p.id)) p.facts = p.facts.filter((f) => f.label.en !== "Location");
      }
    },
  },
  {
    // Directions may link several Instagram accounts (a list instead of one link); the client's accounts
    // are filled in where a direction has none yet.
    id: "2026-10-31-direction-instagram",
    run(c) {
      const dirs = (c.settings.directions ??= {});
      for (const [id, seed] of Object.entries(SEED_DIRECTIONS) as [keyof typeof SEED_DIRECTIONS, (typeof SEED_DIRECTIONS)[keyof typeof SEED_DIRECTIONS]][]) {
        const d = (dirs[id] ??= {});
        const links = instagramList(d.instagram);
        d.instagram = links.length ? links : [...(seed?.instagram ?? [])];
      }
    },
  },
];

export const ALL_MIGRATION_IDS = MIGRATIONS.map((m) => m.id);

/** Applies the migrations not in `applied`. Returns whether anything ran and the new applied list. */
export function applyMigrations(c: MigratableContent, applied: string[]): { ran: string[]; applied: string[] } {
  const done = new Set(applied);
  const ran: string[] = [];
  for (const m of MIGRATIONS) {
    if (done.has(m.id)) continue;
    m.run(c);
    done.add(m.id);
    ran.push(m.id);
  }
  return { ran, applied: [...done] };
}

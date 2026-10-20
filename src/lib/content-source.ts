import { cacheTag } from "next/cache";
import { loadContent } from "@/lib/server/store";
import type { NewsItem, Project, Settings, Vacancy } from "@/lib/types";

/**
 * Public readers. Results are cached under the "content" tag and refreshed
 * by the admin actions (updateTag), so pages stay fast and still show edits at once.
 */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag("content");
  const { projects } = await loadContent();
  return [...projects].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
}

export async function getProject(id: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.id === id);
}

export async function getNews(): Promise<NewsItem[]> {
  "use cache";
  cacheTag("content");
  const { news } = await loadContent();
  return [...news].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getVacancies(): Promise<Vacancy[]> {
  "use cache";
  cacheTag("content");
  const { vacancies } = await loadContent();
  return vacancies.filter((v) => v.open).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag("content");
  return (await loadContent()).settings;
}

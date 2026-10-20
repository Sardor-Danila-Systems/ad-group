import type { NewsItem, Project } from "@/lib/types";
import { SEED_NEWS, SEED_PROJECTS } from "@/lib/seed";

/** Single place the site reads projects and news from. */
export async function getProjects(): Promise<Project[]> {
  return SEED_PROJECTS;
}

export async function getProject(id: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.id === id);
}

export async function getNews(): Promise<NewsItem[]> {
  return [...SEED_NEWS].sort((a, b) => b.date.localeCompare(a.date));
}

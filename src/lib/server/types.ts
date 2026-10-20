import type { Lead, NewsItem, Project, Settings, Vacancy } from "@/lib/types";

export interface Content {
  version: number;
  projects: Project[];
  news: NewsItem[];
  vacancies: Vacancy[];
  settings: Settings;
}

/** Everything the site and the admin need from storage. Implemented by the file store and the Postgres store. */
export interface Store {
  loadContent(): Promise<Content>;
  saveProject(project: Project): Promise<void>;
  deleteProject(id: string): Promise<void>;
  saveNews(item: NewsItem): Promise<void>;
  deleteNews(id: string): Promise<void>;
  saveVacancy(item: Vacancy): Promise<void>;
  deleteVacancy(id: string): Promise<void>;
  saveSettings(settings: Settings): Promise<void>;
  listLeads(): Promise<Lead[]>;
  addLead(input: Omit<Lead, "id" | "createdAt">): Promise<void>;
  deleteLead(id: string): Promise<void>;
  saveImage(file: File): Promise<{ src: string; w: number; h: number }>;
  removeUploads(srcs: (string | undefined)[]): Promise<void>;
  readUpload(name: string): Promise<Buffer | null>;
}

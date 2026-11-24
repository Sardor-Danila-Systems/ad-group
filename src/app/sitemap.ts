import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content-source";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/directions` },
    { url: `${SITE_URL}/vacancies` },
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.id}` })),
  ];
}

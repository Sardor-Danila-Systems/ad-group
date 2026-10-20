import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/site/project-view";
import { getProject, getProjects } from "@/lib/content-source";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return {
    title: `${project.name.ru} — AD Group`,
    description: (project.long ?? project.desc).ru,
    openGraph: project.cover ? { images: [project.cover] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const [project, all] = await Promise.all([getProject(id), getProjects()]);
  if (!project) notFound();
  return <ProjectView project={project} others={all.filter((p) => p.id !== id).slice(0, 3)} />;
}

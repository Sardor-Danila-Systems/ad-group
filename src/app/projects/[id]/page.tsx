import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/site/project-view";
import { DATA } from "@/lib/content";

export function generateStaticParams() {
  return DATA.projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = DATA.projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.name.ru} — AD Group`,
    description: project.long?.ru ?? project.desc.ru,
    openGraph: project.photo ? { images: [project.photo] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  if (!DATA.projects.some((p) => p.id === id)) notFound();
  return <ProjectView id={id} />;
}

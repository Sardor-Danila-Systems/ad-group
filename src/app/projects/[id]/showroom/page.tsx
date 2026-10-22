import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowroomView } from "@/components/site/showroom-view";
import { getProject, getProjects } from "@/lib/content-source";

export async function generateStaticParams() {
  // Cache Components needs at least one result; projects without a showroom answer 404 from the page itself.
  return (await getProjects()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]/showroom">): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project?.showroom?.length) return {};
  return { title: `3D-шоурум — ${project.name.ru} — AD Group`, description: `Интерактивный 3D-шоурум проекта ${project.name.ru}: ходите по комнатам сами.` };
}

export default async function ShowroomPage({ params }: PageProps<"/projects/[id]/showroom">) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project?.showroom?.length) notFound();
  return <ShowroomView project={project} />;
}

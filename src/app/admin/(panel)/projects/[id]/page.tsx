import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { loadContent } from "@/lib/server/store";

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = (await loadContent()).projects.find((p) => p.id === id);
  if (!project) notFound();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">{project.name.ru}</h1>
      <ProjectForm project={project} />
    </div>
  );
}

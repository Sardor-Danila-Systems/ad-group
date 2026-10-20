import { ProjectForm } from "@/components/admin/project-form";

export default function NewProject() {
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">Новый проект</h1>
      <ProjectForm />
    </div>
  );
}

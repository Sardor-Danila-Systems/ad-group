import { notFound } from "next/navigation";
import { VacancyForm } from "@/components/admin/vacancy-form";
import { loadContent } from "@/lib/server/store";

export default async function EditVacancy({ params }: PageProps<"/admin/vacancies/[id]">) {
  const { id } = await params;
  const vacancy = (await loadContent()).vacancies.find((v) => v.id === id);
  if (!vacancy) notFound();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">{vacancy.title.ru}</h1>
      <VacancyForm vacancy={vacancy} />
    </div>
  );
}

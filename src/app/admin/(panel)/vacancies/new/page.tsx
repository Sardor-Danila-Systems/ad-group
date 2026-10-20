import { VacancyForm } from "@/components/admin/vacancy-form";

export default function NewVacancy() {
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">Новая вакансия</h1>
      <VacancyForm />
    </div>
  );
}

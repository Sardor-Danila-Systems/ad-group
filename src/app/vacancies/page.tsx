import type { Metadata } from "next";
import { VacanciesView } from "@/components/site/vacancies-view";
import { getSettings, getVacancies } from "@/lib/content-source";

export const metadata: Metadata = {
  title: "Вакансии — AD Group",
  description: "Открытые вакансии AD Group: строительство, продажи и другие направления.",
};

export default async function VacanciesPage() {
  const [vacancies, settings] = await Promise.all([getVacancies(), getSettings()]);
  return <VacanciesView vacancies={vacancies} founder={settings.founder} />;
}

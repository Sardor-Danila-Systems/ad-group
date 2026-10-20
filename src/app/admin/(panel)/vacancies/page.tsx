import Link from "next/link";
import { deleteVacancy } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadContent } from "@/lib/server/store";

export default async function VacanciesAdmin() {
  const { vacancies } = await loadContent();
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-medium">Вакансии</h1>
        <Button asChild className="rounded-full bg-ink text-paper hover:bg-ink-2"><Link href="/admin/vacancies/new">Добавить</Link></Button>
      </div>
      {vacancies.length === 0 ? (
        <p className="text-sm text-muted-foreground">Вакансий пока нет.</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
          {vacancies.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <b className="block truncate">{v.title.ru}</b>
                <span className="text-sm text-muted-foreground">{v.dept.ru} · {v.city.ru}</span>
              </div>
              <Badge variant={v.open ? "default" : "secondary"} className="rounded-full">{v.open ? "На сайте" : "Скрыта"}</Badge>
              <div className="flex items-center">
                <Button asChild variant="ghost" size="sm"><Link href={`/admin/vacancies/${v.id}`}>Изменить</Link></Button>
                <form action={deleteVacancy}>
                  <input type="hidden" name="id" value={v.id} />
                  <ConfirmButton message={`Удалить вакансию «${v.title.ru}»?`}>Удалить</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveVacancy, type FormState } from "@/actions/admin";
import { FeaturesEditor, L10nInput, Section, selectClass } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Vacancy } from "@/lib/types";

export function VacancyForm({ vacancy }: { vacancy?: Vacancy }) {
  const isNew = !vacancy;
  const [state, action, pending] = useActionState<FormState, FormData>(saveVacancy, {});
  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
      <input type="hidden" name="id" value={vacancy?.id ?? ""} />
      <Section title="Вакансия">
        <L10nInput label="Название" name="title" value={vacancy?.title} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <L10nInput label="Отдел" name="dept" value={vacancy?.dept} />
          <L10nInput label="Город" name="city" value={vacancy?.city} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="type">Занятость</Label>
            <select id="type" name="type" defaultValue={vacancy?.type ?? "full"} className={selectClass}>
              <option value="full">Полная занятость</option>
              <option value="part">Частичная занятость</option>
              <option value="remote">Удалённо</option>
              <option value="contract">Контракт</option>
            </select>
          </div>
          <label className="flex items-center gap-3 pt-7 text-sm">
            <Checkbox name="open" value="1" defaultChecked={vacancy ? vacancy.open : true} />
            Показывать на сайте
          </label>
        </div>
        <L10nInput label="Описание" name="summary" value={vacancy?.summary} multiline rows={4} />
      </Section>
      <Section title="Что важно" hint="Требования списком.">
        <FeaturesEditor name="requirements" initial={vacancy?.requirements ?? []} />
      </Section>
      {state.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{state.error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} size="lg" className="h-11 rounded-full bg-ink px-8 text-paper hover:bg-ink-2">{pending ? "Сохраняю…" : "Сохранить"}</Button>
        <Button asChild variant="ghost" size="lg" className="h-11 rounded-full"><Link href="/admin/vacancies">Отмена</Link></Button>
      </div>
    </form>
  );
}

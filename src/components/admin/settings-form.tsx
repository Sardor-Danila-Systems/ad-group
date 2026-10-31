"use client";

import { useActionState } from "react";
import { keepFormSubmit } from "@/components/admin/use-keep-form";
import { saveSettings, type FormState } from "@/actions/admin";
import { ImageField, L10nInput, Section } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { instagramList } from "@/lib/instagram";
import type { DirectionId, Person, Settings } from "@/lib/types";

/** Fields for one person block. `p` is the form-field prefix the server action reads. */
function PersonFields({ p, person }: { p: "f" | "c"; person: Person }) {
  return (
    <>
      <ImageField label="Фото" fileName={`${p}photo`} currentName={`${p}photoCurrent`} removeName={`${p}removePhoto`} current={person.photo} />
      <L10nInput label="Имя" name={`${p}name`} value={person.name} required />
      <L10nInput label="Должность" name={`${p}role`} value={person.role} />
      <L10nInput label="Цитата" name={`${p}quote`} value={person.quote} multiline rows={3} />
      <L10nInput label="Текст, абзац 1" name={`${p}p1`} value={person.p1} multiline rows={3} />
      <L10nInput label="Текст, абзац 2" name={`${p}p2`} value={person.p2} multiline rows={3} />
    </>
  );
}

const DIRECTIONS: { id: DirectionId; title: string }[] = [
  { id: "construction", title: "Строительство" },
  { id: "service", title: "Сервис и услуги (рестораны и отели)" },
  { id: "logistics", title: "Логистика" },
];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, {});
  const { contacts } = settings;
  const field = "h-10 bg-white";
  return (
    <form onSubmit={keepFormSubmit(action)} className="grid gap-6">
      <Section title="Основатель" hint="Показывается на главной в разделе «О компании», вместе с CEO.">
        <PersonFields p="f" person={settings.founder} />
      </Section>
      <Section title="Сооснователь и CEO" hint="Показывается на главной в разделе «О компании» и на странице «Вакансии».">
        <PersonFields p="c" person={settings.ceo} />
      </Section>
      <Section title="Направления" hint="Страница «Направления»: фото раздела и ссылки на его Instagram. Пока фото нет, показывается стандартное; без ссылок кнопок Instagram нет.">
        {DIRECTIONS.map(({ id, title }) => (
          <div key={id} className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <p className="font-semibold">{title}</p>
            <ImageField label="Фото" fileName={`d_${id}_photo`} currentName={`d_${id}_photoCurrent`} removeName={`d_${id}_removePhoto`} current={settings.directions?.[id]?.photo} />
            <div className="grid gap-2">
              <Label htmlFor={`d_${id}_instagram`}>Instagram — по одной ссылке в строке</Label>
              <Textarea id={`d_${id}_instagram`} name={`d_${id}_instagram`} rows={2} defaultValue={instagramList(settings.directions?.[id]?.instagram).join("\n")} placeholder={"https://www.instagram.com/account/\n@another.account"} className="bg-white" />
            </div>
          </div>
        ))}
      </Section>
      <Section title="Контакты" hint="Подвал сайта и ссылки на соцсети.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2"><Label htmlFor="phone">Телефон</Label><Input id="phone" name="phone" defaultValue={contacts.phone} className={field} /></div>
          <div className="grid gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" defaultValue={contacts.email} className={field} /></div>
          <div className="grid gap-2"><Label htmlFor="hours">Часы работы</Label><Input id="hours" name="hours" defaultValue={contacts.hours} className={field} /></div>
          <div />
          <div className="grid gap-2"><Label htmlFor="instagram">Instagram (логин без @)</Label><Input id="instagram" name="instagram" defaultValue={contacts.instagram} className={field} /></div>
          <div className="grid gap-2"><Label htmlFor="telegram">Telegram (логин без @)</Label><Input id="telegram" name="telegram" defaultValue={contacts.telegram} className={field} /></div>
        </div>
        <L10nInput label="Адрес" name="address" value={contacts.address} />
      </Section>
      {state.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{state.error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} size="lg" className="h-11 rounded-full bg-ink px-8 text-paper hover:bg-ink-2">{pending ? "Сохраняю…" : "Сохранить"}</Button>
        {state.saved && <span className="text-sm text-emerald-700" role="status">Сохранено</span>}
      </div>
    </form>
  );
}

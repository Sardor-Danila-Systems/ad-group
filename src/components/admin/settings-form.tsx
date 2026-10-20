"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/actions/admin";
import { ImageField, L10nInput, Section } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Settings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, {});
  const { founder, contacts } = settings;
  const field = "h-10 bg-white";
  return (
    <form action={action} className="grid gap-6">
      <Section title="Руководитель" hint="Показывается на главной и на странице «Вакансии».">
        <ImageField label="Фото" fileName="photo" currentName="photoCurrent" removeName="removePhoto" current={founder.photo} />
        <L10nInput label="Имя" name="fname" value={founder.name} required />
        <L10nInput label="Должность" name="frole" value={founder.role} />
        <L10nInput label="Цитата" name="fquote" value={founder.quote} multiline rows={3} />
        <L10nInput label="Текст, абзац 1" name="fp1" value={founder.p1} multiline rows={3} />
        <L10nInput label="Текст, абзац 2" name="fp2" value={founder.p2} multiline rows={3} />
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

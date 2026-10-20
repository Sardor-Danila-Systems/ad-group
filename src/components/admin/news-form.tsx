"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveNews, type FormState } from "@/actions/admin";
import { ImageField, L10nInput, Section } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NewsItem } from "@/lib/types";

export function NewsForm({ item }: { item?: NewsItem }) {
  const isNew = !item;
  const [state, action, pending] = useActionState<FormState, FormData>(saveNews, {});
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <Section title="Новость">
        <div className="grid gap-2">
          <Label htmlFor="date">Дата</Label>
          <Input id="date" name="date" type="date" required defaultValue={item?.date ?? today} className="h-10 max-w-48 bg-white" />
        </div>
        <L10nInput label="Заголовок" name="title" value={item?.title} required />
        <L10nInput label="Текст" name="text" value={item?.text} multiline rows={5} />
        <ImageField label="Картинка (необязательно)" fileName="image" currentName="imageCurrent" removeName="removeImage" current={item?.image} />
      </Section>
      {state.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{state.error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} size="lg" className="h-11 rounded-full bg-ink px-8 text-paper hover:bg-ink-2">{pending ? "Сохраняю…" : "Сохранить"}</Button>
        <Button asChild variant="ghost" size="lg" className="h-11 rounded-full"><Link href="/admin/news">Отмена</Link></Button>
      </div>
    </form>
  );
}

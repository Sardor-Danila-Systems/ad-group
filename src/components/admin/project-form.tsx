"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject, type FormState } from "@/actions/admin";
import { FactsEditor, FeaturesEditor, GalleryEditor, ImageField, L10nInput, Section, selectClass } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project?: Project }) {
  const isNew = !project;
  const [state, action, pending] = useActionState<FormState, FormData>(saveProject, {});

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />

      <Section title="Основное">
        <div className="grid gap-2">
          <Label htmlFor="id">Адрес страницы</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">/projects/</span>
            <Input id="id" name="id" required defaultValue={project?.id} readOnly={!isNew} placeholder="my-project" pattern="[a-z0-9]+(-[a-z0-9]+)*" className="h-10 max-w-xs bg-white read-only:bg-muted" />
          </div>
          <p className="text-xs text-muted-foreground">Латиница, цифры и дефис. После создания изменить нельзя.</p>
        </div>
        <L10nInput label="Название" name="name" value={project?.name} required />
        <L10nInput label="Короткое описание (для карточки)" name="desc" value={project?.desc} />
        <L10nInput label="Подробное описание (для страницы проекта)" name="long" value={project?.long} multiline rows={5} />
      </Section>

      <Section title="Параметры">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="cat">Тип</Label>
            <select id="cat" name="cat" defaultValue={project?.cat ?? "residential"} className={selectClass}>
              <option value="residential">Жилой</option>
              <option value="commercial">Коммерческий</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Статус</Label>
            <select id="status" name="status" defaultValue={project?.status ?? "build"} className={selectClass}>
              <option value="build">Строится</option>
              <option value="done">Сдан</option>
              <option value="plan">Скоро старт</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Год сдачи</Label>
            <Input id="year" name="year" type="number" min={1990} max={2100} defaultValue={project?.year} className="h-10 bg-white" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Цена от, $/м²</Label>
            <Input id="price" name="price" type="number" min={0} defaultValue={project?.price} className="h-10 bg-white" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="kind">Рисунок, если нет обложки</Label>
            <select id="kind" name="kind" defaultValue={project?.kind ?? "blocks"} className={selectClass}>
              <option value="blocks">Блоки</option>
              <option value="tower">Башня</option>
              <option value="slab">Корпус</option>
              <option value="stepped">Ступенчатый</option>
              <option value="vatan">Кровли</option>
            </select>
          </div>
          <label className="flex items-center gap-3 pt-7 text-sm">
            <Checkbox name="featured" value="1" defaultChecked={project?.featured} />
            Показывать большим блоком на главной
          </label>
        </div>
      </Section>

      <Section title="Фото" hint="Обложка используется на карточке, в первом экране страницы и на главной. Фото сжимаются и переводятся в WebP автоматически.">
        <ImageField label="Обложка" fileName="cover" currentName="coverCurrent" removeName="removeCover" current={project?.cover} />
        <div className="grid gap-2">
          <Label>Галерея</Label>
          <GalleryEditor name="gallery" fileName="newPhotos" initial={project?.gallery ?? []} />
        </div>
      </Section>

      <Section title="Цифры" hint="Например: «641 — Квартир». Показываются сеткой на странице проекта.">
        <FactsEditor name="facts" initial={project?.facts ?? []} />
      </Section>

      <Section title="Преимущества" hint="Короткие пункты списком.">
        <FeaturesEditor name="features" initial={project?.features ?? []} />
      </Section>

      {state.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{state.error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} size="lg" className="h-11 rounded-full bg-ink px-8 text-paper hover:bg-ink-2">{pending ? "Сохраняю…" : "Сохранить"}</Button>
        <Button asChild variant="ghost" size="lg" className="h-11 rounded-full"><Link href="/admin/projects">Отмена</Link></Button>
      </div>
    </form>
  );
}

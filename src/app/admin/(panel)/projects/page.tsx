import Link from "next/link";
import { deleteProject } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadContent } from "@/lib/server/store";

const STATUS = { build: "Строится", done: "Сдан", plan: "Скоро старт" } as const;

export default async function ProjectsAdmin() {
  const { projects } = await loadContent();
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-medium">ЖК и проекты</h1>
        <Button asChild className="rounded-full bg-ink text-paper hover:bg-ink-2"><Link href="/admin/projects/new">Добавить</Link></Button>
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
        {projects.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.cover ? <img src={p.cover} alt="" className="h-14 w-20 rounded-lg object-cover" /> : <div className="h-14 w-20 rounded-lg bg-sand" />}
            <div className="min-w-0 flex-1">
              <b className="block truncate">{p.name.ru}</b>
              <span className="text-sm text-muted-foreground">/projects/{p.id} · {p.gallery.length} фото</span>
            </div>
            <Badge variant="secondary" className="rounded-full">{STATUS[p.status]}</Badge>
            {p.featured && <Badge className="rounded-full bg-gold text-ink">На главной</Badge>}
            <div className="flex items-center">
              <Button asChild variant="ghost" size="sm"><Link href={`/projects/${p.id}`} target="_blank">Открыть</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href={`/admin/projects/${p.id}`}>Изменить</Link></Button>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <ConfirmButton message={`Удалить «${p.name.ru}»? Фото тоже будут удалены.`}>Удалить</ConfirmButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { deleteNews } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { loadContent } from "@/lib/server/store";

export default async function NewsAdmin() {
  const { news } = await loadContent();
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-medium">Новости</h1>
        <Button asChild className="rounded-full bg-ink text-paper hover:bg-ink-2"><Link href="/admin/news/new">Добавить</Link></Button>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Новостей пока нет.</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
          {sorted.map((n) => (
            <li key={n.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <b className="block truncate">{n.title.ru}</b>
                <span className="text-sm text-muted-foreground">{n.date}</span>
              </div>
              <div className="flex items-center">
                <Button asChild variant="ghost" size="sm"><Link href={`/admin/news/${n.id}`}>Изменить</Link></Button>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={n.id} />
                  <ConfirmButton message={`Удалить новость «${n.title.ru}»?`}>Удалить</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

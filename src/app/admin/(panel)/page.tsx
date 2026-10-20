import Link from "next/link";
import { LuFileText, LuInbox, LuBuilding2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { listLeads, loadContent } from "@/lib/server/store";

export default async function AdminHome() {
  const [content, leads] = await Promise.all([loadContent(), listLeads()]);
  const cards = [
    { href: "/admin/projects", label: "ЖК и проекты", value: content.projects.length, Icon: LuBuilding2 },
    { href: "/admin/news", label: "Новости", value: content.news.length, Icon: LuFileText },
    { href: "/admin/leads", label: "Заявки", value: leads.length, Icon: LuInbox },
  ];
  return (
    <div className="grid gap-8">
      <h1 className="font-display text-4xl font-medium">Обзор</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ href, label, value, Icon }) => (
          <Link key={href} href={href} className="rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
            <Icon className="size-6 text-gold-deep" />
            <b className="mt-4 block font-display text-4xl font-medium">{value}</b>
            <span className="text-sm text-muted-foreground">{label}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full bg-ink text-paper hover:bg-ink-2"><Link href="/admin/projects/new">Добавить ЖК</Link></Button>
        <Button asChild variant="outline" className="rounded-full"><Link href="/admin/news/new">Добавить новость</Link></Button>
      </div>
      <section>
        <h2 className="mb-3 font-display text-2xl font-medium">Последние заявки</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Заявок пока нет.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-white">
            {leads.slice(0, 5).map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm">
                <span><b>{l.name}</b> · <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="text-gold-deep">{l.phone}</a></span>
                <span className="text-muted-foreground">{l.interest} · {new Date(l.createdAt).toLocaleString("ru-RU")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

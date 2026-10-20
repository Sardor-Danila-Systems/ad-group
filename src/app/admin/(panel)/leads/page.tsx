import { deleteLead } from "@/actions/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { listLeads } from "@/lib/server/store";

export default async function LeadsAdmin() {
  const leads = await listLeads();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">Заявки</h1>
      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Заявок пока нет. Они появятся здесь после отправки формы на сайте.</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
          {leads.map((l) => (
            <li key={l.id} className="grid gap-1.5 px-5 py-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-base"><b>{l.name}</b> · <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="font-semibold text-gold-deep">{l.phone}</a></span>
                <span className="text-muted-foreground">{new Date(l.createdAt).toLocaleString("ru-RU")}</span>
              </div>
              <div className="text-muted-foreground">Интересует: {l.interest || "—"} · источник: {l.source || "—"}</div>
              {l.message && <p className="whitespace-pre-wrap">{l.message}</p>}
              <form action={deleteLead} className="-ml-3">
                <input type="hidden" name="id" value={l.id} />
                <ConfirmButton message="Удалить заявку?">Удалить</ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

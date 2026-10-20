import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/news-form";
import { loadContent } from "@/lib/server/store";

export default async function EditNews({ params }: PageProps<"/admin/news/[id]">) {
  const { id } = await params;
  const item = (await loadContent()).news.find((n) => n.id === id);
  if (!item) notFound();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">{item.title.ru}</h1>
      <NewsForm item={item} />
    </div>
  );
}

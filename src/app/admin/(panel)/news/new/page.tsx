import { NewsForm } from "@/components/admin/news-form";

export default function NewNews() {
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">Новая новость</h1>
      <NewsForm />
    </div>
  );
}

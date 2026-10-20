import { SettingsForm } from "@/components/admin/settings-form";
import { loadContent } from "@/lib/server/store";

export default async function SettingsAdmin() {
  const { settings } = await loadContent();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-medium">Настройки</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { LuArrowDown, LuArrowUp, LuCrosshair, LuLink2, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { uploadPanorama } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fitImage } from "@/lib/client-image";
import type { L10n, ShowroomLink, ShowroomScene } from "@/lib/types";

const PanoramaLinkPicker = dynamic(() => import("@/components/admin/panorama-link-picker"), {
  ssr: false,
  loading: () => <p className="grid size-full place-items-center text-sm text-white/70">Загрузка…</p>,
});

const LANGS = ["ru", "uz", "en"] as const;
const newId = () => `s${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
const nameFromFile = (f: string) => f.replace(/\.\w+$/, "").replace(/[-_]+/g, " ").trim();

/**
 * Showroom builder: upload one panorama per room, name the rooms, and place arrows between them
 * by clicking on the panorama. The scene list is sent with the project as a hidden JSON field.
 */
export function ShowroomEditor({ name, initial }: { name: string; initial: ShowroomScene[] }) {
  const [scenes, setScenes] = useState<ShowroomScene[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    for (const file of Array.from(files)) {
      setBusy(file.name);
      // One request per panorama keeps each under hosting request-size limits.
      const fitted = await fitImage(file, { maxSide: 6144, maxBytes: 3_800_000 });
      const fd = new FormData();
      fd.set("file", fitted);
      try {
        const res = await uploadPanorama(fd);
        if ("error" in res) {
          setError(`${file.name}: ${res.error}`);
          continue;
        }
        const label = nameFromFile(file.name);
        setScenes((cur) => [...cur, { id: newId(), name: { ru: label, uz: label, en: label }, image: res.src, links: [] }]);
      } catch {
        setError(`${file.name}: не удалось загрузить, попробуйте файл поменьше.`);
      }
    }
    setBusy(null);
  };

  const patch = (id: string, fn: (s: ShowroomScene) => ShowroomScene) => setScenes((cur) => cur.map((s) => (s.id === id ? fn(s) : s)));
  const move = (i: number, d: -1 | 1) =>
    setScenes((cur) => {
      const j = i + d;
      if (j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (id: string) =>
    setScenes((cur) => cur.filter((s) => s.id !== id).map((s) => ({ ...s, links: s.links.filter((l) => l.to !== id) })));

  const labelOf = (id: string) => scenes.find((s) => s.id === id)?.name.ru || "комната";
  const editingScene = scenes.find((s) => s.id === editing) ?? null;

  return (
    <div className="grid gap-5">
      <input type="hidden" name={name} value={JSON.stringify(scenes)} />

      {scenes.length === 0 && <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">Комнат пока нет. Загрузите панорамы 360° (по одной на комнату), и на странице проекта появится блок «Посмотреть шоурум».</p>}

      <ol className="grid gap-4">
        {scenes.map((sc, i) => (
          <li key={sc.id} className="grid gap-4 rounded-2xl border border-border bg-muted/30 p-4 sm:grid-cols-[200px_1fr]">
            <div className="grid content-start gap-2">
              <Image src={sc.image} alt="" width={400} height={200} sizes="200px" className="aspect-[2/1] w-full rounded-xl object-cover" />
              <p className="text-xs text-muted-foreground">Комната {i + 1}{i === 0 ? " (вход)" : ""} · стрелок: {sc.links.length}</p>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Выше" onClick={() => move(i, -1)}><LuArrowUp /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Ниже" onClick={() => move(i, 1)}><LuArrowDown /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" aria-label="Удалить комнату" onClick={() => remove(sc.id)}><LuTrash2 /></Button>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Название комнаты</Label>
                {LANGS.map((code) => (
                  <div key={code} className="flex items-center gap-2">
                    <span className="w-7 text-xs font-semibold text-muted-foreground">{code.toUpperCase()}</span>
                    <Input value={sc.name[code]} onChange={(e) => patch(sc.id, (s) => ({ ...s, name: { ...s.name, [code]: e.target.value } as L10n }))} className="h-9 bg-white" />
                  </div>
                ))}
              </div>
              <div>
                <Button type="button" variant="outline" onClick={() => setEditing(sc.id)} className="gap-2" disabled={scenes.length < 2}>
                  <LuLink2 className="size-4" /> Стрелки-переходы ({sc.links.length})
                </Button>
                {scenes.length < 2 && <p className="mt-1.5 text-xs text-muted-foreground">Чтобы поставить стрелки, нужно минимум две комнаты.</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-2">
        <Label htmlFor="panoramas" className="flex items-center gap-2"><LuPlus className="size-4" /> Добавить панорамы 360°</Label>
        <Input id="panoramas" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy !== null} onChange={(e) => { const input = e.currentTarget; void upload(input.files).then(() => { input.value = ""; }); }} className="h-auto bg-white py-2" />
        <p className="text-xs text-muted-foreground">Нужны панорамы формата equirectangular с пропорциями 2:1 (например, 6000×3000 из камеры Insta360 или Ricoh Theta). Каждая загружается отдельно и сжимается.</p>
        {busy && <p className="text-sm text-gold-deep" role="status">Загружаю {busy}…</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>

      <Dialog open={editingScene !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[94dvh] max-w-[calc(100%-1rem)] overflow-y-auto sm:max-w-5xl">
          {editingScene && <LinkDialog scene={editingScene} scenes={scenes} labelOf={labelOf} onChange={(updater) => setScenes(updater)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LinkDialog({ scene, scenes, labelOf, onChange }: { scene: ShowroomScene; scenes: ShowroomScene[]; labelOf: (id: string) => string; onChange: (u: (cur: ShowroomScene[]) => ShowroomScene[]) => void }) {
  const others = scenes.filter((s) => s.id !== scene.id);
  const [target, setTarget] = useState(others[0]?.id ?? "");
  const [placing, setPlacing] = useState(false);
  const [reverse, setReverse] = useState(true);

  const add = (yaw: number, pitch: number) => {
    if (!target) return;
    onChange((cur) =>
      cur.map((s) => {
        if (s.id === scene.id) return { ...s, links: [...s.links.filter((l) => l.to !== target), { to: target, yaw, pitch }].slice(0, 8) };
        // Mirror arrow in the other room, pointing the opposite way, unless one already exists.
        if (reverse && s.id === target && !s.links.some((l) => l.to === scene.id)) return { ...s, links: [...s.links, { to: scene.id, yaw: Math.atan2(Math.sin(yaw + Math.PI), Math.cos(yaw + Math.PI)), pitch: Math.min(pitch, -0.15) }].slice(0, 8) };
        return s;
      }),
    );
    setPlacing(false);
  };
  const del = (to: string) => onChange((cur) => cur.map((s) => (s.id === scene.id ? { ...s, links: s.links.filter((l) => l.to !== to) } : s)));
  const links: ShowroomLink[] = scene.links;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">Стрелки: {scene.name.ru || "комната"}</DialogTitle>
        <DialogDescription>Выберите, куда ведёт стрелка, нажмите «Поставить» и кликните по панораме в том месте, где находится проход.</DialogDescription>
      </DialogHeader>
      <div className="h-[46dvh] min-h-[280px] overflow-hidden rounded-2xl bg-ink">
        <PanoramaLinkPicker image={scene.image} links={links} labelOf={labelOf} placing={placing} onPick={add} />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="link-target">Куда ведёт стрелка</Label>
            <select id="link-target" value={target} onChange={(e) => setTarget(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
              {others.map((s) => <option key={s.id} value={s.id}>{s.name.ru || "без названия"}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={reverse} onCheckedChange={(v) => setReverse(v === true)} />
            Добавить обратную стрелку в той комнате
          </label>
        </div>
        <Button type="button" onClick={() => setPlacing((p) => !p)} className={placing ? "h-11 gap-2 rounded-full bg-gold text-ink hover:bg-gold-light" : "h-11 gap-2 rounded-full bg-ink text-paper hover:bg-ink-2"}>
          <LuCrosshair className="size-4" /> {placing ? "Кликните по панораме…" : "Поставить стрелку"}
        </Button>
      </div>
      {links.length > 0 && (
        <ul className="grid gap-2">
          {links.map((l) => (
            <li key={l.to} className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5 text-sm">
              <span>Ведёт в: <b>{labelOf(l.to)}</b></span>
              <Button type="button" variant="ghost" size="sm" onClick={() => del(l.to)} className="gap-1 text-destructive hover:text-destructive"><LuX className="size-4" /> Убрать</Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

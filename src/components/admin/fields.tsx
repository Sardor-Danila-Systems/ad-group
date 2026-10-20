"use client";

import { useState } from "react";
import { LuArrowDown, LuArrowUp, LuPlus, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { shrinkInput } from "@/lib/client-image";
import type { Fact, GalleryPhoto, L10n } from "@/lib/types";

const LANGS = [
  ["ru", "RU"],
  ["uz", "UZ"],
  ["en", "EN"],
] as const;

export const selectClass =
  "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/30";

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <h2 className="font-display text-2xl font-medium">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

/** Three inputs (RU / UZ / EN) named `${name}_ru`, `${name}_uz`, `${name}_en`. */
export function L10nInput({ label, name, value, multiline, rows = 4, required }: { label: string; name: string; value?: L10n; multiline?: boolean; rows?: number; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="grid gap-2">
        {LANGS.map(([code, tag]) => (
          <div key={code} className="flex items-start gap-2">
            <span className="mt-2.5 w-7 shrink-0 text-xs font-semibold text-muted-foreground">{tag}</span>
            {multiline ? (
              <Textarea name={`${name}_${code}`} defaultValue={value?.[code] ?? ""} rows={rows} required={required && code === "ru"} className="bg-white" />
            ) : (
              <Input name={`${name}_${code}`} defaultValue={value?.[code] ?? ""} required={required && code === "ru"} className="h-10 bg-white" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function emptyL10n(): L10n {
  return { ru: "", uz: "", en: "" };
}

function L10nRow({ value, onChange, placeholder }: { value: L10n; onChange: (v: L10n) => void; placeholder?: string }) {
  return (
    <div className="grid flex-1 gap-2 sm:grid-cols-3">
      {LANGS.map(([code, tag]) => (
        <Input key={code} value={value[code]} placeholder={`${placeholder ?? ""} ${tag}`.trim()} onChange={(e) => onChange({ ...value, [code]: e.target.value })} className="h-10 bg-white" />
      ))}
    </div>
  );
}

/** Features: a list of short L10n lines. Serialised into a hidden JSON field. */
export function FeaturesEditor({ name, initial }: { name: string; initial: L10n[] }) {
  const [rows, setRows] = useState<L10n[]>(initial);
  return (
    <div className="grid gap-2.5">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      {rows.map((r, i) => (
        <div key={i} className="flex items-start gap-2">
          <L10nRow value={r} onChange={(v) => setRows(rows.map((x, k) => (k === i ? v : x)))} />
          <Button type="button" variant="ghost" size="icon" aria-label="Удалить" onClick={() => setRows(rows.filter((_, k) => k !== i))} className="mt-0.5 size-9 shrink-0"><LuX /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setRows([...rows, emptyL10n()])} className="w-fit gap-1.5"><LuPlus /> Добавить</Button>
    </div>
  );
}

/** Facts: label (L10n) + value. */
export function FactsEditor({ name, initial }: { name: string; initial: Fact[] }) {
  const [rows, setRows] = useState<Fact[]>(initial);
  return (
    <div className="grid gap-2.5">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      {rows.map((r, i) => (
        <div key={i} className="flex items-start gap-2">
          <Input value={r.value} placeholder="14 015 m²" onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))} className="h-10 w-32 shrink-0 bg-white" />
          <L10nRow value={r.label} placeholder="Подпись" onChange={(label) => setRows(rows.map((x, k) => (k === i ? { ...x, label } : x)))} />
          <Button type="button" variant="ghost" size="icon" aria-label="Удалить" onClick={() => setRows(rows.filter((_, k) => k !== i))} className="mt-0.5 size-9 shrink-0"><LuX /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setRows([...rows, { label: emptyL10n(), value: "" }])} className="w-fit gap-1.5"><LuPlus /> Добавить цифру</Button>
    </div>
  );
}

/** Existing gallery photos: reorder or remove. New files go through a normal file input. */
export function GalleryEditor({ name, initial, fileName }: { name: string; initial: GalleryPhoto[]; fileName: string }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initial);
  const [count, setCount] = useState(0);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    setPhotos(next);
  };
  return (
    <div className="grid gap-4">
      <input type="hidden" name={name} value={JSON.stringify(photos)} />
      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.src} className="overflow-hidden rounded-xl border border-border bg-muted/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="flex items-center justify-between gap-1 p-1.5">
                <span className="pl-1 text-xs text-muted-foreground">{i + 1}</span>
                <span className="flex">
                  <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Выше" onClick={() => move(i, -1)}><LuArrowUp /></Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Ниже" onClick={() => move(i, 1)}><LuArrowDown /></Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" aria-label="Удалить" onClick={() => setPhotos(photos.filter((_, k) => k !== i))}><LuX /></Button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="grid gap-2">
        <Label htmlFor={fileName}>Добавить фото</Label>
        <Input id={fileName} name={fileName} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={async (e) => {
            const input = e.currentTarget;
            await shrinkInput(input);
            setCount(input.files?.length ?? 0);
          }} className="h-auto bg-white py-2" />
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP или AVIF до 12 МБ. {count > 0 && `Выбрано: ${count}.`}</p>
      </div>
    </div>
  );
}

/** Single image: shows the current one, lets you replace or remove it. */
export function ImageField({ label, fileName, currentName, removeName, current }: { label: string; fileName: string; currentName: string; removeName: string; current?: string }) {
  const [removed, setRemoved] = useState(false);
  return (
    <div className="grid gap-2">
      <Label htmlFor={fileName}>{label}</Label>
      <input type="hidden" name={currentName} value={current ?? ""} />
      <input type="hidden" name={removeName} value={removed ? "1" : "0"} />
      {current && !removed && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current} alt="" className="h-24 w-36 rounded-lg border border-border object-cover" />
          <Button type="button" variant="outline" onClick={() => setRemoved(true)} className="gap-1.5"><LuX /> Убрать</Button>
        </div>
      )}
      <Input id={fileName} name={fileName} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => shrinkInput(e.currentTarget)} className="h-auto bg-white py-2" />
      <p className="text-xs text-muted-foreground">Новый файл заменит текущий. JPG, PNG, WebP или AVIF до 12 МБ.</p>
    </div>
  );
}

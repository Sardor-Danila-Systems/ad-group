"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BuildingArt } from "@/components/site/building-art";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = [
  ["all", "projects.all"],
  ["residential", "projects.res"],
  ["commercial", "projects.com"],
  ["done", "projects.done"],
] as const;

export function Projects({ projects }: { projects: Project[] }) {
  const { t, lang } = useSite();
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = projects.filter((p) => filter === "all" || p.cat === filter || (filter === "done" && p.status === "done"));

  return (
    <section id="projects" className="bg-cream py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-display text-[clamp(34px,4.6vw,64px)] leading-[1.04] font-medium tracking-tight">{t("projects.title")}</h2>
          <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as typeof filter)} className="flex-wrap" spacing={2}>
            {FILTERS.map(([v, k]) => (
              <ToggleGroupItem key={v} value={v} className="h-10 rounded-full border border-gold/40 px-5 text-sm font-medium text-ink/80 data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-paper">
                {t(k)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Reveal>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))]">
          {list.map((p) => (
            <article key={p.id} className="group relative overflow-hidden rounded-[22px] bg-white ring-1 ring-gold/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(60,45,20,0.45)]">
              <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-b from-[#f1e9d9] to-sand text-white [--b:var(--ink-2)] [--b2:var(--gold)]">
                {p.cover ? (
                  <Image src={p.cover} alt={p.name[lang]} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <BuildingArt kind={p.kind} className="size-full transition-transform duration-500 group-hover:scale-105" />
                )}
                <Badge className={cn("absolute top-4 left-4 rounded-full border-0 px-3 py-1 text-xs font-semibold", p.status === "done" ? "bg-ink text-paper" : "bg-paper text-ink")}>
                  {t(`status.${p.status}`)}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-medium">{p.name[lang]}</h3>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{p.desc[lang]}</p>
                <div className="mt-5 flex items-center gap-3.5 text-sm text-muted-foreground">
                  {p.year && <span>{p.year}</span>}
                  {p.price && <span className="font-semibold text-gold-deep">{t("price.from")} ${p.price}/m²</span>}
                  <Link href={`/projects/${p.id}`} className="ml-auto inline-flex items-center gap-1 font-semibold text-ink after:absolute after:inset-0">
                    {t("projects.more")} <LuArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-7 text-[13px] text-muted-foreground">{t("demo.note")}</p>
      </div>
    </section>
  );
}

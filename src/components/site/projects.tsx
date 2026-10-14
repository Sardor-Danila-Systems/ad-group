"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BuildingArt } from "@/components/site/building-art";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { DATA } from "@/lib/content";
import { cn } from "@/lib/utils";

const FILTERS = [
  ["all", "projects.all"],
  ["residential", "projects.res"],
  ["commercial", "projects.com"],
  ["done", "projects.done"],
] as const;

export function Projects() {
  const { t, lang } = useSite();
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = DATA.projects.filter((p) => filter === "all" || p.cat === filter || (filter === "done" && p.status === "done"));

  return (
    <section id="projects" className="py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-display text-[clamp(26px,3.4vw,44px)] leading-[1.15] font-normal tracking-tight">{t("projects.title")}</h2>
          <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as typeof filter)} className="flex-wrap" spacing={2}>
            {FILTERS.map(([v, k]) => (
              <ToggleGroupItem
                key={v}
                value={v}
                className="h-10 rounded-full border border-navy/20 px-5 text-sm font-medium data-[state=on]:border-navy data-[state=on]:bg-navy data-[state=on]:text-white"
              >
                {t(k)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Reveal>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))]">
          {list.map((p) => {
            const vatan = p.kind === "vatan";
            return (
              <Card key={p.id} className="group gap-0 overflow-hidden rounded-[18px] border-0 bg-white p-0 shadow-sm ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div
                  className={cn(
                    "relative aspect-[3/2] overflow-hidden text-white",
                    vatan
                      ? "bg-gradient-to-b from-[#F1E4D5] to-[#E8C9A6] [--b:var(--vatan)] [--b2:var(--gold)]"
                      : "bg-gradient-to-b from-[#E4EBF2] to-ice [--b:var(--navy)] [--b2:#2c375a]",
                  )}
                >
                  {p.photo ? (
                    <Image src={p.photo} alt={p.name[lang]} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <BuildingArt kind={p.kind} className="size-full transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <Badge className={cn("absolute top-4 left-4 rounded-full border-0 px-3 py-1 text-xs font-semibold", p.status === "done" ? "bg-navy text-white" : "bg-white text-navy")}>
                    {t(`status.${p.status}`)}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-normal">{p.name[lang]}</h3>
                  <p className="mt-1.5 text-[15px] text-muted-foreground">{p.desc[lang]}</p>
                  <div className="mt-5 flex items-center gap-3.5 text-sm text-muted-foreground">
                    <span>{p.year}</span>
                    {p.from && <span className="font-semibold text-gold">{t("price.from")} ${p.from}/m²</span>}
                    <a href="#" className="ml-auto inline-flex items-center gap-1 font-semibold text-navy">
                      {t("projects.more")} <ArrowRightIcon className="size-4" />
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <p className="mt-7 text-[13px] text-muted-foreground">{t("demo.note")}</p>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { BuildingArt } from "@/components/site/building-art";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { DATA, type ProjectKind } from "@/lib/content";

function Head({ title, api }: { title: string; api?: CarouselApi }) {
  return (
    <Reveal className="mb-12 flex items-end justify-between gap-5">
      <h2 className="font-display text-[clamp(26px,3.4vw,44px)] leading-[1.15] font-normal tracking-tight">{title}</h2>
      <div className="flex gap-2.5">
        <Button variant="outline" size="icon-lg" className="size-12 rounded-full border-navy/25 hover:bg-navy hover:text-white" onClick={() => api?.scrollPrev()} aria-label="prev">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" size="icon-lg" className="size-12 rounded-full border-navy/25 hover:bg-navy hover:text-white" onClick={() => api?.scrollNext()} aria-label="next">
          <ArrowRightIcon />
        </Button>
      </div>
    </Reveal>
  );
}

const ITEM = "basis-[85%] sm:basis-[340px]";

export function History() {
  const { t, lang } = useSite();
  const [api, setApi] = useState<CarouselApi>();
  return (
    <section id="history" className="bg-ice py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Head title={t("history.title")} api={api} />
        <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }}>
          <CarouselContent className="-ml-5">
            {DATA.history.map((h) => (
              <CarouselItem key={h.y} className={`pl-5 ${ITEM}`}>
                <Card className="h-full gap-2.5 rounded-[18px] border-0 bg-white p-7 ring-0">
                  <b className="font-display text-5xl leading-none font-light text-navy">{h.y}</b>
                  <h3 className="font-display text-lg leading-snug font-normal">{h.t[lang]}</h3>
                  <p className="text-[15px] text-muted-foreground">{h.d[lang]}</p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

const NEWS_KINDS: ProjectKind[] = ["vatan", "stepped", "tower", "blocks"];

export function News() {
  const { t, lang } = useSite();
  const [api, setApi] = useState<CarouselApi>();
  const locale = lang === "uz" ? "uz-UZ" : lang === "en" ? "en-GB" : "ru-RU";
  return (
    <section id="news" className="py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Head title={t("news.title")} api={api} />
        <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }}>
          <CarouselContent className="-ml-5">
            {DATA.news.map((n, i) => (
              <CarouselItem key={n.date} className={`pl-5 ${ITEM}`}>
                <a href="#" className="block h-full">
                  <Card className="h-full gap-2.5 overflow-hidden rounded-[18px] border-0 bg-background p-0 pb-7 ring-1 ring-navy/10 transition-transform duration-300 hover:-translate-y-1">
                    <div className="mb-1.5 aspect-[2/1] bg-gradient-to-b from-[#E4EBF2] to-ice text-white [--b:var(--navy)] [--b2:#2c375a]">
                      <BuildingArt kind={NEWS_KINDS[i % 4]} w={300} h={160} className="size-full" />
                    </div>
                    <small className="mx-6 text-[13px] text-muted-foreground">
                      {new Date(n.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                    </small>
                    <h3 className="font-display mx-6 text-lg leading-snug font-normal">{n.t[lang]}</h3>
                    <p className="mx-6 text-[15px] text-muted-foreground">{n.d[lang]}</p>
                  </Card>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSite } from "@/components/site/site-provider";
import type { GalleryPhoto } from "@/lib/types";

/** Masonry gallery with a full-screen lightbox. `limit` shows a teaser with a link to the full set. */
export function ProjectGallery({ photos, title, name, limit, moreHref }: { photos: GalleryPhoto[]; title: string; name: string; limit?: number; moreHref?: string }) {
  const { t, lang } = useSite();
  const [open, setOpen] = useState<number | null>(null);
  const shown = limit ? photos.slice(0, limit) : photos;
  const alt = (p: GalleryPhoto) => p.alt?.[lang] || name;

  if (photos.length === 0) return null;
  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <h3 className="font-display text-[clamp(30px,3.6vw,48px)] leading-none font-medium">{title}</h3>
        <span className="text-sm text-muted-foreground">{photos.length} {t("gallery.photos")}</span>
      </div>

      <div className="columns-2 gap-3 md:columns-3 md:gap-4">
        {shown.map((ph, i) => (
          <button
            key={ph.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={alt(ph)}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-sand break-inside-avoid md:mb-4"
          >
            <Image src={ph.src} alt={alt(ph)} width={ph.w} height={ph.h} sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 50vw" className="h-auto w-full transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-2.5 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {alt(ph)}
            </span>
          </button>
        ))}
      </div>

      {limit && moreHref && photos.length > limit && (
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-gold bg-transparent px-8 text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
            <Link href={moreHref}>{t("gallery.all")} ({photos.length})</Link>
          </Button>
        </div>
      )}

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent showCloseButton={false} className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-black/95 p-0 text-white ring-0 sm:max-w-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {open !== null && <Lightbox photos={photos} start={open} name={name} />}
          <DialogClose asChild>
            <Button variant="ghost" size="icon-lg" className="absolute top-4 right-4 z-10 text-white hover:bg-white/15 hover:text-white" aria-label="Close">
              <LuX className="size-6" />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Lightbox({ photos, start, name }: { photos: GalleryPhoto[]; start: number; name: string }) {
  const { lang } = useSite();
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(start);

  useEffect(() => {
    if (!api) return;
    const on = () => setIndex(api.selectedScrollSnap());
    api.on("select", on);
    return () => {
      api.off("select", on);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [api]);

  const n = photos.length;
  return (
    <div className="relative flex h-full flex-col">
      <Carousel setApi={setApi} opts={{ startIndex: start, loop: true }} className="min-h-0 flex-1 [&>div]:h-full">
        <CarouselContent className="ml-0 h-full [&>div]:h-full" style={{ height: "100%" }}>
          {photos.map((ph, i) => {
            const d = Math.abs(i - index);
            return (
              <CarouselItem key={ph.src} className="relative h-full pl-0">
                {d <= 1 || d >= n - 1 ? (
                  <Image src={ph.src} alt={ph.alt?.[lang] || name} fill sizes="100vw" priority={i === start} className="object-contain p-2 pb-16 sm:p-6 sm:pb-16" />
                ) : null}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4 sm:px-8">
        <span className="text-sm text-white/80">
          {photos[index].alt?.[lang] || name} · {index + 1}/{n}
        </span>
        <div className="pointer-events-auto flex gap-2">
          <Button variant="ghost" size="icon-lg" className="size-11 rounded-full border border-white/25 text-white hover:bg-white/15 hover:text-white" onClick={() => api?.scrollPrev()} aria-label="prev">
            <LuArrowLeft />
          </Button>
          <Button variant="ghost" size="icon-lg" className="size-11 rounded-full border border-white/25 text-white hover:bg-white/15 hover:text-white" onClick={() => api?.scrollNext()} aria-label="next">
            <LuArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

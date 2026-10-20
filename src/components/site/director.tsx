"use client";

import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import type { Settings } from "@/lib/types";

function Quote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 30" aria-hidden="true" className={className} fill="currentColor">
      <path d="M0 30V18C0 8 5 2 14 0l2 4C10 6 8 10 8 14h8v16H0Zm24 0V18c0-10 5-16 14-18l2 4c-6 2-8 6-8 10h8v16H24Z" />
    </svg>
  );
}

export function Director({ founder, className }: { founder: Settings["founder"]; className?: string }) {
  const { lang } = useSite();
  return (
    <section className={`relative isolate overflow-hidden bg-ink py-[clamp(64px,8vw,112px)] text-paper ${className ?? ""}`}>
      <Image src="/vatan/06.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-[0.12] grayscale" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/70" />
      <Reveal className="mx-auto grid w-[min(1240px,100%-32px)] items-start gap-10 md:w-[min(1240px,100%-48px)] lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-[420px] lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-gold/40">
            {founder.photo ? <Image src={founder.photo} alt={founder.name[lang]} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover object-top" /> : <div className="size-full bg-ink-2" />}
          </div>
          <div aria-hidden="true" className="absolute -right-3 -bottom-3 -z-10 size-full rounded-2xl border border-gold/50" />
        </div>
        <div className="relative lg:pt-4">
          <Quote className="mb-6 h-8 w-10 text-gold" />
          <p className="font-display text-[clamp(26px,3.2vw,46px)] leading-[1.18] font-medium">{founder.quote[lang]}</p>
          <div className="mt-9 grid max-w-[70ch] gap-5 text-[clamp(15px,1.25vw,17px)] leading-relaxed text-paper/70">
            <p>{founder.p1[lang]}</p>
            <p>{founder.p2[lang]}</p>
          </div>
          <div className="mt-10 flex items-center gap-5">
            <span aria-hidden="true" className="h-px w-14 bg-gold" />
            <div>
              <p className="font-display text-2xl font-medium">{founder.name[lang]}</p>
              <p className="text-sm text-paper/55">{founder.role[lang]}</p>
            </div>
          </div>
          <Quote className="absolute right-0 bottom-0 hidden h-8 w-10 rotate-180 text-gold/80 lg:block" />
        </div>
      </Reveal>
    </section>
  );
}

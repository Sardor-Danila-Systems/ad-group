"use client";

import Image from "next/image";
import { Line, Reveal, SLIDE, Words, imgReveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import type { L10n, Lang, ProjectSection } from "@/lib/types";
import { cn } from "@/lib/utils";

const WRAP = "mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]";
const BG = ["bg-paper", "bg-cream"];
const pick = (v: string | L10n, lang: Lang) => (typeof v === "string" ? v : v[lang]);

/** The detailed blocks of a project page, one screen each; image and text swap sides from block to block. */
export function ProjectSections({ sections }: { sections: ProjectSection[] }) {
  const { lang } = useSite();
  return (
    <>
      {sections.map((s, i) => {
        const flip = i % 2 === 1;
        const head = (
          <>
            {s.eyebrow && (
              <Reveal kind={flip ? "right" : "left"} className="mb-5 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
                <Line />
                {s.eyebrow[lang]}
              </Reveal>
            )}
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[1.05] font-medium tracking-tight">
              <Words text={s.title[lang]} delay={100} v={(["flip", "slide", undefined] as const)[i % 3]} />
            </h2>
            <Reveal kind="blur" delay={400} className="mt-5 max-w-[60ch] text-[clamp(15px,1.3vw,17px)] leading-relaxed text-ink/70">
              {s.text[lang]}
            </Reveal>
          </>
        );

        if (s.cards?.length) {
          return (
            <section key={s.id} id={s.id} data-curtain className={cn("py-[clamp(56px,7vw,104px)]", SLIDE, BG[i % 2])}>
              <div className={WRAP}>
                <div className="max-w-[760px]">{head}</div>
                <Reveal kind="stagger" from="cards" delay={300} className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
                  {s.cards.map((c, k) => (
                    <article key={k} className="group overflow-hidden rounded-[22px] bg-white ring-1 ring-gold/20">
                      {c.image && (
                        <div {...imgReveal("diag", 500 + k * 120)} className="relative aspect-[4/3] overflow-hidden">
                          <Image src={c.image} alt={c.title[lang]} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-5">
                        {c.stat && <p className="font-display text-2xl font-medium text-gold-deep">{pick(c.stat, lang)}</p>}
                        <h3 className="mt-1 font-display text-xl font-medium">{c.title[lang]}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text[lang]}</p>
                      </div>
                    </article>
                  ))}
                </Reveal>
              </div>
            </section>
          );
        }

        return (
          <section key={s.id} id={s.id} data-curtain className={cn("py-[clamp(56px,7vw,104px)]", SLIDE, BG[i % 2])}>
            <div className={cn(WRAP, "grid items-center gap-10 lg:grid-cols-2 lg:gap-16")}>
              <div className={cn(flip && "lg:order-2")}>
                {head}
                {s.stats && s.stats.length > 0 && (
                  <Reveal as="dl" kind="stagger" from="pop" delay={550} className={cn("mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-gold/35 pt-6", s.stats.length >= 4 ? "sm:grid-cols-4 sm:gap-x-6" : "sm:grid-cols-3")}>
                    {s.stats.map((st, k) => (
                      <div key={k}>
                        <dd className="font-display text-[clamp(24px,2.4vw,34px)] leading-none font-medium whitespace-nowrap text-gold-deep">{pick(st.value, lang)}</dd>
                        <dt className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{st.label[lang]}</dt>
                      </div>
                    ))}
                  </Reveal>
                )}
                {s.points && s.points.length > 0 && (
                  <Reveal as="ul" kind="stagger" from={flip ? "right" : "left"} delay={650} className="mt-6 grid gap-2.5">
                    {s.points.map((pt, k) => (
                      <li key={k} className="relative pl-7 text-[15px] leading-snug before:absolute before:top-[.5em] before:left-0 before:h-2.5 before:w-3.5 before:bg-gold before:[clip-path:polygon(50%_0,100%_100%,0_100%)]">
                        {pt[lang]}
                      </li>
                    ))}
                  </Reveal>
                )}
              </div>
              {s.image && (
                <div
                  {...imgReveal(flip ? "left" : "right", 150)}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/30 lg:aspect-auto lg:h-[min(64svh,560px)]",
                    flip ? "rounded-[28px] rounded-tl-[110px] lg:order-1" : "rounded-[28px] rounded-tr-[110px]",
                  )}
                >
                  <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
                    <Image src={s.image} alt={s.title[lang]} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

"use client";

import Image from "next/image";
import { Line, Reveal, SLIDE, Words, imgReveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import { useSite } from "@/components/site/site-provider";
import type { Person, Settings } from "@/lib/types";

/** Quote marks used in the leadership block. */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 30" aria-hidden="true" className={className} fill="currentColor">
      <path d="M0 30V18C0 8 5 2 14 0l2 4C10 6 8 10 8 14h8v16H0Zm24 0V18c0-10 5-16 14-18l2 4c-6 2-8 6-8 10h8v16H24Z" />
    </svg>
  );
}

function Leader({ person, priority }: { person: Person; priority?: boolean }) {
  const { lang } = useSite();
  return (
    // Phone: small photo beside the name, quote below. Wider: photo on the left, name and quote on the right.
    <figure className="grid grid-cols-[96px_1fr] items-center gap-x-5 gap-y-6 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-x-8 lg:grid-cols-[170px_1fr] xl:grid-cols-[210px_1fr]">
      <div {...imgReveal(undefined, 900)} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-2 ring-1 ring-gold/40 sm:row-span-2">
        {person.photo && <Image src={person.photo} alt={person.name[lang]} fill priority={priority} sizes="(min-width: 1280px) 210px, (min-width: 640px) 200px, 96px" className="object-cover object-top" />}
      </div>
      <figcaption>
        <p className="text-[11px] font-semibold tracking-[.18em] text-gold-light uppercase sm:text-[12px]">{person.role[lang]}</p>
        <p className="mt-2 font-display text-[clamp(21px,2.2vw,32px)] leading-tight font-medium">{person.name[lang]}</p>
      </figcaption>
      {person.quote[lang] && (
        <blockquote className="col-span-2 border-l border-gold/50 pl-5 sm:col-span-1 sm:col-start-2">
          <QuoteMark className="mb-3 h-4 w-5 text-gold" />
          <p className="font-display text-[clamp(17px,1.4vw,20px)] leading-snug text-paper/85 italic">{person.quote[lang]}</p>
        </blockquote>
      )}
    </figure>
  );
}

/** «О компании»: two screens — the company (text and an aerial view), then the founder and the CEO together. */
export function About({ founder, ceo }: { founder: Settings["founder"]; ceo: Settings["ceo"] }) {
  const { t } = useSite();
  return (
    <>
      <section id="about" data-curtain className={cn("bg-marble py-[clamp(80px,10vw,150px)]", SLIDE)}>
        <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-12 md:w-[min(1240px,100%-48px)] lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="max-w-[820px]">
            <Reveal kind="left" className="mb-6 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
              <Line />
              {t("about.eyebrow")}
            </Reveal>
            <h2 className="font-display text-[clamp(38px,5.2vw,76px)] leading-[1.02] font-medium tracking-tight"><Words text={t("about.title")} delay={100} /></h2>
            <Reveal kind="blur" delay={450} className="mt-8 max-w-[58ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-ink/70">{t("about.text")}</Reveal>
          </div>
          <div {...imgReveal("right", 200)} className="relative aspect-[4/3] overflow-hidden rounded-[28px] rounded-tl-[120px] shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40 lg:aspect-[4/5] lg:max-h-[min(68svh,600px)] lg:w-full">
            <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
              <Image src="/vatan/13.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="leaders" data-curtain className={cn("bg-marble py-[clamp(48px,6vw,96px)]", SLIDE)}>
        <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
          <Reveal kind="zoom" className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-paper shadow-[0_40px_80px_-40px_rgba(28,25,21,0.6)] sm:p-10 lg:p-14">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-marble-strong opacity-[0.05]" />
            <div className="relative">
              <h3 className="mb-10 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-light uppercase">
                <Line className="bg-gold-light" />
                <Words text={t("about.team")} v="slide" delay={300} />
              </h3>
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
                <Reveal kind="left" delay={500} className="lg:pr-12">
                  <Leader person={founder} />
                </Reveal>
                <Reveal kind="right" delay={700} className="border-t border-gold/25 pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                  <Leader person={ceo} />
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

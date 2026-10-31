"use client";

import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-2 ring-1 ring-gold/40 sm:row-span-2">
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

/** «О компании»: company text, then the founder and the CEO together in one block. */
export function About({ founder, ceo }: { founder: Settings["founder"]; ceo: Settings["ceo"] }) {
  const { t } = useSite();
  return (
    <section id="about" className="bg-marble py-[clamp(80px,10vw,150px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Reveal className="max-w-[820px]">
          <p className="mb-6 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            {t("about.eyebrow")}
          </p>
          <h2 className="font-display text-[clamp(38px,5.2vw,76px)] leading-[1.02] font-medium tracking-tight">{t("about.title")}</h2>
          <p className="mt-8 max-w-[58ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-ink/70">{t("about.text")}</p>
        </Reveal>

        <Reveal className="relative mt-[clamp(48px,6vw,88px)] overflow-hidden rounded-[32px] bg-ink p-6 text-paper shadow-[0_40px_80px_-40px_rgba(28,25,21,0.6)] sm:p-10 lg:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-marble-strong opacity-[0.05]" />
          <div className="relative">
            <h3 className="mb-10 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-light uppercase">
              <span aria-hidden="true" className="h-px w-10 bg-gold-light" />
              {t("about.team")}
            </h3>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
              <div className="lg:pr-12">
                <Leader person={founder} />
              </div>
              <div className="border-t border-gold/25 pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                <Leader person={ceo} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

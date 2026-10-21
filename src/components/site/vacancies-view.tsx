"use client";

import { useState } from "react";
import { LuArrowRight, LuMapPin, LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Director } from "@/components/site/director";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import type { Person, Vacancy } from "@/lib/types";
import { cn } from "@/lib/utils";

export function VacanciesView({ vacancies, ceo }: { vacancies: Vacancy[]; ceo: Person }) {
  const { t, lang, applyFor } = useSite();
  const [open, setOpen] = useState<string | null>(vacancies[0]?.id ?? null);

  return (
    <>
      <Header />
      <main>
        {/* The CEO speaks first, in the same block style as the founder on the home page. */}
        <Director founder={ceo} className="pt-[calc(76px+clamp(48px,6vw,96px))]" />

        <section id="open" className="bg-paper py-[clamp(64px,8vw,128px)]">
          <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
            <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
              <div>
                <p className="mb-6 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
                  <span aria-hidden="true" className="h-px w-10 bg-gold" />
                  {t("vac.eyebrow")}
                </p>
                <h1 className="font-display text-[clamp(40px,6vw,88px)] leading-[1] font-medium tracking-tight">{t("vac.open")}</h1>
              </div>
              <p className="max-w-[52ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink/70">{t("vac.lead")}</p>
            </Reveal>

            {vacancies.length === 0 ? (
              <Reveal className="mt-14 rounded-[28px] bg-white p-8 ring-1 ring-gold/25 sm:p-12">
                <p className="max-w-[48ch] font-display text-2xl leading-snug">{t("vac.empty")}</p>
                <Button onClick={() => applyFor(t("vac.general"))} size="lg" className="mt-8 h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                  {t("vac.general")}
                </Button>
              </Reveal>
            ) : (
              <ul className="mt-14 border-t border-gold/40">
                {vacancies.map((v, i) => {
                  const isOpen = open === v.id;
                  return (
                    <li key={v.id} className="border-b border-gold/40">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`vac-${v.id}`}
                        onClick={() => setOpen(isOpen ? null : v.id)}
                        className="group flex w-full items-baseline gap-4 py-6 text-left sm:gap-8 sm:py-8"
                      >
                        <span className="w-8 shrink-0 font-display text-lg text-gold-deep tabular-nums sm:w-12 sm:text-2xl">{String(i + 1).padStart(2, "0")}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[clamp(26px,3.6vw,48px)] leading-[1.08] font-medium transition-transform duration-500 group-hover:translate-x-2">{v.title[lang]}</span>
                          <span className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink/60">
                            <span>{v.dept[lang]}</span>
                            <span className="inline-flex items-center gap-1.5"><LuMapPin className="size-3.5 text-gold-deep" />{v.city[lang]}</span>
                            <span>{t(`vtype.${v.type}`)}</span>
                          </span>
                        </span>
                        <span className={cn("grid size-11 shrink-0 place-items-center self-center rounded-full border border-gold/60 text-gold-deep transition-all duration-300 group-hover:bg-gold group-hover:text-ink", isOpen && "rotate-45 bg-gold text-ink")}>
                          <LuPlus className="size-5" />
                        </span>
                      </button>
                      <div id={`vac-${v.id}`} className={cn("grid transition-all duration-500 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                        <div className="overflow-hidden">
                          <div className="grid gap-8 pb-10 pl-12 sm:pl-20 lg:grid-cols-[1.2fr_1fr]">
                            <div>
                              <p className="max-w-[54ch] text-[17px] leading-relaxed text-ink/75">{v.summary[lang]}</p>
                              <Button onClick={() => applyFor(v.title[lang])} size="lg" className="group/btn mt-7 h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                                {t("vac.apply")} <LuArrowRight className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </div>
                            {v.requirements.length > 0 && (
                              <div>
                                <h3 className="mb-4 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">{t("vac.requirements")}</h3>
                                <ul className="grid gap-3">
                                  {v.requirements.map((r, k) => (
                                    <li key={k} className="relative pl-6 text-[15px] leading-snug before:absolute before:top-[.55em] before:left-0 before:h-2 before:w-3 before:bg-gold before:[clip-path:polygon(50%_0,100%_100%,0_100%)]">
                                      {r[lang]}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
        <Cta />
      </main>
      <Footer />
      <ToTop />
      <CookieBar />
    </>
  );
}

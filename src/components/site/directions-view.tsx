"use client";

import Image from "next/image";
import Link from "next/link";
import { LuArrowDownRight, LuArrowRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { cn } from "@/lib/utils";

const DIRECTIONS = [
  { id: "construction", prefix: "c", photo: "/vatan/14.jpg" },
  { id: "service", prefix: "s", photo: "/vatan/07.jpg" },
  { id: "logistics", prefix: "l" },
] as const;

/** Abstract route: a dashed line with stops, drawn on load. Decorative only. */
function RouteArt() {
  return (
    <svg viewBox="0 0 560 420" className="size-full" aria-hidden="true">
      <defs>
        <linearGradient id="route" x1="0" x2="1">
          <stop offset="0" stopColor="#d9bf88" />
          <stop offset="1" stopColor="#b8924f" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#b8924f" strokeOpacity="0.18">
        {[70, 140, 210, 280, 350].map((y) => (
          <path key={y} d={`M0 ${y}H560`} />
        ))}
        {[90, 190, 290, 390, 490].map((x) => (
          <path key={x} d={`M${x} 0V420`} />
        ))}
      </g>
      <path d="M60 330C140 330 150 200 250 200S360 300 420 220 480 110 510 90" fill="none" stroke="url(#route)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" />
      <path d="M60 330C140 330 150 200 250 200S360 300 420 220 480 110 510 90" fill="none" stroke="#b8924f" strokeWidth="1.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="route-draw" />
      {[
        [60, 330],
        [250, 200],
        [420, 220],
        [510, 90],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" fill="#b8924f" fillOpacity="0.15" />
          <circle cx={x} cy={y} r="6" fill="#b8924f" />
        </g>
      ))}
    </svg>
  );
}

export function DirectionsView() {
  const { t, openCall } = useSite();

  return (
    <>
      <Header />
      <main>
        <section className="bg-marble pt-[76px]">
          <div className="mx-auto w-[min(1240px,100%-32px)] py-[clamp(56px,8vw,112px)] md:w-[min(1240px,100%-48px)]">
            <p className="enter enter-up mb-6 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              {t("dirs.eyebrow")}
            </p>
            <h1 className="enter enter-up font-display text-[clamp(44px,7vw,100px)] leading-[1] font-medium tracking-tight" style={{ animationDelay: "0.1s" }}>{t("dirs.title")}</h1>
            <p className="enter enter-up mt-7 max-w-[56ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-ink/70" style={{ animationDelay: "0.2s" }}>{t("dirs.lead")}</p>

            {/* Contents list: big serif rows with hairlines instead of icon cards. */}
            <nav className="mt-14 border-t border-gold/40" aria-label={t("dirs.title")}>
              {DIRECTIONS.map((d, i) => (
                <a key={d.id} href={`#${d.id}`} className="group relative flex items-baseline gap-5 overflow-hidden border-b border-gold/40 py-6 sm:gap-10 sm:py-8">
                  <span aria-hidden="true" className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gold/10 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="relative font-display text-lg text-gold-deep tabular-nums sm:text-2xl">0{i + 1}</span>
                  <span className="relative font-display text-[clamp(30px,5vw,68px)] leading-none font-medium transition-transform duration-500 ease-out group-hover:translate-x-3">{t(`dirs.${d.prefix}.name`)}</span>
                  {d.id === "service" && <span className="relative hidden text-sm tracking-wide text-ink/55 md:inline">{t("dirs.s.sub")}</span>}
                  <LuArrowDownRight className="relative ml-auto size-6 shrink-0 self-center text-gold-deep transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 sm:size-8" />
                </a>
              ))}
            </nav>
          </div>
        </section>

        {DIRECTIONS.map((d, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={d.id} id={d.id} className={cn("overflow-hidden py-[clamp(64px,8vw,128px)]", flip ? "bg-cream" : "bg-paper")}>
              <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-12 md:w-[min(1240px,100%-48px)] lg:grid-cols-[1fr_1.05fr] lg:gap-24">
                <Reveal className={cn(flip && "lg:order-2")}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-[clamp(56px,7vw,96px)] leading-none font-medium text-gold/45 tabular-nums">0{i + 1}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-gold/40" />
                  </div>
                  <h2 className="mt-6 font-display text-[clamp(34px,4.6vw,64px)] leading-[1.04] font-medium tracking-tight">{t(`dirs.${d.prefix}.name`)}</h2>
                  {d.id === "service" && <p className="mt-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">{t("dirs.s.sub")}</p>}
                  <p className="mt-6 max-w-[52ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink/70">{t(`dirs.${d.prefix}.text`)}</p>

                  <ol className="mt-9 border-t border-gold/35">
                    {[1, 2, 3, 4].map((k) => (
                      <li key={k} className="flex items-baseline gap-5 border-b border-gold/35 py-4">
                        <span className="w-7 shrink-0 font-display text-sm text-gold-deep tabular-nums">{String(k).padStart(2, "0")}</span>
                        <span className="text-[16px] leading-snug">{t(`dirs.${d.prefix}.i${k}`)}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-9">
                    {d.id === "construction" ? (
                      <Button asChild size="lg" className="group h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                        <Link href="/#projects">{t("dirs.c.link")} <LuArrowRight className="ml-1 transition-transform group-hover:translate-x-1" /></Link>
                      </Button>
                    ) : (
                      <Button onClick={openCall} size="lg" className="group h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                        {t("dirs.cta")} <LuArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                      </Button>
                    )}
                  </div>
                </Reveal>

                <Reveal className={cn("relative", flip && "lg:order-1")}>
                  {"photo" in d ? (
                    <div className="relative">
                      {/* Offset outline frame behind the photo. */}
                      <div aria-hidden="true" className={cn("absolute inset-0 rounded-[28px] border border-gold/60", flip ? "-translate-x-4 translate-y-4" : "translate-x-4 translate-y-4")} />
                      <div className={cn("relative aspect-[4/5] overflow-hidden shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] sm:aspect-[5/4]", flip ? "rounded-[28px] rounded-tl-[120px]" : "rounded-[28px] rounded-tr-[120px]")}>
                        <Image src={d.photo} alt={t(`dirs.${d.prefix}.name`)} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] rounded-tr-[120px] bg-marble ring-1 ring-gold/40">
                      <RouteArt />
                    </div>
                  )}
                </Reveal>
              </div>
            </section>
          );
        })}

        <p className="bg-paper pb-10 text-center text-[13px] text-muted-foreground">{t("dirs.note")}</p>
        <Cta />
      </main>
      <Footer />
      <ToTop />
      <CookieBar />
    </>
  );
}

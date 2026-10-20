"use client";

import Image from "next/image";
import { Counter } from "@/components/site/counter";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/site-provider";

export function Hero() {
  const { t, openCall } = useSite();
  return (
    <section className="relative isolate overflow-hidden bg-marble pt-[76px]">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-10 py-14 md:w-[min(1240px,100%-48px)] lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-16">
        <div className="enter enter-up" style={{ animationDelay: "0.15s" }}>
          <p className="mb-6 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            {t("hero.eyebrow")}
          </p>
          <h1 className="font-display text-[clamp(42px,6.2vw,92px)] leading-[0.98] font-medium tracking-tight text-ink">{t("hero.title")}</h1>
          <p className="mt-7 max-w-[46ch] text-[clamp(16px,1.4vw,19px)] text-ink/70">{t("hero.lead")}</p>
          <div className="mt-10 flex flex-wrap gap-3.5">
            <Button onClick={openCall} size="lg" className="h-13 rounded-full bg-ink px-8 text-[15px] font-semibold text-paper hover:bg-ink-2">
              {t("lead.send")}
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 rounded-full border-gold bg-transparent px-8 text-[15px] font-semibold text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
              <a href="#projects">{t("hero.cta1")}</a>
            </Button>
          </div>
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-5 border-t border-gold/30 pt-7">
            {([
              [2011, "", "hero.s1"],
              [25, "+", "hero.s2"],
              [3000, "", "hero.s3"],
            ] as const).map(([n, suffix, k]) => (
              <div key={k}>
                <dt className="font-display text-4xl font-medium text-gold-deep">
                  <Counter to={n} suffix={suffix} />
                </dt>
                <dd className="text-[13px] text-ink/60">{t(k)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="enter enter-rise relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[28px] shadow-[0_40px_80px_-30px_rgba(60,45,20,0.5)] ring-1 ring-gold/40">
            <Image src="/vatan/08.jpg" alt="Vatan Residence" fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-5 left-4 rounded-2xl bg-paper px-5 py-4 shadow-xl ring-1 ring-gold/30 sm:-left-6">
            <Image src="/assets/logo-vatan.png" alt="Vatan Residence" width={150} height={48} className="h-9 w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { BuildingArt } from "@/components/site/building-art";
import { useSite } from "@/components/site/site-provider";

export function Hero() {
  const { t } = useSite();
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-gradient-to-b from-navy to-[#1d2744] pt-32 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 text-ice [--b:#202A47] [--b2:#2A3556] after:absolute after:inset-0 after:bg-gradient-to-b after:from-navy after:from-10% after:to-transparent after:to-90% md:after:bg-gradient-to-r md:after:from-navy md:after:from-[18%] md:after:to-transparent md:after:to-70%"
      >
        <BuildingArt kind="stepped" w={1200} h={600} className="absolute -right-[40%] bottom-0 h-[60%] w-[140%] opacity-55 md:-right-[4%] md:h-[78%] md:w-[78%]" />
        <BuildingArt kind="tower" w={900} h={520} className="absolute right-[30%] bottom-0 hidden h-[92%] w-[48%] opacity-35 [--b:#1B2440] md:block" />
      </div>

      <div className="mx-auto flex w-[min(1240px,100%-32px)] flex-1 flex-col justify-center pb-10 md:w-[min(1240px,100%-48px)]">
        <p className="mb-5 text-[13px] font-semibold tracking-[.14em] text-gold-light uppercase">{t("hero.eyebrow")}</p>
        <h1 className="font-display max-w-[12ch] text-[clamp(38px,6.4vw,92px)] leading-[1.04] font-light tracking-tight">{t("hero.title")}</h1>
        <p className="mt-7 max-w-[48ch] text-[clamp(16px,1.5vw,19px)] text-[#C3CCDF]">{t("hero.lead")}</p>
        <div className="mt-10 flex flex-wrap gap-3.5">
          <Button asChild size="lg" className="h-12 rounded-full bg-ice px-7 text-[15px] font-semibold text-navy hover:bg-white">
            <a href="#projects">{t("hero.cta1")}</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-ice/45 bg-transparent px-7 text-[15px] font-semibold text-white hover:bg-white/10 hover:text-white">
            <a href="#about">{t("hero.cta2")}</a>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto flex w-[min(1240px,100%-32px)] flex-wrap gap-x-14 gap-y-4 border-t border-ice/20 pt-7 pb-9 md:w-[min(1240px,100%-48px)]">
        {[
          ["2011", "hero.s1"],
          ["25+", "hero.s2"],
          ["3 000", "hero.s3"],
        ].map(([n, k]) => (
          <div key={k}>
            <b className="font-display block text-[clamp(22px,2.4vw,32px)] font-normal">{n}</b>
            <span className="text-[13px] text-[#AEB8CF]">{t(k)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Counter, Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";

const STATS = [
  [400000, "about.s1"],
  [3000, "about.s2"],
  [25, "about.s3"],
  [8000, "about.s4"],
] as const;

export function About() {
  const { t } = useSite();
  return (
    <section id="about" className="bg-navy py-[clamp(72px,9vw,128px)] text-white">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-10 md:w-[min(1240px,100%-48px)] md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="mb-5 text-[13px] font-semibold tracking-[.14em] text-gold-light uppercase">{t("about.eyebrow")}</p>
          <h2 className="font-display text-[clamp(26px,3.4vw,44px)] leading-[1.15] font-normal tracking-tight">{t("about.title")}</h2>
          <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.4vw,19px)] text-[#AEB8CF]">{t("about.text")}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-ice/15">
          {STATS.map(([n, k]) => (
            <Reveal key={k} className="bg-navy px-5 py-8 sm:p-9">
              <Counter to={n} className="font-display block text-[clamp(26px,3.6vw,52px)] leading-none font-light" />
              <span className="mt-3 block text-sm text-[#AEB8CF]">{t(k)}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto mt-[clamp(64px,8vw,110px)] grid w-[min(1240px,100%-32px)] items-center gap-6 border-t border-ice/15 pt-[clamp(48px,6vw,80px)] md:w-[min(1240px,100%-48px)] md:grid-cols-[200px_1fr] md:gap-12">
        <div aria-hidden="true" className="aspect-square w-24 bg-ice opacity-90 [clip-path:polygon(0_100%,35%_0,100%_0,65%_100%)] md:w-full" />
        <blockquote>
          <p className="font-display text-[clamp(20px,2.4vw,32px)] leading-[1.35] font-light">{t("mission.quote")}</p>
          <footer className="mt-5 text-sm text-[#AEB8CF]">{t("mission.by")}</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}

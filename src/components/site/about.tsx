"use client";

import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";

export function About() {
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
      </div>
    </section>
  );
}

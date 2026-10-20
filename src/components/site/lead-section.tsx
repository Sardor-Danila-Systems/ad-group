"use client";

import { LuClock, LuPhone } from "react-icons/lu";
import { Reveal } from "@/components/site/reveal";
import { LeadForm } from "@/components/site/lead-form";
import { useSite } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";

export function LeadSection({ projects }: { projects: Pick<Project, "id" | "name">[] }) {
  const { t } = useSite();
  return (
    <section id="request" className="relative bg-paper py-[clamp(64px,8vw,112px)]">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] items-start gap-10 md:w-[min(1240px,100%-48px)] lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="mb-5 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            {t("lead.eyebrow")}
          </p>
          <h2 className="font-display text-[clamp(34px,4.6vw,64px)] leading-[1.04] font-medium tracking-tight">{t("lead.title")}</h2>
          <p className="mt-6 max-w-[46ch] text-[clamp(16px,1.4vw,18px)] text-ink/70">{t("lead.text")}</p>
          <div className="mt-9 grid gap-4 text-[15px]">
            <a href="tel:+998662300000" className="flex items-center gap-3 font-semibold transition-colors hover:text-gold-deep">
              <span className="grid size-11 place-items-center rounded-full bg-gold/15 text-gold-deep"><LuPhone className="size-5" /></span>
              +998 66 230 00 00
            </a>
            <p className="flex items-center gap-3 text-ink/70">
              <span className="grid size-11 place-items-center rounded-full bg-gold/15 text-gold-deep"><LuClock className="size-5" /></span>
              09:00 – 18:00
            </p>
          </div>
        </Reveal>
        <Reveal className="rounded-[28px] bg-white p-6 shadow-[0_30px_70px_-35px_rgba(60,45,20,0.45)] ring-1 ring-gold/25 sm:p-9">
          <LeadForm projects={projects} source="home" />
        </Reveal>
      </div>
    </section>
  );
}

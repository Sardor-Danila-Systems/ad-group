"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fx } from "@/components/site/fx";
import { ProjectGallery } from "@/components/site/project-gallery";
import { FactsGrid } from "@/components/site/facts-grid";
import { Line, Reveal, SLIDE, Words, imgReveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { parseVideo } from "@/lib/video";
import { hasShowroom } from "@/lib/matterport";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const WRAP = "mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]";

/** The featured project on the home page, in three screens: the story, the figures, the gallery. */
export function Vatan({ project }: { project: Project }) {
  const { t, lang, openCall } = useSite();
  return (
    <>
      <section id="vatan" data-curtain className={cn("bg-paper py-[clamp(72px,9vw,128px)]", SLIDE)}>
        <div className={cn(WRAP, "grid items-center gap-10 md:grid-cols-2 md:gap-16")}>
          <div>
            {project.logo && (
              <Reveal kind="left">
                <Image src={project.logo} alt={project.name[lang]} width={300} height={96} className="mb-8 h-[84px] w-auto rounded-lg lg:mb-6 lg:h-16" />
              </Reveal>
            )}
            <Reveal kind="left" delay={100} className="mb-4 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
              <Line />
              {t("vatan.eyebrow")}
            </Reveal>
            <h2 className="font-display text-[clamp(36px,4.6vw,66px)] leading-[1.03] font-medium tracking-tight lg:text-[clamp(36px,4vw,60px)]">
              <Words text={(project.tagline ?? project.name)[lang]} delay={150} v="flip" />
            </h2>
            <Reveal kind="blur" delay={500} className="mt-6 max-w-[54ch] text-ink/70">{(project.long ?? project.desc)[lang]}</Reveal>
            <Reveal kind="stagger" from="left" delay={650} className="mt-9 flex flex-wrap gap-3">
              <Button onClick={openCall} size="lg" className={`h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink ${fx.ink}`}>{t("vatan.cta")}</Button>
              <Button asChild size="lg" variant="outline" className={`h-12 rounded-full border-gold bg-transparent px-7 text-[15px] font-semibold text-gold-deep hover:bg-transparent ${fx.outline}`}>
                <Link href={`/projects/${project.id}`}>{t("vatan.more")}</Link>
              </Button>
              {hasShowroom(project) && (
                <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 text-[15px] font-semibold text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
                  <Link href={`/projects/${project.id}/showroom`}>{t("showroom.btn")}</Link>
                </Button>
              )}
              {parseVideo(project.video) && (
                <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 text-[15px] font-semibold text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
                  <Link href={`/projects/${project.id}#tour`}>{t("video.btn")}</Link>
                </Button>
              )}
            </Reveal>
          </div>
          <div {...imgReveal("diag", 150)} className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40 lg:aspect-auto lg:h-[min(72svh,640px)]">
            <div data-parallax className="absolute inset-x-0 -inset-y-[8%]">
              <Image src={project.cover ?? "/vatan/08.jpg"} alt={project.name[lang]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {(project.features.length > 0 || project.facts.length > 0) && (
        <section data-curtain className={cn("bg-cream py-[clamp(64px,8vw,112px)]", SLIDE)}>
          <div className={cn(WRAP, "grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16")}>
            <div>
              <h3 className="font-display text-[clamp(30px,3.6vw,52px)] leading-[1.05] font-medium tracking-tight"><Words text={project.name[lang]} v="slide" /></h3>
              {project.features.length > 0 && (
                <Reveal as="ul" kind="stagger" from="left" delay={300} className="mt-8 grid gap-0 border-t border-gold/35">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-baseline gap-5 border-b border-gold/35 py-4">
                      <span className="w-7 shrink-0 font-display text-sm text-gold-deep tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[16px] leading-snug">{f[lang]}</span>
                    </li>
                  ))}
                </Reveal>
              )}
            </div>
            {project.facts.length > 0 && <FactsGrid facts={project.facts} compact />}
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section data-curtain className={cn("bg-paper py-[clamp(64px,8vw,112px)]", SLIDE)}>
          <div className={WRAP}>
            <ProjectGallery photos={project.gallery} title={t("vatan.gallery")} name={project.name[lang]} strip moreHref={`/projects/${project.id}`} />
          </div>
        </section>
      )}
    </>
  );
}

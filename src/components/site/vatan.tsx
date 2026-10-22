"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/site/project-gallery";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { parseVideo } from "@/lib/video";
import type { Project } from "@/lib/types";

export function Vatan({ project }: { project: Project }) {
  const { t, lang, openCall } = useSite();
  return (
    <section id="vatan" className="bg-paper py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-10 md:w-[min(1240px,100%-48px)] md:grid-cols-2 md:gap-16">
        <Reveal>
          {project.logo && <Image src={project.logo} alt={project.name[lang]} width={300} height={96} className="mb-8 h-[84px] w-auto rounded-lg" />}
          <p className="mb-4 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">{t("vatan.eyebrow")}</p>
          <h2 className="font-display text-[clamp(36px,4.6vw,66px)] leading-[1.03] font-medium tracking-tight">{(project.tagline ?? project.name)[lang]}</h2>
          <p className="mt-6 max-w-[54ch] text-ink/70">{(project.long ?? project.desc)[lang]}</p>
          <ul className="mt-7 mb-9 grid gap-3">
            {project.features.map((f, i) => (
              <li key={i} className="relative pl-7 before:absolute before:top-[.6em] before:left-0 before:h-2.5 before:w-3.5 before:bg-gold before:[clip-path:polygon(50%_0,100%_100%,0_100%)]">
                {f[lang]}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button onClick={openCall} size="lg" className="h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">{t("vatan.cta")}</Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-gold bg-transparent px-7 text-[15px] font-semibold text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
              <Link href={`/projects/${project.id}`}>{t("vatan.more")}</Link>
            </Button>
            {parseVideo(project.video) && (
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 text-[15px] font-semibold text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
                <Link href={`/projects/${project.id}#tour`}>{t("video.btn")}</Link>
              </Button>
            )}
          </div>
        </Reveal>
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40">
            <Image src={project.cover ?? "/vatan/08.jpg"} alt={project.name[lang]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </div>

      {project.facts.length > 0 && (
        <Reveal className="mx-auto mt-[clamp(56px,7vw,96px)] w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
          <h3 className="mb-6 font-display text-[clamp(26px,3vw,40px)] font-medium">{project.name[lang]}</h3>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-gold/25 ring-1 ring-gold/25 md:grid-cols-4">
            {project.facts.map((f) => (
              <div key={f.label.ru} className="bg-white p-5 sm:p-7">
                <dd className="font-display text-[clamp(28px,3vw,44px)] leading-none font-medium whitespace-nowrap text-gold-deep">{f.value}</dd>
                <dt className="mt-2.5 text-sm text-muted-foreground">{f.label[lang]}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      <div className="mx-auto mt-[clamp(56px,7vw,96px)] w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <ProjectGallery photos={project.gallery} title={t("vatan.gallery")} name={project.name[lang]} limit={6} moreHref={`/projects/${project.id}`} />
      </div>
    </section>
  );
}

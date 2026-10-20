"use client";

import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BuildingArt } from "@/components/site/building-art";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ProjectGallery } from "@/components/site/project-gallery";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";

export function ProjectView({ project, others }: { project: Project; others: Project[] }) {
  const { t, lang, openCall } = useSite();

  const facts: [string, string][] = [
    [t("proj.status"), t(`status.${project.status}`)],
    [t("proj.type"), t(`type.${project.cat}`)],
  ];
  if (project.year) facts.push([t("proj.year"), String(project.year)]);
  if (project.price) facts.push([t("proj.price"), `${t("price.from")} $${project.price}/m²`]);

  return (
    <>
      <Header />
      <main>
        <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink text-white">
          {project.cover ? (
            <Image src={project.cover} alt={project.name[lang]} fill priority sizes="100vw" className="-z-10 object-cover" />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 -z-10 text-white [--b:#2a251d] [--b2:var(--gold)]">
              <BuildingArt kind={project.kind} w={1200} h={600} className="absolute right-0 bottom-0 h-[85%] w-full opacity-50 md:w-[70%]" />
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="mx-auto w-[min(1240px,100%-32px)] pt-40 pb-12 md:w-[min(1240px,100%-48px)] md:pb-16">
            <Link href="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
              <LuArrowLeft className="size-4" /> {t("proj.back")}
            </Link>
            <div className="mb-4">
              <Badge className="rounded-full border-0 bg-gold px-3 py-1 text-xs font-semibold text-ink">{t(`status.${project.status}`)}</Badge>
            </div>
            <h1 className="max-w-[16ch] font-display text-[clamp(48px,8vw,112px)] leading-[0.98] font-medium tracking-tight">{project.name[lang]}</h1>
            <p className="mt-5 max-w-[52ch] text-[clamp(16px,1.5vw,20px)] text-white/85">{project.desc[lang]}</p>
          </div>
        </section>

        <section className="bg-paper py-[clamp(56px,7vw,104px)]">
          <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
            <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-gold/25 ring-1 ring-gold/25 lg:grid-cols-4">
              {facts.map(([k, v]) => (
                <div key={k} className="bg-white p-6 sm:p-8">
                  <small className="block text-[13px] text-muted-foreground">{k}</small>
                  <b className="mt-1.5 block font-display text-2xl font-medium text-gold-deep sm:text-3xl">{v}</b>
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-[clamp(48px,6vw,88px)] grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
              <div>
                <h2 className="font-display text-[clamp(34px,4.2vw,58px)] leading-[1.05] font-medium tracking-tight">{t("proj.about")}</h2>
                <p className="mt-6 max-w-[60ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink/70">{(project.long ?? project.desc)[lang]}</p>
                <Button onClick={openCall} size="lg" className="mt-8 h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                  {t("proj.cta")}
                </Button>
              </div>
              {project.features.length > 0 && (
                <div>
                  <h3 className="mb-5 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">{t("proj.features")}</h3>
                  <ul className="grid gap-3.5">
                    {project.features.map((f, i) => (
                      <li key={i} className="relative pl-7 before:absolute before:top-[.6em] before:left-0 before:h-2.5 before:w-3.5 before:bg-gold before:[clip-path:polygon(50%_0,100%_100%,0_100%)]">
                        {f[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>

            {project.facts.length > 0 && (
              <Reveal className="mt-[clamp(48px,6vw,88px)]">
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

            {project.gallery.length > 0 && (
              <div className="mt-[clamp(56px,7vw,104px)]">
                <ProjectGallery photos={project.gallery} title={t("vatan.gallery")} name={project.name[lang]} />
              </div>
            )}
            <p className="mt-10 text-[13px] text-muted-foreground">{t("demo.note")}</p>
          </div>
        </section>

        {others.length > 0 && (
          <section className="bg-sand py-[clamp(56px,7vw,104px)]">
            <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
              <h2 className="mb-10 font-display text-[clamp(30px,3.6vw,52px)] leading-[1.05] font-medium tracking-tight">{t("proj.other")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => (
                  <Link key={o.id} href={`/projects/${o.id}`} className="group overflow-hidden rounded-[22px] bg-white ring-1 ring-gold/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-b from-[#f1e9d9] to-sand text-white [--b:var(--ink-2)] [--b2:var(--gold)]">
                      {o.cover ? (
                        <Image src={o.cover} alt={o.name[lang]} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <BuildingArt kind={o.kind} className="size-full" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 p-5">
                      <div>
                        <h3 className="font-display text-2xl font-medium">{o.name[lang]}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{o.desc[lang]}</p>
                      </div>
                      <LuArrowRight className="size-5 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Cta />
      </main>
      <Footer />
      <ToTop />
      <CookieBar />
    </>
  );
}

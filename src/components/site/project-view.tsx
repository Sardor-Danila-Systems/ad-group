"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BuildingArt } from "@/components/site/building-art";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { VatanGallery } from "@/components/site/vatan-gallery";
import { DATA } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProjectView({ id }: { id: string }) {
  const { t, lang, openCall } = useSite();
  const project = DATA.projects.find((p) => p.id === id)!;
  const vatan = project.kind === "vatan";
  const others = DATA.projects.filter((p) => p.id !== id).slice(0, 3);

  const facts: [string, string][] = [
    [t("proj.status"), t(`status.${project.status}`)],
    [t("proj.year"), String(project.year)],
    [t("proj.type"), t(`type.${project.cat}`)],
  ];
  if (project.from) facts.push([t("proj.price"), `${t("price.from")} $${project.from}/m²`]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={cn("relative isolate flex min-h-[78svh] items-end overflow-hidden text-white", vatan ? "bg-vatan" : "bg-navy")}>
          {project.photo ? (
            <Image src={project.photo} alt={project.name[lang]} fill priority sizes="100vw" className="-z-10 object-cover" />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 -z-10 text-ice [--b:#202A47] [--b2:#2A3556]">
              <BuildingArt kind={project.kind} w={1200} h={600} className="absolute right-0 bottom-0 h-[85%] w-full opacity-60 md:w-[70%]" />
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
          <div className="mx-auto w-[min(1240px,100%-32px)] pt-36 pb-12 md:w-[min(1240px,100%-48px)] md:pb-16">
            <Link href="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
              <ArrowLeftIcon className="size-4" /> {t("proj.back")}
            </Link>
            <div className="mb-4">
              <Badge className="rounded-full border-0 bg-white px-3 py-1 text-xs font-semibold text-navy">{t(`status.${project.status}`)}</Badge>
            </div>
            <h1 className={cn("max-w-[16ch] text-[clamp(40px,7vw,96px)] leading-[1.02]", vatan ? "font-serif font-medium text-gold-light" : "font-display font-light tracking-tight")}>
              {project.name[lang]}
            </h1>
            <p className="mt-5 max-w-[52ch] text-[clamp(16px,1.5vw,19px)] text-white/85">{project.desc[lang]}</p>
          </div>
        </section>

        {/* Facts + about */}
        <section className={cn("py-[clamp(56px,7vw,104px)]", vatan ? "bg-vatan text-white" : "bg-background")}>
          <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
            <Reveal className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-[18px] lg:grid-cols-4", vatan ? "bg-white/10" : "bg-border")}>
              {facts.map(([k, v]) => (
                <div key={k} className={cn("p-6 sm:p-8", vatan ? "bg-vatan" : "bg-white")}>
                  <small className={cn("block text-[13px]", vatan ? "text-[#AEB8CF]" : "text-muted-foreground")}>{k}</small>
                  <b className={cn("mt-1.5 block text-lg font-semibold sm:text-xl", vatan && "text-gold-light")}>{v}</b>
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-[clamp(48px,6vw,88px)] grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
              <div>
                <h2 className={cn("text-[clamp(26px,3.4vw,44px)] leading-[1.15]", vatan ? "font-serif font-medium text-gold-light" : "font-display font-normal tracking-tight")}>
                  {t("proj.about")}
                </h2>
                <p className={cn("mt-5 max-w-[60ch] text-[clamp(16px,1.4vw,18px)]", vatan ? "text-[#C5CDE0]" : "text-muted-foreground")}>
                  {(project.long ?? project.desc)[lang]}
                </p>
                <Button
                  onClick={openCall}
                  size="lg"
                  className={cn("mt-8 h-12 rounded-full px-7 text-[15px] font-semibold", vatan && "bg-gold text-vatan hover:bg-gold-light")}
                >
                  {t("proj.cta")}
                </Button>
              </div>
              {vatan && (
                <div>
                  <h3 className="mb-5 text-[13px] font-semibold tracking-[.14em] text-gold-light uppercase">{t("proj.features")}</h3>
                  <ul className="grid gap-3">
                    {["vatan.l1", "vatan.l2", "vatan.l3"].map((k) => (
                      <li key={k} className="relative pl-7 before:absolute before:top-[.55em] before:left-0 before:h-2.5 before:w-3.5 before:bg-gold before:[clip-path:polygon(50%_0,100%_100%,0_100%)]">
                        {t(k)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>

            {vatan && (
              <div className="mt-[clamp(56px,7vw,104px)]">
                <VatanGallery />
              </div>
            )}
            <p className={cn("mt-10 text-[13px]", vatan ? "text-[#8E99B5]" : "text-muted-foreground")}>{t("demo.note")}</p>
          </div>
        </section>

        {/* Other projects */}
        <section className="bg-ice py-[clamp(56px,7vw,104px)]">
          <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
            <h2 className="font-display mb-10 text-[clamp(24px,3vw,38px)] leading-[1.15] font-normal tracking-tight">{t("proj.other")}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <Link key={o.id} href={`/projects/${o.id}`} className="group overflow-hidden rounded-[18px] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className={cn("relative aspect-[3/2] overflow-hidden text-white", o.kind === "vatan" ? "bg-gradient-to-b from-[#F1E4D5] to-[#E8C9A6] [--b:var(--vatan)] [--b2:var(--gold)]" : "bg-gradient-to-b from-[#E4EBF2] to-ice [--b:var(--navy)] [--b2:#2c375a]")}>
                    {o.photo ? (
                      <Image src={o.photo} alt={o.name[lang]} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <BuildingArt kind={o.kind} className="size-full" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <h3 className="font-display text-lg font-normal">{o.name[lang]}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{o.desc[lang]}</p>
                    </div>
                    <ArrowRightIcon className="size-5 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
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

"use client";

import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { LuBuilding2, LuConciergeBell, LuHardHat, LuHotel, LuPackage, LuRoute, LuTruck, LuUtensils, LuWarehouse } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { cn } from "@/lib/utils";

interface Direction {
  id: "construction" | "service" | "logistics";
  prefix: "c" | "s" | "l";
  Icon: IconType;
  icons: IconType[];
  photo?: string;
}

const DIRECTIONS: Direction[] = [
  { id: "construction", prefix: "c", Icon: LuHardHat, icons: [LuBuilding2, LuHardHat, LuRoute, LuWarehouse], photo: "/vatan/14.jpg" },
  { id: "service", prefix: "s", Icon: LuConciergeBell, icons: [LuUtensils, LuHotel, LuBuilding2, LuConciergeBell], photo: "/vatan/07.jpg" },
  { id: "logistics", prefix: "l", Icon: LuTruck, icons: [LuTruck, LuWarehouse, LuPackage, LuRoute] },
];

export function DirectionsView() {
  const { t, openCall } = useSite();

  return (
    <>
      <Header />
      <main>
        <section className="bg-marble pt-[76px]">
          <div className="mx-auto w-[min(1240px,100%-32px)] py-[clamp(56px,8vw,112px)] md:w-[min(1240px,100%-48px)]">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              {t("dirs.eyebrow")}
            </p>
            <h1 className="font-display text-[clamp(48px,8vw,116px)] leading-[0.98] font-medium tracking-tight">{t("dirs.title")}</h1>
            <p className="mt-7 max-w-[56ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-ink/70">{t("dirs.lead")}</p>

            <nav className="mt-12 grid gap-3 sm:grid-cols-3" aria-label={t("dirs.title")}>
              {DIRECTIONS.map((d, i) => (
                <a key={d.id} href={`#${d.id}`} className="group flex items-center gap-4 rounded-2xl bg-paper/80 p-5 ring-1 ring-gold/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-ink">
                    <d.Icon className="size-6" />
                  </span>
                  <span>
                    <small className="block text-xs tracking-widest text-gold-deep">0{i + 1}</small>
                    <b className="font-display text-xl font-medium">{t(`dirs.${d.prefix}.name`)}</b>
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        {DIRECTIONS.map((d, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={d.id} id={d.id} className={cn("py-[clamp(64px,8vw,120px)]", flip ? "bg-cream" : "bg-paper")}>
              <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-10 md:w-[min(1240px,100%-48px)] lg:grid-cols-2 lg:gap-20">
                <Reveal className={cn(flip && "lg:order-2")}>
                  <span className="font-display text-[clamp(64px,8vw,110px)] leading-none font-medium text-gold/50">0{i + 1}</span>
                  <h2 className="mt-2 font-display text-[clamp(38px,5vw,72px)] leading-[1.02] font-medium tracking-tight">{t(`dirs.${d.prefix}.name`)}</h2>
                  {d.id === "service" && <p className="mt-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">{t("dirs.s.sub")}</p>}
                  <p className="mt-6 max-w-[52ch] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink/70">{t(`dirs.${d.prefix}.text`)}</p>
                  <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
                    {d.icons.map((Icon, k) => (
                      <li key={k} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep"><Icon className="size-[18px]" /></span>
                        <span className="pt-1.5 text-[15px] leading-snug">{t(`dirs.${d.prefix}.i${k + 1}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-9">
                    {d.id === "construction" ? (
                      <Button asChild size="lg" className="h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                        <Link href="/#projects">{t("dirs.c.link")}</Link>
                      </Button>
                    ) : (
                      <Button onClick={openCall} size="lg" className="h-12 rounded-full bg-ink px-7 text-[15px] font-semibold text-paper hover:bg-ink-2">
                        {t("dirs.cta")}
                      </Button>
                    )}
                  </div>
                </Reveal>

                <Reveal className={cn(flip && "lg:order-1")}>
                  {d.photo ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40">
                      <Image src={d.photo} alt={t(`dirs.${d.prefix}.name`)} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                    </div>
                  ) : (
                    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[28px] bg-ink text-gold shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40">
                      <div aria-hidden="true" className="absolute inset-0 bg-marble-strong opacity-[0.08]" />
                      <d.Icon className="relative size-[34%] stroke-[0.7]" />
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

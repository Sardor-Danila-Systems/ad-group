"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { VatanGallery } from "@/components/site/vatan-gallery";
import { useSite } from "@/components/site/site-provider";
import { cn } from "@/lib/utils";

const ROOFS = [
  { k: "vatan.t1", clip: "[clip-path:polygon(0_100%,100%_0,100%_100%)]", cls: "" },
  { k: "vatan.t2", clip: "[clip-path:polygon(50%_0,100%_100%,0_100%)]", cls: "" },
  { k: "vatan.t3", clip: "[clip-path:polygon(0_0,100%_100%,0_100%)]", cls: "" },
  { k: "vatan.t4", clip: "[clip-path:polygon(60%_0,100%_0,100%_100%,20%_100%)]", cls: "" },
];

export function Vatan() {
  const { t } = useSite();
  return (
    <section id="vatan" className="relative overflow-hidden bg-vatan py-[clamp(72px,9vw,128px)] text-white">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] items-center gap-10 md:w-[min(1240px,100%-48px)] md:grid-cols-2 md:gap-16">
        <Reveal>
          <Image src="/assets/logo-vatan.png" alt="Vatan Residence" width={300} height={76} className="mb-9 h-[76px] w-auto" />
          <h2 className="font-serif text-[clamp(34px,4.4vw,60px)] leading-[1.05] font-medium text-gold-light">{t("vatan.title")}</h2>
          <p className="mt-5 max-w-[52ch] text-[#C5CDE0]">{t("vatan.text")}</p>
          <ul className="mt-7 mb-9 grid gap-2.5">
            {["vatan.l1", "vatan.l2", "vatan.l3"].map((k) => (
              <li key={k} className="relative pl-7 before:absolute before:top-[.55em] before:left-0 before:h-2.5 before:w-3.5 before:bg-gold before:[clip-path:polygon(50%_0,100%_100%,0_100%)]">
                {t(k)}
              </li>
            ))}
          </ul>
          <VatanCta />
        </Reveal>
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] shadow-2xl ring-1 ring-white/10">
            <Image
              src="/vatan/08.jpg"
              alt="Vatan Residence"
              width={1500}
              height={1487}
              priority={false}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-[clamp(56px,7vw,96px)] w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <VatanGallery />
        <Reveal className="mt-[clamp(48px,6vw,80px)] grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {ROOFS.map((r) => (
            <div
              key={r.k}
              aria-hidden="true"
              className="group relative flex aspect-square items-start overflow-hidden bg-[#0B1B38] p-[18px] font-serif text-[clamp(16px,1.6vw,22px)] leading-[1.15] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="relative z-10">{t(r.k)}</span>
              <span className={cn("absolute inset-x-0 bottom-0 h-[62%] bg-gold", r.clip)} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function VatanCta() {
  const { t, openCall } = useSite();
  return (
    <Button onClick={openCall} size="lg" className="h-12 rounded-full bg-gold px-7 text-[15px] font-semibold text-vatan hover:bg-gold-light">
      {t("vatan.cta")}
    </Button>
  );
}

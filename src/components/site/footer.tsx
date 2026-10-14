"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { useLocalValue } from "@/lib/local-store";

export function Cta() {
  const { t, openCall } = useSite();
  return (
    <section className="bg-ice py-[clamp(56px,7vw,96px)]">
      <Reveal className="mx-auto flex w-[min(1240px,100%-32px)] flex-wrap items-center justify-between gap-7 md:w-[min(1240px,100%-48px)]">
        <h2 className="font-display max-w-[20ch] text-[clamp(26px,3.4vw,44px)] leading-[1.15] font-normal tracking-tight">{t("cta2.title")}</h2>
        <Button onClick={openCall} size="lg" className="h-12 rounded-full px-7 text-[15px] font-semibold">{t("cta.call")}</Button>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const { t } = useSite();
  return (
    <footer id="contacts" className="bg-navy pt-[72px] pb-7 text-white">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] gap-12 md:w-[min(1240px,100%-48px)] md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/assets/logo-ad.png" alt="AD Group" width={160} height={26} className="h-[26px] w-auto brightness-0 invert" />
          <p className="mt-5 max-w-[32ch] text-[#AEB8CF]">{t("footer.slogan")}</p>
          <div className="mt-6 flex gap-2.5">
            {["TG", "IG", "FB", "YT"].map((s) => (
              <a key={s} href="#" className="grid size-[42px] place-items-center rounded-full border border-ice/30 text-xs font-bold transition-colors hover:bg-ice hover:text-navy">{s}</a>
            ))}
          </div>
        </div>
        <Col title={t("footer.nav")}>
          <a href="#projects">{t("nav.projects")}</a>
          <a href="#about">{t("nav.about")}</a>
          <a href="#calculator">{t("nav.invest")}</a>
          <a href="#news">{t("nav.news")}</a>
        </Col>
        <Col title={t("nav.contacts")}>
          <a href="tel:+998712000000">+998 71 200 00 00</a>
          <a href="mailto:adgroup@gmail.com">adgroup@gmail.com</a>
          <span>{t("footer.addr")}</span>
        </Col>
      </div>
      <div className="mx-auto mt-14 flex w-[min(1240px,100%-32px)] flex-wrap justify-between gap-3 border-t border-ice/15 pt-6 text-xs text-[#8E99B5] md:w-[min(1240px,100%-48px)]">
        <small>{t("footer.disc")}</small>
        <small>© 2011–2026 AD Group</small>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 text-ice [&_a:hover]:text-white">
      <h3 className="mb-2 text-[13px] font-semibold tracking-[.12em] text-[#8E99B5] uppercase">{title}</h3>
      {children}
    </div>
  );
}

export function ToTop() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > 900);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <Button
      size="icon-lg"
      aria-label="Up"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-6 z-40 size-12 rounded-full shadow-lg transition-all ${on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  );
}

export function CookieBar() {
  const { t } = useSite();
  // Server snapshot "1" keeps the bar out of the prerendered HTML.
  const [seen, setSeen] = useLocalValue("cookie", "1");
  if (seen === "1") return null;
  return (
    <div className="fixed right-24 bottom-6 left-6 z-[45] flex max-w-[560px] items-center gap-5 rounded-2xl bg-navy p-4 text-sm text-white shadow-2xl max-sm:right-3 max-sm:bottom-3 max-sm:left-3 max-sm:flex-col max-sm:items-start">
      <span>{t("cookie.text")}</span>
      <Button onClick={() => setSeen("1")} className="h-9 rounded-full bg-ice px-4 text-navy hover:bg-white">
        {t("cookie.ok")}
      </Button>
    </div>
  );
}

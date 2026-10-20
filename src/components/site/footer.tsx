"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { LuArrowUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { useLocalValue } from "@/lib/local-store";

export function Cta() {
  const { t, openCall } = useSite();
  return (
    <section className="bg-marble-strong py-[clamp(64px,8vw,112px)]">
      <Reveal className="mx-auto flex w-[min(1240px,100%-32px)] flex-wrap items-center justify-between gap-8 md:w-[min(1240px,100%-48px)]">
        <h2 className="font-display max-w-[20ch] text-[clamp(34px,4.6vw,64px)] leading-[1.04] font-medium tracking-tight">{t("cta2.title")}</h2>
        <Button onClick={openCall} size="lg" className="h-13 rounded-full bg-ink px-8 text-[15px] font-semibold text-paper hover:bg-ink-2">{t("cta.call")}</Button>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const { t } = useSite();
  return (
    <footer id="contacts" className="bg-ink pt-[72px] pb-7 text-paper">
      <div className="mx-auto grid w-[min(1240px,100%-32px)] gap-12 md:w-[min(1240px,100%-48px)] md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={160} height={26} className="h-[26px] w-auto" />
          <p className="mt-5 max-w-[32ch] text-paper/60">{t("footer.slogan")}</p>
          <div className="mt-6 flex gap-2.5">
            <a href="https://instagram.com/vatan.residence" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-[42px] place-items-center rounded-full border border-gold/40 text-gold-light transition-colors hover:bg-gold hover:text-ink"><FaInstagram className="size-[18px]" /></a>
            <a href="https://t.me/vatan_residence" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="grid size-[42px] place-items-center rounded-full border border-gold/40 text-gold-light transition-colors hover:bg-gold hover:text-ink"><FaTelegramPlane className="size-[18px]" /></a>
          </div>
        </div>
        <Col title={t("footer.nav")}>
          <Link href="/#projects">{t("nav.projects")}</Link>
          <Link href="/directions">{t("nav.directions")}</Link>
          <Link href="/#about">{t("nav.about")}</Link>
          <Link href="/#calculator">{t("nav.invest")}</Link>
          <Link href="/#news">{t("nav.news")}</Link>
        </Col>
        <Col title={t("nav.contacts")}>
          <a href="tel:+998662300000">+998 66 230 00 00</a>
          <a href="mailto:adgroup@gmail.com">adgroup@gmail.com</a>
          <span>{t("footer.addr")}</span>
        </Col>
      </div>
      <div className="mx-auto mt-14 flex w-[min(1240px,100%-32px)] flex-wrap justify-between gap-3 border-t border-gold/20 pt-6 text-xs text-paper/45 md:w-[min(1240px,100%-48px)]">
        <small>{t("footer.disc")}</small>
        <small>© 2011–2026 AD Group</small>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 text-paper/80 [&_a:hover]:text-gold-light">
      <h3 className="mb-2 text-[13px] font-semibold tracking-[.14em] text-gold uppercase">{title}</h3>
      {children}
    </div>
  );
}

export function ToTop() {
  const on = useScrolled(900);
  return (
    <Button
      size="icon-lg"
      aria-label="Up"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-6 z-40 size-12 rounded-full bg-gold text-ink shadow-lg transition-all hover:bg-gold-light ${on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <LuArrowUp className="size-5" />
    </Button>
  );
}

function useScrolled(px: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > px);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [px]);
  return on;
}

export function CookieBar() {
  const { t } = useSite();
  // Server snapshot "1" keeps the bar out of the prerendered HTML.
  const [seen, setSeen] = useLocalValue("cookie", "1");
  if (seen === "1") return null;
  return (
    <div className="fixed right-24 bottom-6 left-6 z-[45] flex max-w-[560px] items-center gap-5 rounded-2xl bg-ink p-4 text-sm text-paper shadow-2xl max-sm:right-3 max-sm:bottom-3 max-sm:left-3 max-sm:flex-col max-sm:items-start">
      <span>{t("cookie.text")}</span>
      <Button onClick={() => setSeen("1")} className="h-9 rounded-full bg-gold px-4 font-semibold text-ink hover:bg-gold-light">{t("cookie.ok")}</Button>
    </div>
  );
}

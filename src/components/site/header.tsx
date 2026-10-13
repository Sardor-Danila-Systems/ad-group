"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSite } from "@/components/site/site-provider";
import type { Lang } from "@/lib/content";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#projects", key: "nav.projects" },
  { href: "#about", key: "nav.about" },
  { href: "#vatan", key: "Vatan" },
  { href: "#calculator", key: "nav.invest" },
  { href: "#news", key: "nav.news" },
  { href: "#contacts", key: "nav.contacts" },
];

export function Header() {
  const { t, lang, setLang, openCall } = useSite();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const label = (k: string) => (k === "Vatan" ? k : t(k));

  const langs = (
    <ToggleGroup
      type="single"
      value={lang}
      onValueChange={(v) => v && setLang(v as Lang)}
      spacing={0}
      aria-label="Language"
      className="rounded-full border border-white/25 p-0.5"
    >
      {(["ru", "uz", "en"] as const).map((l) => (
        <ToggleGroupItem
          key={l}
          value={l}
          className="h-7 rounded-full px-2.5 text-xs font-semibold uppercase text-white/70 data-[state=on]:bg-ice data-[state=on]:text-navy hover:bg-white/10 hover:text-white"
        >
          {l}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-white transition-all duration-300",
        solid && "bg-navy/90 shadow-[0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-[76px] w-[min(1240px,100%-32px)] items-center gap-8 md:w-[min(1240px,100%-48px)]">
        <a href="#top" aria-label="AD Group" className="shrink-0">
          <Image src="/assets/logo-ad.png" alt="AD Group" width={160} height={26} priority className="h-[26px] w-auto brightness-0 invert" />
        </a>
        <nav className="ml-auto hidden gap-7 text-sm font-medium lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="opacity-80 transition-opacity hover:opacity-100">
              {label(n.key)}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          {langs}
          <a href="tel:+998712000000" className="hidden text-sm font-semibold xl:block">+998 71 200 00 00</a>
          <Button onClick={openCall} className="hidden h-10 rounded-full bg-ice px-5 text-navy hover:bg-white sm:inline-flex">
            {t("cta.call")}
          </Button>
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Menu">
                <MenuIcon className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-navy p-6 pt-16 text-white">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="border-b border-white/10 py-4 text-lg">
                    {label(n.key)}
                  </a>
                ))}
              </nav>
              <Button
                onClick={() => { setMenu(false); openCall(); }}
                className="mt-4 h-12 rounded-full bg-ice text-base text-navy hover:bg-white"
              >
                {t("cta.call")}
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { LuCheck, LuMenu } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { fx } from "@/components/site/fx";
import { useSite } from "@/components/site/site-provider";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#projects", key: "nav.projects" },
  { href: "/directions", key: "nav.directions" },
  { href: "/#about", key: "nav.about" },
  { href: "/#calculator", key: "nav.invest", wide: true },
  { href: "/vacancies", key: "nav.vacancies" },
  { href: "/#news", key: "nav.news" },
  { href: "/#contacts", key: "nav.contacts" },
];

const LANGS: { code: Lang; name: string }[] = [
  { code: "ru", name: "Русский" },
  { code: "uz", name: "O‘zbekcha" },
  { code: "en", name: "English" },
];

export function Header() {
  const { t, lang, setLang, openCall } = useSite();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  // Solid once scrolled; slides away while scrolling down and comes back on the way up.
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const label = (k: string) => t(k);

  return (
    <header
      className={cn(
        "hdr-enter fixed inset-x-0 top-0 z-50 border-b text-ink transition-[translate,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        solid ? "border-gold/25 bg-paper/90 shadow-sm backdrop-blur-xl" : "border-transparent bg-paper/60 backdrop-blur-md",
        hidden && !menu && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex h-[76px] w-[min(1240px,100%-32px)] items-center gap-8 md:w-[min(1240px,100%-48px)]">
        <Link href="/" aria-label="AD Group" className="shrink-0">
          <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={160} height={26} priority className="h-[26px] w-auto" />
        </Link>
        <nav className="ml-auto hidden gap-7 text-sm font-medium whitespace-nowrap xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("fx-link pb-0.5 text-ink/70 hover:text-gold-deep", n.wide && "hidden 2xl:block")}>
              {label(n.key)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 xl:ml-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label={t("lang.label")} className="h-10 gap-1.5 rounded-full px-3 text-ink hover:bg-gold/10 hover:text-gold-deep">
                <HiOutlineGlobeAlt className="size-5" />
                <span className="text-xs font-semibold uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40 rounded-2xl border-gold/20 bg-paper p-1.5">
              {LANGS.map((l) => (
                <DropdownMenuItem key={l.code} onSelect={() => setLang(l.code)} className="cursor-pointer justify-between rounded-xl px-3 py-2.5 text-[15px] focus:bg-gold/10">
                  {l.name}
                  {l.code === lang && <LuCheck className="size-4 text-gold-deep" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openCall} className={cn("hidden h-10 rounded-full bg-gold px-5 text-sm font-semibold whitespace-nowrap text-ink hover:bg-gold sm:inline-flex", fx.gold)}>
            {t("cta.call")}
          </Button>
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="text-ink hover:bg-gold/10 xl:hidden" aria-label="Menu">
                <LuMenu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-gold/20 bg-paper p-6 pt-16 text-ink">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col">
                {NAV.map((n, i) => (
                  <Link key={n.href} href={n.href} onClick={() => setMenu(false)} style={{ "--i": i } as React.CSSProperties} className="menu-item group flex items-center justify-between border-b border-gold/20 py-4 font-display text-2xl transition-colors hover:text-gold-deep">
                    {label(n.key)}
                    <span aria-hidden="true" className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-10" />
                  </Link>
                ))}
              </nav>
              <Button onClick={() => { setMenu(false); openCall(); }} style={{ "--i": NAV.length } as React.CSSProperties} className={cn("menu-item mt-4 h-12 rounded-full bg-gold text-base font-semibold text-ink hover:bg-gold", fx.gold)}>
                {t("cta.call")}
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

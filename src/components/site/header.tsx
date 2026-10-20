"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { LuCheck, LuMenu } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSite } from "@/components/site/site-provider";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#projects", key: "nav.projects" },
  { href: "/directions", key: "nav.directions" },
  { href: "/#about", key: "nav.about" },
  { href: "/projects/vatan", key: "Vatan" },
  { href: "/#calculator", key: "nav.invest", wide: true },
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
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const label = (k: string) => (k === "Vatan" ? k : t(k));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b text-ink transition-all duration-300",
        solid ? "border-gold/25 bg-paper/90 shadow-sm backdrop-blur-xl" : "border-transparent bg-paper/60 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[76px] w-[min(1240px,100%-32px)] items-center gap-8 md:w-[min(1240px,100%-48px)]">
        <Link href="/" aria-label="AD Group" className="shrink-0">
          <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={160} height={26} priority className="h-[26px] w-auto" />
        </Link>
        <nav className="ml-auto hidden gap-7 text-sm font-medium whitespace-nowrap xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("text-ink/70 transition-colors hover:text-gold-deep", n.wide && "hidden 2xl:block")}>
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
            <DropdownMenuContent align="end" className="min-w-44 rounded-2xl border-gold/20 bg-paper p-1.5">
              <DropdownMenuLabel className="px-3 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("lang.label")}</DropdownMenuLabel>
              {LANGS.map((l) => (
                <DropdownMenuItem key={l.code} onSelect={() => setLang(l.code)} className="cursor-pointer justify-between rounded-xl px-3 py-2.5 text-[15px] focus:bg-gold/10">
                  {l.name}
                  {l.code === lang && <LuCheck className="size-4 text-gold-deep" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openCall} className="hidden h-10 rounded-full bg-gold px-5 text-sm font-semibold whitespace-nowrap text-ink hover:bg-gold-light sm:inline-flex">
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
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="border-b border-gold/20 py-4 font-display text-2xl">
                    {label(n.key)}
                  </Link>
                ))}
              </nav>
              <Button onClick={() => { setMenu(false); openCall(); }} className="mt-4 h-12 rounded-full bg-gold text-base font-semibold text-ink hover:bg-gold-light">
                {t("cta.call")}
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

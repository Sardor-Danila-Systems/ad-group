"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { I18N } from "@/lib/content";
import type { Lang, Project } from "@/lib/types";
import { CallDialog } from "@/components/site/call-dialog";
import { useLocalValue } from "@/lib/local-store";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  openCall: () => void;
}

const SiteCtx = createContext<Ctx | null>(null);

export function SiteProvider({ children, projects }: { children: React.ReactNode; projects: Pick<Project, "id" | "name">[] }) {
  const [saved, setLang] = useLocalValue("lang", "ru");
  const lang: Lang = saved && saved in I18N ? (saved as Lang) : "ru";
  const [callOpen, setCallOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Lead popup: opens once per browser session after the visitor scrolls down a little (public pages only).
  useEffect(() => {
    const KEY = "lead-popup";
    const seen = () => {
      try {
        return sessionStorage.getItem(KEY) === "1";
      } catch {
        return true;
      }
    };
    if (seen()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (window.location.pathname.startsWith("/admin") || window.scrollY < 700 || seen()) return;
      window.removeEventListener("scroll", onScroll);
      // Wait a beat so it does not jump in the middle of a flick.
      timer = setTimeout(() => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        setCallOpen(true);
      }, 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => I18N[lang][key] ?? I18N.ru[key] ?? key,
      openCall: () => setCallOpen(true),
    }),
    [lang, setLang],
  );

  return (
    <SiteCtx.Provider value={value}>
      {children}
      <CallDialog open={callOpen} onOpenChange={setCallOpen} projects={projects} />
    </SiteCtx.Provider>
  );
}

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteProvider");
  return c;
}

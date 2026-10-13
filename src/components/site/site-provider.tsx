"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { I18N, type Lang } from "@/lib/content";
import { CallDialog } from "@/components/site/call-dialog";
import { useLocalValue } from "@/lib/local-store";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  openCall: () => void;
}

const SiteCtx = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [saved, setLang] = useLocalValue("lang", "ru");
  const lang: Lang = saved && saved in I18N ? (saved as Lang) : "ru";
  const [callOpen, setCallOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
      <CallDialog open={callOpen} onOpenChange={setCallOpen} />
    </SiteCtx.Provider>
  );
}

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteProvider");
  return c;
}

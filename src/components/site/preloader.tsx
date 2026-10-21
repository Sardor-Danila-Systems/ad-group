"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_MS = 1500;
const OPEN_MS = 900;

/**
 * Splash with the AD Group logo. Two marble curtains meet on a diagonal seam and
 * slide apart once the page has loaded. Server-rendered so nothing flashes beneath it.
 */
export function Preloader() {
  const isAdmin = usePathname().startsWith("/admin");
  const [phase, setPhase] = useState<"show" | "open" | "gone">("show");

  useEffect(() => {
    const start = performance.now();
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      t1 = setTimeout(() => {
        setPhase("open");
        t2 = setTimeout(() => setPhase("gone"), OPEN_MS);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Tell the page when entrance animations may start (curtains opening, or no preloader at all).
  useEffect(() => {
    if (isAdmin || phase === "open") {
      document.documentElement.setAttribute("data-ready", "1");
      window.dispatchEvent(new Event("site-ready"));
    }
  }, [phase, isAdmin]);

  useEffect(() => {
    document.documentElement.style.overflow = isAdmin || phase === "gone" ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase, isAdmin]);

  if (isAdmin || phase === "gone") return null;
  const open = phase === "open";
  const curtain = "absolute inset-0 bg-marble-strong transition-transform ease-[cubic-bezier(0.77,0,0.18,1)]";
  return (
    <div role="status" aria-label="Loading" className={cn("fixed inset-0 z-[100] overflow-hidden", open && "pointer-events-none")}>
      <div className={cn(curtain, "curtain-left duration-[900ms]", open && "-translate-x-full")} />
      <div className={cn(curtain, "curtain-right duration-[900ms]", open && "translate-x-full")} />
      <div className={cn("absolute inset-0 grid place-items-center transition-all duration-500", open && "scale-95 opacity-0")}>
        <div className="flex w-[min(380px,78vw)] flex-col items-center gap-8">
          <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={420} height={63} priority className="loader-logo h-auto w-full" />
          <div className="h-px w-full overflow-hidden bg-gold/25">
            <div className="loader-bar h-full origin-left bg-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Light-weight placeholder used while a route segment streams in. */
export function RouteLoader() {
  return (
    <div role="status" aria-label="Loading" className="grid min-h-svh place-items-center bg-marble-strong">
      <div className="w-[min(200px,60vw)]">
        <div className="h-px w-full overflow-hidden bg-gold/25">
          <div className="loader-bar h-full origin-left bg-gold" />
        </div>
      </div>
    </div>
  );
}

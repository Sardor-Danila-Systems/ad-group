"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_MS = 1100;

/** Full-screen splash for the first paint. Server-rendered so content never flashes beneath it. */
export function Preloader() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    const start = performance.now();
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      t1 = setTimeout(() => {
        setPhase("hide");
        t2 = setTimeout(() => setPhase("gone"), 600);
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

  useEffect(() => {
    document.documentElement.style.overflow = phase === "show" ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  if (phase === "gone") return null;
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-navy text-white transition-all duration-500 ease-out",
        phase === "hide" && "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div className="flex w-[min(260px,70vw)] flex-col items-center gap-8">
        <Image src="/assets/logo-ad.png" alt="AD Group" width={240} height={39} priority className="loader-logo h-auto w-full brightness-0 invert" />
        <div className="h-px w-full overflow-hidden bg-white/15">
          <div className="loader-bar h-full origin-left bg-gold-light" />
        </div>
      </div>
    </div>
  );
}

/** Light-weight placeholder used while a route segment streams in. */
export function RouteLoader() {
  return (
    <div role="status" aria-label="Loading" className="grid min-h-svh place-items-center bg-navy">
      <div className="w-[min(200px,60vw)]">
        <div className="h-px w-full overflow-hidden bg-white/15">
          <div className="loader-bar h-full origin-left bg-gold-light" />
        </div>
      </div>
    </div>
  );
}

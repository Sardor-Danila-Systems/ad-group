"use client";

import { useEffect, useRef, useState } from "react";

/** Counts from 0 to `to` once the page is ready (preloader opened) and the number is on screen. */
export function Counter({ to, suffix = "", className, duration = 1800 }: { to: number; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let cancelled = false;
    let started = false;
    const run = () => {
      if (started || cancelled) return;
      started = true;
      let t0: number | null = null;
      const step = (ts: number) => {
        t0 ??= ts;
        const p = Math.min(1, (ts - t0) / duration);
        setV(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const whenReady = (fn: () => void) => {
      if (document.documentElement.hasAttribute("data-ready")) fn();
      else window.addEventListener("site-ready", fn, { once: true });
    };
    const reset = requestAnimationFrame(() => setV(0));
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        whenReady(run);
      }
    });
    io.observe(el);
    return () => {
      cancelled = true;
      cancelAnimationFrame(reset);
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("site-ready", run);
    };
  }, [to, duration]);

  const text = v.toLocaleString("ru-RU").replace(/ /g, " ");
  const full = to.toLocaleString("ru-RU").replace(/ /g, " ");
  // The final value is rendered invisibly in the same cell so the width never changes while counting.
  return (
    <span ref={ref} className={`inline-grid whitespace-nowrap ${className ?? ""}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{full}{suffix}</span>
      <span className="col-start-1 row-start-1">{text}{suffix}</span>
    </span>
  );
}

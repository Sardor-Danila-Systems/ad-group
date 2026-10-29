"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `to` once the page is ready (preloader opened) and the number is on screen.
 * Pass `active` to control the start yourself (for numbers that are on screen but not yet revealed).
 */
export function Counter({ to, suffix = "", className, duration = 1800, active, grouping = true }: { to: number; suffix?: string; className?: string; duration?: number; active?: boolean; grouping?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);

  // Externally controlled start: stay at 0 until `active`, then count once.
  const ran = useRef(false);
  useEffect(() => {
    if (active === undefined || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (ran.current) return;
    let raf = 0;
    if (!active) {
      raf = requestAnimationFrame(() => setV(0));
      return () => cancelAnimationFrame(raf);
    }
    ran.current = true;
    let t0: number | null = null;
    const step = (ts: number) => {
      t0 ??= ts;
      const p = Math.min(1, (ts - t0) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, to, duration]);

  useEffect(() => {
    const el = ref.current;
    if (active !== undefined || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, duration]);

  const fmt = (n: number) => (grouping ? n.toLocaleString("ru-RU") : String(n));
  const text = fmt(v).replace(/ /g, " ");
  const full = fmt(to).replace(/ /g, " ");
  // The final value is rendered invisibly in the same cell so the width never changes while counting.
  return (
    <span ref={ref} className={`inline-grid whitespace-nowrap ${className ?? ""}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{full}{suffix}</span>
      <span className="col-start-1 row-start-1">{text}{suffix}</span>
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Fade/slide in once on first view. Content is visible without JS/IntersectionObserver. */
export function Reveal({ children, className, as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "blockquote" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    // Already on screen at mount: show as-is, otherwise it would flash out and back in.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref}
      className={cn(armed && "transition-all duration-700 ease-out", armed && !shown && "translate-y-7 opacity-0", className)}
    >
      {children}
    </Comp>
  );
}

export function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let t0: number | null = null;
      const step = (ts: number) => {
        t0 ??= ts;
        const p = Math.min(1, (ts - t0) / 1400);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  const text = (n: number) => n.toLocaleString("ru-RU").replace(/\u00a0/g, " ");
  // The final value is rendered invisibly in the same grid cell so the box keeps its width while counting.
  return (
    <b ref={ref} className={cn("grid whitespace-nowrap", className)}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{text(to)}</span>
      <span className="col-start-1 row-start-1">{text(v)}</span>
    </b>
  );
}

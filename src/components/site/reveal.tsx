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

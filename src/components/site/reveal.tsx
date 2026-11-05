import { cn } from "@/lib/utils";

/**
 * How an element comes in when it scrolls into view (styles in globals.css, «Motion»):
 * - up / left / right: slides in from that side;
 * - blur: comes into focus; pop: grows from smaller; zoom: a card opening from its centre; fade;
 * - stagger: its direct children come one after another (`from`: up, left, right, pop or cards — a fan from the right);
 * - img: an image frame; the picture opens (`from`: bottom by default, left, right, diag) and settles from a zoom;
 * - line: a hairline grows from the left.
 */
export type RevealKind = "up" | "left" | "right" | "blur" | "pop" | "zoom" | "fade" | "stagger" | "img" | "line";
export type RevealFrom = "up" | "left" | "right" | "pop" | "cards" | "diag";

/** Entrance animation on first view. The page is complete without JS or with reduced motion. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  kind = "up",
  from,
  delay,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "blockquote" | "span" | "ul" | "ol" | "li" | "dl" | "p";
  kind?: RevealKind;
  from?: RevealFrom;
  /** Milliseconds before it starts. */
  delay?: number;
  id?: string;
}) {
  const Comp = Tag as "div";
  return (
    <Comp id={id} data-reveal={kind} data-from={from} className={className} style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </Comp>
  );
}

/** Props for an image frame that opens on first view (spread onto the frame element). */
export const imgReveal = (from?: Exclude<RevealFrom, "up" | "pop" | "cards">, delay?: number) => ({
  "data-reveal": "img",
  "data-from": from,
  style: delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined,
});

/**
 * A heading whose words come in one by one: rise from under a mask (default), flip up in 3D,
 * or slide in from the right out of focus. Pass plain text; spaces stay as they are.
 */
export function Words({ text, delay = 0, v, className }: { text: string; delay?: number; v?: "flip" | "slide"; className?: string }) {
  let i = 0;
  return (
    <span data-reveal="words" data-v={v} className={className} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      {text.split(/(\s+)/).map((w, k) =>
        /^\s+$/.test(w) || !w ? (
          w
        ) : (
          <span key={k} className="sw">
            <span style={{ "--w": i++ } as React.CSSProperties}>{w}</span>
          </span>
        ),
      )}
    </span>
  );
}

/** A short gold hairline (the eyebrow dash) that grows in. */
export function Line({ className }: { className?: string }) {
  return <span aria-hidden="true" data-reveal="line" className={cn("block h-px w-10 shrink-0 bg-gold", className)} />;
}

/** Classes that make a section one full screen on desktop, its content centred (the paged scroll stops once per block). */
export const SLIDE = "lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-[clamp(84px,11svh,120px)]";

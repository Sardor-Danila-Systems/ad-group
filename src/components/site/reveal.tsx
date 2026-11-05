import { cn } from "@/lib/utils";

/**
 * How an element comes in when it scrolls into view (styles in globals.css, «Motion»):
 * - up: rises and fades in (default);
 * - fade: fades in only;
 * - stagger: its direct children come in one after another;
 * - img: an image frame; the picture opens from the bottom and settles from a slight zoom;
 * - line: a hairline grows from the left.
 */
export type RevealKind = "up" | "fade" | "stagger" | "img" | "line";

/** Entrance animation on first view. The page is complete without JS or with reduced motion. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  kind = "up",
  delay,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "blockquote" | "span" | "ul" | "ol" | "li" | "dl" | "p";
  kind?: RevealKind;
  /** Milliseconds before it starts. */
  delay?: number;
  id?: string;
}) {
  const Comp = Tag as "div";
  return (
    <Comp id={id} data-reveal={kind} className={className} style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </Comp>
  );
}

/**
 * A heading whose words rise one by one from under a mask (the Sheron-style title).
 * Pass plain text; spaces and line breaks stay as they are.
 */
export function Words({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  let i = 0;
  return (
    <span data-reveal="words" className={className} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
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

"use client";

import { useSite } from "@/components/site/site-provider";
import type { Fact } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Figures of a project in a hairline grid; empty white cells close the last row so no gaps show.
 * `compact`: two columns at every width (for a half-width column). The cells pop in one by one.
 */
export function FactsGrid({ facts, compact }: { facts: Fact[]; compact?: boolean }) {
  const { lang } = useSite();
  const fill2 = (2 - (facts.length % 2)) % 2;
  const fill4 = compact ? fill2 : (4 - (facts.length % 4)) % 4;
  return (
    <dl data-reveal="stagger" data-from="pop" className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-gold/25 ring-1 ring-gold/25", !compact && "md:grid-cols-4")}>
      {facts.map((f) => (
        <div key={f.label.ru} className={cn("bg-white p-5 sm:p-7", compact && "lg:p-6")}>
          <dd className="font-display text-[clamp(26px,3vw,44px)] leading-none font-medium whitespace-nowrap text-gold-deep">{f.value}</dd>
          <dt className="mt-2.5 text-sm text-muted-foreground">{f.label[lang]}</dt>
        </div>
      ))}
      {Array.from({ length: Math.max(fill2, fill4) }, (_, i) => (
        <div key={`fill-${i}`} aria-hidden="true" className={cn("bg-white", !compact && (i < fill2 ? "" : "max-md:hidden"), !compact && (i < fill4 ? "" : "md:hidden"))} />
      ))}
    </dl>
  );
}

"use client";

import { useSite } from "@/components/site/site-provider";
import type { Fact } from "@/lib/types";

/** Figures of a project in a hairline grid; empty white cells close the last row so no gaps show. */
export function FactsGrid({ facts }: { facts: Fact[] }) {
  const { lang } = useSite();
  const fill2 = (2 - (facts.length % 2)) % 2;
  const fill4 = (4 - (facts.length % 4)) % 4;
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-gold/25 ring-1 ring-gold/25 md:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label.ru} className="bg-white p-5 sm:p-7">
          <dd className="font-display text-[clamp(26px,3vw,44px)] leading-none font-medium whitespace-nowrap text-gold-deep">{f.value}</dd>
          <dt className="mt-2.5 text-sm text-muted-foreground">{f.label[lang]}</dt>
        </div>
      ))}
      {Array.from({ length: Math.max(fill2, fill4) }, (_, i) => (
        <div key={`fill-${i}`} aria-hidden="true" className={`bg-white ${i < fill2 ? "" : "max-md:hidden"} ${i < fill4 ? "" : "md:hidden"}`} />
      ))}
    </dl>
  );
}

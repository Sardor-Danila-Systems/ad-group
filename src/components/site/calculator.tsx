"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { installment, LIMITS, type Currency } from "@/lib/installment";

/** Interest-free developer instalment calculator: price, down payment, term → balance and monthly payment. */
export function Calculator() {
  const { t, lang, openCall } = useSite();
  const [cur, setCur] = useState<Currency>("USD");
  const [price, setPrice] = useState(String(LIMITS.USD.defaultPrice));
  const [downPct, setDownPct] = useState(30);
  const [term, setTerm] = useState(24);
  const lim = LIMITS[cur];

  const num = (s: string) => Number(s.replace(/[\s ]/g, "").replace(",", "."));
  const r = installment({ price: num(price), downPct, term, currency: cur });

  const fmt = (v: number) => {
    const n = Math.round(v).toLocaleString(lang === "en" ? "en-US" : "ru-RU").replace(/ /g, " ");
    return cur === "USD" ? `$${n}` : `${n} ${t("cur.suffix")}`;
  };
  /** "24 месяца", "5 месяцев", "1 месяц"; Uzbek and English forms come from the strings. */
  const months = (n: number) => {
    if (lang === "ru") {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return "месяц";
      if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "месяца";
      return "месяцев";
    }
    if (lang === "en") return n === 1 ? "month" : "months";
    return t("calc.monthsLong");
  };
  const err = (key: string, min: number, max: number) => t(key).replace("{min}", fmt(min)).replace("{max}", fmt(max));
  const errText =
    r.error === "price" ? err("calc.err.price", lim.minPrice, lim.maxPrice) : r.error === "term" ? t("calc.err.term").replace("{min}", String(LIMITS.minTerm)).replace("{max}", String(LIMITS.maxTerm)) : null;

  const switchCur = (next: Currency) => {
    if (next === cur) return;
    setCur(next);
    setPrice(String(LIMITS[next].defaultPrice));
  };

  return (
    <section id="calculator" className="bg-cream py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Reveal className="mb-12">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-semibold tracking-[.18em] text-gold-deep uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            {t("calc.eyebrow")}
          </p>
          <h2 className="font-display text-[clamp(34px,4.6vw,64px)] leading-[1.04] font-medium tracking-tight">{t("calc.title")}</h2>
          <p className="mt-4 max-w-[60ch] text-ink/70">{t("calc.lead")}</p>
        </Reveal>

        <Reveal className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <form onSubmit={(e) => e.preventDefault()} noValidate className="grid content-start gap-7 rounded-[22px] bg-white p-6 ring-1 ring-gold/20 sm:p-8">
            <ToggleGroup type="single" value={cur} onValueChange={(v) => v && switchCur(v as Currency)} spacing={0} aria-label="Currency" className="w-fit rounded-full bg-cream p-1">
              {(["USD", "UZS"] as const).map((c) => (
                <ToggleGroupItem key={c} value={c} className="h-9 rounded-full px-5 text-[13px] font-semibold data-[state=on]:bg-ink data-[state=on]:text-paper">
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="grid gap-2.5">
              <Label htmlFor="calc-price" className="text-sm font-semibold">{t("calc.price")}</Label>
              <div className="relative">
                <Input
                  id="calc-price"
                  inputMode="numeric"
                  autoComplete="off"
                  value={price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  aria-invalid={r.error === "price"}
                  aria-describedby={r.error === "price" ? "calc-error" : undefined}
                  className="h-12 rounded-xl bg-paper pr-16 text-lg font-semibold"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-sm text-muted-foreground">{cur === "USD" ? "USD" : t("cur.suffix")}</span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="calc-down" className="text-sm font-semibold">{t("calc.down")}</Label>
                <span className="text-sm font-semibold text-gold-deep tabular-nums">
                  {downPct}% · {r.error === "price" ? "—" : fmt(r.down)}
                </span>
              </div>
              <Slider id="calc-down" min={LIMITS.minDownPct} max={LIMITS.maxDownPct} step={5} value={[downPct]} onValueChange={([v]) => setDownPct(v)} aria-label={t("calc.down")} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>{LIMITS.minDownPct}%</span><span>{LIMITS.maxDownPct}%</span></div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="calc-term" className="text-sm font-semibold">{t("calc.term")}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="calc-term-input"
                    inputMode="numeric"
                    aria-label={t("calc.term")}
                    value={String(term)}
                    onChange={(e) => {
                      const v = Number(e.target.value.replace(/\D/g, ""));
                      setTerm(Number.isFinite(v) ? Math.min(v, 999) : 0);
                    }}
                    aria-invalid={r.error === "term"}
                    className="h-9 w-16 rounded-lg bg-paper text-center font-semibold tabular-nums"
                  />
                  <span className="text-sm text-muted-foreground">{months(term)}</span>
                </div>
              </div>
              <Slider id="calc-term" min={LIMITS.minTerm} max={LIMITS.maxTerm} step={1} value={[Math.min(Math.max(term, LIMITS.minTerm), LIMITS.maxTerm)]} onValueChange={([v]) => setTerm(v)} aria-label={t("calc.term")} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>{LIMITS.minTerm} {t("calc.months")}</span><span>{LIMITS.maxTerm} {t("calc.months")}</span></div>
            </div>

            {errText && (
              <p id="calc-error" role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errText}
              </p>
            )}
          </form>

          <div className="flex flex-col rounded-[22px] bg-ink p-6 text-paper sm:p-8" aria-live="polite">
            <p className="text-sm text-paper/60">{t("calc.monthly")}</p>
            <p className="mt-2 font-display text-[clamp(40px,5vw,64px)] leading-none font-medium text-gold-light tabular-nums">{r.error ? "—" : fmt(r.monthly)}</p>
            <p className="mt-3 text-sm text-paper/60">
              × {r.error ? "—" : `${r.term} ${months(r.term)}`} · {t("calc.noInterest")}
            </p>
            {!r.error && r.last !== r.monthly && (
              <p className="mt-1 text-xs text-paper/50">
                {t("calc.last")}: {fmt(r.last)}
              </p>
            )}

            <dl className="mt-8 grid gap-4 border-t border-paper/15 pt-6 text-[15px]">
              {[
                [t("calc.price"), r.price],
                [`${t("calc.down")} (${downPct}%)`, r.down],
                [t("calc.rest"), r.rest],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex items-baseline justify-between gap-4">
                  <dt className="text-paper/65">{k}</dt>
                  <dd className="font-semibold tabular-nums">{r.error ? "—" : fmt(Number(v))}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 border-t border-paper/15 pt-4">
                <dt className="text-paper/65">{t("calc.total")}</dt>
                <dd className="font-semibold text-gold-light tabular-nums">{r.error ? "—" : fmt(r.price)}</dd>
              </div>
            </dl>

            <Button onClick={openCall} size="lg" className="mt-8 h-12 rounded-full bg-gold px-7 text-[15px] font-semibold text-ink hover:bg-gold-light">
              {t("calc.cta")}
            </Button>
            <p className="mt-5 text-xs leading-relaxed text-paper/50">{t("calc.note")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

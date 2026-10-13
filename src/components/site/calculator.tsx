"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";

const GROWTH = 0.15;
const DEPOSIT = 0.13;

export function Calculator() {
  const { t, lang } = useSite();
  const [cur, setCur] = useState<"USD" | "UZS">("USD");
  const [area, setArea] = useState(60);
  const [price, setPrice] = useState(900);
  const [down, setDown] = useState(30);
  const [term, setTerm] = useState(36);
  const [rate, setRate] = useState(12700);

  const fmt = (v: number) => {
    const n = Math.round(v).toLocaleString(lang === "en" ? "en-US" : "ru-RU").replace(/ /g, " ");
    return cur === "USD" ? `$${n}` : `${n} ${t("cur.suffix")}`;
  };

  const total = area * price;
  const downSum = (total * down) / 100;
  const monthly = (total - downSum) / term;
  const propertyValue = total * Math.pow(1 + GROWTH, term / 12);
  const mr = Math.pow(1 + DEPOSIT, 1 / 12) - 1;
  let bank = downSum * Math.pow(1 + DEPOSIT, term / 12);
  for (let i = 1; i <= term; i++) bank += monthly * Math.pow(1 + mr, term - i);
  const diff = propertyValue - bank;

  const switchCur = (next: "USD" | "UZS") => {
    if (next === cur) return;
    setPrice(next === "UZS" ? Math.round(price * rate) : Math.round(price / rate));
    setCur(next);
  };

  return (
    <section id="calculator" className="py-[clamp(72px,9vw,128px)]">
      <div className="mx-auto w-[min(1240px,100%-32px)] md:w-[min(1240px,100%-48px)]">
        <Reveal className="mb-12">
          <h2 className="font-display text-[clamp(26px,3.4vw,44px)] leading-[1.15] font-normal tracking-tight">{t("calc.title")}</h2>
          <p className="mt-3 max-w-[56ch] text-muted-foreground">{t("calc.lead")}</p>
        </Reveal>

        <Reveal className="grid gap-6 lg:grid-cols-[5fr_6fr]">
          <form onSubmit={(e) => e.preventDefault()} className="grid content-start gap-6 rounded-[18px] bg-white p-6 sm:p-8">
            <ToggleGroup type="single" value={cur} onValueChange={(v) => v && switchCur(v as "USD" | "UZS")} spacing={0} className="w-fit rounded-full bg-background p-1">
              {(["USD", "UZS"] as const).map((c) => (
                <ToggleGroupItem key={c} value={c} className="h-9 rounded-full px-5 text-[13px] font-semibold data-[state=on]:bg-navy data-[state=on]:text-white">
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <Field label={t("calc.area")} id="cArea">
              <Input id="cArea" type="number" min={10} max={500} value={area} onChange={(e) => setArea(+e.target.value)} className="h-11 rounded-xl bg-background" />
            </Field>
            <Field label={t("calc.price")} id="cPrice">
              <Input id="cPrice" type="number" min={1} value={price} onChange={(e) => setPrice(+e.target.value)} className="h-11 rounded-xl bg-background" />
            </Field>
            <Field label={t("calc.down")} id="cDown" value={`${down}%`}>
              <Slider id="cDown" min={10} max={90} step={1} value={[down]} onValueChange={([v]) => setDown(v)} />
            </Field>
            <Field label={t("calc.term")} id="cTerm" value={String(term)}>
              <Slider id="cTerm" min={6} max={60} step={6} value={[term]} onValueChange={([v]) => setTerm(v)} />
            </Field>
            <Field label={t("calc.rate")} id="cRate">
              <Input id="cRate" type="number" min={1} value={rate} onChange={(e) => setRate(+e.target.value || 1)} className="h-11 rounded-xl bg-background" />
            </Field>
          </form>

          <div className="rounded-[18px] bg-white p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 rounded-2xl bg-navy p-6 text-white">
                <small className="text-[13px] opacity-70">{t("calc.ad")}</small>
                <b className="font-display text-[clamp(20px,2.2vw,30px)] leading-tight font-normal">{fmt(propertyValue)}</b>
                <span className="text-sm font-semibold text-gold-light">+{fmt(propertyValue - total)}</span>
              </div>
              <div className="grid gap-1.5 rounded-2xl bg-background p-6">
                <small className="text-[13px] opacity-70">{t("calc.bank")}</small>
                <b className="font-display text-[clamp(20px,2.2vw,30px)] leading-tight font-normal">{fmt(bank)}</b>
                <span className="text-sm font-semibold text-muted-foreground">+{fmt(bank - total)}</span>
              </div>
            </div>
            <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-3">
              <Stat label={t("calc.total")} value={fmt(total)} />
              <Stat label={t("calc.monthly")} value={fmt(monthly)} />
              <Stat label={t("calc.diff")} value={`${diff >= 0 ? "+" : ""}${fmt(diff)}`} className="text-emerald-700" />
            </div>
            <p className="mt-7 text-[13px] text-muted-foreground">{t("calc.note")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, id, value, children }: { label: string; id: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-semibold">{label}</Label>
        {value && <em className="text-sm font-semibold text-gold not-italic">{value}</em>}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <small className="block text-[13px] text-muted-foreground">{label}</small>
      <b className={`text-lg ${className ?? ""}`}>{value}</b>
    </div>
  );
}

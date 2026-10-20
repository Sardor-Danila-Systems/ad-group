"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitLead } from "@/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSite } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const field = "h-12 rounded-xl border-input bg-paper px-4 text-[15px] placeholder:text-muted-foreground/70 focus-visible:border-gold focus-visible:ring-gold/30";

export function LeadForm({ projects, source, onDone, className }: { projects: Pick<Project, "id" | "name">[]; source: string; onDone?: () => void; className?: string }) {
  const { t, lang } = useSite();
  const [busy, setBusy] = useState(false);
  const [interest, setInterest] = useState("any");

  return (
    <form
      className={cn("grid gap-3.5", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        data.set("interest", interest === "any" ? t("lead.interest.any") : (projects.find((p) => p.id === interest)?.name[lang] ?? interest));
        data.set("source", source);
        setBusy(true);
        try {
          const res = await submitLead(data);
          if (res.ok) {
            toast.success(t("lead.ok"));
            form.reset();
            setInterest("any");
            onDone?.();
          } else {
            toast.error(t("lead.err"));
          }
        } catch {
          toast.error(t("lead.err"));
        } finally {
          setBusy(false);
        }
      }}
    >
      <Input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder={t("lead.name")} className={field} />
      <Input name="phone" type="tel" required autoComplete="tel" defaultValue="+998 " placeholder={t("lead.phone")} className={field} />
      <Select value={interest} onValueChange={setInterest}>
        <SelectTrigger aria-label={t("lead.interest")} className={cn(field, "w-full justify-between")}>
          <SelectValue placeholder={t("lead.interest")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">{t("lead.interest.any")}</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>{p.name[lang]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea name="message" rows={3} maxLength={1000} placeholder={t("lead.message")} className="rounded-xl border-input bg-paper px-4 py-3 text-[15px] focus-visible:border-gold focus-visible:ring-gold/30" />
      {/* Honeypot: hidden from people, filled by bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
      <Button type="submit" disabled={busy} className="h-12 rounded-full bg-ink text-[15px] font-semibold text-paper hover:bg-ink-2">
        {t("lead.send")}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">{t("lead.privacy")}</p>
    </form>
  );
}

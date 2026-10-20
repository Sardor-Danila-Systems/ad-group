"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeadForm } from "@/components/site/lead-form";
import { useSite, type CallOptions } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";

/** Application form as a modal: photo on the left, form on the right (stacked on phones). */
export function CallDialog({ open, onOpenChange, projects, options }: { open: boolean; onOpenChange: (o: boolean) => void; projects: Pick<Project, "id" | "name">[]; options: CallOptions }) {
  const { t } = useSite();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-[calc(100%-1.5rem)] gap-0 overflow-y-auto rounded-3xl border-0 bg-paper p-0 ring-1 ring-gold/30 sm:max-w-4xl">
        <div className="grid md:grid-cols-[0.85fr_1fr]">
          <div className="relative hidden min-h-[520px] md:block">
            <Image src="/vatan/03.jpg" alt="" fill sizes="400px" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-paper">
              <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={150} height={24} className="mb-4 h-5 w-auto" />
              <p className="font-display text-2xl leading-snug font-medium">{options.vacancy ?? t("lead.title")}</p>
            </div>
          </div>
          <div className="p-6 sm:p-9">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-display text-3xl font-medium sm:text-4xl">{options.vacancy ? t("vac.apply.title") : t("call.title")}</DialogTitle>
              <DialogDescription className="text-[15px]">{options.vacancy ? t("vac.apply.text") : t("lead.text")}</DialogDescription>
            </DialogHeader>
            <LeadForm projects={projects} source={options.vacancy ? "vacancy" : "popup"} vacancy={options.vacancy} onDone={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

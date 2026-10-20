"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeadForm } from "@/components/site/lead-form";
import { useSite } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";

export function CallDialog({ open, onOpenChange, projects }: { open: boolean; onOpenChange: (o: boolean) => void; projects: Pick<Project, "id" | "name">[] }) {
  const { t } = useSite();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-paper p-8 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-medium">{t("call.title")}</DialogTitle>
          <DialogDescription>{t("call.text")}</DialogDescription>
        </DialogHeader>
        <LeadForm projects={projects} source="dialog" onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

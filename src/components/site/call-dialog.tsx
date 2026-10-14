"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSite } from "@/components/site/site-provider";

export function CallDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useSite();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl p-8 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-normal">{t("call.title")}</DialogTitle>
          <DialogDescription>{t("call.text")}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            // Demo: nothing is sent anywhere.
            toast.success(t("call.ok"));
            onOpenChange(false);
            e.currentTarget.reset();
          }}
        >
          <Input name="name" required placeholder={t("call.name")} className="h-11 rounded-xl" />
          <Input name="phone" type="tel" required defaultValue="+998 " placeholder={t("call.phone")} className="h-11 rounded-xl" />
          <Textarea name="q" rows={3} placeholder={t("call.q")} className="rounded-xl" />
          <Button type="submit" size="lg" className="h-11 rounded-full">{t("call.send")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

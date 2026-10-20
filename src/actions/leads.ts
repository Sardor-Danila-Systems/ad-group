"use server";

import { addLead } from "@/lib/server/store";

export interface LeadResult {
  ok: boolean;
  error?: "invalid";
}

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/** Public lead form. Validates on the server and stores the request for the admin panel. */
export async function submitLead(formData: FormData): Promise<LeadResult> {
  if (clip(formData.get("website"), 200) !== "") return { ok: true }; // honeypot: silently accept bots
  const name = clip(formData.get("name"), 100);
  const phone = clip(formData.get("phone"), 40);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || digits.length < 9 || digits.length > 15) return { ok: false, error: "invalid" };
  await addLead({
    name,
    phone,
    interest: clip(formData.get("interest"), 120),
    message: clip(formData.get("message"), 1000),
    source: clip(formData.get("source"), 40),
  });
  return { ok: true };
}

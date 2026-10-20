"use server";

export interface LeadResult {
  ok: boolean;
  error?: "invalid";
}

/** Validates a lead request. Persistence is added with the admin panel. */
export async function submitLead(formData: FormData): Promise<LeadResult> {
  if (String(formData.get("website") ?? "") !== "") return { ok: true }; // honeypot: silently accept bots
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 100 || digits.length < 9 || digits.length > 15) {
    return { ok: false, error: "invalid" };
  }
  return { ok: true };
}

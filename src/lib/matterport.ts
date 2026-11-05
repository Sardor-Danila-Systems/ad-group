/**
 * Matterport 3D tours. Only links to my.matterport.com spaces are accepted, so a link entered in the admin
 * can never put an arbitrary page into the site.
 */
const ID = /^[A-Za-z0-9]{11}$/;

/** Space id from a pasted link ("https://my.matterport.com/show/?m=F81totvRM7Q", with or without extras) or a bare id. */
export function matterportId(input: string | undefined | null): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  if (ID.test(raw)) return raw;
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.hostname !== "my.matterport.com" && u.hostname !== "matterport.com") return null;
  const id = u.searchParams.get("m") ?? "";
  return ID.test(id) ? id : null;
}

/** Whether a project has a showroom to open: a Matterport tour or panoramas. */
export const hasShowroom = (p: { matterport?: string; showroom?: unknown[] }) => Boolean(matterportId(p.matterport) || p.showroom?.length);

/** Canonical share link for a space id. */
export const matterportLink = (id: string) => `https://my.matterport.com/show/?m=${id}`;

/**
 * Embed address: starts right away (play), skips the fly-in (qs), hides the Matterport branding panel and help,
 * and uses the site language where Matterport has it (it has no Uzbek, so Uzbek visitors get Russian).
 */
export function matterportEmbed(id: string, lang: "ru" | "uz" | "en") {
  const p = new URLSearchParams({ m: id, play: "1", qs: "1", brand: "0", help: "0", lang: lang === "en" ? "en" : "ru" });
  return `https://my.matterport.com/show/?${p}`;
}

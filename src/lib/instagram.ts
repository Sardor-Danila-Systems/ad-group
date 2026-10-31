/**
 * Normalises what an admin pastes for an Instagram account: "@ad.group", "ad.group",
 * "instagram.com/ad.group" or a full link (with or without query). Returns a canonical
 * https://www.instagram.com/<account>/ link, or null when it is not an Instagram account.
 */
export function instagramUrl(input: string | null | undefined): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  let account: string | undefined;
  if (/^@?[\w.]{1,30}$/.test(raw)) {
    account = raw.replace(/^@/, "");
  } else {
    let u: URL;
    try {
      u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    } catch {
      return null;
    }
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!/^(www\.|m\.)?instagram\.com$/i.test(u.hostname)) return null;
    account = u.pathname.split("/").filter(Boolean)[0];
  }
  if (!account || !/^[\w.]{1,30}$/.test(account) || /^\.|\.$|\.\./.test(account)) return null;
  if (["p", "reel", "reels", "explore", "stories", "accounts", "tv"].includes(account.toLowerCase())) return null;
  return `https://www.instagram.com/${account}/`;
}

/**
 * Canonical links from a stored value or admin input: a list, a single link (older data) or text with
 * links separated by spaces, commas or new lines. Invalid entries are dropped, duplicates removed.
 */
export function instagramList(value: unknown): string[] {
  const parts = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\s,]+/) : [];
  const links = parts.map((v) => instagramUrl(typeof v === "string" ? v : null)).filter((v): v is string => Boolean(v));
  return [...new Set(links)];
}

/** "@account" label for a canonical link. */
export const instagramHandle = (url: string) => `@${url.replace(/^https:\/\/www\.instagram\.com\//, "").replace(/\/$/, "")}`;

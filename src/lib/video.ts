export type Video =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string; hash?: string }
  | { kind: "file"; src: string };

const YT_ID = /^[\w-]{11}$/;

/**
 * Recognises a pasted link. Only YouTube, Vimeo and direct https video files are accepted,
 * so a link entered in the admin can never inject an arbitrary page into the site.
 */
export function parseVideo(input: string | undefined | null): Video | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.split("/")[1] ?? "";
    return YT_ID.test(id) ? { kind: "youtube", id } : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const id = u.searchParams.get("v") ?? (["embed", "shorts", "live", "v"].includes(parts[0]) ? parts[1] : "") ?? "";
    return YT_ID.test(id ?? "") ? { kind: "youtube", id: id! } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts.find((p) => /^\d+$/.test(p));
    if (!id) return null;
    // Unlisted Vimeo links carry a privacy hash: vimeo.com/<id>/<hash> or ?h=<hash>.
    const hash = u.searchParams.get("h") ?? parts.find((p) => /^[0-9a-f]{8,}$/i.test(p) && p !== id);
    return { kind: "vimeo", id, hash: hash && /^[\w]+$/.test(hash) ? hash : undefined };
  }
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "file", src: u.toString() };
  return null;
}

export function embedUrl(v: Video): string | null {
  if (v.kind === "youtube") return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  if (v.kind === "vimeo") return `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1${v.hash ? `&h=${v.hash}` : ""}`;
  return null;
}

/** Poster image shown before the player loads (YouTube only; others fall back to the project cover). */
export function posterUrl(v: Video): string | null {
  return v.kind === "youtube" ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : null;
}

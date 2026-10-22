"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LuCheck, LuLink, LuPlay } from "react-icons/lu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { cn } from "@/lib/utils";
import { embedUrl, parseVideo, posterUrl } from "@/lib/video";

/**
 * Video tour. YouTube/Vimeo load nothing until the visitor presses play (fast page, no third-party
 * requests for people who never watch). A video file shows its own first frame and plays inline.
 * Portrait footage (shot on a phone) gets a phone-shaped frame next to the text instead of a wide player.
 */
export function VideoTour({ url, cover, name, id }: { url: string; cover?: string; name: string; id: string }) {
  const { t } = useSite();
  const video = parseVideo(url);
  const fileSrc = video?.kind === "file" ? video.src : null;
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null); // width / height of a video file, once known
  const player = useRef<HTMLVideoElement>(null);

  // Read the real proportions of a video file so the frame fits it.
  useEffect(() => {
    if (!fileSrc) return;
    const probe = document.createElement("video");
    probe.preload = "metadata";
    const onMeta = () => {
      if (probe.videoWidth && probe.videoHeight) setRatio(probe.videoWidth / probe.videoHeight);
    };
    probe.addEventListener("loadedmetadata", onMeta);
    probe.src = fileSrc;
    return () => {
      probe.removeEventListener("loadedmetadata", onMeta);
      probe.removeAttribute("src");
    };
  }, [fileSrc]);

  if (!video) return null;
  const portrait = ratio !== null && ratio < 0.9;
  const poster = (!posterFailed && posterUrl(video)) || cover || null;
  const frame = embedUrl(video);

  const copy = async () => {
    const link = `${window.location.origin}/projects/${id}#tour`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success(t("video.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("video.copy"), link);
    }
  };

  const start = () => {
    setPlaying(true);
    player.current?.play().catch(() => setPlaying(false));
  };

  const intro = (
    <div>
      <h2 className="font-display text-[clamp(30px,3.6vw,48px)] leading-none font-medium">{t("video.title")}</h2>
      <p className="mt-3 max-w-[40ch] text-muted-foreground">{t("video.lead")}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {portrait && (
          <Button type="button" onClick={start} className="h-11 gap-2 rounded-full bg-ink px-6 text-paper hover:bg-ink-2">
            <LuPlay className="size-4 fill-current" /> {t("video.play")}
          </Button>
        )}
        <Button type="button" variant="outline" onClick={copy} className="h-11 gap-2 rounded-full border-gold bg-transparent px-5 text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
          {copied ? <LuCheck className="size-4" /> : <LuLink className="size-4" />} {t("video.copy")}
        </Button>
      </div>
    </div>
  );

  const media = (
    <div
      className={cn(
        "relative overflow-hidden bg-ink shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40",
        portrait ? "mx-auto aspect-[9/16] w-full max-w-[340px] rounded-[36px] lg:mx-0" : "aspect-video rounded-[28px]",
      )}
      style={portrait && ratio ? { aspectRatio: String(ratio) } : undefined}
    >
      {video.kind === "file" && (
        // #t=0.1 makes the browser paint a real frame as the poster without downloading the whole file.
        <video ref={player} src={`${video.src}#t=0.1`} preload="metadata" playsInline controls={playing} onEnded={() => setPlaying(false)} className="size-full bg-black object-contain" />
      )}
      {playing && frame && (
        <iframe
          src={frame}
          title={`${t("video.title")}: ${name}`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full border-0"
        />
      )}
      {!playing && (
        <button type="button" onClick={start} aria-label={t("video.play")} className="group absolute inset-0 grid place-items-center">
          {video.kind !== "file" &&
            poster &&
            (posterUrl(video) && !posterFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" onError={() => setPosterFailed(true)} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <Image src={poster} alt="" fill sizes="(min-width: 1240px) 1240px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            ))}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20" />
          <span className="relative grid size-20 place-items-center rounded-full bg-gold text-ink shadow-xl transition-transform duration-300 group-hover:scale-110 sm:size-24">
            <LuPlay className="ml-1 size-8 fill-current sm:size-10" />
          </span>
        </button>
      )}
    </div>
  );

  return (
    <section id="tour" className="scroll-mt-24">
      <Reveal className={cn(portrait ? "grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-20" : "grid gap-8")}>
        {intro}
        {media}
      </Reveal>
    </section>
  );
}

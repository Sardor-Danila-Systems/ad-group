"use client";

import Image from "next/image";
import { useState } from "react";
import { LuCheck, LuLink, LuPlay } from "react-icons/lu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { useSite } from "@/components/site/site-provider";
import { embedUrl, parseVideo, posterUrl } from "@/lib/video";

/**
 * Video tour. Nothing from YouTube/Vimeo loads until the visitor presses play,
 * which keeps the page fast and avoids third-party requests for people who never watch.
 */
export function VideoTour({ url, cover, name, id }: { url: string; cover?: string; name: string; id: string }) {
  const { t } = useSite();
  const video = parseVideo(url);
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!video) return null;

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

  return (
    <section id="tour" className="scroll-mt-24">
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(30px,3.6vw,48px)] leading-none font-medium">{t("video.title")}</h2>
            <p className="mt-3 max-w-[48ch] text-muted-foreground">{t("video.lead")}</p>
          </div>
          <Button type="button" variant="outline" onClick={copy} className="h-11 gap-2 rounded-full border-gold bg-transparent px-5 text-gold-deep hover:bg-gold/10 hover:text-gold-deep">
            {copied ? <LuCheck className="size-4" /> : <LuLink className="size-4" />} {t("video.copy")}
          </Button>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[28px] bg-ink shadow-[0_40px_80px_-35px_rgba(60,45,20,0.55)] ring-1 ring-gold/40">
          {playing && video.kind === "file" && <video src={video.src} controls autoPlay playsInline className="size-full" />}
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
            <button type="button" onClick={() => setPlaying(true)} aria-label={t("video.play")} className="group absolute inset-0 grid place-items-center">
              {poster &&
                (posterUrl(video) && !posterFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={poster} alt="" onError={() => setPosterFailed(true)} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <Image src={poster} alt="" fill sizes="(min-width: 1240px) 1240px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ))}
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />
              <span className="relative grid size-20 place-items-center rounded-full bg-gold text-ink shadow-xl transition-transform duration-300 group-hover:scale-110 sm:size-24">
                <LuPlay className="ml-1 size-8 fill-current sm:size-10" />
              </span>
              <span className="absolute bottom-5 left-6 font-display text-xl text-white sm:text-2xl">{t("video.play")}</span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}

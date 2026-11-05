"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuMaximize, LuMinimize } from "react-icons/lu";
import { useSite } from "@/components/site/site-provider";
import { matterportEmbed, matterportId } from "@/lib/matterport";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

// The viewer touches window and WebGL, so it is only ever loaded in the browser.
const ShowroomViewer = dynamic(() => import("@/components/site/showroom-viewer"), {
  ssr: false,
  loading: () => <Loading />,
});

function Loading() {
  const { t } = useSite();
  return (
    <div className="fixed inset-0 grid place-items-center bg-ink text-white" role="status">
      <p className="font-display text-xl text-white/80">{t("showroom.loading")}</p>
    </div>
  );
}

/** A Matterport space under a slim bar of our own: back to the project, its name, full screen. */
function MatterportTour({ id, projectName, backHref }: { id: string; projectName: string; backHref: string }) {
  const { t, lang } = useSite();
  const [loaded, setLoaded] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const on = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-ink text-white">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 sm:h-[72px] sm:px-6">
        <Link href={backHref} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/20">
          <LuArrowLeft className="size-4" /> {t("showroom.back")}
        </Link>
        <p className="truncate font-display text-lg leading-tight font-medium sm:text-2xl">{projectName}</p>
        <button
          type="button"
          onClick={toggleFull}
          aria-label={full ? t("showroom.exit") : t("showroom.fullscreen")}
          title={full ? t("showroom.exit") : t("showroom.fullscreen")}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          {full ? <LuMinimize className="size-5" /> : <LuMaximize className="size-5" />}
        </button>
      </div>
      <div data-lenis-prevent className="relative min-h-0 flex-1">
        <iframe
          src={matterportEmbed(id, lang)}
          title={`3D-тур — ${projectName}`}
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 size-full border-0"
        />
        <div role="status" className={cn("pointer-events-none absolute inset-0 grid place-items-center bg-ink transition-opacity duration-700", loaded && "opacity-0")}>
          <p className="font-display text-xl text-white/80">{t("showroom.loading")}</p>
        </div>
      </div>
    </div>
  );
}

/** The project's showroom: its Matterport tour when one is set, otherwise the panorama tour. */
export function ShowroomView({ project }: { project: Project }) {
  const { lang } = useSite();
  const backHref = `/projects/${project.id}`;
  const mp = matterportId(project.matterport);
  if (mp) return <MatterportTour id={mp} projectName={project.name[lang]} backHref={backHref} />;
  return <ShowroomViewer scenes={project.showroom ?? []} projectName={project.name[lang]} backHref={backHref} />;
}

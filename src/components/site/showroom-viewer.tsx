"use client";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import { Viewer } from "@photo-sphere-viewer/core";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { VirtualTourPlugin, type VirtualTourNode } from "@photo-sphere-viewer/virtual-tour-plugin";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuMaximize, LuMinimize } from "react-icons/lu";
import { useSite } from "@/components/site/site-provider";
import type { ShowroomScene } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Gold floor arrow shown where the tour continues. */
const ARROW =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 12 88 62 68 62 50 36 32 62 12 62Z" fill="#b8924f" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>',
  );

const TAU = Math.PI * 2;
const angleDiff = (a: number, b: number) => Math.abs(((a - b + Math.PI * 3) % TAU) - Math.PI);

export default function ShowroomViewer({ scenes, projectName, backHref }: { scenes: ShowroomScene[]; projectName: string; backHref: string }) {
  const { t, lang } = useSite();
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const tour = useRef<VirtualTourPlugin | null>(null);
  const history = useRef<string[]>([scenes[0].id]);
  const [current, setCurrent] = useState(scenes[0].id);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hint, setHint] = useState(true);
  const [full, setFull] = useState(false);
  const langRef = useRef(lang);
  const labels = useRef({ loading: t("showroom.loading") });

  useEffect(() => {
    langRef.current = lang;
    for (const sc of scenes) tour.current?.updateNode({ id: sc.id, name: sc.name[lang] });
  }, [lang, scenes]);

  useEffect(() => {
    if (!box.current) return;
    const nodes: VirtualTourNode[] = scenes.map((sc) => ({
      id: sc.id,
      panorama: sc.image,
      name: sc.name[langRef.current],
      links: sc.links.map((l) => ({ nodeId: l.to, position: { yaw: l.yaw, pitch: l.pitch } })),
    }));
    const v = new Viewer({
      container: box.current,
      navbar: ["zoom", "move", "gyroscope"],
      keyboard: false,
      touchmoveTwoFingers: false,
      mousewheelCtrlKey: false,
      defaultZoomLvl: 25,
      loadingTxt: labels.current.loading,
      plugins: [
        MarkersPlugin,
        GyroscopePlugin,
        [
          VirtualTourPlugin,
          {
            positionMode: "manual",
            renderMode: "3d",
            nodes,
            startNodeId: scenes[0].id,
            preload: true,
            showLinkTooltip: true,
            arrowStyle: { image: ARROW, size: { width: 110, height: 110 } },
            transitionOptions: { effect: "fade", speed: "24rpm", rotation: true, showLoader: true },
          },
        ],
      ],
    });
    viewer.current = v;
    const vt = v.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);
    tour.current = vt;
    vt.addEventListener("node-changed", ({ node }) => {
      setCurrent(node.id);
      setReady(true);
      const h = history.current;
      if (h[h.length - 1] !== node.id) h.push(node.id);
    });
    v.addEventListener("panorama-error", () => setFailed(true));
    v.addEventListener("panorama-loaded", () => setReady(true));
    const hide = () => setHint(false);
    v.addEventListener("position-updated", hide, { once: true });
    const timer = setTimeout(hide, 9000);
    return () => {
      clearTimeout(timer);
      v.destroy();
      viewer.current = null;
      tour.current = null;
    };
  }, [scenes]);

  // Keyboard: ← → turn, ↑ walk to the arrow in front of you, ↓ walk back, + − zoom.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = viewer.current;
      const vt = tour.current;
      if (!v || !vt || e.altKey || e.ctrlKey || e.metaKey) return;
      const step = 0.14;
      const pos = v.getPosition();
      if (e.key === "ArrowLeft") v.rotate({ yaw: pos.yaw - step, pitch: pos.pitch });
      else if (e.key === "ArrowRight") v.rotate({ yaw: pos.yaw + step, pitch: pos.pitch });
      else if (e.key === "+" || e.key === "=") v.zoomIn();
      else if (e.key === "-") v.zoomOut();
      else if (e.key === "ArrowUp") {
        const scene = scenes.find((sc) => sc.id === vt.getCurrentNode()?.id);
        const ahead = scene?.links
          .map((l) => ({ l, d: angleDiff(l.yaw, pos.yaw) }))
          .filter((x) => x.d < (75 * Math.PI) / 180)
          .sort((a, b) => a.d - b.d)[0];
        if (ahead) void vt.setCurrentNode(ahead.l.to, undefined, { nodeId: ahead.l.to, position: { yaw: ahead.l.yaw, pitch: ahead.l.pitch } });
      } else if (e.key === "ArrowDown") {
        const h = history.current;
        if (h.length > 1) {
          h.pop();
          const prev = h[h.length - 1];
          void vt.setCurrentNode(prev);
        } else v.rotate({ yaw: pos.yaw + Math.PI, pitch: pos.pitch });
      } else return;
      e.preventDefault();
      setHint(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scenes]);

  useEffect(() => {
    const on = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const go = (id: string) => {
    if (id !== current) void tour.current?.setCurrentNode(id);
  };

  const name = scenes.find((s) => s.id === current)?.name[lang] ?? "";

  return (
    <div className="fixed inset-0 bg-ink text-white">
      <div ref={box} className="size-full" />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-6">
        <Link href={backHref} className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-colors hover:bg-black/65">
          <LuArrowLeft className="size-4" /> {t("showroom.back")}
        </Link>
        <div className="pointer-events-none hidden text-right sm:block">
          <p className="font-display text-2xl leading-tight font-medium drop-shadow">{projectName}</p>
          <p className="text-sm text-white/80 drop-shadow">{name}</p>
        </div>
        <button
          type="button"
          onClick={toggleFull}
          aria-label={full ? t("showroom.exit") : t("showroom.fullscreen")}
          title={full ? t("showroom.exit") : t("showroom.fullscreen")}
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur-md transition-colors hover:bg-black/65"
        >
          {full ? <LuMinimize className="size-5" /> : <LuMaximize className="size-5" />}
        </button>
      </div>

      {/* Hint */}
      <div className={cn("pointer-events-none absolute inset-x-0 top-24 flex justify-center px-4 transition-opacity duration-700", hint && ready ? "opacity-100" : "opacity-0")}>
        <p className="max-w-md rounded-full bg-black/55 px-5 py-2.5 text-center text-sm backdrop-blur-md">{t("showroom.hint")}</p>
      </div>

      {/* Rooms */}
      {scenes.length > 1 && (
        <nav aria-label={t("showroom.rooms")} className="absolute inset-x-0 bottom-0 flex justify-center p-3 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-16">
          <ul className="flex max-w-full gap-2 overflow-x-auto rounded-3xl bg-black/50 p-2 backdrop-blur-md">
            {scenes.map((sc) => (
              <li key={sc.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(sc.id)}
                  aria-current={sc.id === current}
                  className={cn("group relative block h-16 w-28 overflow-hidden rounded-2xl ring-2 transition-all sm:h-20 sm:w-36", sc.id === current ? "ring-gold" : "ring-transparent hover:ring-white/50")}
                >
                  <Image src={sc.image} alt="" width={288} height={144} sizes="144px" className="size-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1 text-left text-[11px] leading-tight font-medium sm:text-xs">{sc.name[lang]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-ink/90 p-6 text-center">
          <p className="font-display text-2xl">{t("showroom.error")}</p>
        </div>
      )}
    </div>
  );
}

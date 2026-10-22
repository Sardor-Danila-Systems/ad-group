"use client";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useEffect, useRef } from "react";
import type { ShowroomLink } from "@/lib/types";

/**
 * Panorama preview for placing arrows. Click the panorama while "placing" is on to report a direction;
 * existing arrows are drawn as labelled pins.
 */
export default function PanoramaLinkPicker({
  image,
  links,
  labelOf,
  placing,
  onPick,
}: {
  image: string;
  links: ShowroomLink[];
  labelOf: (id: string) => string;
  placing: boolean;
  onPick: (yaw: number, pitch: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const pick = useRef(onPick);
  const armed = useRef(placing);
  // Keep the latest callbacks readable from the viewer event without rebuilding the viewer.
  useEffect(() => {
    pick.current = onPick;
    armed.current = placing;
  });

  useEffect(() => {
    if (!box.current) return;
    const v = new Viewer({ container: box.current, panorama: image, navbar: ["zoom", "move"], defaultZoomLvl: 20, plugins: [MarkersPlugin], touchmoveTwoFingers: false, mousewheelCtrlKey: false });
    viewer.current = v;
    v.addEventListener("click", ({ data }) => {
      if (armed.current) pick.current(data.yaw, data.pitch);
    });
    return () => {
      v.destroy();
      viewer.current = null;
    };
  }, [image]);

  useEffect(() => {
    const v = viewer.current;
    if (!v) return;
    const markers = v.getPlugin<MarkersPlugin>(MarkersPlugin);
    const apply = () => {
      markers.clearMarkers();
      links.forEach((l, i) => {
        markers.addMarker({
          id: `link-${i}`,
          position: { yaw: l.yaw, pitch: l.pitch },
          html: `<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:#b8924f;color:#1c1915;font:600 13px system-ui;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.35)">↑ ${labelOf(l.to).replace(/[<>&]/g, "")}</div>`,
          anchor: "center",
        });
      });
    };
    if (v.state.ready) apply();
    else v.addEventListener("ready", apply, { once: true });
  }, [links, labelOf, image]);

  return <div ref={box} className={placing ? "size-full cursor-crosshair" : "size-full"} />;
}

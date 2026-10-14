import type { CSSProperties } from "react";
import type { ProjectKind } from "@/lib/content";

type B = { x: number; w: number; h: number; lit: boolean };

function layout(kind: ProjectKind, w: number, h: number): B[] {
  switch (kind) {
    case "tower":
      return [
        { x: w * 0.18, w: w * 0.2, h: h * 0.5, lit: false },
        { x: w * 0.4, w: w * 0.22, h: h * 0.85, lit: true },
        { x: w * 0.64, w: w * 0.18, h: h * 0.6, lit: false },
      ];
    case "slab":
      return [
        { x: w * 0.1, w: w * 0.8, h: h * 0.42, lit: true },
        { x: w * 0.22, w: w * 0.56, h: h * 0.62, lit: false },
      ];
    case "stepped":
      return [
        { x: w * 0.1, w: w * 0.24, h: h * 0.45, lit: false },
        { x: w * 0.3, w: w * 0.24, h: h * 0.65, lit: true },
        { x: w * 0.5, w: w * 0.24, h: h * 0.85, lit: false },
        { x: w * 0.7, w: w * 0.2, h: h * 0.55, lit: true },
      ];
    default:
      return [
        { x: w * 0.08, w: w * 0.26, h: h * 0.4, lit: true },
        { x: w * 0.36, w: w * 0.26, h: h * 0.58, lit: false },
        { x: w * 0.64, w: w * 0.28, h: h * 0.46, lit: true },
      ];
  }
}

function Windows({ x, y, w, h, lit }: { x: number; y: number; w: number; h: number; lit: boolean }) {
  const out = [];
  for (let yy = y + 14; yy < y + h - 10; yy += 16)
    for (let xx = x + 10; xx < x + w - 12; xx += 14) {
      const on = lit && Math.round(xx * 7 + yy * 3) % 5 === 0;
      out.push(<rect key={`${xx}-${yy}`} x={xx} y={yy} width={6} height={8} fill="currentColor" opacity={on ? 0.9 : 0.18} />);
    }
  return <>{out}</>;
}

/** Procedural placeholder for project photos. Colors come from --b / --b2 / currentColor. */
export function BuildingArt({ kind, w = 400, h = 260, className, style }: { kind: ProjectKind; w?: number; h?: number; className?: string; style?: CSSProperties }) {
  const base = h - 10;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax slice" className={className} style={style} aria-hidden="true">
      {kind === "vatan" ? (
        <>
          <path d={`M${w * 0.12} ${base}V${h * 0.52}L${w * 0.38} ${h * 0.26}V${base}Z`} fill="var(--b)" />
          <path d={`M${w * 0.4} ${base}V${h * 0.3}L${w * 0.5} ${h * 0.16}L${w * 0.6} ${h * 0.3}V${base}Z`} fill="var(--b2)" />
          <path d={`M${w * 0.62} ${base}V${h * 0.26}L${w * 0.88} ${h * 0.52}V${base}Z`} fill="var(--b)" />
          <Windows x={w * 0.12} y={h * 0.5} w={w * 0.26} h={h * 0.5} lit />
          <Windows x={w * 0.4} y={h * 0.3} w={w * 0.2} h={h * 0.7} lit />
          <Windows x={w * 0.62} y={h * 0.5} w={w * 0.26} h={h * 0.5} lit />
        </>
      ) : (
        <>
          {layout(kind, w, h).map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill="var(--b)" />
              <Windows x={b.x} y={base - b.h} w={b.w} h={b.h} lit={b.lit} />
            </g>
          ))}
          {kind === "tower" && (
            <path d={`M${w * 0.4} ${base - h * 0.85}L${w * 0.51} ${base - h * 0.98}L${w * 0.62} ${base - h * 0.85}Z`} fill="var(--b2)" />
          )}
        </>
      )}
      <rect x={0} y={base} width={w} height={10} fill="var(--b2)" />
    </svg>
  );
}

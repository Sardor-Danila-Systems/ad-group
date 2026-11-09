"use client";

import { useEffect, useRef, useState } from "react";
import { Counter } from "@/components/site/counter";
import { useSite } from "@/components/site/site-provider";
import { Button } from "@/components/ui/button";
import { fx } from "@/components/site/fx";

/*
 * Scroll-driven first screen: the construction video is played by the scroll position, then the
 * final frame stays on screen and the headline, buttons and numbers fade in over it.
 *
 * The video is shipped as an image sequence (public/hero/v2, made by scripts/hero-frames) and drawn
 * on a canvas. Seeking an MP4 on every scroll tick stutters, especially in Safari and on phones;
 * a frame sequence is what premium product pages use for this.
 */
/** Frames in the sequence (scripts/hero-frames/retime.mjs prints it). */
const FRAME_COUNT = 223;
const num = (i: number) => String(i).padStart(4, "0");

interface FrameSet {
  /** Every n-th frame is shipped. */
  step: number;
  /** Decoded frames kept ahead of the current one (and a third of that behind). */
  window: number;
  src: (i: number) => string;
}
/**
 * The client's render is 1340×952; the frames are upscaled ×2 on device (scripts/hero-frames) and
 * shipped at 1920 px for larger screens and 1080 px for phones (every frame on both), as AVIF.
 * Browsers that cannot decode AVIF get every second phone frame as WebP. The folder name is the version: change it
 * whenever the frames change, they are cached for a year.
 */
const SETS = {
  desktop: { step: 1, window: 12, src: (i: number) => `/hero/v3/d/${num(i)}.avif` },
  phone: { step: 1, window: 12, src: (i: number) => `/hero/v3/m/${num(i)}.avif` },
  fallback: { step: 2, window: 10, src: (i: number) => `/hero/v3/m/${num(i)}.webp` },
} satisfies Record<string, FrameSet>;

/** Share of the pinned scroll that plays the video; the rest reveals the final screen. */
const VIDEO_END = 0.78;
const TEXT_FROM = 0.8;
const TEXT_TO = 0.94;
/** Phones: the text sits on the dark area under the video, so it comes in piece by piece while the video plays. */
const TEXT_FROM_PHONE = 0.08;
const TEXT_TO_PHONE = 0.76;
/** Pieces of the final screen (eyebrow, title, lead, buttons, numbers), revealed one after another. */
const PIECES = 5;
/** Opacity and lift of piece `i` from the overall reveal (0…1), so each fades in after the one before. */
const piece = (i: number): React.CSSProperties => {
  const o = `clamp(0, calc(var(--reveal) * ${PIECES + 1} - ${i}), 1)`;
  return { opacity: o, transform: `translateY(calc((1 - ${o}) * 24px))` };
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Load order: ends first, then ever finer strides, so scrubbing works long before everything is in. */
function loadOrder(step: number) {
  const order: number[] = [0, FRAME_COUNT - 1];
  for (const stride of [32, 16, 8, 4, 2, 1]) {
    if (stride < step) break;
    for (let i = 0; i < FRAME_COUNT; i += stride) if (i % step === 0) order.push(i);
  }
  return [...new Set(order)];
}

export function Hero() {
  const { t, openCall } = useSite();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = section.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // Phones and data-saver: the lighter set (1080 px) is plenty for their screens and a third of the download.
    const phone = window.matchMedia("(max-width: 767px)");
    let set: FrameSet = phone.matches || conn?.saveData ? SETS.phone : SETS.desktop;
    // Compressed frames (small) are all kept; decoded ones (large) only around the current position.
    let blobs: (Blob | undefined)[] = new Array(FRAME_COUNT);
    const bitmaps = new Map<number, ImageBitmap>();
    const decoding = new Set<number>();

    let current = 0; // smoothed frame position
    let drawn = -1; // position on the canvas (between two frames while they are blended)
    let dirty = true;
    let raf = 0;
    let visible = true;
    let wasRevealed = false;
    let disposed = false;
    let heading = 1; // which way the frames are moving, to decode ahead
    /** Furthest apart two decoded frames may be and still be blended (while the rest is downloading). */
    const GAP = 16;

    const snap = (i: number) => Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(i / set.step) * set.step));
    /** The decoded frame closest to `i`, or -1. */
    const nearest = (i: number) => {
      const c = snap(i);
      for (let d = 0; d < FRAME_COUNT; d += set.step) {
        if (bitmaps.has(c - d)) return c - d;
        if (bitmaps.has(c + d)) return c + d;
      }
      return -1;
    };

    /*
     * Decoding happens off the main thread (createImageBitmap), a window of frames around the current one,
     * reaching further in the direction of travel. Drawing a decoded bitmap is then a plain GPU copy:
     * no decode in the middle of a scroll frame, which is what made the hero stutter.
     */
    const pump = () => {
      if (disposed) return;
      const c = snap(current);
      // Reach at least GAP ahead: while frames are still downloading, the next one to blend may be that far.
      const ahead = Math.max(GAP, set.window * set.step), behind = Math.max(GAP, Math.round(set.window / 3) * set.step);
      const lo = heading > 0 ? c - behind : c - ahead;
      const hi = heading > 0 ? c + ahead : c + behind;
      for (const [i, b] of bitmaps) {
        if (i < lo || i > hi) {
          b.close();
          bitmaps.delete(i);
        }
      }
      // Nearest first, so the frame needed now is never queued behind far ones.
      const want: number[] = [];
      for (let d = 0; d <= ahead; d += set.step) {
        for (const i of d === 0 ? [c] : heading > 0 ? [c + d, c - d] : [c - d, c + d]) {
          if (i >= lo && i <= hi && i >= 0 && i < FRAME_COUNT && blobs[i] && !bitmaps.has(i) && !decoding.has(i)) want.push(i);
        }
      }
      for (const i of want) {
        if (decoding.size >= 6) break;
        decoding.add(i);
        const blob = blobs[i]!;
        createImageBitmap(blob)
          .then((bmp) => {
            decoding.delete(i);
            const c2 = snap(current);
            const reach = Math.max(GAP, set.window * set.step);
            if (disposed || Math.abs(i - c2) > reach) {
              bmp.close();
            } else {
              bitmaps.set(i, bmp);
              // Repaint if this frame is one of the pair being shown, or closer than what is on screen.
              if (drawn === -1 || Math.abs(i - current) <= GAP || Math.abs(i - c2) < Math.abs(drawn - c2)) {
                dirty = true;
                kick();
              }
            }
            pump();
          })
          .catch(() => {
            decoding.delete(i);
            blobs[i] = undefined; // never retry a frame that cannot be decoded
            // This browser cannot decode the format (AVIF): switch to the WebP fallback once.
            if (set !== SETS.fallback && drawn === -1) {
              set = SETS.fallback;
              blobs = new Array(FRAME_COUNT);
              startLoading();
            }
          });
      }
    };

    const resize = () => {
      // Phones draw at their full pixel density (3× on most), so the frame is as sharp as the screen.
      const dpr = Math.min(window.devicePixelRatio || 1, phone.matches ? 3 : 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      // Resizing the canvas resets its state; ask for the best scaling filter again.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      dirty = true;
    };

    const below = (p: number) => {
      for (let k = Math.floor(p / set.step) * set.step; k >= 0 && k >= p - GAP; k -= set.step) if (bitmaps.has(k)) return k;
      return -1;
    };
    const above = (p: number) => {
      for (let k = Math.ceil(p / set.step) * set.step; k <= p + GAP; k += set.step) {
        const f = Math.min(k, FRAME_COUNT - 1); // the last frame is in every set
        if (bitmaps.has(f)) return f;
        if (f === FRAME_COUNT - 1) break;
      }
      return -1;
    };

    /*
     * Draws position `pos`, which is usually between two frames: the later frame is laid over the earlier
     * one in proportion. So the picture moves on every screen refresh, also at the slow start and end of a
     * glide, where the position creeps less than a frame per refresh and whole frames alone would step.
     * While frames are still downloading, the nearest decoded ones on either side are blended the same way.
     */
    const draw = (pos: number) => {
      const lo = below(pos), hi = above(pos);
      let shown: number;
      // The canvas box has the frame's own shape (1340:952), so a frame fills it exactly.
      if (lo !== -1 && hi !== -1) {
        if (pos === drawn && !dirty) return;
        const t = hi === lo ? 0 : clamp((pos - lo) / (hi - lo));
        ctx.globalAlpha = 1;
        ctx.drawImage(bitmaps.get(t > 0.99 ? hi : lo)!, 0, 0, cv.width, cv.height);
        if (t >= 0.01 && t <= 0.99) {
          ctx.globalAlpha = t;
          ctx.drawImage(bitmaps.get(hi)!, 0, 0, cv.width, cv.height);
          ctx.globalAlpha = 1;
        }
        shown = pos;
      } else {
        const k = nearest(pos);
        if (k === -1 || (k === drawn && !dirty)) return;
        ctx.globalAlpha = 1;
        ctx.drawImage(bitmaps.get(k)!, 0, 0, cv.width, cv.height);
        shown = k;
      }
      // The server-rendered poster stays visible until the canvas holds a real frame.
      if (drawn === -1) cv.style.opacity = "1";
      drawn = shown;
      dirty = false;
    };

    const progress = () => {
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return 1;
      return clamp(-el.getBoundingClientRect().top / range);
    };

    const tick = () => {
      raf = 0;
      if (disposed) return;
      const p = reduced ? 1 : progress();
      const target = clamp(p / VIDEO_END) * (FRAME_COUNT - 1);
      if (Math.abs(target - current) > 0.5) heading = target > current ? 1 : -1;
      const before = snap(current);
      current += (target - current) * 0.2;
      if (Math.abs(target - current) < 0.02) current = target;
      if (snap(current) !== before) pump();
      if (current !== drawn || dirty) draw(current);

      const [from, to] = phone.matches ? [TEXT_FROM_PHONE, TEXT_TO_PHONE] : [TEXT_FROM, TEXT_TO];
      const reveal = reduced ? 1 : phone.matches ? clamp((p - from) / (to - from)) : ease(clamp((p - from) / (to - from)));
      el.style.setProperty("--reveal", reveal.toFixed(3));
      el.style.setProperty("--hint", (1 - clamp(p / 0.05)).toFixed(3));
      // Buttons clickable and numbers counting once their pieces are in.
      const now = reveal > 0.7;
      if (now !== wasRevealed) {
        wasRevealed = now;
        setRevealed(now);
      }
      if (visible && (Math.abs(target - current) > 0.001 || dirty)) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // Downloads: ends first, then ever finer strides, a few requests at a time. A new set (the fallback)
    // starts a new generation and the old downloads stop.
    let generation = 0;
    function startLoading() {
      const gen = ++generation;
      const { step, src } = set;
      const queue = loadOrder(step);
      // The first, coarse pass (both ends and every 16th frame) is what the hero needs to play at all; the
      // rest fills in at low priority, so photos further down the page are not held up behind it.
      const urgent = new Set(queue.slice(0, Math.ceil(FRAME_COUNT / 16) + 2));
      const worker = async () => {
        while (queue.length && !disposed && gen === generation) {
          // Once the visitor has moved past the hero, the rest waits, so the pictures below get the connection.
          while (!visible && !disposed) await new Promise((r) => setTimeout(r, 400));
          if (!queue.length || disposed) return;
          const i = queue.shift()!;
          try {
            const res = await fetch(src(i), { priority: urgent.has(i) ? "high" : "low" });
            if (!res.ok) continue;
            const blob = await res.blob();
            if (disposed || gen !== generation) return;
            blobs[i] = blob;
            pump();
          } catch {
            // a missing frame is covered by its neighbours
          }
        }
      };
      for (let k = 0; k < 6; k++) void worker();
    }
    startLoading();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);

    resize();
    tick();
    const onScroll = () => kick();
    const onResize = () => {
      resize();
      kick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      for (const b of bitmaps.values()) b.close();
      bitmaps.clear();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={section}
      data-scroll-hero
      data-curtain="exit"
      data-stops="0,1"
      data-glide="4.4"
      aria-label={t("hero.title")}
      className="relative h-[360svh] bg-ink md:h-[420svh] motion-reduce:h-svh"
      style={{ "--reveal": 0, "--hint": 1 } as React.CSSProperties}
    >
      <noscript>
        <style>{"[data-scroll-hero]{--reveal:1!important;--hint:0!important;height:100svh!important}"}</style>
      </noscript>

      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The frame spans the full width in its own 1340:952 shape. Phones: right under the header, the dark
            background below holds the text. Wide screens: the frame is taller than the screen, so a
            little of the top and more of the bottom (the ground) fall outside. */}
        <div className="hero-intro absolute inset-x-0 top-[76px] aspect-[1340/952] [@media(min-aspect-ratio:1340/952)]:top-[calc((100svh-71.04vw)*0.2)]">
          {/* First frame from the server: visible during the preloader and before frames arrive. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/v3/first.jpg" srcSet="/hero/v3/first-m.jpg 1280w, /hero/v3/first.jpg 1920w" sizes="100vw" alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 size-full" />
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full opacity-0" />
        </div>

        {/* Darkening for legible text, faded in together with it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(18,14,10,0.92)_0%,rgba(18,14,10,0.8)_50%,rgba(18,14,10,0)_80%)] md:bg-[linear-gradient(90deg,rgba(18,14,10,0.86)_0%,rgba(18,14,10,0.55)_42%,rgba(18,14,10,0.1)_75%)]"
          style={{ opacity: "var(--reveal)" }}
        />

        {/* Final screen */}
        <div
          className="absolute inset-0 flex items-end pb-[max(2.5rem,env(safe-area-inset-bottom))] md:items-center md:pb-0"
          style={{ pointerEvents: revealed ? "auto" : "none" }}
        >
          <div className="mx-auto w-[min(1240px,100%-32px)] pt-[76px] md:w-[min(1240px,100%-48px)]">
            <div className="max-w-[620px] text-white">
              <p style={piece(0)} className="mb-5 flex items-center gap-3 text-[12px] font-semibold tracking-[.2em] text-gold-light uppercase sm:text-[13px]">
                <span aria-hidden="true" className="h-px w-10 bg-gold-light" />
                {t("hero.eyebrow")}
              </p>
              <h1 style={piece(1)} className="font-display text-[clamp(40px,6vw,88px)] leading-[0.98] font-medium tracking-tight">{t("hero.title")}</h1>
              <p style={piece(2)} className="mt-6 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-white/80">{t("hero.lead")}</p>
              <div style={piece(3)} className="mt-8 flex flex-wrap gap-3">
                <Button onClick={openCall} size="lg" className={`h-12 rounded-full bg-gold px-7 text-[15px] font-semibold text-ink hover:bg-gold ${fx.goldOnDark}`}>
                  {t("lead.send")}
                </Button>
                <Button asChild size="lg" variant="outline" className={`h-12 rounded-full border-white/40 bg-white/10 px-7 text-[15px] font-semibold text-white hover:bg-white/10 ${fx.goldOnDark}`}>
                  <a href="#projects">{t("hero.cta1")}</a>
                </Button>
              </div>
              <dl style={piece(4)} className="mt-8 grid grid-cols-3 gap-x-4 border-t border-white/20 pt-5 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-4 sm:pt-6">
                {([
                  [2011, "", "hero.s1"],
                  [25, "+", "hero.s2"],
                  [3000, "", "hero.s3"],
                ] as const).map(([n, suffix, k]) => (
                  <div key={k}>
                    <dt className="font-display text-[26px] font-medium text-gold-light sm:text-4xl">
                      <Counter to={n} suffix={suffix} active={revealed} grouping={k !== "hero.s1"} />
                    </dt>
                    <dd className="text-[12px] text-white/65 sm:text-[13px]">{t(k)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Scroll hint, only at the very start */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-white" style={{ opacity: "var(--hint)" }}>
          <span className="text-[11px] font-semibold tracking-[.28em] uppercase drop-shadow">{t("hero.scroll")}</span>
          <span className="relative h-12 w-px overflow-hidden bg-white/30">
            <span className="hero-scroll-line absolute inset-x-0 top-0 h-1/2 bg-white" />
          </span>
        </div>
      </div>
    </section>
  );
}

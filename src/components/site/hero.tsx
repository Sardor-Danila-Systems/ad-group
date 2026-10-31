"use client";

import { useEffect, useRef, useState } from "react";
import { Counter } from "@/components/site/counter";
import { useSite } from "@/components/site/site-provider";
import { Button } from "@/components/ui/button";

/*
 * Scroll-driven first screen: the construction video is played by the scroll position, then the
 * final frame stays on screen and the headline, buttons and numbers fade in over it.
 *
 * The video is shipped as an image sequence (public/hero/frames, made by scripts/hero-frames) and drawn
 * on a canvas. Seeking an MP4 on every scroll tick stutters, especially in Safari and on phones;
 * a frame sequence is what premium product pages use for this.
 */
const FRAME_COUNT = 193;
/** Full-size frames (1664×1248) for larger screens, a lighter set with every second frame for phones. */
const frameSrc = (i: number, light: boolean) => `/hero/${light ? "frames-m" : "frames"}/${String(i).padStart(4, "0")}.webp`;

/** Share of the pinned scroll that plays the video; the rest reveals the final screen. */
const VIDEO_END = 0.78;
const TEXT_FROM = 0.8;
const TEXT_TO = 0.94;
/** Vertical place of the frame when the screen is taller than it (phones): a little above the middle, leaving room for the text. */
const FRAME_Y = 0.35;
/** Width / height of the frames (1664×1248 and 900×675). */
const FRAME_ASPECT = 4 / 3;

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
  const ambient = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = section.current;
    const cv = canvas.current;
    const am = ambient.current;
    const st = stage.current;
    if (!el || !cv || !am || !st) return;
    const ctx = cv.getContext("2d");
    const actx = am.getContext("2d");
    if (!ctx || !actx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // Phones and data-saver: every second frame is plenty and halves the download.
    const light = window.matchMedia("(max-width: 767px)").matches || Boolean(conn?.saveData);
    const step = light ? 2 : 1;
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);

    let current = 0; // smoothed frame position
    let drawn = -1;
    let dirty = true;
    let raf = 0;
    let visible = true;
    let wasRevealed = false;
    let disposed = false;

    const nearest = (i: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        const a = frames[i - d];
        if (a) return a;
        const b = frames[i + d];
        if (b) return b;
      }
      return undefined;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      // The blurred backdrop is tiny on purpose: upscaling it is the blur, and it costs nothing to redraw.
      am.width = 64;
      am.height = Math.max(1, Math.round((64 * cv.clientHeight) / Math.max(1, cv.clientWidth)));
      // Resizing the canvas resets its state; ask for the best scaling filter again.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      // Soft edges where the frame meets the blurred backdrop, so it reads as one picture across the screen.
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      const fw = Math.min(W, H * FRAME_ASPECT);
      const fh = fw / FRAME_ASPECT;
      const x0 = (W - fw) / 2;
      const y0 = (H - fh) * FRAME_Y;
      const f = Math.round(Math.min(64, Math.max(fw, fh) * 0.06));
      const mask =
        x0 > 1
          ? `linear-gradient(to right, transparent ${x0}px, #000 ${x0 + f}px, #000 ${x0 + fw - f}px, transparent ${x0 + fw}px)`
          : H - fh > 1
            ? `linear-gradient(to bottom, transparent ${y0}px, #000 ${y0 + f}px, #000 ${y0 + fh - f}px, transparent ${y0 + fh}px)`
            : "none";
      st.style.maskImage = mask;
      st.style.webkitMaskImage = mask;
      dirty = true;
    };

    const draw = (i: number) => {
      const img = nearest(i);
      if (!img) return;
      const { width: cw, height: ch } = cv;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      // The whole frame, never cropped: as wide as the screen allows, or as tall on wide monitors.
      const s = Math.min(cw / iw, ch / ih);
      const dw = iw * s;
      const dh = ih * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) * 0.5, (ch - dh) * FRAME_Y, dw, dh);
      // The free space around it shows the same frame, blurred, so the screen stays filled.
      const as = Math.max(am.width / iw, am.height / ih);
      actx.drawImage(img, (am.width - iw * as) * 0.5, (am.height - ih * as) * 0.5, iw * as, ih * as);
      drawn = i;
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
      current += (target - current) * 0.2;
      if (Math.abs(target - current) < 0.02) current = target;
      const idx = Math.round(current);
      if (idx !== drawn || dirty) draw(idx);

      const reveal = reduced ? 1 : ease(clamp((p - TEXT_FROM) / (TEXT_TO - TEXT_FROM)));
      el.style.setProperty("--reveal", reveal.toFixed(3));
      el.style.setProperty("--hint", (1 - clamp(p / 0.05)).toFixed(3));
      const now = reveal > 0.55;
      if (now !== wasRevealed) {
        wasRevealed = now;
        setRevealed(now);
      }
      if (visible && (Math.abs(target - current) > 0.001 || dirty)) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // Progressive loading with a few parallel requests.
    const queue = loadOrder(step);
    const worker = async () => {
      while (queue.length && !disposed) {
        const i = queue.shift()!;
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(i, light);
        try {
          await img.decode();
        } catch {
          continue;
        }
        if (disposed) return;
        frames[i] = img;
        // Repaint if this frame is closer to where the viewer is than what is on screen.
        if (Math.abs(i - Math.round(current)) <= Math.abs(drawn - Math.round(current)) || drawn === -1) {
          dirty = true;
          kick();
        }
      }
    };
    for (let k = 0; k < 6; k++) void worker();

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
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={section}
      data-scroll-hero
      aria-label={t("hero.title")}
      className="relative h-[360svh] bg-ink md:h-[420svh] motion-reduce:h-svh"
      style={{ "--reveal": 0, "--hint": 1 } as React.CSSProperties}
    >
      <noscript>
        <style>{"[data-scroll-hero]{--reveal:1!important;--hint:0!important;height:100svh!important}"}</style>
      </noscript>

      <div className="sticky top-0 h-svh overflow-hidden">
        {/* First frame from the server: visible during the preloader and before frames arrive.
            Behind it, the same frame blurred fills the space the uncropped frame leaves free. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/first.jpg" alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-2xl" />
        <canvas ref={ambient} aria-hidden="true" className="absolute inset-0 size-full scale-110 opacity-60 blur-2xl" />
        <div ref={stage} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/first.jpg" alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 size-full object-contain [object-position:50%_35%]" />
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
        </div>

        {/* Darkening for legible text, faded in together with it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(18,14,10,0.9)_0%,rgba(18,14,10,0.62)_55%,rgba(18,14,10,0.3)_100%)] md:bg-[linear-gradient(90deg,rgba(18,14,10,0.86)_0%,rgba(18,14,10,0.55)_42%,rgba(18,14,10,0.1)_75%)]"
          style={{ opacity: "var(--reveal)" }}
        />

        {/* Final screen */}
        <div
          className="absolute inset-0 flex items-end pb-[max(2.5rem,env(safe-area-inset-bottom))] md:items-center md:pb-0"
          style={{ opacity: "var(--reveal)", transform: "translateY(calc((1 - var(--reveal)) * 28px))", pointerEvents: revealed ? "auto" : "none" }}
        >
          <div className="mx-auto w-[min(1240px,100%-32px)] pt-[76px] md:w-[min(1240px,100%-48px)]">
            <div className="max-w-[620px] text-white">
              <p className="mb-5 flex items-center gap-3 text-[12px] font-semibold tracking-[.2em] text-gold-light uppercase sm:text-[13px]">
                <span aria-hidden="true" className="h-px w-10 bg-gold-light" />
                {t("hero.eyebrow")}
              </p>
              <h1 className="font-display text-[clamp(40px,6vw,88px)] leading-[0.98] font-medium tracking-tight">{t("hero.title")}</h1>
              <p className="mt-6 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-white/80">{t("hero.lead")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={openCall} size="lg" className="h-12 rounded-full bg-gold px-7 text-[15px] font-semibold text-ink hover:bg-gold-light">
                  {t("lead.send")}
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-white/5 px-7 text-[15px] font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white">
                  <a href="#projects">{t("hero.cta1")}</a>
                </Button>
              </div>
              <dl className="mt-8 grid grid-cols-3 gap-x-4 border-t border-white/20 pt-5 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-4 sm:pt-6">
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

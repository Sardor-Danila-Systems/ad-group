"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

/*
 * Site-wide motion, mounted once in the root layout.
 *
 * - Paged scrolling (the Sheron feel): the screen stays still and every wheel step, swipe or arrow key
 *   glides to the next stop in about 1.6 s with a slow start and a long, soft finish. Stops are the
 *   tops of the page sections ([data-curtain]); tall sections get extra stops one screen apart,
 *   and a section may set its own as fractions of its scroll range (data-stops="0,0.4,1").
 * - Curtains: while a section glides in, its content is held still and the edge moves up, like a wipe
 *   (pure CSS, scroll-driven; here we only keep --h, the section height, up to date).
 * - Reveals: [data-reveal] elements start hidden (only under html.motion, so the page is complete
 *   without JS or with reduced motion) and get .in when they come into view. Looks: globals.css («Motion»).
 */

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Softer start and finish for long glides through a scroll-played video. */
const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Where the page scrolls by itself: dialogs, menus, popovers, the 360° viewer. */
const OWN_SCROLL = "[data-lenis-prevent],[role=dialog],[data-radix-popper-content-wrapper],[data-slot=sheet-content],[data-slot=dialog-overlay],[data-slot=sheet-overlay]";
/** Controls that use vertical drags or keys themselves. */
const OWN_INPUT = "input,textarea,select,[contenteditable],[role=slider],[role=listbox],[role=menu],[role=dialog]";

export function Motion() {
  const admin = usePathname().startsWith("/admin");


  // Before paint, so reveals are hidden in the first frame the user could see (the preloader covers the page at load).
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || admin || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion");
    return () => document.documentElement.classList.remove("motion");
  }, [admin]);

  // Reveals and curtain heights. Both start once the page is shown (also keeps hydration untouched).
  useEffect(() => {
    if (admin || !document.documentElement.classList.contains("motion")) return;
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        el.style.setProperty("--h", `${Math.round(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)}px`);
      }
    });

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
      document.querySelectorAll("[data-curtain]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        ro.observe(el);
      });
    };

    // Entrance animations wait for the preloader to open.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      scan();
    };
    if (root.hasAttribute("data-ready")) start();
    else window.addEventListener("site-ready", start, { once: true });

    // Client-side navigation and lists that change (filters, carousels) bring new elements.
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued || !started) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // At the very end of the page the bottom margin above can never be crossed: show what is on screen.
    const onEnd = () => {
      if (!started || window.innerHeight + window.scrollY < root.scrollHeight - 4) return;
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      });
    };
    window.addEventListener("scroll", onEnd, { passive: true });

    return () => {
      window.removeEventListener("site-ready", start);
      window.removeEventListener("scroll", onEnd);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
    };
  }, [admin]);

  /*
   * Pictures. They start loading two to three screens before they come into view (the browser's own lazy
   * loading waits until they are almost there, too late with paged glides and a distant CDN), a warm
   * shimmer holds their frame until they arrive, and then they fade in (styles: globals.css «Pictures»).
   */
  useEffect(() => {
    if (admin) return;
    const root = document.documentElement;
    root.classList.add("imgfx");
    const PHOTO = 'img[data-nimg="fill"], img[data-nimg="1"][sizes]';
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const shown = (img: HTMLImageElement, fade: boolean) => {
      if (img.hasAttribute("data-loaded")) return;
      img.setAttribute("data-loaded", "");
      // The shimmer stays under the picture until it has faded in.
      if (!fade) return img.setAttribute("data-shown", "");
      const t = setTimeout(() => {
        timers.delete(t);
        img.setAttribute("data-shown", "");
      }, 650);
      timers.add(t);
    };
    const onLoad = (e: Event) => {
      const img = e.target;
      // Priority pictures (page covers) are never hidden, so there is no fade to wait for.
      if (img instanceof HTMLImageElement && img.matches(PHOTO)) shown(img, !img.matches('[fetchpriority="high"]'));
    };
    document.addEventListener("load", onLoad, true);
    document.addEventListener("error", onLoad, true);

    /*
     * What is watched is the picture's section ([data-curtain]), not the picture: while a section waits
     * below the screen its content is shifted up into view but clipped by the section, and the browser
     * (its lazy loading, an IntersectionObserver on the picture) counts a clipped picture as not there,
     * so pictures only began to load as their section was already sliding in.
     * A section about a screen away loads its pictures at once; further ones (up to 4.5 screens, enough to
     * reach past the home hero) queue,
     * three pictures at a time and nearest first, so they do not split the connection.
     */
    const pictures = new Map<Element, Set<HTMLImageElement>>();
    const start = (img: HTMLImageElement) => {
      if (img.loading === "lazy") img.loading = "eager";
    };
    const queue = new Set<HTMLImageElement>();
    let active = 0;
    const distance = (img: HTMLImageElement) => Math.abs((img.closest("[data-curtain]") ?? img).getBoundingClientRect().top);
    const pumpQueue = () => {
      while (active < 3 && queue.size) {
        const next = [...queue].sort((a, b) => distance(a) - distance(b))[0];
        queue.delete(next);
        if (next.loading !== "lazy" || next.complete) continue;
        active++;
        const settle = () => {
          active--;
          pumpQueue();
        };
        next.addEventListener("load", settle, { once: true });
        next.addEventListener("error", settle, { once: true });
        start(next);
      }
    };
    const near = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          for (const img of pictures.get(e.target) ?? []) {
            queue.delete(img);
            start(img);
          }
          near.unobserve(e.target);
        }
      },
      { rootMargin: "110% 60% 110% 60%" },
    );
    const far = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          far.unobserve(e.target);
          for (const img of pictures.get(e.target) ?? []) if (img.loading === "lazy") queue.add(img);
        }
        pumpQueue();
      },
      { rootMargin: "450% 100% 450% 100%" },
    );
    const watch = (img: HTMLImageElement) => {
      const target = img.closest("[data-curtain]") ?? img;
      let set = pictures.get(target);
      if (!set) {
        set = new Set();
        pictures.set(target, set);
      }
      set.add(img);
      // Observing again after the section was already handled reports it again, which starts this picture.
      near.observe(target);
      far.observe(target);
    };
    const seen = new WeakSet<Element>();
    // Every next/image picture loads ahead (logos too); photos also get the shimmer and the fade.
    const scan = () =>
      document.querySelectorAll<HTMLImageElement>("img[data-nimg]").forEach((img) => {
        // Already in (from the cache, or before this ran): no fade, nothing to wait for.
        if (img.complete && img.naturalWidth > 0 && img.matches(PHOTO)) shown(img, false);
        if (seen.has(img)) return;
        seen.add(img);
        if (img.loading === "lazy") watch(img);
      });
    scan();
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("load", onLoad, true);
      document.removeEventListener("error", onLoad, true);
      near.disconnect();
      far.disconnect();
      queue.clear();
      pictures.clear();
      mo.disconnect();
      for (const t of timers) clearTimeout(t);
      root.classList.remove("imgfx");
    };
  }, [admin]);

  // Paged scrolling.
  useEffect(() => {
    const root = document.documentElement;
    if (admin || !root.classList.contains("motion")) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    // Lenis only animates the glides; wheel and touch are handled below.
    const lenis = new Lenis({ smoothWheel: false, syncTouch: false, anchors: { offset: -76, duration: 1.6, easing: ease } });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const locked = () => root.style.overflow === "hidden" || document.body.hasAttribute("data-scroll-locked");
    // Only on pages built from sections; others (the 360° showroom) scroll as usual.
    const active = () => !locked() && document.querySelector("[data-curtain]") !== null && root.scrollHeight > window.innerHeight + 40;
    const sync = () => root.classList.toggle("paged", Boolean(document.querySelector("[data-curtain]")));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });

    const stops = () => {
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      const out: number[] = [0, max];
      document.querySelectorAll<HTMLElement>("[data-curtain]").forEach((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const range = el.offsetHeight - vh;
        const own = el.dataset.stops?.split(",").map(Number).filter((f) => Number.isFinite(f));
        if (own?.length) {
          for (const f of own) out.push(top + f * Math.max(0, range));
          return;
        }
        out.push(top);
        if (range > vh * 0.2) {
          const step = vh * 0.8;
          for (let y = top + step; y < top + range - vh * 0.25; y += step) out.push(y);
          out.push(top + range);
        }
      });
      const sorted = out.map((y) => Math.round(Math.min(max, Math.max(0, y)))).sort((a, b) => a - b);
      return sorted.filter((y, i) => i === 0 || y - sorted[i - 1] > 40);
    };

    let busy = false;
    let doneAt = 0;
    let safety: ReturnType<typeof setTimeout> | undefined;
    /** The glide under way, when it is a long one that a new push may hurry. */
    let long: { target: number; dir: number } | null = null;

    /*
     * A section can set its own glide length (data-glide, seconds on a computer): the home hero plays its
     * whole video in one calm glide instead of two quick ones with a stop in the middle.
     */
    const ownGlide = (from: number, to: number) => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-glide]")) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = top + el.offsetHeight - window.innerHeight;
        if (Math.min(from, to) >= top - 2 && Math.max(from, to) <= bottom + 2) return Number(el.dataset.glide) || 0;
      }
      return 0;
    };

    const glide = (target: number) => {
      const dist = Math.abs(target - window.scrollY) / window.innerHeight;
      const own = ownGlide(window.scrollY, target);
      const duration = own ? own * (fine ? 1 : 0.85) : (fine ? 1.65 : 1.2) * Math.min(1.3, Math.max(0.8, dist));
      long = own ? { target, dir: Math.sign(target - window.scrollY) } : null;
      busy = true;
      const done = () => {
        busy = false;
        long = null;
        doneAt = performance.now();
        clearTimeout(safety);
      };
      safety = setTimeout(done, duration * 1000 + 400);
      lenis.scrollTo(target, { duration, easing: own ? easeSine : ease, lock: true, force: true, onComplete: done });
    };
    /** Another push the same way during a long glide finishes it quickly instead of being ignored. */
    const hurry = (dir: number) => {
      if (!long || long.dir !== dir) return;
      const { target } = long;
      long = null;
      clearTimeout(safety);
      safety = setTimeout(() => {
        busy = false;
        doneAt = performance.now();
      }, 1100);
      lenis.scrollTo(target, {
        duration: 0.7,
        easing: easeOut,
        lock: true,
        force: true,
        onComplete: () => {
          busy = false;
          doneAt = performance.now();
          clearTimeout(safety);
        },
      });
    };
    const go = (dir: 1 | -1) => {
      const y = window.scrollY;
      const list = stops();
      const target = dir > 0 ? list.find((s) => s > y + 4) : [...list].reverse().find((s) => s < y - 4);
      if (target !== undefined) glide(target);
    };

    // A nested area that can still scroll this way keeps the wheel.
    const scrollsItself = (node: Element | null, dy: number) => {
      for (let el = node; el && el !== document.body && el !== root; el = el.parentElement) {
        const s = getComputedStyle(el);
        if (!/(auto|scroll)/.test(s.overflowY) || el.scrollHeight <= el.clientHeight + 1) continue;
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
      return false;
    };

    let lastWheel = 0;
    let lastDelta = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || !active()) return;
      const target = e.target as Element;
      if (target.closest?.(OWN_SCROLL) || scrollsItself(target, e.deltaY)) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      const fresh = Math.abs(e.deltaY) > Math.abs(lastDelta) * 1.4 + 4;
      lastWheel = now;
      lastDelta = e.deltaY;
      if (busy && (fresh || gap > 250) && Math.abs(e.deltaY) >= 2) hurry(e.deltaY > 0 ? 1 : -1);
      if (busy || Math.abs(e.deltaY) < 2) return;
      // A trackpad keeps sending a fading stream after a glide: wait for a pause or a fresh push.
      if (now - doneAt < 650 && gap < 160 && !fresh) return;
      go(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !active()) return;
      const focus = document.activeElement;
      if (focus?.closest(OWN_INPUT)) return;
      const space = e.key === " " && !focus?.closest("button,a,[role=button]");
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (space && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (space && e.shiftKey);
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        if (!busy) glide(e.key === "Home" ? 0 : root.scrollHeight - window.innerHeight);
        return;
      }
      if (!down && !up) return;
      e.preventDefault();
      if (busy) hurry(down ? 1 : -1);
      else go(down ? 1 : -1);
    };

    let tracking = false;
    let sx = 0;
    let sy = 0;
    const onTouchStart = (e: TouchEvent) => {
      tracking = e.touches.length === 1 && active() && !(e.target as Element).closest?.(`${OWN_SCROLL},${OWN_INPUT}`);
      sx = e.touches[0]?.clientX ?? 0;
      sy = e.touches[0]?.clientY ?? 0;
    };
    // The page itself never scrolls under the finger; the swipe decides where to glide.
    const onTouchMove = (e: TouchEvent) => {
      if (tracking && e.touches.length === 1 && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = sx - t.clientX;
      const dy = sy - t.clientY;
      if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx)) return;
      if (busy) hurry(dy > 0 ? 1 : -1);
      else go(dy > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      clearTimeout(safety);
      cancelAnimationFrame(raf);
      mo.disconnect();
      root.classList.remove("paged");
      lenis.destroy();
    };
  }, [admin]);

  return null;
}

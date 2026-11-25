"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

/*
 * Site-wide motion, mounted once in the root layout.
 *
 * - Scrolling is the browser's own: wheel, trackpad, touch and keys are never intercepted, so the page
 *   answers at once and scrolls on the compositor even while the main thread is busy. (Paged glides
 *   with Lenis used to swallow pushes during a glide and the trackpad's momentum, so the page
 *   sometimes did not move and sometimes lagged.)
 * - Curtains: while a section scrolls in, its content is held still and the edge moves up, like a wipe
 *   (pure CSS, scroll-driven; here we only keep --h, the section height, up to date).
 * - Reveals: [data-reveal] elements start hidden (only under html.motion, so the page is complete
 *   without JS or with reduced motion) and get .in when they come into view. Looks: globals.css («Motion»).
 */

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
   * loading waits until they are almost there, too late for a fast flick and a distant CDN), a warm
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
      if (img instanceof HTMLImageElement && img.matches(PHOTO)) shown(img, !img.matches('[fetchpriority="high"]:not([data-boost])'));
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
            // The section about to arrive goes ahead of everything still downloading (hero frames included).
            img.dataset.boost = ""; // still fades in, unlike a page cover
            img.fetchPriority = "high";
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

  return null;
}

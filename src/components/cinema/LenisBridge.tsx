"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LenisBridge() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Prevent mobile Safari/Chrome dynamic address-bar resizes from breaking
    // pinned vertical-to-horizontal scroll stages or causing layout jumps.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // 24 FPS cadence creates crisp, authentic real-looking motion speed
    // and keeps CPU/GPU overhead light across mobile and desktop.
    gsap.ticker.fps(24);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 0.52,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.25,
      touchMultiplier: 1.35,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // Only refresh ScrollTrigger when viewport width actually changes
    // (ignores mobile vertical address-bar show/hide height changes).
    let lastWidth = window.innerWidth;
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const t = setTimeout(() => ScrollTrigger.refresh(), 90);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

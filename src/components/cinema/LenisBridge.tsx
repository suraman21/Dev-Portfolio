"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll Performance Bridge (60–120 Hz Native Speed)
 *
 * - Mobile / Touch devices: Uses 100% native OS hardware-accelerated momentum
 *   scrolling (never intercepts touch events or slows down thumb flicks).
 * - Desktop / Mouse devices: Runs Lenis at native display refresh rate (autoRaf)
 *   with crisp, responsive lerp so wheel scrolling feels fast and effortless.
 * - Note: The 3D Hero Workstation runs its own independent 24 FPS pacer inside
 *   `SceneCanvas.tsx` — global scroll & GSAP stay unlocked at full 60–120 FPS.
 */
export function LenisBridge() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Prevent mobile browser dynamic address-bar resizes from jumping pinned stages
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarseTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // Refresh ScrollTrigger only when viewport WIDTH changes (never on mobile URL bar hide/show)
    let lastWidth = window.innerWidth;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // On mobile/touch or reduced-motion: rely purely on fast native browser scrolling
    if (reducedMotion || isCoarseTouch) {
      ScrollTrigger.refresh();
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
      };
    }

    // Desktop/Laptop: crisp, fast native-Hz smooth wheel (zero heavy drag or 24fps throttle)
    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: true,
      wheelMultiplier: 1.35,
      autoRaf: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
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

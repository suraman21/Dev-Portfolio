"use client";

import { useEffect, useState } from "react";
import { useCinema } from "./CinemaProvider";

export function XRayTelemetryOverlay() {
  const { xrayMode, tvMode, toggleXrayMode } = useCinema();
  const [fps, setFps] = useState(60);
  const [viewport, setViewport] = useState({ w: 1440, h: 900, tier: "LAPTOP" });

  useEffect(() => {
    if (!xrayMode) return;

    const updateViewport = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const tier = tvMode
        ? "4K / 10-FT TV"
        : w < 768
          ? "MOBILE (1-FT)"
          : w < 1441
            ? "LAPTOP (2-FT)"
            : w < 2400
              ? "DESKTOP (2.5-FT)"
              : "4K ULTRAWIDE";
      setViewport({ w, h, tier });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    let frames = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      frames++;
      if (now - lastTime >= 500) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", updateViewport);
      cancelAnimationFrame(rafId);
    };
  }, [xrayMode, tvMode]);

  if (!xrayMode) return null;

  return (
    <>
      {/* 12-Column Swiss Architectural Grid Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] shell"
      >
        <div className="grid h-full grid-cols-4 md:grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full border-x border-[var(--neon-teal)]/20 bg-[var(--neon-teal)]/[0.025] ${
                idx >= 4 ? "hidden md:block" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Live Engineering Telemetry HUD */}
      <div className="obsidian-island fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[110] rounded-2xl px-4 py-3 text-xs">
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/10">
          <span className="font-mono-tech text-[10px] text-[var(--neon-teal)]">
            X-RAY TELEMETRY · LIVE
          </span>
          <button
            onClick={toggleXrayMode}
            className="font-mono-tech text-[10px] text-white/60 hover:text-[var(--neon-orange)] cursor-pointer"
          >
            CLOSE [X]
          </button>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-1.5 font-mono text-[11px]">
          <span className="text-white/55">FRAME RATE</span>
          <span className="text-right font-semibold text-[var(--neon-teal)]">{fps} FPS</span>
          <span className="text-white/55">VIEWPORT</span>
          <span className="text-right text-white">
            {viewport.w}×{viewport.h}
          </span>
          <span className="text-white/55">SPATIAL TIER</span>
          <span className="text-right text-[var(--neon-orange)]">{viewport.tier}</span>
          <span className="text-white/55">COLOR GAMUT</span>
          <span className="text-right text-white">oklch · Light PBR</span>
        </div>
      </div>
    </>
  );
}

"use client";

import React, { Component, Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Precision 24 FPS Frame Pacer
 * Runs the 3D scene at a crisp, real-looking 24fps filmic cadence (41.67ms/frame)
 * using R3F `frameloop="demand"` — cuts GPU overhead by ~60% while delivering
 * authentic cinematic motion speed. Automatically pauses when tab is hidden.
 */
function FramePacer({ fps = 24 }: { fps?: number }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const frameInterval = 1000 / fps;
    let rafId = 0;
    let lastTime = 0;

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (document.hidden) return;
      if (now - lastTime >= frameInterval) {
        lastTime = now - ((now - lastTime) % frameInterval);
        invalidate();
      }
    };

    invalidate();
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [fps, invalidate]);

  return null;
}

function OpticalFallback({ label }: { label?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit] sunlit-aura">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border border-[var(--neon-teal)]/60 shadow-[0_0_60px_rgba(0,229,204,0.28)]"
          style={{ animation: "spin 18s linear infinite" }}
        />
        <div
          className="absolute inset-6 rounded-full border border-[var(--neon-orange)]/70 shadow-[0_0_50px_rgba(255,90,31,0.25)]"
          style={{ animation: "spin 12s linear infinite reverse" }}
        />
        <div className="porcelain-glass flex h-24 w-24 items-center justify-center rounded-3xl rotate-45">
          <div className="-rotate-45 h-7 w-7 rounded-full bg-gradient-to-br from-[var(--neon-teal)] to-[var(--neon-orange)] shadow-[0_0_24px_rgba(255,90,31,0.5)]" />
        </div>
      </div>
      {label && (
        <span className="font-mono-tech absolute bottom-4 left-4 text-[10px] text-[var(--ink-muted)]">
          {label}
        </span>
      )}
    </div>
  );
}

interface SceneCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  fps?: number;
  className?: string;
  fallbackLabel?: string;
}

export function SceneCanvas({
  children,
  cameraPosition = [0, 0.35, 5.4],
  fov = 38,
  fps = 24,
  className = "",
  fallbackLabel,
}: SceneCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebglReady(false);
    } catch {
      setWebglReady(false);
    }
  }, []);

  const fallback = <OpticalFallback label={fallbackLabel} />;

  if (!mounted || !webglReady) {
    return <div className={`relative h-full w-full ${className}`}>{fallback}</div>;
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <CanvasErrorBoundary fallback={fallback}>
        <Canvas
          frameloop="demand"
          dpr={dpr}
          camera={{ position: cameraPosition, fov, near: 0.1, far: 80 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
          style={{ background: "transparent" }}
        >
          <FramePacer fps={fps} />
          <PerformanceMonitor
            onDecline={() => setDpr([1, 1.25])}
            onIncline={() => setDpr([1, 1.75])}
          />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

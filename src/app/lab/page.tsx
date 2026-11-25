"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Expand, Minimize2, Sparkles, Waves } from "lucide-react";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { TopologyLab3D } from "@/components/3d/TopologyLab3D";
import { ProjectArtifact3D } from "@/components/3d/ProjectArtifact3D";
import type { ArtifactVariant } from "@/data/projects";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

export default function LabPage() {
  // Experiment 1: Distributed Edge & Refraction Studio
  const [trafficRps, setTrafficRps] = useState(55);
  const [edgeCache, setEdgeCache] = useState(true);
  const [ior, setIor] = useState(1.52);
  const [exploded, setExploded] = useState(false);

  // Experiment 2: Sculptural PBR Artifact Gallery
  const [artifact, setArtifact] = useState<ArtifactVariant>("monolith");

  // Experiment 3: Disney Spring Physics Bench
  const [stiffness, setStiffness] = useState(280);
  const [damping, setDamping] = useState(24);
  const [pulseCount, setPulseCount] = useState(0);

  const { soundEnabled } = useCinema();

  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        <header className="max-w-3xl pb-12 border-b border-[var(--border-mineral)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-mist)] border border-[var(--neon-teal)]/45 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[var(--teal-deep)]">
            <Sparkles className="h-3.5 w-3.5" />
            R&amp;D SCREENING ROOM · INTERACTIVE 3D &amp; MOTION LAB
          </span>
          <h1 className="mt-5 text-hero font-bold text-[var(--ink-obsidian)]">
            Live Engineering{" "}
            <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
              Playground.
            </span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--ink-slate)] max-w-[58ch]">
            Every control below manipulates real WebGL PBR uniforms, simulated distributed load, or
            analytical spring physics in real time — proof of craft you can touch directly.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          {/* LAB 01 — Edge Topology & Dichroic Refraction Studio */}
          <section className="porcelain-card dichroic-ring rounded-[34px] p-6 md:p-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 h-[360px] md:h-[450px] overflow-hidden rounded-3xl border border-[var(--border-mineral)] sunlit-aura">
                <SceneCanvas cameraPosition={[0, 0.25, 4.9]} fallbackLabel="LAB 01 TOPOLOGY">
                  <TopologyLab3D
                    trafficRps={trafficRps}
                    edgeCache={edgeCache}
                    refractionIor={ior}
                    exploded={exploded}
                  />
                </SceneCanvas>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2 font-mono text-[10.5px] font-bold text-[var(--teal-deep)]">
                  <Cpu className="h-4 w-4" /> EXPERIMENT 01 · PBR REFRACTION &amp; EDGE LOAD
                </div>
                <h2 className="text-h3 font-bold text-[var(--ink-obsidian)]">
                  Real-Time Optical Core &amp; Traffic Telemetry
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span>SIMULATED TRAFFIC LOAD</span>
                      <span className="text-[var(--orange-lacquer)] font-bold">
                        {trafficRps * 10}k RPS
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={trafficRps}
                      onChange={(e) => setTrafficRps(Number(e.target.value))}
                      className="h-2 w-full accent-[var(--neon-orange)] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span>CRYSTAL REFRACTION INDEX (IOR)</span>
                      <span className="text-[var(--teal-deep)] font-bold">{ior.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={1.1}
                      max={2.1}
                      step={0.02}
                      value={ior}
                      onChange={(e) => setIor(Number(e.target.value))}
                      className="h-2 w-full accent-[var(--teal-deep)] cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      data-tv-focus="true"
                      onClick={() => {
                        foley.playDetent(soundEnabled);
                        setEdgeCache((v) => !v);
                      }}
                      className={`rounded-full px-4 py-2.5 font-mono text-xs font-semibold cursor-pointer ${
                        edgeCache
                          ? "bg-[var(--teal-deep)] text-white"
                          : "bg-[var(--neon-orange)] text-[#0E171A]"
                      }`}
                    >
                      Edge Cache: {edgeCache ? "ENABLED" : "BYPASSED"}
                    </button>

                    <button
                      type="button"
                      data-tv-focus="true"
                      onClick={() => {
                        foley.playDetent(soundEnabled);
                        setExploded((v) => !v);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white px-4 py-2.5 font-mono text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
                    >
                      {exploded ? (
                        <>
                          <Minimize2 className="h-3.5 w-3.5" /> Collapse
                        </>
                      ) : (
                        <>
                          <Expand className="h-3.5 w-3.5" /> Explode
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LAB 02 — Sculptural PBR Artifact Switcher */}
          <section className="porcelain-card rounded-[34px] p-6 md:p-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="font-mono text-[10.5px] font-bold text-[var(--orange-lacquer)]">
                  EXPERIMENT 02 · LIGHT-MODE PBR MATERIAL GALLERY
                </div>
                <h2 className="text-h3 font-bold text-[var(--ink-obsidian)]">
                  Inspect All 4 Bespoke Portfolio Sculptures
                </h2>
                <p className="text-sm text-[var(--ink-slate)] leading-relaxed">
                  Each flagship project owns a distinct physical sculpture lit by procedural studio
                  softboxes and short-range neon bounce lights — zero heavy HDRI files.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    [
                      { id: "prism", label: "01 · Edge Prism" },
                      { id: "vault", label: "02 · Swiss Vault" },
                      { id: "monolith", label: "03 · Glass Monolith" },
                      { id: "lattice", label: "04 · Kinetic Lattice" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      data-tv-focus="true"
                      onClick={() => {
                        foley.playDetent(soundEnabled);
                        setArtifact(item.id);
                      }}
                      className={`rounded-2xl border px-4 py-3 text-left font-mono text-xs font-semibold transition-all cursor-pointer ${
                        artifact === item.id
                          ? "border-[var(--ink-obsidian)] bg-[var(--ink-obsidian)] text-[var(--neon-teal)]"
                          : "border-[var(--border-mineral)] bg-[var(--bg-alabaster)] text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 h-[360px] md:h-[420px] overflow-hidden rounded-3xl border border-[var(--border-mineral)] sunlit-aura">
                <SceneCanvas cameraPosition={[0, 0.25, 4.35]} fallbackLabel="ARTIFACT STUDIO">
                  <ProjectArtifact3D variant={artifact} />
                </SceneCanvas>
              </div>
            </div>
          </section>

          {/* LAB 03 — Spring Physics & Tactile Motion Bench */}
          <section className="porcelain-card rounded-[34px] p-6 md:p-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2 font-mono text-[10.5px] font-bold text-[var(--teal-deep)]">
                  <Waves className="h-4 w-4" /> EXPERIMENT 03 · LUXURY SPRING PHYSICS BENCH
                </div>
                <h2 className="text-h3 font-bold text-[var(--ink-obsidian)]">
                  Feel Critically Damped vs. Energetic Motion
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span>STIFFNESS</span>
                      <span className="font-bold text-[var(--teal-deep)]">{stiffness}</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={600}
                      value={stiffness}
                      onChange={(e) => setStiffness(Number(e.target.value))}
                      className="h-2 w-full accent-[var(--teal-deep)] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span>DAMPING</span>
                      <span className="font-bold text-[var(--orange-lacquer)]">{damping}</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={50}
                      value={damping}
                      onChange={(e) => setDamping(Number(e.target.value))}
                      className="h-2 w-full accent-[var(--neon-orange)] cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    data-tv-focus="true"
                    onClick={() => {
                      foley.playDetent(soundEnabled);
                      setPulseCount((c) => c + 1);
                    }}
                    className="rounded-full bg-[var(--neon-orange)] px-6 py-3 font-mono text-xs font-bold text-[#0E171A] shadow-md cursor-pointer"
                  >
                    Trigger Spring Impulse ({pulseCount})
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 flex h-[280px] items-center justify-center rounded-3xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-6 overflow-hidden">
                <motion.div
                  key={pulseCount}
                  initial={{ x: -120, rotate: -14, scale: 0.88 }}
                  animate={{ x: 0, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness, damping, mass: 0.9 }}
                  className="obsidian-island dichroic-ring flex h-36 w-64 flex-col items-center justify-center rounded-3xl p-5 text-center"
                >
                  <span className="font-mono text-[10px] text-[var(--neon-teal)]">
                    LIVE SPRING SPEC
                  </span>
                  <div className="mt-1 font-mono text-sm font-bold text-white">
                    k={stiffness} · c={damping}
                  </div>
                  <span className="mt-2 font-mono text-[10px] text-[var(--neon-orange)]">
                    {damping >= 22 ? "LUXURY ARCHITECTURAL WEIGHT" : "PLAYFUL OVERSHOOT"}
                  </span>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

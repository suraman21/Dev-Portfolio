"use client";

import { useState } from "react";
import { ArrowUpRight, Cpu, Gauge, ShieldCheck, Sliders, Sparkles } from "lucide-react";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { TopologyLab3D } from "@/components/3d/TopologyLab3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

/**
 * ACT IV — THE LIVING ATELIER (Interactive SaaS Engineering Workbench)
 * Lets CTOs & hiring managers directly manipulate traffic load & edge caching
 * and watch the 3D distributed mesh + live p99 latency telemetry respond in real time.
 * Grounded in Flow (#46), IKEA Effect (#49), and Authority Bias (#02).
 */
export function LivingAtelierSection() {
  const [trafficRps, setTrafficRps] = useState(42);
  const [edgeCache, setEdgeCache] = useState(true);
  const [exploded, setExploded] = useState(false);
  const { soundEnabled, toggleXrayMode, xrayMode } = useCinema();

  const p99Latency = edgeCache
    ? Math.round(18 + trafficRps * 0.24)
    : Math.round(48 + Math.pow(trafficRps, 1.38) * 0.65);

  const throughputM = (trafficRps * 0.22).toFixed(1);
  const isHealthy = p99Latency < 85;

  return (
    <section
      id="act-4"
      aria-label="Act IV — The Living Atelier Interactive Engineering Workbench"
      className="relative border-y border-[var(--border-mineral)] bg-[var(--bg-alabaster)] py-20 md:py-28"
    >
      <div className="shell">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-mist)] border border-[var(--neon-teal)]/45 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[var(--teal-deep)]">
              <Cpu className="h-3.5 w-3.5" />
              ACT 04 · THE LIVING ATELIER
            </span>
            <h2 className="mt-4 text-h2 font-bold text-[var(--ink-obsidian)]">
              Don&apos;t Just Read About Systems —{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                Stress-Test One.
              </span>
            </h2>
          </div>

          <MagneticButton href="/lab" variant="teal" cursorText="OPEN LAB">
            Open Full R&amp;D Screening Room <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>

        {/* Luxury SaaS Bento Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Interactive 3D Distributed Mesh Stage */}
          <div className="lg:col-span-7 porcelain-card dichroic-ring rounded-[32px] p-5 md:p-6 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isHealthy ? "bg-[var(--neon-teal)] pulse-teal" : "bg-[var(--neon-orange)]"
                  }`}
                />
                <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                  LIVE 3D EDGE TOPOLOGY SIMULATOR
                </span>
              </div>
              <span
                className={`rounded-full px-3 py-1 font-mono text-[10.5px] font-bold ${
                  isHealthy
                    ? "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                    : "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                }`}
              >
                {isHealthy ? "EQUILIBRIUM · OPTIMAL" : "THERMAL LOAD SPIKE"}
              </span>
            </div>

            <div className="h-[340px] sm:h-[400px] w-full overflow-hidden rounded-3xl border border-[var(--border-mineral)] sunlit-aura">
              <SceneCanvas cameraPosition={[0, 0.25, 4.9]} fallbackLabel="EDGE TOPOLOGY">
                <TopologyLab3D
                  trafficRps={trafficRps}
                  edgeCache={edgeCache}
                  exploded={exploded}
                />
              </SceneCanvas>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[var(--bg-alabaster)] p-3.5 border border-[var(--border-mineral)]/80">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">GLOBAL p99</div>
                <div
                  className={`mt-1 text-xl md:text-2xl font-bold font-mono ${
                    isHealthy ? "text-[var(--teal-deep)]" : "text-[var(--orange-lacquer)]"
                  }`}
                >
                  {p99Latency}ms
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--bg-alabaster)] p-3.5 border border-[var(--border-mineral)]/80">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">THROUGHPUT</div>
                <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[var(--ink-obsidian)]">
                  {throughputM}M/m
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--bg-alabaster)] p-3.5 border border-[var(--border-mineral)]/80">
                <div className="font-mono text-[10px] text-[var(--ink-muted)]">CACHE HIT</div>
                <div className="mt-1 text-xl md:text-2xl font-bold font-mono text-[var(--ink-obsidian)]">
                  {edgeCache ? "98.4%" : "12.0%"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Control Deck & Meta-Engineering Proof */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct Manipulation Controls */}
            <div className="porcelain-card rounded-[32px] p-6 md:p-7 space-y-6">
              <div className="flex items-center gap-2.5">
                <Sliders className="h-4 w-4 text-[var(--orange-lacquer)]" />
                <span className="font-mono-tech text-[11px] text-[var(--ink-obsidian)]">
                  INTERACTIVE CONTROLS · TRY IT LIVE
                </span>
              </div>

              {/* Traffic Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="rps-slider" className="font-semibold text-[var(--ink-obsidian)]">
                    Simulated Global Traffic
                  </label>
                  <span className="font-mono text-xs font-bold text-[var(--orange-lacquer)]">
                    {trafficRps * 10}k req/sec
                  </span>
                </div>
                <input
                  id="rps-slider"
                  type="range"
                  min={10}
                  max={100}
                  value={trafficRps}
                  onChange={(e) => setTrafficRps(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-stone-deep)] accent-[var(--neon-orange)]"
                />
                <div className="flex justify-between font-mono text-[10px] text-[var(--ink-muted)]">
                  <span>100k RPS (Calm)</span>
                  <span>1M RPS (Peak Surge)</span>
                </div>
              </div>

              {/* Edge Cache Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--ink-obsidian)]">
                    Multi-Region Edge Caching
                  </div>
                  <div className="text-xs text-[var(--ink-slate)]">
                    Toggle off during high RPS to observe live orange thermal load
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={edgeCache}
                  data-tv-focus="true"
                  onClick={() => {
                    foley.playDetent(soundEnabled);
                    setEdgeCache((v) => !v);
                  }}
                  className={`relative h-8 w-14 shrink-0 rounded-full transition-colors cursor-pointer ${
                    edgeCache ? "bg-[var(--teal-deep)]" : "bg-[var(--neon-orange)]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      edgeCache ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Explode Mesh Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--ink-obsidian)]">
                    Expand Node Constellation
                  </div>
                  <div className="text-xs text-[var(--ink-slate)]">
                    Inspect all 24 orbital edge PoPs &amp; central refractive core
                  </div>
                </div>
                <button
                  type="button"
                  data-tv-focus="true"
                  onClick={() => {
                    foley.playDetent(soundEnabled);
                    setExploded((v) => !v);
                  }}
                  className="rounded-full border border-[var(--border-mineral)] bg-white px-4 py-2 font-mono text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
                >
                  {exploded ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            {/* Meta Engineering Proof Card — Inspect This Portfolio Live! */}
            <div className="obsidian-island rounded-[32px] p-6 md:p-7 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10.5px] text-[var(--neon-teal)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  LIVE PORTFOLIO INSPECTION
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#F7F5F0]">
                  Inspect This Site&apos;s Own Swiss Grid &amp; Real-Time FPS
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  Flip on X-Ray Mode to audit the 12-column mathematical grid, active spatial
                  viewport tier, and live frame telemetry powering this page.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs font-mono text-white/65">
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-[var(--neon-teal)]" /> INP &lt; 100ms
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--neon-orange)]" /> WCAG 2.2 AA+
                  </span>
                </div>
                <button
                  type="button"
                  data-tv-focus="true"
                  onClick={toggleXrayMode}
                  className="rounded-full bg-[var(--neon-teal)] px-4 py-2 font-mono text-xs font-bold text-[#0E171A] hover:brightness-110 transition-all cursor-pointer"
                >
                  {xrayMode ? "Disable X-Ray" : "Launch X-Ray [X]"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

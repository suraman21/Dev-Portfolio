"use client";

import { ArrowUpRight, CheckCircle2, Globe, Lock, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import type { ProjectPreviewType } from "@/data/projects";

interface ProjectPreviewProps {
  type: ProjectPreviewType;
  title: string;
  compact?: boolean;
}

/**
 * High-Craft Realistic SaaS & Website UI Previews
 * Gives normal visitors, founders, and recruiters immediate, tangible proof
 * of real product & web interface mastery — clean, fast, and crystal clear.
 */
export function ProjectPreview({ type, title, compact = false }: ProjectPreviewProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[24px] border border-[var(--border-mineral)] bg-gradient-to-br from-[#FBF9F5] via-[#FFFFFF] to-[#F3F0E9] ${
        compact ? "p-4" : "p-5 sm:p-6"
      } shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]`}
    >
      {/* Subtle Sunlit Ambient Glow inside Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--neon-teal)]/15 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[var(--neon-orange)]/12 blur-2xl"
      />

      {/* Crisp Browser Chrome Bar */}
      <div className="relative z-10 mb-4 flex items-center justify-between border-b border-[var(--border-mineral)]/80 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-orange)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-teal)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-mineral)]" />
        </div>
        <div className="rounded-full bg-[var(--bg-alabaster)] border border-[var(--border-mineral)]/80 px-3 py-0.5 font-mono text-[10px] text-[var(--ink-muted)]">
          {title.toLowerCase().replace(/\s+/g, "")}.app
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--teal-deep)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-teal)]" /> Live
        </span>
      </div>

      {/* Variant 1: Aether Cloud Analytics SaaS */}
      {type === "analytics" && (
        <div className="relative z-10 space-y-3.5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-[var(--border-mineral)] bg-white p-3">
              <div className="text-[10px] font-medium text-[var(--ink-muted)]">Global Latency</div>
              <div className="mt-1 text-lg font-bold text-[var(--teal-deep)]">36ms</div>
              <div className="text-[10px] text-[var(--teal-deep)]">↓ 64% faster</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-mineral)] bg-white p-3">
              <div className="text-[10px] font-medium text-[var(--ink-muted)]">Uptime SLA</div>
              <div className="mt-1 text-lg font-bold text-[var(--ink-obsidian)]">99.99%</div>
              <div className="text-[10px] text-[var(--ink-muted)]">38 edge regions</div>
            </div>
            <div className="rounded-2xl border border-[var(--neon-orange)]/35 bg-[var(--orange-halo)]/65 p-3">
              <div className="text-[10px] font-medium text-[var(--orange-lacquer)]">Active Alerts</div>
              <div className="mt-1 text-lg font-bold text-[var(--orange-lacquer)]">0</div>
              <div className="text-[10px] text-[var(--orange-lacquer)]">All healthy</div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-mineral)] bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--ink-obsidian)]">
                Real-Time Request Throughput
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--teal-mist)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--teal-deep)]">
                <TrendingUp className="h-3 w-3" /> 14.2M / min
              </span>
            </div>
            <div className="flex h-24 items-end gap-2">
              {[42, 56, 48, 64, 72, 61, 82, 76, 91, 86, 98, 94].map((val, i) => (
                <div
                  key={i}
                  style={{ height: `${val}%` }}
                  className={`flex-1 rounded-t-md transition-all ${
                    i === 10
                      ? "bg-[var(--neon-orange)]"
                      : i >= 7
                        ? "bg-[var(--neon-teal)]"
                        : "bg-[var(--surface-stone-deep)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Variant 2: Solstice Financial / Treasury SaaS */}
      {type === "finance" && (
        <div className="relative z-10 space-y-3.5">
          <div className="rounded-2xl bg-[var(--ink-obsidian)] p-4 text-[#F7F5F0]">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span>Total Treasury Balance</span>
              <span className="inline-flex items-center gap-1 text-[var(--neon-teal)]">
                <Lock className="h-3 w-3" /> Multi-Sig Verified
              </span>
            </div>
            <div className="mt-1.5 font-mono text-2xl font-bold tracking-tight">$48,920,400.00</div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px]">
              <span className="text-white/65">Zurich · USD / EUR / CHF</span>
              <span className="rounded-full bg-[var(--neon-orange)] px-2.5 py-0.5 font-semibold text-[#0F171A]">
                Approve Wire
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { name: "Meridian Settlement", amount: "$4,250,000", status: "Approved · 2/2", ok: true },
              { name: "Nordic Liquidity Pool", amount: "$1,800,000", status: "Ready for Sign-Off", ok: false },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-xl border border-[var(--border-mineral)] bg-white px-3.5 py-2.5"
              >
                <div>
                  <div className="text-xs font-semibold text-[var(--ink-obsidian)]">{row.name}</div>
                  <div className="text-[10.5px] text-[var(--ink-muted)]">{row.status}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                    {row.amount}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                      row.ok ? "text-[var(--teal-deep)]" : "text-[var(--orange-lacquer)]"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" /> {row.ok ? "Settled" : "Action Needed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variant 3: Maison Velour Luxury Web Flagship */}
      {type === "commerce" && (
        <div className="relative z-10 space-y-3.5">
          <div className="grid grid-cols-12 gap-3 rounded-2xl border border-[var(--border-mineral)] bg-[#FAF7F1] p-4 items-center">
            <div className="col-span-7 space-y-2">
              <span className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--teal-deep)]">
                AUTUMN COLLECTION · PARIS
              </span>
              <div className="font-editorial text-2xl leading-tight text-[var(--ink-obsidian)]">
                Sculpted Ceramic &amp; Light
              </div>
              <p className="text-[11px] text-[var(--ink-slate)]">
                Hand-finished architectural vessels delivered worldwide.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--neon-orange)] px-3 py-1 text-[10.5px] font-semibold text-[#0F171A]">
                  Shop Lookbook <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
            <div className="col-span-5 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-white via-[#F5F2EB] to-[#E8F8F5] border border-[var(--border-mineral)]">
              <div className="relative h-16 w-12 rounded-t-full rounded-b-xl bg-gradient-to-b from-white to-[#E6E1D7] border border-white shadow-[0_12px_24px_-8px_rgba(0,229,204,0.4)]">
                <div className="absolute -right-2 top-3 h-4 w-4 rounded-full bg-[var(--neon-orange)]/80 blur-[1px]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-xl border border-[var(--border-mineral)] bg-white py-2.5 px-2">
              <div className="text-xs font-bold text-[var(--teal-deep)]">1.1s</div>
              <div className="text-[10px] text-[var(--ink-muted)]">Mobile Load</div>
            </div>
            <div className="rounded-xl border border-[var(--border-mineral)] bg-white py-2.5 px-2">
              <div className="text-xs font-bold text-[var(--orange-lacquer)]">+41%</div>
              <div className="text-[10px] text-[var(--ink-muted)]">Sales Lift</div>
            </div>
            <div className="rounded-xl border border-[var(--border-mineral)] bg-white py-2.5 px-2">
              <div className="text-xs font-bold text-[var(--ink-obsidian)]">60fps</div>
              <div className="text-[10px] text-[var(--ink-muted)]">Smooth Swipe</div>
            </div>
          </div>
        </div>
      )}

      {/* Variant 4: Kinetix Collaborative Design System Workspace */}
      {type === "workspace" && (
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-center justify-between rounded-xl border border-[var(--border-mineral)] bg-white px-3.5 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink-obsidian)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--orange-lacquer)]" />
              Button · Primary Component
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-[var(--teal-mist)] px-2 py-0.5 text-[10px] font-semibold text-[var(--teal-deep)]">
                3 Live Editors
              </span>
              <Globe className="h-3.5 w-3.5 text-[var(--ink-muted)]" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-mineral)] bg-white p-5">
              <div className="rounded-full bg-[var(--neon-orange)] px-5 py-2 text-xs font-semibold text-[#0F171A] shadow-[0_10px_24px_-8px_rgba(255,90,31,0.6)]">
                Get Started →
              </div>
              <span className="mt-3 font-mono text-[10px] text-[var(--teal-deep)]">
                Spring · 60fps · WCAG AA+
              </span>
            </div>
            <div className="col-span-5 space-y-2 rounded-2xl border border-[var(--border-mineral)] bg-white p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Synced Tokens
              </div>
              {["Radius · Full", "Accent · Neon", "Export · React"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-[11px] text-[var(--ink-obsidian)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

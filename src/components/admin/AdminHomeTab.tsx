"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { BuildStep, CmsData } from "@/types/cms";

interface AdminHomeTabProps {
  draft: CmsData;
  onUpdate: (updater: (prev: CmsData) => CmsData) => void;
}

type HomeSubTab = "hero" | "slides" | "reel" | "cta";

export function AdminHomeTab({ draft, onUpdate }: AdminHomeTabProps) {
  const [subTab, setSubTab] = useState<HomeSubTab>("hero");
  const { site, buildSteps } = draft;

  const setSite = (patch: Partial<CmsData["site"]>) =>
    onUpdate((prev) => ({ ...prev, site: { ...prev.site, ...patch } }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Home Page Sections</h2>
          <p className="text-xs text-[var(--ink-slate)]">
            Every section on the Home page is categorized below — Hero, Process Slides, Featured
            Work Reel, and Closing CTA.
          </p>
        </div>

        {/* Categorized Sub-Tabs for Home Page */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[var(--border-mineral)] bg-white p-1.5">
          {[
            { id: "hero" as const, label: "1. Hero & Stats" },
            { id: "slides" as const, label: `2. How I Build (${buildSteps.length})` },
            { id: "reel" as const, label: "3. Selected Work Reel" },
            { id: "cta" as const, label: "4. Testimonials & CTA" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubTab(item.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                subTab === item.id
                  ? "bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                  : "text-[var(--ink-slate)] hover:bg-[var(--bg-alabaster)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. HERO & STATS */}
      {subTab === "hero" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold">Opening Hero Copy &amp; Buttons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Hero Headline
                </label>
                <input
                  value={site.heroTitle}
                  onChange={(e) => setSite({ heroTitle: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                  Hero Italic Orange Highlight
                </label>
                <input
                  value={site.heroHighlight}
                  onChange={(e) => setSite({ heroHighlight: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                Hero Intro Description
              </label>
              <textarea
                rows={3}
                value={site.heroDescription}
                onChange={(e) => setSite({ heroDescription: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Primary Button Label (/work)
                </label>
                <input
                  value={site.heroPrimaryCta}
                  onChange={(e) => setSite({ heroPrimaryCta: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Secondary Button Label (/contact)
                </label>
                <input
                  value={site.heroSecondaryCta}
                  onChange={(e) => setSite({ heroSecondaryCta: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Bottom Scroll Cue Label
                </label>
                <input
                  value={site.heroScrollCue}
                  onChange={(e) => setSite({ heroScrollCue: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Proof Stats (Hero &amp; About Overview)</h3>
                <p className="text-xs text-[var(--ink-slate)]">
                  Shown beneath the Hero buttons and inside the Quick Overview card on About.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSite({
                    heroStats: [...site.heroStats, { value: "100%", label: "New Metric" }],
                  })
                }
                className="inline-flex items-center gap-1 rounded-full bg-[var(--ink-obsidian)] px-3.5 py-1.5 text-xs font-semibold text-[#F7F5F0] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-[var(--neon-teal)]" /> Add Stat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {site.heroStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase text-[var(--ink-muted)]">
                      Stat #{idx + 1}
                    </span>
                    {site.heroStats.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSite({
                            heroStats: site.heroStats.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-red-600 hover:opacity-80 cursor-pointer"
                        title="Remove stat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    value={stat.value}
                    onChange={(e) =>
                      setSite({
                        heroStats: site.heroStats.map((s, i) =>
                          i === idx ? { ...s, value: e.target.value } : s
                        ),
                      })
                    }
                    placeholder="e.g. 8+ Years"
                    className="w-full rounded-lg border border-[var(--border-mineral)] bg-white px-2.5 py-1.5 text-sm font-bold"
                  />
                  <input
                    value={stat.label}
                    onChange={(e) =>
                      setSite({
                        heroStats: site.heroStats.map((s, i) =>
                          i === idx ? { ...s, label: e.target.value } : s
                        ),
                      })
                    }
                    placeholder="Label"
                    className="w-full rounded-lg border border-[var(--border-mineral)] bg-white px-2.5 py-1.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PROCESS SLIDES ("HOW I BUILD") */}
      {subTab === "slides" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--ink-slate)]">
              Edit every full-screen color-coded chapter in the &ldquo;How I Build&rdquo; sticky deck.
            </p>
            <button
              type="button"
              onClick={() => {
                const nextNum = String(buildSteps.length + 1).padStart(2, "0");
                const created: BuildStep = {
                  id: `step-${Date.now()}`,
                  number: nextNum,
                  label: `Step ${nextNum} · New Stage`,
                  title: "Built with purposeful",
                  highlight: "precision.",
                  description: "Describe this stage of your product process.",
                  accent: "teal",
                  points: ["Key deliverable 1", "Key deliverable 2"],
                  statValue: "100%",
                  statLabel: "Quality commitment",
                  visualType: "strategy",
                };
                onUpdate((p) => ({ ...p, buildSteps: [...p.buildSteps, created] }));
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Slide
            </button>
          </div>

          {buildSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--teal-deep)]">
                  SLIDE {step.number}
                </span>
                {buildSteps.length > 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate((p) => ({
                        ...p,
                        buildSteps: p.buildSteps
                          .filter((_, i) => i !== idx)
                          .map((s, i) => ({
                            ...s,
                            number: String(i + 1).padStart(2, "0"),
                          })),
                      }))
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove Slide
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  value={step.label}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      buildSteps: p.buildSteps.map((s, i) =>
                        i === idx ? { ...s, label: e.target.value } : s
                      ),
                    }))
                  }
                  placeholder="Badge Label"
                  className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                />
                <select
                  value={step.accent}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      buildSteps: p.buildSteps.map((s, i) =>
                        i === idx
                          ? { ...s, accent: e.target.value as BuildStep["accent"] }
                          : s
                      ),
                    }))
                  }
                  className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                >
                  <option value="teal">Electric Mint-Teal Studio</option>
                  <option value="orange">Solar Neon-Orange Studio</option>
                  <option value="cobalt">Electric Cobalt-Ice + Dark Card</option>
                </select>
                <select
                  value={step.visualType}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      buildSteps: p.buildSteps.map((s, i) =>
                        i === idx
                          ? { ...s, visualType: e.target.value as BuildStep["visualType"] }
                          : s
                      ),
                    }))
                  }
                  className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                >
                  <option value="strategy">Visual: Strategy Grid</option>
                  <option value="engineering">Visual: Performance Bars</option>
                  <option value="craft">Visual: 24 FPS Motion Badge</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={step.statValue}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        buildSteps: p.buildSteps.map((s, i) =>
                          i === idx ? { ...s, statValue: e.target.value } : s
                        ),
                      }))
                    }
                    placeholder="Stat Value"
                    className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-bold"
                  />
                  <input
                    value={step.statLabel}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        buildSteps: p.buildSteps.map((s, i) =>
                          i === idx ? { ...s, statLabel: e.target.value } : s
                        ),
                      }))
                    }
                    placeholder="Stat Label"
                    className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={step.title}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      buildSteps: p.buildSteps.map((s, i) =>
                        i === idx ? { ...s, title: e.target.value } : s
                      ),
                    }))
                  }
                  placeholder="Slide Headline"
                  className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
                <input
                  value={step.highlight}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      buildSteps: p.buildSteps.map((s, i) =>
                        i === idx ? { ...s, highlight: e.target.value } : s
                      ),
                    }))
                  }
                  placeholder="Italic Highlight Word"
                  className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                />
              </div>

              <textarea
                rows={2}
                value={step.description}
                onChange={(e) =>
                  onUpdate((p) => ({
                    ...p,
                    buildSteps: p.buildSteps.map((s, i) =>
                      i === idx ? { ...s, description: e.target.value } : s
                    ),
                  }))
                }
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />

              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Bullet Points (one per line)
                </label>
                <textarea
                  rows={3}
                  value={step.points.join("\n")}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      buildSteps: p.buildSteps.map((s, i) =>
                        i === idx
                          ? {
                              ...s,
                              points: e.target.value.split("\n").filter((l) => l.trim()),
                            }
                          : s
                      ),
                    }))
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. SELECTED WORK REEL COPY */}
      {subTab === "reel" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold">Horizontal Showcase Header</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Eyebrow
                </label>
                <input
                  value={site.workReelEyebrow}
                  onChange={(e) => setSite({ workReelEyebrow: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Headline
                </label>
                <input
                  value={site.workReelHeadline}
                  onChange={(e) => setSite({ workReelHeadline: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Orange Italic Highlight
                </label>
                <input
                  value={site.workReelHighlight}
                  onChange={(e) => setSite({ workReelHighlight: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold">Final Dark End-Cap Card (Browse All Work)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Card Eyebrow
                </label>
                <input
                  value={site.workReelEndEyebrow}
                  onChange={(e) => setSite({ workReelEndEyebrow: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Card Headline
                </label>
                <input
                  value={site.workReelEndHeadline}
                  onChange={(e) => setSite({ workReelEndHeadline: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Card Highlight
                </label>
                <input
                  value={site.workReelEndHighlight}
                  onChange={(e) => setSite({ workReelEndHighlight: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                Card Description
              </label>
              <textarea
                rows={2}
                value={site.workReelEndDescription}
                onChange={(e) => setSite({ workReelEndDescription: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="max-w-xs">
              <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                Button Label
              </label>
              <input
                value={site.workReelEndCta}
                onChange={(e) => setSite({ workReelEndCta: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. TESTIMONIALS HEADER & CLOSING CTA */}
      {subTab === "cta" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold">Testimonials Section Header</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Eyebrow
                </label>
                <input
                  value={site.testimonialsEyebrow}
                  onChange={(e) => setSite({ testimonialsEyebrow: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Headline
                </label>
                <input
                  value={site.testimonialsHeadline}
                  onChange={(e) => setSite({ testimonialsHeadline: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Orange Italic Highlight
                </label>
                <input
                  value={site.testimonialsHighlight}
                  onChange={(e) => setSite({ testimonialsHighlight: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold">Closing Call-to-Action Banner</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  CTA Headline
                </label>
                <input
                  value={site.ctaHeadline}
                  onChange={(e) => setSite({ ctaHeadline: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  CTA Italic Highlight
                </label>
                <input
                  value={site.ctaHighlight}
                  onChange={(e) => setSite({ ctaHighlight: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  CTA Button Label
                </label>
                <input
                  value={site.ctaButtonLabel}
                  onChange={(e) => setSite({ ctaButtonLabel: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                CTA Description
              </label>
              <textarea
                rows={2}
                value={site.ctaDescription}
                onChange={(e) => setSite({ ctaDescription: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

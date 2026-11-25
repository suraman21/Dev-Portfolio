"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Quote, Send, Sparkles } from "lucide-react";
import { testimonials } from "@/data/story";
import { siteConfig } from "@/data/site";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { FinaleBeacon3D } from "@/components/3d/FinaleBeacon3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

type Pathway = "role" | "commission" | "note";

/**
 * ACT V — AUTHORITY ENDORSEMENTS & THE CONCIERGE FINALE
 * Deliberately engineered around Authority Bias (#02), Social Proof (#13),
 * Hick's Law (#09 — 3 clear pathways), and the Peak-End Rule (#50).
 */
export function ConciergeSection() {
  const [pathway, setPathway] = useState<Pathway>("commission");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { soundEnabled } = useCinema();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    foley.playSuccessChord(soundEnabled);
    setSubmitted(true);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(siteConfig.email);
    foley.playDetent(soundEnabled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="act-5"
      aria-label="Act V — Endorsements and Private Concierge Finale"
      className="relative bg-[var(--surface-porcelain)] py-20 md:py-28"
    >
      <div className="shell">
        {/* Part 1: Restrained Editorial Leadership Endorsements */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono-tech text-[10.5px] text-[var(--teal-deep)]">
                ACT 05 · LEADERSHIP ENDORSEMENTS
              </span>
              <h2 className="mt-3 text-h2 font-bold text-[var(--ink-obsidian)]">
                Trusted by Engineering{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  Leaders &amp; Founders.
                </span>
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              VERIFIED PRODUCTION OUTCOMES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <blockquote
                key={t.author}
                className="porcelain-card rounded-3xl p-7 flex flex-col justify-between"
              >
                <div>
                  <Quote
                    className={`h-6 w-6 mb-4 ${
                      idx === 1 ? "text-[var(--neon-orange)]" : "text-[var(--neon-teal)]"
                    }`}
                  />
                  <p className="text-[15px] leading-relaxed text-[var(--ink-obsidian)]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[var(--border-mineral)]">
                  <div className="inline-flex rounded-full bg-[var(--bg-alabaster)] border border-[var(--border-mineral)] px-3 py-1 font-mono text-[10px] font-semibold text-[var(--teal-deep)] mb-3">
                    {t.impactTag}
                  </div>
                  <div className="font-bold text-sm text-[var(--ink-obsidian)]">{t.author}</div>
                  <div className="text-xs text-[var(--ink-slate)]">
                    {t.role} · {t.company}
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Part 2: The Quiet Horizon Concierge Finale (Peak-End Rule #50) */}
        <div className="porcelain-card dichroic-ring overflow-hidden rounded-[36px] p-6 sm:p-10 lg:p-12 sunlit-aura">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Serene 3D Horizon Beacon */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-[var(--border-mineral)] px-3.5 py-1.5">
                <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
                <span className="font-mono text-[10.5px] font-semibold text-[var(--teal-deep)]">
                  PRIVATE CONCIERGE · DIRECT LINE
                </span>
              </div>

              <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                Let&apos;s Direct Your Next{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  Flagship.
                </span>
              </h2>

              <p className="text-body text-[var(--ink-slate)]">
                Whether you&apos;re hiring a Staff-level engineer to elevate systems and craft, or
                commissioning a category-defining SaaS web experience — choose your path below.
              </p>

              <div className="h-[260px] sm:h-[300px] w-full overflow-hidden rounded-3xl border border-[var(--border-mineral)] bg-white/75">
                <SceneCanvas cameraPosition={[0, 0.25, 4.4]} fallbackLabel="HORIZON BEACON">
                  <FinaleBeacon3D celebrating={submitted} />
                </SceneCanvas>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-tv-focus="true"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-4 py-2.5 font-mono text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--teal-deep)]" /> Copied{" "}
                      {siteConfig.email}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[var(--teal-deep)]" /> {siteConfig.email}
                    </>
                  )}
                </button>
                <MagneticButton href="/contact" variant="porcelain">
                  Full Scoping Salon <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>

            {/* Right Interactive 3-Pathway Executive Brief */}
            <div className="lg:col-span-7">
              <div className="rounded-[28px] border border-[var(--border-mineral)] bg-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-24px_rgba(14,23,26,0.12)]">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--teal-mist)] border border-[var(--neon-teal)]">
                      <Sparkles className="h-6 w-6 text-[var(--teal-deep)]" />
                    </div>
                    <div className="font-mono text-xs uppercase tracking-widest text-[var(--teal-deep)]">
                      TRANSMISSION RECEIVED · EXECUTIVE RECEIPT
                    </div>
                    <h3 className="text-h3 font-bold text-[var(--ink-obsidian)]">
                      Thank you, {name}. Your brief is in motion.
                    </h3>
                    <p className="mx-auto max-w-md text-sm text-[var(--ink-slate)]">
                      Expect a direct, thoughtful technical reply at{" "}
                      <span className="font-semibold text-[var(--ink-obsidian)]">{email}</span>{" "}
                      within 24 hours (UTC+3).
                    </p>
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setName("");
                          setEmail("");
                          setBrief("");
                        }}
                        className="rounded-full border border-[var(--border-mineral)] px-5 py-2.5 font-mono text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-orange)] cursor-pointer"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 3 Low-Friction Paths (Hick's Law #09) */}
                    <div>
                      <div className="font-mono-tech text-[10px] text-[var(--ink-muted)] mb-2.5">
                        SELECT YOUR PATH
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: "commission", label: "Flagship Project" },
                          { id: "role", label: "Staff / Senior Role" },
                          { id: "note", label: "Quick Direct Note" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            data-tv-focus="true"
                            onClick={() => {
                              foley.playDetent(soundEnabled);
                              setPathway(opt.id as Pathway);
                            }}
                            className={`rounded-2xl border px-4 py-3 text-xs font-semibold transition-all cursor-pointer ${
                              pathway === opt.id
                                ? "border-[var(--ink-obsidian)] bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                                : "border-[var(--border-mineral)] bg-[var(--bg-alabaster)] text-[var(--ink-slate)] hover:border-[var(--neon-teal)]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="concierge-name"
                          className="block font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5"
                        >
                          Your Name
                        </label>
                        <input
                          id="concierge-name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Elena Rostova"
                          className="w-full rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3 text-sm text-[var(--ink-obsidian)] placeholder:text-[var(--ink-muted)]/65 focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="concierge-email"
                          className="block font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5"
                        >
                          Work Email
                        </label>
                        <input
                          id="concierge-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="elena@company.com"
                          className="w-full rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3 text-sm text-[var(--ink-obsidian)] placeholder:text-[var(--ink-muted)]/65 focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="concierge-brief"
                        className="block font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5"
                      >
                        {pathway === "role"
                          ? "Role Scope & Engineering Team"
                          : pathway === "commission"
                            ? "Product Vision, Timeline & Goals"
                            : "Your Message"}
                      </label>
                      <textarea
                        id="concierge-brief"
                        rows={4}
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder={
                          pathway === "role"
                            ? "Tell me about the architecture challenges, team, and mission..."
                            : "Tell me what you're building, desired launch window, and what success looks like..."
                        }
                        className="w-full resize-none rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3 text-sm text-[var(--ink-obsidian)] placeholder:text-[var(--ink-muted)]/65 focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                      <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                        TYPICAL RESPONSE &lt; 24 HOURS
                      </span>
                      <MagneticButton type="submit" variant="primary" cursorText="TRANSMIT">
                        Transmit Executive Brief <Send className="h-4 w-4" />
                      </MagneticButton>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

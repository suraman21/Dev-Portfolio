"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Copy, MapPin, Send, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { FinaleBeacon3D } from "@/components/3d/FinaleBeacon3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCinema } from "@/components/cinema/CinemaProvider";
import { foley } from "@/lib/sound";

const scopes = [
  "Staff / Senior Engineering Role",
  "Full-Stack SaaS Platform",
  "Cinematic 3D / WebGL Flagship",
  "Architecture & Performance Audit",
];

const timelines = ["Immediate (< 30 days)", "Q1–Q2 2027", "Flexible / Advisory"];

export default function ContactPage() {
  const [selectedScope, setSelectedScope] = useState(scopes[1]);
  const [selectedTimeline, setSelectedTimeline] = useState(timelines[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localClock, setLocalClock] = useState("--:-- UTC+3");
  const { soundEnabled } = useCinema();

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Addis_Ababa",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setLocalClock(`${formatted} EAT (UTC+3)`);
      } catch {
        setLocalClock("UTC+3");
      }
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    foley.playSuccessChord(soundEnabled);
    setSent(true);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(siteConfig.email);
    foley.playDetent(soundEnabled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Executive Salon Info + Live 3D Horizon Beacon */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-[var(--border-mineral)] px-3.5 py-1.5">
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              <span className="font-mono text-[10.5px] font-semibold text-[var(--teal-deep)]">
                PRIVATE CONCIERGE · EXECUTIVE SALON
              </span>
            </span>

            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              Start a{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                Conversation.
              </span>
            </h1>

            <p className="text-body-lg text-[var(--ink-slate)]">
              Direct access — no account managers or automated forms. Every inquiry lands straight
              in my inbox with a thoughtful technical response inside 24 hours.
            </p>

            <div className="porcelain-glass dichroic-ring h-[300px] w-full overflow-hidden rounded-[30px]">
              <SceneCanvas cameraPosition={[0, 0.25, 4.4]} fallbackLabel="HORIZON BEACON">
                <FinaleBeacon3D celebrating={sent} />
              </SceneCanvas>
            </div>

            <div className="porcelain-card rounded-3xl p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[var(--ink-slate)]">
                  <MapPin className="h-4 w-4 text-[var(--teal-deep)]" /> Location
                </span>
                <span className="font-semibold text-[var(--ink-obsidian)]">
                  Addis Ababa · Global Remote
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[var(--ink-slate)]">
                  <Clock className="h-4 w-4 text-[var(--orange-lacquer)]" /> Local Time
                </span>
                <span className="font-mono text-xs font-bold text-[var(--ink-obsidian)]">
                  {localClock}
                </span>
              </div>
              <div className="pt-2 border-t border-[var(--border-mineral)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--teal-deep)]">{siteConfig.email}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-1.5 font-mono text-[11px] font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--teal-deep)]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Interactive Project & Role Scoping Brief */}
          <div className="lg:col-span-7">
            <div className="porcelain-card rounded-[34px] p-6 sm:p-10">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-5"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--teal-mist)] border border-[var(--neon-teal)]">
                    <Sparkles className="h-7 w-7 text-[var(--teal-deep)]" />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--teal-deep)]">
                    CONFIRMED · EXECUTIVE RECEIPT #SA-2026
                  </div>
                  <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                    Received with care, {name}.
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-[var(--ink-slate)]">
                    Scope: <strong className="text-[var(--ink-obsidian)]">{selectedScope}</strong> ·
                    Timeline:{" "}
                    <strong className="text-[var(--ink-obsidian)]">{selectedTimeline}</strong>. I
                    will reply directly to <strong>{email}</strong> within 24 hours.
                  </p>
                  <div className="pt-2">
                    <MagneticButton
                      onClick={() => {
                        setSent(false);
                        setMessage("");
                      }}
                      variant="teal"
                    >
                      Compose Another Brief
                    </MagneticButton>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="font-mono-tech text-[10.5px] text-[var(--ink-muted)] mb-3">
                      01 · ENGAGEMENT SCOPE
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {scopes.map((scope) => (
                        <button
                          key={scope}
                          type="button"
                          data-tv-focus="true"
                          onClick={() => {
                            foley.playDetent(soundEnabled);
                            setSelectedScope(scope);
                          }}
                          className={`rounded-2xl border px-4 py-3.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                            selectedScope === scope
                              ? "border-[var(--ink-obsidian)] bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                              : "border-[var(--border-mineral)] bg-[var(--bg-alabaster)] text-[var(--ink-slate)] hover:border-[var(--neon-teal)]"
                          }`}
                        >
                          {scope}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono-tech text-[10.5px] text-[var(--ink-muted)] mb-3">
                      02 · TARGET WINDOW
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {timelines.map((tl) => (
                        <button
                          key={tl}
                          type="button"
                          data-tv-focus="true"
                          onClick={() => {
                            foley.playDetent(soundEnabled);
                            setSelectedTimeline(tl);
                          }}
                          className={`rounded-full border px-4 py-2 font-mono text-xs font-semibold transition-all cursor-pointer ${
                            selectedTimeline === tl
                              ? "border-[var(--neon-orange)] bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                              : "border-[var(--border-mineral)] bg-white text-[var(--ink-slate)] hover:border-[var(--neon-teal)]"
                          }`}
                        >
                          {tl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Marcus Lindholm"
                        className="w-full rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="marcus@company.com"
                        className="w-full rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5"
                    >
                      03 · Architecture Goals &amp; Context
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your product ambition, scale goals, role details, or key technical constraints..."
                      className="w-full resize-none rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                      CONFIDENTIAL · ZERO THIRD-PARTY TRACKERS
                    </span>
                    <MagneticButton type="submit" variant="primary" cursorText="SEND BRIEF">
                      Transmit Brief <Send className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

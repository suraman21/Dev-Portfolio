"use client";

import { ArrowUpRight, CheckCircle2, MapPin } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";

const OBJECT_POS_CLASS: Record<"top" | "center" | "bottom", string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

/**
 * Luxury Developer Profile Spotlight on the Home Page
 * Displays the developer's portrait, bio, role, availability, and highlights —
 * 100% editable and toggleable from `/app` -> Developer Profile.
 */
export function DeveloperProfileSection() {
  const { data } = useCms();
  const { site } = data;

  if (site.showHomeProfile === false) {
    return null;
  }

  const posClass = OBJECT_POS_CLASS[site.profileImagePosition || "top"];

  return (
    <section
      id="developer-profile"
      aria-label="Developer Profile"
      className="relative bg-[var(--bg-alabaster)] pt-20 md:pt-28 pb-6"
    >
      <div className="shell">
        <div className="porcelain-glass dichroic-ring relative overflow-hidden rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12">
          {/* Subtle Ambient Studio Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--neon-teal)]/16 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[var(--neon-orange)]/12 blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Framed Editorial Developer Portrait */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-[24px] sm:rounded-[28px] border-2 border-white/90 bg-[var(--surface-stone)] shadow-[0_24px_60px_-24px_rgba(15,23,26,0.28)]">
                  {site.profileImage ? (
                    <img
                      src={site.profileImage}
                      alt={site.profileImageAlt || `${site.name} portrait`}
                      className={`h-full w-full object-cover ${posClass}`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--ink-obsidian)] font-mono text-5xl font-bold text-[var(--neon-teal)]">
                      {site.monogram}
                    </div>
                  )}

                  {/* Floating Luxury Name & Availability Plate */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 rounded-2xl border border-white/75 bg-white/92 px-4 py-3 backdrop-blur-md shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-[var(--ink-obsidian)]">
                          {site.name}
                        </div>
                        <div className="truncate text-[11px] font-medium text-[var(--teal-deep)]">
                          {site.role}
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[var(--teal-mist)] px-2.5 py-1 text-[10px] font-bold text-[var(--teal-deep)]">
                        <span className="pulse-teal h-1.5 w-1.5 rounded-full bg-[var(--neon-teal)]" />
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Bio, Highlights & Direct Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                  {site.profileEyebrow}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1 text-[11px] font-medium text-[var(--ink-slate)]">
                  <MapPin className="h-3 w-3 text-[var(--orange-lacquer)]" />
                  {site.location}
                </span>
              </div>

              <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
                {site.profileHeadline}{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  {site.profileHighlight}
                </span>
              </h2>

              <p className="text-body-lg text-[var(--ink-slate)] max-w-[56ch]">
                {site.profileBio}
              </p>

              {site.profileHighlights && site.profileHighlights.length > 0 && (
                <ul className="space-y-2.5 pt-1">
                  {site.profileHighlights.map((item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className="flex items-start gap-2.5 text-sm font-medium text-[var(--ink-obsidian)]"
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          idx % 2 === 1 ? "text-[var(--orange-lacquer)]" : "text-[var(--teal-deep)]"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <MagneticButton href="/about" variant="primary">
                  {site.profilePrimaryCta || "Full Bio & Experience"}{" "}
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton href="/contact" variant="teal">
                  {site.profileSecondaryCta || "Start a Conversation"}
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

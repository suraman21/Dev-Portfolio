"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, MapPin } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BrandAvatar } from "@/components/ui/BrandAvatar";

const OBJECT_POS_CLASS: Record<"top" | "center" | "bottom", string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export default function AboutPage() {
  const { data } = useCms();
  const { site, about, services, experiences, skillGroups } = data;
  const activeServices = services.filter((s) => s.active);
  const posClass = OBJECT_POS_CLASS[site.profileImagePosition || "top"];

  return (
    <div className="sunlit-aura pt-24 pb-24 md:pt-36">
      <div className="shell">
        {/* Warm Human Introduction + Prominent Developer Portrait & Quick Overview */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--border-mineral)] items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                {about.eyebrow}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white/90 px-3 py-1 text-[11px] font-semibold text-[var(--teal-deep)]">
                <span className="pulse-teal h-1.5 w-1.5 rounded-full bg-[var(--neon-teal)]" />
                {site.availability}
              </span>
            </div>

            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              {about.headline}{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                {about.highlight}
              </span>
            </h1>

            <p className="text-body-lg text-[var(--ink-slate)] max-w-[60ch]">{about.bio}</p>

            {about.secondaryBio && (
              <p className="text-body text-[var(--ink-slate)] max-w-[60ch] leading-relaxed">
                {about.secondaryBio}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <MagneticButton href="/work" variant="primary">
                {about.primaryCtaLabel || "See Selected Work"} <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="teal">
                {about.secondaryCtaLabel || "Get in Touch"}
              </MagneticButton>
            </div>

            {/* Quick Overview Proof Metrics */}
            <div className="pt-4">
              <div className="porcelain-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                    {about.quickOverviewTitle || "Quick Overview"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--orange-lacquer)]" />
                    {site.location}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {site.heroStats.map((stat, idx) => (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/80 px-4 py-3"
                    >
                      <div
                        className={`text-xl font-bold ${
                          idx === 2 ? "text-[var(--orange-lacquer)]" : "text-[var(--ink-obsidian)]"
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--ink-slate)]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Developer Profile Portrait Card */}
          {about.showProfileImage !== false && (
            <div className="lg:col-span-5">
              <div className="porcelain-card dichroic-ring overflow-hidden rounded-[30px] p-4 sm:p-5 space-y-4">
                <div className="relative aspect-[4/4.8] w-full overflow-hidden rounded-[22px] bg-[var(--surface-stone)]">
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

                  {about.profileCardLabel && (
                    <span className="absolute left-3.5 top-3.5 rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[11px] font-semibold text-[var(--ink-obsidian)] backdrop-blur-md">
                      {about.profileCardLabel}
                    </span>
                  )}
                </div>

                <div className="px-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-[var(--ink-obsidian)]">
                        {site.name}
                      </div>
                      <div className="text-xs font-semibold text-[var(--teal-deep)]">
                        {site.role}
                      </div>
                    </div>
                    <BrandAvatar
                      src={site.profileImage}
                      alt={site.profileImageAlt || site.name}
                      monogram={site.monogram}
                      position={site.profileImagePosition}
                      sizeClass="h-9 w-9"
                    />
                  </div>
                  {about.profileCaption && (
                    <p className="text-xs text-[var(--ink-slate)] leading-relaxed border-t border-[var(--border-mineral)] pt-2.5">
                      {about.profileCaption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Services Managed From Admin Panel */}
        {about.showServices !== false && activeServices.length > 0 && (
          <section className="py-16 border-b border-[var(--border-mineral)]">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                  {about.servicesEyebrow || "Services"}
                </span>
                <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
                  {about.servicesHeadline || "How we can"}{" "}
                  <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                    {about.servicesHighlight || "work together."}
                  </span>
                </h2>
              </div>
              <Link
                href="/contact"
                className="text-xs font-semibold text-[var(--teal-deep)] hover:underline"
              >
                {about.servicesLinkLabel || "Request a service →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeServices.map((svc) => {
                const isOrange = svc.accent === "orange";
                return (
                  <article
                    key={svc.id}
                    className="porcelain-card rounded-3xl p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        {svc.timeline && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
                              isOrange
                                ? "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                                : "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                            }`}
                          >
                            <Clock className="h-3 w-3" /> {svc.timeline}
                          </span>
                        )}
                        {svc.startingPrice && (
                          <span className="font-mono text-[11px] font-semibold text-[var(--ink-muted)]">
                            {svc.startingPrice}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[var(--ink-obsidian)]">{svc.name}</h3>
                      <p className="text-sm text-[var(--ink-slate)] leading-relaxed">
                        {svc.shortDescription}
                      </p>
                    </div>

                    <Link
                      href={`/contact?service=${encodeURIComponent(svc.id)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink-obsidian)] hover:text-[var(--orange-lacquer)] transition-colors pt-2 border-t border-[var(--border-mineral)]"
                    >
                      Inquire about this service <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Career Experience */}
        {about.showExperience !== false && experiences.length > 0 && (
          <section className="py-16 border-b border-[var(--border-mineral)]">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange-lacquer)]">
                {about.experienceEyebrow || "Experience"}
              </span>
              <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
                {about.experienceHeadline || "Where I've"}{" "}
                <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                  {about.experienceHighlight || "shipped work."}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.map((exp, idx) => (
                <article
                  key={exp.id || `${exp.period}-${idx}`}
                  className="porcelain-card rounded-3xl p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="rounded-full bg-[var(--teal-mist)] px-3 py-1 font-semibold text-[var(--teal-deep)]">
                      {exp.period}
                    </span>
                    <span className="text-[var(--ink-muted)]">{exp.location}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[var(--ink-obsidian)]">{exp.role}</h3>
                  <div className="mt-1 text-sm font-semibold text-[var(--orange-lacquer)]">
                    {exp.company}
                  </div>
                  <p className="mt-3 text-sm text-[var(--ink-slate)]">{exp.summary}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-[var(--border-mineral)] pt-4">
                      {exp.highlights.map((h, hIdx) => (
                        <li
                          key={`${h}-${hIdx}`}
                          className="flex items-start gap-2.5 text-sm text-[var(--ink-obsidian)]"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-deep)]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Core Skills */}
        {about.showSkills !== false && skillGroups.length > 0 && (
          <section className="pt-16">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                {about.skillsEyebrow || "Core Capabilities"}
              </span>
              <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
                {about.skillsHeadline || "Tools &"}{" "}
                <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                  {about.skillsHighlight || "Expertise"}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skillGroups.map((group, idx) => (
                <div
                  key={group.id || `${group.title}-${idx}`}
                  className="porcelain-card rounded-3xl p-6"
                >
                  <h3
                    className={`text-sm font-bold mb-4 ${
                      group.accent === "orange"
                        ? "text-[var(--orange-lacquer)]"
                        : "text-[var(--teal-deep)]"
                    }`}
                  >
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={`${skill}-${sIdx}`}
                        className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 text-xs font-medium text-[var(--ink-obsidian)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

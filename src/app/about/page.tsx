"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function AboutPage() {
  const { data } = useCms();
  const { site, about, services, experiences, skillGroups } = data;
  const activeServices = services.filter((s) => s.active);

  return (
    <div className="sunlit-aura pt-24 pb-24 md:pt-36">
      <div className="shell">
        {/* Warm Human Introduction */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--border-mineral)] items-end">
          <div className="lg:col-span-8 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
              {about.eyebrow}
            </span>
            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              {about.headline}{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                {about.highlight}
              </span>
            </h1>
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[60ch]">{about.bio}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <MagneticButton href="/work" variant="primary">
                See Selected Work <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/contact" variant="teal">
                Get in Touch
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="porcelain-card rounded-3xl p-6 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                Quick Overview
              </div>
              {site.heroStats.map((stat, idx) => (
                <div
                  key={`${stat.label}-${idx}`}
                  className="flex items-baseline justify-between gap-3 border-b border-[var(--border-mineral)] pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-[var(--ink-slate)]">{stat.label}</span>
                  <span className="shrink-0 text-lg font-bold text-[var(--ink-obsidian)]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Services Managed From Admin Panel */}
        {activeServices.length > 0 && (
          <section className="py-16 border-b border-[var(--border-mineral)]">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                  Services
                </span>
                <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
                  How we can{" "}
                  <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                    work together.
                  </span>
                </h2>
              </div>
              <Link
                href="/contact"
                className="text-xs font-semibold text-[var(--teal-deep)] hover:underline"
              >
                Request a service →
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
        <section className="py-16 border-b border-[var(--border-mineral)]">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--orange-lacquer)]">
              Experience
            </span>
            <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
              Where I&apos;ve{" "}
              <span className="font-editorial italic font-normal text-[var(--teal-deep)]">
                shipped work.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp, idx) => (
              <article key={exp.id || `${exp.period}-${idx}`} className="porcelain-card rounded-3xl p-7">
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
                <ul className="mt-4 space-y-2 border-t border-[var(--border-mineral)] pt-4">
                  {exp.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm text-[var(--ink-obsidian)]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-deep)]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Core Skills */}
        <section className="pt-16">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
              Core Capabilities
            </span>
            <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
              Tools &amp;{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                Expertise
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillGroups.map((group, idx) => (
              <div key={group.id || `${group.title}-${idx}`} className="porcelain-card rounded-3xl p-6">
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
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
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
      </div>
    </div>
  );
}

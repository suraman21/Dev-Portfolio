"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsData, ExperienceItem, SkillGroup } from "@/types/cms";

interface AdminAboutTabProps {
  draft: CmsData;
  onUpdate: (updater: (prev: CmsData) => CmsData) => void;
  onJumpToProfile: () => void;
}

type AboutSubTab = "intro" | "sections" | "experience" | "skills";

export function AdminAboutTab({ draft, onUpdate, onJumpToProfile }: AdminAboutTabProps) {
  const [subTab, setSubTab] = useState<AboutSubTab>("intro");
  const { about, experiences, skillGroups, site } = draft;

  const setAbout = (patch: Partial<CmsData["about"]>) =>
    onUpdate((prev) => ({ ...prev, about: { ...prev.about, ...patch } }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">About Page Manager</h2>
          <p className="text-xs text-[var(--ink-slate)]">
            Every section, portrait setting, heading, experience bullet, and skill category on{" "}
            <code>/about</code> is categorized and editable below.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[var(--border-mineral)] bg-white p-1.5">
          {[
            { id: "intro" as const, label: "1. Intro & Portrait" },
            { id: "sections" as const, label: "2. Section Headings" },
            { id: "experience" as const, label: `3. Experience (${experiences.length})` },
            { id: "skills" as const, label: `4. Skills (${skillGroups.length})` },
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

      {/* 1. INTRO & DEVELOPER PORTRAIT CARD */}
      {subTab === "intro" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold">About Hero Introduction &amp; Bio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Eyebrow
                </label>
                <input
                  value={about.eyebrow}
                  onChange={(e) => setAbout({ eyebrow: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Main Headline
                </label>
                <input
                  value={about.headline}
                  onChange={(e) => setAbout({ headline: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Orange Italic Highlight
                </label>
                <input
                  value={about.highlight}
                  onChange={(e) => setAbout({ highlight: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                Primary Bio Paragraph
              </label>
              <textarea
                rows={3}
                value={about.bio}
                onChange={(e) => setAbout({ bio: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                Secondary Bio Paragraph (Optional)
              </label>
              <textarea
                rows={2}
                value={about.secondaryBio}
                onChange={(e) => setAbout({ secondaryBio: e.target.value })}
                className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Primary Button Label (/work)
                </label>
                <input
                  value={about.primaryCtaLabel}
                  onChange={(e) => setAbout({ primaryCtaLabel: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Secondary Button Label (/contact)
                </label>
                <input
                  value={about.secondaryCtaLabel}
                  onChange={(e) => setAbout({ secondaryCtaLabel: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Quick Overview Card Title
                </label>
                <input
                  value={about.quickOverviewTitle}
                  onChange={(e) => setAbout({ quickOverviewTitle: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {site.profileImage && (
                  <img
                    src={site.profileImage}
                    alt={site.profileImageAlt || site.name}
                    className="h-12 w-12 rounded-2xl object-cover object-top border border-[var(--border-mineral)]"
                  />
                )}
                <div>
                  <h3 className="text-base font-bold">About Page Developer Portrait Card</h3>
                  <p className="text-xs text-[var(--ink-slate)]">
                    Uses your portrait photo from Developer Profile.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onJumpToProfile}
                  className="rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 text-xs font-semibold text-[var(--teal-deep)] hover:border-[var(--teal-deep)] cursor-pointer"
                >
                  Change Portrait Photo →
                </button>
                <label className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={about.showProfileImage !== false}
                    onChange={(e) => setAbout({ showProfileImage: e.target.checked })}
                  />
                  Show Portrait on About
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Portrait Corner Badge Label
                </label>
                <input
                  value={about.profileCardLabel}
                  onChange={(e) => setAbout({ profileCardLabel: e.target.value })}
                  placeholder="Developer Portrait"
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Portrait Card Caption
                </label>
                <input
                  value={about.profileCaption}
                  onChange={(e) => setAbout({ profileCaption: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTION HEADINGS & VISIBILITY TOGGLES */}
      {subTab === "sections" && (
        <div className="space-y-5">
          {/* Services Section Settings */}
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold">Services Section on About Page</h3>
              <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={about.showServices !== false}
                  onChange={(e) => setAbout({ showServices: e.target.checked })}
                />
                Visible on About Page
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                value={about.servicesEyebrow}
                onChange={(e) => setAbout({ servicesEyebrow: e.target.value })}
                placeholder="Eyebrow"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
              />
              <input
                value={about.servicesHeadline}
                onChange={(e) => setAbout({ servicesHeadline: e.target.value })}
                placeholder="Headline"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
              />
              <input
                value={about.servicesHighlight}
                onChange={(e) => setAbout({ servicesHighlight: e.target.value })}
                placeholder="Italic Highlight"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs italic"
              />
              <input
                value={about.servicesLinkLabel}
                onChange={(e) => setAbout({ servicesLinkLabel: e.target.value })}
                placeholder="Right Link Label"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          {/* Experience Section Settings */}
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold">Experience Section Heading</h3>
              <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={about.showExperience !== false}
                  onChange={(e) => setAbout({ showExperience: e.target.checked })}
                />
                Visible on About Page
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={about.experienceEyebrow}
                onChange={(e) => setAbout({ experienceEyebrow: e.target.value })}
                placeholder="Eyebrow"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
              />
              <input
                value={about.experienceHeadline}
                onChange={(e) => setAbout({ experienceHeadline: e.target.value })}
                placeholder="Headline"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
              />
              <input
                value={about.experienceHighlight}
                onChange={(e) => setAbout({ experienceHighlight: e.target.value })}
                placeholder="Italic Highlight"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs italic"
              />
            </div>
          </div>

          {/* Skills Section Settings */}
          <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold">Core Skills Section Heading</h3>
              <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={about.showSkills !== false}
                  onChange={(e) => setAbout({ showSkills: e.target.checked })}
                />
                Visible on About Page
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={about.skillsEyebrow}
                onChange={(e) => setAbout({ skillsEyebrow: e.target.value })}
                placeholder="Eyebrow"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
              />
              <input
                value={about.skillsHeadline}
                onChange={(e) => setAbout({ skillsHeadline: e.target.value })}
                placeholder="Headline"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold"
              />
              <input
                value={about.skillsHighlight}
                onChange={(e) => setAbout({ skillsHighlight: e.target.value })}
                placeholder="Italic Highlight"
                className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs italic"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPERIENCE TIMELINE (FULL CRUD INCLUDING LOCATION + HIGHLIGHTS!) */}
      {subTab === "experience" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--ink-slate)]">
              Edit every field of each career role — period, location, role, company, summary, and
              achievement bullet points.
            </p>
            <button
              type="button"
              onClick={() => {
                const created: ExperienceItem = {
                  id: `exp-${Date.now()}`,
                  period: "2026 — Present",
                  role: "Senior Software Engineer",
                  company: "Company Name",
                  location: "Remote",
                  summary: "Key scope and product engineering leadership summary.",
                  highlights: ["Shipped high-impact product milestone"],
                };
                onUpdate((p) => ({ ...p, experiences: [created, ...p.experiences] }));
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Experience Role
            </button>
          </div>

          {experiences.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--teal-deep)]">
                  ROLE #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate((p) => ({
                      ...p,
                      experiences: p.experiences.filter((_, i) => i !== idx),
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Role
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Period
                  </label>
                  <input
                    value={exp.period}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        experiences: p.experiences.map((item, i) =>
                          i === idx ? { ...item, period: e.target.value } : item
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Location
                  </label>
                  <input
                    value={exp.location}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        experiences: p.experiences.map((item, i) =>
                          i === idx ? { ...item, location: e.target.value } : item
                        ),
                      }))
                    }
                    placeholder="Remote / City"
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Role Title
                  </label>
                  <input
                    value={exp.role}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        experiences: p.experiences.map((item, i) =>
                          i === idx ? { ...item, role: e.target.value } : item
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Company
                  </label>
                  <input
                    value={exp.company}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        experiences: p.experiences.map((item, i) =>
                          i === idx ? { ...item, company: e.target.value } : item
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Role Summary
                </label>
                <textarea
                  rows={2}
                  value={exp.summary}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      experiences: p.experiences.map((item, i) =>
                        i === idx ? { ...item, summary: e.target.value } : item
                      ),
                    }))
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Key Achievements / Highlights (one bullet per line)
                </label>
                <textarea
                  rows={3}
                  value={(exp.highlights || []).join("\n")}
                  onChange={(e) =>
                    onUpdate((p) => ({
                      ...p,
                      experiences: p.experiences.map((item, i) =>
                        i === idx
                          ? {
                              ...item,
                              highlights: e.target.value
                                .split("\n")
                                .map((l) => l.trim())
                                .filter(Boolean),
                            }
                          : item
                      ),
                    }))
                  }
                  placeholder="Shipped unified design system&#10;Reduced checkout latency by 45%"
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. CORE SKILL CATEGORIES (FULL CRUD WITH ACCENT COLOR!) */}
      {subTab === "skills" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--ink-slate)]">
              Organize your tools and expertise into themed skill groups shown at the bottom of{" "}
              <code>/about</code>.
            </p>
            <button
              type="button"
              onClick={() => {
                const created: SkillGroup = {
                  id: `skill-${Date.now()}`,
                  title: "New Skill Category",
                  accent: "teal",
                  skills: ["TypeScript", "Next.js"],
                };
                onUpdate((p) => ({ ...p, skillGroups: [...p.skillGroups, created] }));
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Skill Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillGroups.map((group, idx) => (
              <div
                key={group.id || idx}
                className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-[var(--ink-muted)]">
                    CATEGORY #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate((p) => ({
                        ...p,
                        skillGroups: p.skillGroups.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-xs font-semibold text-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Category Title
                  </label>
                  <input
                    value={group.title}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        skillGroups: p.skillGroups.map((g, i) =>
                          i === idx ? { ...g, title: e.target.value } : g
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Accent Color
                  </label>
                  <select
                    value={group.accent}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        skillGroups: p.skillGroups.map((g, i) =>
                          i === idx
                            ? { ...g, accent: e.target.value as "teal" | "orange" }
                            : g
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                  >
                    <option value="teal">Neon Teal</option>
                    <option value="orange">Neon Orange</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                    Skills (comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={group.skills.join(", ")}
                    onChange={(e) =>
                      onUpdate((p) => ({
                        ...p,
                        skillGroups: p.skillGroups.map((g, i) =>
                          i === idx
                            ? {
                                ...g,
                                skills: e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }
                            : g
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

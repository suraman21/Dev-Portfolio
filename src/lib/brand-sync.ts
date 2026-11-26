import type { CmsData } from "@/types/cms";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Derives 1–2 letter uppercase monogram initials from a full name */
export function deriveMonogram(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function replaceTextExact(input: string, from: string, to: string): string {
  if (!input || !from.trim() || !to.trim() || from.trim() === to.trim()) return input;
  const re = new RegExp(`\\b${escapeRegex(from.trim())}\\b`, "g");
  return input.replace(re, to.trim());
}

/**
 * Counts occurrences of an old brand/developer name (full name or first name)
 * still lingering across bio paragraphs, experience titles, and testimonials.
 */
export function countLegacyNameReferences(
  cms: CmsData,
  oldNames: string[],
  currentName: string
): number {
  const target = currentName.trim();
  const candidates = Array.from(
    new Set(
      oldNames
        .flatMap((n) => {
          const clean = n.trim();
          if (!clean) return [];
          const first = clean.split(/\s+/)[0] || "";
          return first.length >= 3 ? [clean, first] : [clean];
        })
        .filter((c) => c && c.toLowerCase() !== target.toLowerCase() && !target.toLowerCase().includes(c.toLowerCase()))
    )
  );

  if (candidates.length === 0) return 0;

  const texts: string[] = [
    cms.site.heroDescription,
    cms.site.profileBio,
    cms.site.profileImageAlt,
    cms.site.footerBio,
    cms.about.bio,
    cms.about.secondaryBio,
    ...cms.experiences.flatMap((e) => [e.company, e.summary, ...(e.highlights || [])]),
    ...cms.testimonials.map((t) => t.quote),
  ];

  let count = 0;
  for (const text of texts) {
    if (!text) continue;
    for (const candidate of candidates) {
      const matches = text.match(new RegExp(`\\b${escapeRegex(candidate)}\\b`, "g"));
      if (matches) count += matches.length;
    }
  }
  return count;
}

/**
 * Synchronizes a renamed developer name across every distributed text field
 * in the CMS (profile alt, monogram, bios, experience companies, and testimonials).
 */
export function syncBrandNameEverywhere(
  cms: CmsData,
  oldNames: string[],
  newFullName: string
): CmsData {
  const targetFull = newFullName.trim();
  if (!targetFull) return cms;
  const targetFirst = targetFull.split(/\s+/)[0] || targetFull;

  const fullCandidates = Array.from(
    new Set(
      oldNames
        .map((n) => n.trim())
        .filter((n) => n && n.toLowerCase() !== targetFull.toLowerCase())
    )
  );

  const firstCandidates = Array.from(
    new Set(
      fullCandidates
        .map((n) => n.split(/\s+/)[0] || "")
        .filter(
          (f) =>
            f.length >= 3 &&
            f.toLowerCase() !== targetFirst.toLowerCase() &&
            !targetFull.toLowerCase().includes(f.toLowerCase())
        )
    )
  );

  const applyReplacements = (text: string, includeFirstName: boolean): string => {
    let out = text;
    for (const oldFull of fullCandidates) {
      out = replaceTextExact(out, oldFull, targetFull);
    }
    if (includeFirstName) {
      for (const oldFirst of firstCandidates) {
        out = replaceTextExact(out, oldFirst, targetFirst);
      }
    }
    return out;
  };

  return {
    ...cms,
    site: {
      ...cms.site,
      name: targetFull,
      monogram: deriveMonogram(targetFull),
      profileImageAlt: `${targetFull} — ${cms.site.role}`,
      heroDescription: applyReplacements(cms.site.heroDescription, true),
      profileBio: applyReplacements(cms.site.profileBio, true),
      footerBio: applyReplacements(cms.site.footerBio, true),
    },
    about: {
      ...cms.about,
      bio: applyReplacements(cms.about.bio, true),
      secondaryBio: applyReplacements(cms.about.secondaryBio, true),
    },
    experiences: cms.experiences.map((exp) => ({
      ...exp,
      company: applyReplacements(exp.company, false),
      summary: applyReplacements(exp.summary, true),
      highlights: (exp.highlights || []).map((h) => applyReplacements(h, true)),
    })),
    testimonials: cms.testimonials.map((t) => ({
      ...t,
      quote: applyReplacements(t.quote, true),
    })),
  };
}

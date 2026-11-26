"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { CaseStudyView } from "@/components/work/CaseStudyView";

interface ProjectDetailClientProps {
  initialSlug: string;
}

export function ProjectDetailClient({ initialSlug }: ProjectDetailClientProps) {
  const { data, loading } = useCms();
  const [resolvedSlug, setResolvedSlug] = useState(initialSlug);

  // On cPanel static hosting, newly added project slugs rewrite to `/work/_fallback/index.html`.
  // Reading the real browser pathname lets brand-new Admin Panel projects render live without rebuilding!
  useEffect(() => {
    if (initialSlug === "_fallback" && typeof window !== "undefined") {
      const match = window.location.pathname.match(/^\/work\/([^/]+)/);
      if (match && match[1] && match[1] !== "_fallback") {
        setResolvedSlug(decodeURIComponent(match[1]));
      }
    }
  }, [initialSlug]);

  const publishedProjects = data.projects.filter((p) => p.published !== false);
  const index = publishedProjects.findIndex((p) => p.slug === resolvedSlug);

  if (index === -1) {
    if (loading || resolvedSlug === "_fallback") {
      return (
        <div className="sunlit-aura min-h-[75vh] pt-36 pb-24">
          <div className="shell max-w-xl text-center">
            <p className="text-sm font-semibold text-[var(--ink-slate)]">Loading case study...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="sunlit-aura min-h-[75vh] pt-36 pb-24">
        <div className="shell max-w-xl text-center space-y-5">
          <h1 className="text-h2 font-bold text-[var(--ink-obsidian)]">Project not found</h1>
          <p className="text-body text-[var(--ink-slate)]">
            This case study may have been unpublished or moved in the Admin Panel.
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink-obsidian)] px-6 py-3 text-sm font-semibold text-[#F7F5F0]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Selected Work
          </Link>
        </div>
      </div>
    );
  }

  const project = publishedProjects[index];
  const nextProject = publishedProjects[(index + 1) % publishedProjects.length];

  return <CaseStudyView project={project} nextProject={nextProject} />;
}

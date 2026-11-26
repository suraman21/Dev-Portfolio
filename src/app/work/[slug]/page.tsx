"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { CaseStudyView } from "@/components/work/CaseStudyView";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data } = useCms();

  const publishedProjects = data.projects.filter((p) => p.published !== false);
  const index = publishedProjects.findIndex((p) => p.slug === slug);

  if (index === -1) {
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

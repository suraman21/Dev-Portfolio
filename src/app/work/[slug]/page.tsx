import { projects } from "@/data/projects";
import { ProjectDetailClient } from "@/components/work/ProjectDetailClient";

export function generateStaticParams() {
  return [...projects.map((p) => ({ slug: p.slug })), { slug: "_fallback" }];
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectDetailClient initialSlug={slug} />;
}

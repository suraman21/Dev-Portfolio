import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { experiences, skillGroups } from "@/data/story";
import { siteConfig } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function AboutPage() {
  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        {/* Warm Human Introduction */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--border-mineral)] items-end">
          <div className="lg:col-span-8 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
              About Me
            </span>
            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              Senior engineering rigor with an eye for{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                luxury craft.
              </span>
            </h1>
            <p className="text-body-lg text-[var(--ink-slate)] max-w-[60ch]">
              I&apos;m {siteConfig.name}, a Senior Software Engineer and Web Developer with over 8
              years of experience building scalable SaaS products and high-converting websites. I
              enjoy bridging the gap between backend reliability and smooth, intuitive design so
              products feel great for real people.
            </p>
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
              {siteConfig.heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between border-b border-[var(--border-mineral)] pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-[var(--ink-slate)]">{stat.label}</span>
                  <span className="text-lg font-bold text-[var(--ink-obsidian)]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

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
            {experiences.map((exp) => (
              <article key={exp.period} className="porcelain-card rounded-3xl p-7">
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
            {skillGroups.map((group) => (
              <div key={group.title} className="porcelain-card rounded-3xl p-6">
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

"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Quote } from "lucide-react";
import { testimonials } from "@/data/story";
import { siteConfig } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function TestimonialsAndContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[var(--bg-alabaster)] py-20 md:py-28">
      <div className="shell space-y-20">
        {/* Testimonials */}
        <div>
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
              Client Feedback
            </span>
            <h2 className="mt-2 text-h2 font-bold text-[var(--ink-obsidian)]">
              What teams say after{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                shipping together.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <blockquote
                key={item.author}
                className="porcelain-card rounded-3xl p-7 flex flex-col justify-between"
              >
                <div>
                  <Quote
                    className={`h-6 w-6 mb-4 ${
                      idx === 1 ? "text-[var(--neon-orange)]" : "text-[var(--neon-teal)]"
                    }`}
                  />
                  <p className="text-[15px] leading-relaxed text-[var(--ink-obsidian)]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--border-mineral)] pt-4">
                  <div className="inline-block rounded-full bg-[var(--teal-mist)] px-3 py-1 text-[11px] font-semibold text-[var(--teal-deep)] mb-3">
                    {item.result}
                  </div>
                  <div className="text-sm font-bold text-[var(--ink-obsidian)]">{item.author}</div>
                  <div className="text-xs text-[var(--ink-slate)]">
                    {item.role}, {item.company}
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Clean, Warm Luxury Closing CTA */}
        <div className="porcelain-card dichroic-ring rounded-[34px] p-8 sm:p-12 md:p-14 sunlit-aura text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--teal-deep)]">
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              {siteConfig.availability}
            </div>

            <h2 className="text-h2 font-bold text-[var(--ink-obsidian)]">
              Have a product or role in mind?{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                Let&apos;s build it right.
              </span>
            </h2>

            <p className="text-body-lg text-[var(--ink-slate)]">
              Whether you&apos;re hiring a senior engineer or launching a new flagship SaaS or
              website, I&apos;d love to hear what you&apos;re working on.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <MagneticButton href="/contact" variant="primary">
                Start a Conversation <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[var(--teal-deep)]" /> Copied {siteConfig.email}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-[var(--teal-deep)]" /> Copy {siteConfig.email}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CmsData } from "@/types/cms";

interface AdminContactFooterTabProps {
  draft: CmsData;
  onUpdate: (updater: (prev: CmsData) => CmsData) => void;
}

export function AdminContactFooterTab({ draft, onUpdate }: AdminContactFooterTabProps) {
  const { site } = draft;
  const setSite = (patch: Partial<CmsData["site"]>) =>
    onUpdate((prev) => ({ ...prev, site: { ...prev.site, ...patch } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Contact Page &amp; Global Footer</h2>
        <p className="text-xs text-[var(--ink-slate)]">
          Manage all copy on <code>/contact</code>, the budget dropdown options, and the luxury
          website footer.
        </p>
      </div>

      {/* 1. Contact Page Copy & Budget Dropdown Options */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
        <h3 className="text-base font-bold">Contact Page Copy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Contact Headline
            </label>
            <input
              value={site.contactHeadline}
              onChange={(e) => setSite({ contactHeadline: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Contact Orange Italic Highlight
            </label>
            <input
              value={site.contactHighlight}
              onChange={(e) => setSite({ contactHighlight: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
            Contact Intro Description
          </label>
          <textarea
            rows={2}
            value={site.contactDescription}
            onChange={(e) => setSite({ contactDescription: e.target.value })}
            className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Reply Time Note
            </label>
            <input
              value={site.contactReplyNote}
              onChange={(e) => setSite({ contactReplyNote: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Submit Button Label
            </label>
            <input
              value={site.contactSubmitLabel}
              onChange={(e) => setSite({ contactSubmitLabel: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Budget Dropdown Options */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-mineral)]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--ink-obsidian)]">
              Budget / Engagement Dropdown Options
            </label>
            <button
              type="button"
              onClick={() =>
                setSite({
                  contactBudgetOptions: [
                    ...(site.contactBudgetOptions || []),
                    "Custom Engagement",
                  ],
                })
              }
              className="inline-flex items-center gap-1 rounded-full bg-[var(--ink-obsidian)] px-3 py-1 text-[11px] font-semibold text-[#F7F5F0] cursor-pointer"
            >
              <Plus className="h-3 w-3 text-[var(--neon-teal)]" /> Add Option
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(site.contactBudgetOptions || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={(e) =>
                    setSite({
                      contactBudgetOptions: site.contactBudgetOptions.map((item, i) =>
                        i === idx ? e.target.value : item
                      ),
                    })
                  }
                  className="flex-1 rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                />
                {site.contactBudgetOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSite({
                        contactBudgetOptions: site.contactBudgetOptions.filter((_, i) => i !== idx),
                      })
                    }
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Luxury Footer Copy */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
        <h3 className="text-base font-bold">Global Footer Copy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Footer Headline
            </label>
            <input
              value={site.footerHeadline}
              onChange={(e) => setSite({ footerHeadline: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Footer Italic Highlight
            </label>
            <input
              value={site.footerHighlight}
              onChange={(e) => setSite({ footerHighlight: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
            Footer Bio
          </label>
          <textarea
            rows={2}
            value={site.footerBio}
            onChange={(e) => setSite({ footerBio: e.target.value })}
            className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Footer CTA Button Label
            </label>
            <input
              value={site.footerCtaLabel}
              onChange={(e) => setSite({ footerCtaLabel: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Footer Copyright Note
            </label>
            <input
              value={site.footerCopyrightNote}
              onChange={(e) => setSite({ footerCopyrightNote: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Code2, Image as ImageIcon, Plus, RefreshCw, RotateCcw, Trash2, Upload } from "lucide-react";
import type { CmsData, MediaAsset, ProfileImagePosition } from "@/types/cms";
import { DEFAULT_FAVICON_URL, FAVICON_PRESETS } from "@/data/cms-defaults";
import {
  countLegacyNameReferences,
  deriveMonogram,
  syncBrandNameEverywhere,
} from "@/lib/brand-sync";

interface AdminProfileTabProps {
  draft: CmsData;
  savedName: string;
  uploading: boolean;
  onUpdate: (updater: (prev: CmsData) => CmsData) => void;
  onUploadImage: (file: File, alt: string) => Promise<MediaAsset | null>;
}

const POS_CLASS: Record<ProfileImagePosition, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export function AdminProfileTab({
  draft,
  savedName,
  uploading,
  onUpdate,
  onUploadImage,
}: AdminProfileTabProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showFaviconPicker, setShowFaviconPicker] = useState(false);
  const { site, mediaLibrary } = draft;
  const activeFavicon = site.faviconUrl?.trim() || DEFAULT_FAVICON_URL;

  const setSite = (patch: Partial<CmsData["site"]>) =>
    onUpdate((prev) => ({ ...prev, site: { ...prev.site, ...patch } }));

  const legacyNames = [savedName, "Sura Aman"];
  const legacyRefCount = countLegacyNameReferences(draft, legacyNames, site.name);

  const handleNameChange = (nextName: string) => {
    onUpdate((prev) => {
      const prevMonogram = deriveMonogram(prev.site.name);
      const shouldUpdateMonogram =
        !prev.site.monogram || prev.site.monogram.toUpperCase() === prevMonogram;
      const shouldUpdateAlt =
        !prev.site.profileImageAlt ||
        prev.site.profileImageAlt.startsWith(prev.site.name);

      return {
        ...prev,
        site: {
          ...prev.site,
          name: nextName,
          monogram: shouldUpdateMonogram ? deriveMonogram(nextName) : prev.site.monogram,
          profileImageAlt: shouldUpdateAlt
            ? `${nextName} — ${prev.site.role}`
            : prev.site.profileImageAlt,
        },
      };
    });
  };

  const handleSyncNameEverywhere = () => {
    onUpdate((prev) => syncBrandNameEverywhere(prev, legacyNames, prev.site.name));
  };

  const posClass = POS_CLASS[site.profileImagePosition || "top"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Developer Profile &amp; Brand Identity</h2>
        <p className="text-xs text-[var(--ink-slate)]">
          Upload your profile portrait and manage your personal identity — shown on both the Home
          page and About page.
        </p>
      </div>

      {/* 1. Profile Portrait Uploader & Live Preview */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 space-y-3">
            <div className="relative aspect-[4/4.6] w-full max-w-[260px] overflow-hidden rounded-3xl border-2 border-[var(--border-mineral)] bg-[var(--bg-alabaster)]">
              {site.profileImage ? (
                <img
                  src={site.profileImage}
                  alt={site.profileImageAlt || site.name}
                  className={`h-full w-full object-cover ${posClass}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--ink-obsidian)] font-mono text-4xl font-bold text-[var(--neon-teal)]">
                  {site.monogram}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer hover:scale-[1.02]">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Upload Portrait"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const asset = await onUploadImage(file, `${site.name} developer portrait`);
                    if (asset) {
                      setSite({
                        profileImage: asset.url,
                        profileImageAlt: `${site.name} — ${site.role}`,
                      });
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowPicker((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold cursor-pointer hover:border-[var(--teal-deep)]"
              >
                <ImageIcon className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
                {showPicker ? "Hide Library" : "Pick from Library"}
              </button>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <h3 className="text-sm font-bold">Portrait Image Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Profile Image URL (or upload on the left)
                </label>
                <input
                  value={site.profileImage}
                  onChange={(e) => setSite({ profileImage: e.target.value })}
                  placeholder="/images/developer-profile.png"
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Image Alt Text (Accessibility)
                </label>
                <input
                  value={site.profileImageAlt}
                  onChange={(e) => setSite({ profileImageAlt: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                  Portrait Crop Focus
                </label>
                <select
                  value={site.profileImagePosition || "top"}
                  onChange={(e) =>
                    setSite({ profileImagePosition: e.target.value as ProfileImagePosition })
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
                >
                  <option value="top">Top (Best for headshots &amp; portraits)</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>

            {showPicker && (
              <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3.5 space-y-2.5">
                <div className="text-[11px] font-bold text-[var(--ink-slate)]">
                  Select an existing image from Media Library:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {mediaLibrary.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setSite({ profileImage: asset.url });
                        setShowPicker(false);
                      }}
                      className={`overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${
                        site.profileImage === asset.url
                          ? "border-[var(--neon-orange)]"
                          : "border-transparent hover:border-[var(--teal-deep)]"
                      }`}
                    >
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1b. Browser Tab Favicon (Software Engineering Presets & Custom Upload) */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--teal-deep)]">
              <Code2 className="h-3.5 w-3.5" />
              <span>Browser Tab Icon (Separate from Profile Photo)</span>
            </div>
            <h3 className="text-base font-bold">Website Favicon</h3>
            <p className="text-xs text-[var(--ink-slate)]">
              Choose a crisp software-engineering favicon or upload your own SVG, PNG, ICO, or WebP
              icon. Updates the live browser tab across every page.
            </p>
          </div>

          {/* Realistic Browser Tab Live Preview */}
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-2.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-mineral)] bg-white p-1.5 shadow-xs">
              <img
                src={activeFavicon}
                alt="Active favicon preview"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="space-y-1 pr-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-slate)]">
                Browser Tab Preview
              </div>
              <div className="inline-flex max-w-[210px] items-center gap-2 rounded-lg border border-[var(--border-mineral)] bg-white px-2.5 py-1 shadow-xs">
                <img src={activeFavicon} alt="" className="h-4 w-4 shrink-0 object-contain" />
                <span className="truncate text-[11px] font-semibold text-[var(--ink-obsidian)]">
                  {site.name} — {site.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Software Engineering Presets */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-slate)]">
            Software Engineering Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FAVICON_PRESETS.map((preset) => {
              const selected = activeFavicon === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSite({ faviconUrl: preset.url })}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer ${
                    selected
                      ? "border-[var(--neon-orange)] bg-[rgba(255,107,0,0.06)] shadow-xs"
                      : "border-[var(--border-mineral)] bg-[var(--bg-alabaster)] hover:border-[var(--teal-deep)]"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="h-10 w-10 shrink-0 rounded-lg object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-xs font-bold text-[var(--ink-obsidian)]">
                        {preset.label}
                      </span>
                      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--orange-deep)]" />}
                    </div>
                    <p className="truncate text-[10px] text-[var(--ink-slate)] mt-0.5">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Favicon Upload + URL + Media Library */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6">
            <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
              Favicon URL (SVG, PNG, ICO, or WebP)
            </label>
            <input
              value={site.faviconUrl || ""}
              onChange={(e) => setSite({ faviconUrl: e.target.value })}
              placeholder={DEFAULT_FAVICON_URL}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 font-mono text-xs"
            />
          </div>
          <div className="md:col-span-6 flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-4 py-2.5 text-xs font-bold text-[#F7F5F0] cursor-pointer hover:bg-[#1a272d]">
              <Upload className="h-3.5 w-3.5 text-[var(--neon-teal)]" />
              {uploading ? "Uploading..." : "Upload Favicon"}
              <input
                type="file"
                accept=".svg,.ico,.png,.webp,.jpg,.jpeg,image/svg+xml,image/x-icon,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const asset = await onUploadImage(file, `${site.name} custom favicon`);
                  if (asset) {
                    setSite({ faviconUrl: asset.url });
                  }
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => setShowFaviconPicker((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold cursor-pointer hover:border-[var(--teal-deep)]"
            >
              <ImageIcon className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
              {showFaviconPicker ? "Hide Library" : "Pick from Library"}
            </button>
            {activeFavicon !== DEFAULT_FAVICON_URL && (
              <button
                type="button"
                onClick={() => setSite({ faviconUrl: DEFAULT_FAVICON_URL })}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-white px-3.5 py-2.5 text-xs font-semibold text-[var(--ink-slate)] cursor-pointer hover:border-[var(--orange-deep)] hover:text-[var(--orange-deep)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Default
              </button>
            )}
          </div>
        </div>

        {showFaviconPicker && (
          <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3.5 space-y-2.5">
            <div className="text-[11px] font-bold text-[var(--ink-slate)]">
              Select an icon from Media Library:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {mediaLibrary.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    setSite({ faviconUrl: asset.url });
                    setShowFaviconPicker(false);
                  }}
                  className={`overflow-hidden rounded-xl border-2 bg-white p-1.5 cursor-pointer transition-all ${
                    activeFavicon === asset.url
                      ? "border-[var(--neon-orange)]"
                      : "border-transparent hover:border-[var(--teal-deep)]"
                  }`}
                >
                  <img
                    src={asset.url}
                    alt={asset.alt}
                    className="aspect-square w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Core Identity & Social Links */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">Core Brand Identity &amp; Global Sync</h3>
            <p className="text-xs text-[var(--ink-slate)]">
              Changes here automatically sync across Header, Footer, Browser Tab Title, Hero, About,
              and Contact pages.
            </p>
          </div>
          {legacyRefCount > 0 && (
            <button
              type="button"
              onClick={handleSyncNameEverywhere}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-teal)] px-4 py-2 text-xs font-bold text-[#0F171A] shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync &ldquo;{site.name}&rdquo; into {legacyRefCount} Text Mentions
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Full Name (Synced Site-Wide)
            </label>
            <input
              value={site.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Fallback Initials (Shown if no photo)
            </label>
            <input
              value={site.monogram}
              onChange={(e) => setSite({ monogram: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Direct Email (Synced Site-Wide)
            </label>
            <input
              value={site.email}
              onChange={(e) => setSite({ email: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Role / Title Badge (Synced Site-Wide)
            </label>
            <input
              value={site.role}
              onChange={(e) => setSite({ role: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Location (Synced Site-Wide)
            </label>
            <input
              value={site.location}
              onChange={(e) => setSite({ location: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Availability Status (Header, About, Contact &amp; Footer)
            </label>
            <input
              value={site.availability}
              onChange={(e) => setSite({ availability: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
              Header CTA Button Label
            </label>
            <input
              value={site.headerCtaLabel || "Let's Talk"}
              onChange={(e) => setSite({ headerCtaLabel: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* 2b. Social Media & Floating WhatsApp / Telegram Controls (On / Off Toggles) */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">
              Social Media &amp; Floating Direct Contact (On / Off)
            </h3>
            <p className="text-xs text-[var(--ink-slate)]">
              Turn any social account ON or OFF site-wide (e.g. hide LinkedIn if you don&apos;t use
              it) and configure your WhatsApp &amp; Telegram floating popup button.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={site.showFloatingContact !== false}
              onChange={(e) => setSite({ showFloatingContact: e.target.checked })}
            />
            Show Floating WhatsApp &amp; Telegram Button
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#15803D]">WhatsApp Direct Chat</span>
              <label className="inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={site.showWhatsapp !== false}
                  onChange={(e) => setSite({ showWhatsapp: e.target.checked })}
                />
                {site.showWhatsapp !== false ? "ON" : "OFF"}
              </label>
            </div>
            <input
              value={site.whatsapp || ""}
              onChange={(e) => setSite({ whatsapp: e.target.value })}
              placeholder="+251912345678 or https://wa.me/251912345678"
              disabled={site.showWhatsapp === false}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3.5 py-2.5 text-xs font-mono disabled:opacity-50"
            />
            <p className="text-[10px] text-[var(--ink-muted)]">
              Enter your phone number with country code or full <code>https://wa.me/...</code> link.
            </p>
          </div>

          {/* Telegram */}
          <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#0369A1]">Telegram Direct Message</span>
              <label className="inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={site.showTelegram !== false}
                  onChange={(e) => setSite({ showTelegram: e.target.checked })}
                />
                {site.showTelegram !== false ? "ON" : "OFF"}
              </label>
            </div>
            <input
              value={site.telegram || ""}
              onChange={(e) => setSite({ telegram: e.target.value })}
              placeholder="@yourusername or https://t.me/yourusername"
              disabled={site.showTelegram === false}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3.5 py-2.5 text-xs font-mono disabled:opacity-50"
            />
            <p className="text-[10px] text-[var(--ink-muted)]">
              Enter your <code>@username</code> or full <code>https://t.me/...</code> link.
            </p>
          </div>

          {/* GitHub */}
          <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--ink-obsidian)]">GitHub Profile</span>
              <label className="inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={site.showGithub !== false}
                  onChange={(e) => setSite({ showGithub: e.target.checked })}
                />
                {site.showGithub !== false ? "ON" : "OFF"}
              </label>
            </div>
            <input
              value={site.github || ""}
              onChange={(e) => setSite({ github: e.target.value })}
              placeholder="https://github.com/username"
              disabled={site.showGithub === false}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3.5 py-2.5 text-xs disabled:opacity-50"
            />
          </div>

          {/* LinkedIn */}
          <div className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)]/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--ink-obsidian)]">LinkedIn Profile</span>
              <label className="inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={site.showLinkedin !== false}
                  onChange={(e) => setSite({ showLinkedin: e.target.checked })}
                />
                {site.showLinkedin !== false ? "ON" : "OFF"}
              </label>
            </div>
            <input
              value={site.linkedin || ""}
              onChange={(e) => setSite({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              disabled={site.showLinkedin === false}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3.5 py-2.5 text-xs disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* 3. Home Page Developer Profile Spotlight Section */}
      <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">Home Page Developer Profile Card</h3>
            <p className="text-xs text-[var(--ink-slate)]">
              Controls the dedicated Developer Profile spotlight displayed on the Home page.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={site.showHomeProfile !== false}
              onChange={(e) => setSite({ showHomeProfile: e.target.checked })}
            />
            Show Profile Section on Home Page
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
              Eyebrow Label
            </label>
            <input
              value={site.profileEyebrow}
              onChange={(e) => setSite({ profileEyebrow: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
              Headline
            </label>
            <input
              value={site.profileHeadline}
              onChange={(e) => setSite({ profileHeadline: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
              Orange Italic Highlight
            </label>
            <input
              value={site.profileHighlight}
              onChange={(e) => setSite({ profileHighlight: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
            Home Profile Bio
          </label>
          <textarea
            rows={3}
            value={site.profileBio}
            onChange={(e) => setSite({ profileBio: e.target.value })}
            className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[var(--ink-slate)]">
              Key Profile Highlights (Checkmark Bullets)
            </label>
            <button
              type="button"
              onClick={() =>
                setSite({
                  profileHighlights: [...(site.profileHighlights || []), "New developer highlight"],
                })
              }
              className="inline-flex items-center gap-1 rounded-full bg-[var(--ink-obsidian)] px-3 py-1 text-[11px] font-semibold text-[#F7F5F0] cursor-pointer"
            >
              <Plus className="h-3 w-3 text-[var(--neon-teal)]" /> Add Bullet
            </button>
          </div>
          <div className="space-y-2">
            {(site.profileHighlights || []).map((hl, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={hl}
                  onChange={(e) =>
                    setSite({
                      profileHighlights: site.profileHighlights.map((item, i) =>
                        i === idx ? e.target.value : item
                      ),
                    })
                  }
                  className="flex-1 rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSite({
                      profileHighlights: site.profileHighlights.filter((_, i) => i !== idx),
                    })
                  }
                  className="rounded-xl p-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Remove highlight"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
              Primary Button Label (Links to /about)
            </label>
            <input
              value={site.profilePrimaryCta}
              onChange={(e) => setSite({ profilePrimaryCta: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
              Secondary Button Label (Links to /contact)
            </label>
            <input
              value={site.profileSecondaryCta}
              onChange={(e) => setSite({ profileSecondaryCta: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

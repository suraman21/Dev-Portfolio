"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import type {
  BuildStep,
  CmsData,
  ContactMessage,
  ContactMessageStatus,
  ExperienceItem,
  MediaAsset,
  ServiceItem,
  SkillGroup,
  Testimonial,
} from "@/types/cms";
import { useCms } from "@/components/cms/CmsProvider";
import { generateMysqlExport } from "@/lib/sql-export";
import { AdminProjectsTab } from "./AdminProjectsTab";

type AdminTab =
  | "overview"
  | "inbox"
  | "projects"
  | "services"
  | "site"
  | "slides"
  | "about"
  | "testimonials"
  | "media"
  | "database";

interface AdminDashboardProps {
  userEmail: string;
  backend: "php-mysql" | "local-preview";
  onLogout: () => Promise<void>;
}

export function AdminDashboard({ userEmail, backend, onLogout }: AdminDashboardProps) {
  const { data: liveCms, refresh: refreshGlobalCms, setCmsLocal } = useCms();

  const [tab, setTab] = useState<AdminTab>("overview");
  const [draft, setDraft] = useState<CmsData>(() => structuredClone(liveCms));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [msgFilter, setMsgFilter] = useState<"all" | ContactMessageStatus>("all");
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const showToast = useCallback((text: string, type: "ok" | "err" = "ok") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // Keep draft synced when live CMS loads initially (if not currently editing)
  useEffect(() => {
    if (!dirty) {
      setDraft(structuredClone(liveCms));
    }
  }, [liveCms, dirty]);

  const loadMessages = useCallback(async () => {
    setLoadingInbox(true);
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } finally {
      setLoadingInbox(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const updateDraft = (updater: (prev: CmsData) => CmsData) => {
    setDraft((prev) => updater(prev));
    setDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Could not save changes.");
      if (json.data) {
        setDraft(json.data);
        setCmsLocal(json.data);
      }
      await refreshGlobalCms();
      setDirty(false);
      showToast(
        backend === "php-mysql"
          ? "Saved directly to MySQL via PHP API!"
          : "All changes saved & live across the website!"
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed.", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async (file: File, alt: string): Promise<MediaAsset | null> => {
    setUploadingMedia(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed.");
      const asset = json.asset as MediaAsset;
      setDraft((prev) => ({
        ...prev,
        mediaLibrary: [asset, ...prev.mediaLibrary],
      }));
      await refreshGlobalCms();
      showToast(`Uploaded ${asset.filename}`);
      return asset;
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed.", "err");
      return null;
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    const res = await fetch(`/api/admin/media/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDraft((prev) => ({
        ...prev,
        mediaLibrary: prev.mediaLibrary.filter((m) => m.id !== id),
      }));
      await refreshGlobalCms();
      showToast("Media asset removed.");
    }
  };

  const handleMessageStatus = async (id: string, status: ContactMessageStatus) => {
    const res = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      showToast(`Marked message as ${status}.`);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const res = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Message deleted.");
    }
  };

  const handleDownloadSql = () => {
    const sql = generateMysqlExport(draft, messages);
    const blob = new Blob([sql], { type: "application/sql;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dev-portfolio-mysql-export-${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded MySQL 8 SQL export!");
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify({ cms: draft, messages }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dev-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded JSON backup!");
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Reset all website content back to initial defaults?")) return;
    const res = await fetch("/api/admin/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ __reset: true }),
    });
    if (res.ok) {
      const json = await res.json();
      setDraft(json.data);
      setCmsLocal(json.data);
      setDirty(false);
      await refreshGlobalCms();
      showToast("Restored default site content.");
    }
  };

  const unreadCount = messages.filter((m) => m.status === "new").length;
  const filteredMessages =
    msgFilter === "all" ? messages : messages.filter((m) => m.status === msgFilter);

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inbox", label: "Contact Inbox", icon: Inbox, badge: unreadCount },
    { id: "projects", label: "Portfolio Projects", icon: FolderKanban },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "site", label: "Site, Hero & Footer", icon: Globe },
    { id: "slides", label: "Process Slides", icon: Layers },
    { id: "about", label: "About & Experience", icon: User },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "database", label: "PHP & MySQL", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-alabaster)] text-[var(--ink-obsidian)]">
      {/* Top Sticky Admin Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-mineral)] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ink-obsidian)] font-mono text-xs font-bold text-[var(--neon-teal)]">
              {draft.site.monogram}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm sm:text-base font-bold text-[var(--ink-obsidian)]">
                  Portfolio CMS Admin
                </h1>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    backend === "php-mysql"
                      ? "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                      : "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                  }`}
                >
                  <Database className="h-3 w-3" />
                  {backend === "php-mysql" ? "PHP + MySQL Live" : "PHP + MySQL Ready (Preview)"}
                </span>
              </div>
              <div className="truncate text-[11px] text-[var(--ink-muted)]">{userEmail}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2 text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--teal-deep)]"
            >
              View Live Site <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || !dirty}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                dirty
                  ? "bg-[var(--neon-orange)] text-[#0F171A] shadow-[0_8px_20px_-8px_rgba(255,90,31,0.65)] hover:scale-[1.02]"
                  : "bg-[var(--surface-stone)] text-[var(--ink-muted)] cursor-default"
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : dirty ? "Save Changes" : "All Saved"}
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-mineral)] bg-white text-[var(--ink-slate)] hover:border-red-400 hover:text-red-600 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tab Strip */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 border-t border-[var(--border-mineral)]/70 px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
                  active
                    ? "bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                    : "bg-[var(--bg-alabaster)] text-[var(--ink-slate)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
                {item.badge ? (
                  <span className="rounded-full bg-[var(--neon-orange)] px-1.5 text-[10px] font-bold text-[#0F171A]">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold shadow-xl ${
              toast.type === "err"
                ? "bg-red-600 text-white"
                : "bg-[var(--ink-obsidian)] text-[#F7F5F0] border border-[var(--neon-teal)]/50"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-[var(--neon-teal)]" />
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Responsive Workspace Grid */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-6 sm:px-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <nav className="sticky top-22 space-y-1 rounded-3xl border border-[var(--border-mineral)] bg-white p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--ink-obsidian)] text-[#F7F5F0] shadow-sm"
                      : "text-[var(--ink-slate)] hover:bg-[var(--bg-alabaster)] hover:text-[var(--ink-obsidian)]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${active ? "text-[var(--neon-teal)]" : "text-[var(--ink-muted)]"}`}
                    />
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="rounded-full bg-[var(--neon-orange)] px-2 py-0.5 text-[10px] font-bold text-[#0F171A]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Module Content Area */}
        <section className="lg:col-span-9 xl:col-span-10 space-y-6">
          {/* ==================== 1. OVERVIEW ==================== */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5">
                  <div className="text-xs font-medium text-[var(--ink-muted)]">
                    Unread Messages
                  </div>
                  <div className="mt-2 text-3xl font-bold text-[var(--orange-lacquer)]">
                    {unreadCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("inbox")}
                    className="mt-2 text-xs font-semibold text-[var(--teal-deep)] hover:underline cursor-pointer"
                  >
                    Open Inbox →
                  </button>
                </div>

                <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5">
                  <div className="text-xs font-medium text-[var(--ink-muted)]">
                    Portfolio Projects
                  </div>
                  <div className="mt-2 text-3xl font-bold text-[var(--ink-obsidian)]">
                    {draft.projects.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("projects")}
                    className="mt-2 text-xs font-semibold text-[var(--teal-deep)] hover:underline cursor-pointer"
                  >
                    Manage Projects →
                  </button>
                </div>

                <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5">
                  <div className="text-xs font-medium text-[var(--ink-muted)]">
                    Active Services
                  </div>
                  <div className="mt-2 text-3xl font-bold text-[var(--teal-deep)]">
                    {draft.services.filter((s) => s.active).length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("services")}
                    className="mt-2 text-xs font-semibold text-[var(--teal-deep)] hover:underline cursor-pointer"
                  >
                    Edit Contact Dropdown →
                  </button>
                </div>

                <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5">
                  <div className="text-xs font-medium text-[var(--ink-muted)]">
                    Media Assets
                  </div>
                  <div className="mt-2 text-3xl font-bold text-[var(--ink-obsidian)]">
                    {draft.mediaLibrary.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("media")}
                    className="mt-2 text-xs font-semibold text-[var(--teal-deep)] hover:underline cursor-pointer"
                  >
                    Upload Images →
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold">Latest Contact Submissions</h2>
                  <button
                    type="button"
                    onClick={loadMessages}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--teal-deep)] hover:underline cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p className="text-sm text-[var(--ink-muted)]">No contact messages yet.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-4"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold">{m.name}</span>
                            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[var(--teal-deep)] border border-[var(--border-mineral)]">
                              {m.serviceName}
                            </span>
                            {m.status === "new" && (
                              <span className="rounded-full bg-[var(--neon-orange)] px-2 py-0.5 text-[10px] font-bold text-[#0F171A]">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-[var(--ink-slate)]">
                            {m.message}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTab("inbox")}
                          className="shrink-0 text-xs font-bold text-[var(--ink-obsidian)] hover:text-[var(--orange-lacquer)] cursor-pointer"
                        >
                          Open →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 2. CONTACT INBOX ==================== */}
          {tab === "inbox" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Contact Form Inbox ({messages.length})</h2>
                  <p className="text-xs text-[var(--ink-slate)]">
                    Every submission from /contact is stored here and in MySQL `contact_messages`.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(["all", "new", "read", "replied", "archived"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setMsgFilter(status)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize cursor-pointer ${
                        msgFilter === status
                          ? "bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                          : "border border-[var(--border-mineral)] bg-white text-[var(--ink-slate)]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={loadMessages}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingInbox ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-10 text-center text-sm text-[var(--ink-muted)]">
                  No messages in this filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMessages.map((msg) => (
                    <article
                      key={msg.id}
                      className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5 sm:p-6 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold">{msg.name}</h3>
                            <span className="text-xs text-[var(--ink-muted)]">{msg.email}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                msg.status === "new"
                                  ? "bg-[var(--neon-orange)] text-[#0F171A]"
                                  : msg.status === "replied"
                                    ? "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                                    : "bg-black/8 text-[var(--ink-slate)]"
                              }`}
                            >
                              {msg.status}
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full bg-[var(--teal-mist)] px-3 py-0.5 font-semibold text-[var(--teal-deep)]">
                              Service: {msg.serviceName}
                            </span>
                            {msg.budget && (
                              <span className="rounded-full bg-[var(--bg-alabaster)] px-3 py-0.5 font-medium text-[var(--ink-slate)]">
                                Budget: {msg.budget}
                              </span>
                            )}
                            <span className="text-[11px] text-[var(--ink-muted)]">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.serviceName}`)}`}
                            onClick={() => handleMessageStatus(msg.id, "replied")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-obsidian)] px-3.5 py-1.5 text-xs font-semibold text-[#F7F5F0]"
                          >
                            <Mail className="h-3.5 w-3.5 text-[var(--neon-teal)]" /> Reply
                          </a>
                          {msg.status === "new" && (
                            <button
                              type="button"
                              onClick={() => handleMessageStatus(msg.id, "read")}
                              className="rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleMessageStatus(msg.id, "archived")}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--border-mineral)] bg-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                          >
                            <Archive className="h-3.5 w-3.5" /> Archive
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="rounded-full border border-red-200 bg-red-50 p-1.5 text-red-600 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="rounded-2xl bg-[var(--bg-alabaster)] p-4 text-sm text-[var(--ink-obsidian)] whitespace-pre-wrap">
                        {msg.message || "(No additional message text provided)"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. PORTFOLIO PROJECTS ==================== */}
          {tab === "projects" && (
            <AdminProjectsTab
              projects={draft.projects}
              mediaLibrary={draft.mediaLibrary}
              onChange={(nextProjects) => updateDraft((prev) => ({ ...prev, projects: nextProjects }))}
              onUploadImage={handleUploadImage}
            />
          )}

          {/* ==================== 4. SERVICES MANAGER ==================== */}
          {tab === "services" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Services Manager ({draft.services.length})</h2>
                  <p className="text-xs text-[var(--ink-slate)]">
                    Active services immediately appear in the Contact Form dropdown, About page, and Footer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const created: ServiceItem = {
                      id: `svc-${Date.now()}`,
                      name: "New Service Offering",
                      shortDescription: "Describe what clients receive and why it matters.",
                      timeline: "4–6 Weeks",
                      startingPrice: "Custom Scope",
                      accent: "teal",
                      active: true,
                    };
                    updateDraft((prev) => ({ ...prev, services: [...prev.services, created] }));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Service
                </button>
              </div>

              <div className="space-y-4">
                {draft.services.map((svc, idx) => (
                  <div
                    key={svc.id}
                    className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={svc.active}
                          onChange={(e) =>
                            updateDraft((prev) => ({
                              ...prev,
                              services: prev.services.map((item, i) =>
                                i === idx ? { ...item, active: e.target.checked } : item
                              ),
                            }))
                          }
                        />
                        Active in Contact Dropdown &amp; Public Site
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((prev) => ({
                            ...prev,
                            services: prev.services.filter((_, i) => i !== idx),
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                          Service Name
                        </label>
                        <input
                          value={svc.name}
                          onChange={(e) =>
                            updateDraft((prev) => ({
                              ...prev,
                              services: prev.services.map((item, i) =>
                                i === idx ? { ...item, name: e.target.value } : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                          Timeline
                        </label>
                        <input
                          value={svc.timeline}
                          onChange={(e) =>
                            updateDraft((prev) => ({
                              ...prev,
                              services: prev.services.map((item, i) =>
                                i === idx ? { ...item, timeline: e.target.value } : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                          Accent
                        </label>
                        <select
                          value={svc.accent}
                          onChange={(e) =>
                            updateDraft((prev) => ({
                              ...prev,
                              services: prev.services.map((item, i) =>
                                i === idx
                                  ? { ...item, accent: e.target.value as "teal" | "orange" }
                                  : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2.5 text-sm"
                        >
                          <option value="teal">Neon Teal</option>
                          <option value="orange">Neon Orange</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                        Short Description (Shown beneath dropdown &amp; on About page)
                      </label>
                      <textarea
                        rows={2}
                        value={svc.shortDescription}
                        onChange={(e) =>
                          updateDraft((prev) => ({
                            ...prev,
                            services: prev.services.map((item, i) =>
                              i === idx ? { ...item, shortDescription: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 5. SITE, HERO, FOOTER & CONTACT COPY ==================== */}
          {tab === "site" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold">Global Brand Identity &amp; Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Full Name
                    </label>
                    <input
                      value={draft.site.name}
                      onChange={(e) =>
                        updateDraft((p) => ({ ...p, site: { ...p.site, name: e.target.value } }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Monogram Badge
                    </label>
                    <input
                      value={draft.site.monogram}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, monogram: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Direct Email
                    </label>
                    <input
                      value={draft.site.email}
                      onChange={(e) =>
                        updateDraft((p) => ({ ...p, site: { ...p.site, email: e.target.value } }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Role Badge
                    </label>
                    <input
                      value={draft.site.role}
                      onChange={(e) =>
                        updateDraft((p) => ({ ...p, site: { ...p.site, role: e.target.value } }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Location
                    </label>
                    <input
                      value={draft.site.location}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, location: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Availability Banner Text
                    </label>
                    <input
                      value={draft.site.availability}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, availability: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      GitHub URL
                    </label>
                    <input
                      value={draft.site.github}
                      onChange={(e) =>
                        updateDraft((p) => ({ ...p, site: { ...p.site, github: e.target.value } }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      value={draft.site.linkedin}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, linkedin: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold">Hero Section &amp; Key Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Hero Headline
                    </label>
                    <input
                      value={draft.site.heroTitle}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, heroTitle: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Hero Italic Orange Highlight
                    </label>
                    <input
                      value={draft.site.heroHighlight}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, heroHighlight: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                    Hero Description
                  </label>
                  <textarea
                    rows={3}
                    value={draft.site.heroDescription}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        site: { ...p.site, heroDescription: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {draft.site.heroStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-3.5 space-y-2"
                    >
                      <input
                        value={stat.value}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            site: {
                              ...p.site,
                              heroStats: p.site.heroStats.map((s, i) =>
                                i === idx ? { ...s, value: e.target.value } : s
                              ),
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-[var(--border-mineral)] bg-white px-2.5 py-1.5 text-sm font-bold"
                      />
                      <input
                        value={stat.label}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            site: {
                              ...p.site,
                              heroStats: p.site.heroStats.map((s, i) =>
                                i === idx ? { ...s, label: e.target.value } : s
                              ),
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-[var(--border-mineral)] bg-white px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold">Footer &amp; Closing CTA Copy</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Footer Headline
                    </label>
                    <input
                      value={draft.site.footerHeadline}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, footerHeadline: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                      Footer Italic Highlight
                    </label>
                    <input
                      value={draft.site.footerHighlight}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          site: { ...p.site, footerHighlight: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-slate)] mb-1">
                    Footer Bio
                  </label>
                  <textarea
                    rows={2}
                    value={draft.site.footerBio}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        site: { ...p.site, footerBio: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6. PROCESS SLIDES (HOW I BUILD) ==================== */}
          {tab === "slides" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Sticky Full-Screen Process Slides</h2>
                  <p className="text-xs text-[var(--ink-slate)]">
                    Edit every slide in the color-coded &ldquo;How I Build&rdquo; section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = String(draft.buildSteps.length + 1).padStart(2, "0");
                    const created: BuildStep = {
                      id: `step-${Date.now()}`,
                      number: nextNum,
                      label: `Step ${nextNum} · New Stage`,
                      title: "Built with purposeful",
                      highlight: "precision.",
                      description: "Describe this stage of your product process.",
                      accent: "teal",
                      points: ["Key deliverable 1", "Key deliverable 2"],
                      statValue: "100%",
                      statLabel: "Quality commitment",
                      visualType: "strategy",
                    };
                    updateDraft((p) => ({ ...p, buildSteps: [...p.buildSteps, created] }));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Slide
                </button>
              </div>

              {draft.buildSteps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--teal-deep)]">
                      SLIDE {step.number}
                    </span>
                    {draft.buildSteps.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            buildSteps: p.buildSteps
                              .filter((_, i) => i !== idx)
                              .map((s, i) => ({
                                ...s,
                                number: String(i + 1).padStart(2, "0"),
                              })),
                          }))
                        }
                        className="text-xs font-semibold text-red-600 cursor-pointer"
                      >
                        Remove Slide
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      value={step.label}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          buildSteps: p.buildSteps.map((s, i) =>
                            i === idx ? { ...s, label: e.target.value } : s
                          ),
                        }))
                      }
                      placeholder="Badge Label"
                      className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                    />
                    <select
                      value={step.accent}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          buildSteps: p.buildSteps.map((s, i) =>
                            i === idx
                              ? { ...s, accent: e.target.value as BuildStep["accent"] }
                              : s
                          ),
                        }))
                      }
                      className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-semibold"
                    >
                      <option value="teal">Electric Mint-Teal Studio</option>
                      <option value="orange">Solar Neon-Orange Studio</option>
                      <option value="cobalt">Electric Cobalt-Ice + Dark Card</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={step.statValue}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            buildSteps: p.buildSteps.map((s, i) =>
                              i === idx ? { ...s, statValue: e.target.value } : s
                            ),
                          }))
                        }
                        placeholder="Stat Value"
                        className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-bold"
                      />
                      <input
                        value={step.statLabel}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            buildSteps: p.buildSteps.map((s, i) =>
                              i === idx ? { ...s, statLabel: e.target.value } : s
                            ),
                          }))
                        }
                        placeholder="Stat Label"
                        className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={step.title}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          buildSteps: p.buildSteps.map((s, i) =>
                            i === idx ? { ...s, title: e.target.value } : s
                          ),
                        }))
                      }
                      placeholder="Slide Headline"
                      className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                    />
                    <input
                      value={step.highlight}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          buildSteps: p.buildSteps.map((s, i) =>
                            i === idx ? { ...s, highlight: e.target.value } : s
                          ),
                        }))
                      }
                      placeholder="Italic Highlight Word"
                      className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        buildSteps: p.buildSteps.map((s, i) =>
                          i === idx ? { ...s, description: e.target.value } : s
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--ink-slate)] mb-1">
                      Bullet Points (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={step.points.join("\n")}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          buildSteps: p.buildSteps.map((s, i) =>
                            i === idx
                              ? {
                                  ...s,
                                  points: e.target.value.split("\n").filter((l) => l.trim()),
                                }
                              : s
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== 7. ABOUT, EXPERIENCE & SKILLS ==================== */}
          {tab === "about" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold">About Page Introduction</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={draft.about.eyebrow}
                    onChange={(e) =>
                      updateDraft((p) => ({ ...p, about: { ...p.about, eyebrow: e.target.value } }))
                    }
                    placeholder="Eyebrow"
                    className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                  />
                  <input
                    value={draft.about.headline}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        about: { ...p.about, headline: e.target.value },
                      }))
                    }
                    placeholder="Headline"
                    className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm font-semibold"
                  />
                  <input
                    value={draft.about.highlight}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        about: { ...p.about, highlight: e.target.value },
                      }))
                    }
                    placeholder="Highlight"
                    className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm italic"
                  />
                </div>
                <textarea
                  rows={3}
                  value={draft.about.bio}
                  onChange={(e) =>
                    updateDraft((p) => ({ ...p, about: { ...p.about, bio: e.target.value } }))
                  }
                  className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                />
              </div>

              {/* Career Experience */}
              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">Experience Timeline</h2>
                  <button
                    type="button"
                    onClick={() => {
                      const created: ExperienceItem = {
                        id: `exp-${Date.now()}`,
                        period: "2026 — Present",
                        role: "Role Title",
                        company: "Company Name",
                        location: "Remote",
                        summary: "Key scope and leadership summary.",
                        highlights: ["Key shipped impact"],
                      };
                      updateDraft((p) => ({ ...p, experiences: [created, ...p.experiences] }));
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--ink-obsidian)] px-3.5 py-1.5 text-xs font-semibold text-[#F7F5F0] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-[var(--neon-teal)]" /> Add Role
                  </button>
                </div>

                {draft.experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        value={exp.period}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx ? { ...item, period: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Period"
                        className="rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs font-semibold"
                      />
                      <input
                        value={exp.role}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx ? { ...item, role: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Role"
                        className="sm:col-span-2 rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs font-bold"
                      />
                      <input
                        value={exp.company}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx ? { ...item, company: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Company"
                        className="rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={exp.summary}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          experiences: p.experiences.map((item, i) =>
                            i === idx ? { ...item, summary: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            experiences: p.experiences.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-xs font-semibold text-red-600 cursor-pointer"
                      >
                        Delete Role
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skill Groups */}
              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">Core Skill Categories</h2>
                  <button
                    type="button"
                    onClick={() => {
                      const created: SkillGroup = {
                        id: `skill-${Date.now()}`,
                        title: "New Skill Category",
                        accent: "teal",
                        skills: ["Skill 1", "Skill 2"],
                      };
                      updateDraft((p) => ({ ...p, skillGroups: [...p.skillGroups, created] }));
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--ink-obsidian)] px-3.5 py-1.5 text-xs font-semibold text-[#F7F5F0] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-[var(--neon-orange)]" /> Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {draft.skillGroups.map((group, idx) => (
                    <div
                      key={group.id || idx}
                      className="rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] p-4 space-y-2.5"
                    >
                      <input
                        value={group.title}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            skillGroups: p.skillGroups.map((g, i) =>
                              i === idx ? { ...g, title: e.target.value } : g
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs font-bold"
                      />
                      <textarea
                        rows={3}
                        value={group.skills.join(", ")}
                        onChange={(e) =>
                          updateDraft((p) => ({
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
                        placeholder="Comma separated skills"
                        className="w-full rounded-xl border border-[var(--border-mineral)] bg-white px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            skillGroups: p.skillGroups.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-[11px] font-semibold text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. TESTIMONIALS ==================== */}
          {tab === "testimonials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Client Testimonials ({draft.testimonials.length})
                  </h2>
                  <p className="text-xs text-[var(--ink-slate)]">
                    Add, update, or remove client quotes displayed on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const created: Testimonial = {
                      id: `test-${Date.now()}`,
                      quote: "Working together transformed our product speed and customer trust.",
                      author: "Client Name",
                      role: "Founder & CEO",
                      company: "Company Name",
                      result: "+40% conversion lift",
                    };
                    updateDraft((p) => ({ ...p, testimonials: [...p.testimonials, created] }));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neon-orange)] px-4 py-2 text-xs font-bold text-[#0F171A] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.testimonials.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="rounded-3xl border border-[var(--border-mineral)] bg-white p-5 space-y-3"
                  >
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          testimonials: p.testimonials.map((item, i) =>
                            i === idx ? { ...item, quote: e.target.value } : item
                          ),
                        }))
                      }
                      placeholder="Client quote"
                      className="w-full rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-2.5 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        value={t.author}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            testimonials: p.testimonials.map((item, i) =>
                              i === idx ? { ...item, author: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Author"
                        className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs font-bold"
                      />
                      <input
                        value={t.result}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            testimonials: p.testimonials.map((item, i) =>
                              i === idx ? { ...item, result: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Key Result Pill"
                        className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                      />
                      <input
                        value={t.role}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            testimonials: p.testimonials.map((item, i) =>
                              i === idx ? { ...item, role: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Role"
                        className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                      />
                      <input
                        value={t.company}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            testimonials: p.testimonials.map((item, i) =>
                              i === idx ? { ...item, company: e.target.value } : item
                            ),
                          }))
                        }
                        placeholder="Company"
                        className="rounded-xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            testimonials: p.testimonials.filter((_, i) => i !== idx),
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 9. MEDIA LIBRARY ==================== */}
          {tab === "media" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    Media Library ({draft.mediaLibrary.length} Images)
                  </h2>
                  <p className="text-xs text-[var(--ink-slate)]">
                    Upload real product images (JPG, PNG, WebP, AVIF up to 8MB) for any project.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 rounded-full bg-[var(--neon-orange)] px-5 py-2.5 text-xs font-bold text-[#0F171A] cursor-pointer shadow-sm hover:scale-[1.02]">
                  <Upload className="h-4 w-4" />
                  {uploadingMedia ? "Uploading..." : "Upload Product Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingMedia}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await handleUploadImage(file, file.name);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {draft.mediaLibrary.map((asset) => (
                  <div
                    key={asset.id}
                    className="overflow-hidden rounded-3xl border border-[var(--border-mineral)] bg-white"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--bg-alabaster)]">
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div className="truncate text-xs font-bold text-[var(--ink-obsidian)]">
                        {asset.filename}
                      </div>
                      <div className="truncate font-mono text-[10px] text-[var(--ink-muted)]">
                        {asset.url}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(asset.url);
                            setCopiedUrl(asset.url);
                            setTimeout(() => setCopiedUrl(null), 1600);
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-2.5 py-1 text-[11px] font-semibold cursor-pointer"
                        >
                          {copiedUrl === asset.url ? (
                            <>
                              <Check className="h-3 w-3 text-[var(--teal-deep)]" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy URL
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(asset.id)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 10. PHP & MYSQL DATABASE ==================== */}
          {tab === "database" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border-mineral)] bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">PHP 8.2+ &amp; MySQL 8 Backend Architecture</h2>
                    <p className="text-xs text-[var(--ink-slate)]">
                      Complete relational PHP + MySQL backend included in <code>php-backend/</code>.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                      backend === "php-mysql"
                        ? "bg-[var(--teal-mist)] text-[var(--teal-deep)]"
                        : "bg-[var(--orange-halo)] text-[var(--orange-lacquer)]"
                    }`}
                  >
                    Mode: {backend === "php-mysql" ? "Connected to PHP + MySQL" : "Local Preview Fallback"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-[var(--bg-alabaster)] p-4 space-y-2">
                    <div className="font-bold text-[var(--ink-obsidian)]">
                      Included MySQL Tables (php-backend/database/schema.sql)
                    </div>
                    <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-[var(--teal-deep)]">
                      <li>• admin_users</li>
                      <li>• admin_sessions</li>
                      <li>• site_settings</li>
                      <li>• services</li>
                      <li>• projects</li>
                      <li>• build_steps</li>
                      <li>• testimonials</li>
                      <li>• experiences</li>
                      <li>• skill_groups</li>
                      <li>• contact_messages</li>
                      <li>• media_assets</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-[var(--ink-obsidian)] p-4 text-[#F7F5F0] space-y-2">
                    <div className="font-bold text-[var(--neon-teal)]">
                      cPanel Direct Setup (/public + /app · No .env Needed)
                    </div>
                    <ol className="space-y-1.5 text-white/80 list-decimal list-inside">
                      <li>Upload <code>/public</code> &amp; <code>/app</code> into any cPanel folder (main domain or subdomain).</li>
                      <li>Point your domain/subdomain DocumentRoot directly to <code>/public</code>.</li>
                      <li>Import <code>app/database/schema.sql</code> &amp; <code>seed.sql</code> in phpMyAdmin.</li>
                      <li>Edit MySQL &amp; admin login inside <code>app/config.php</code> — open <code>/app</code>!</li>
                    </ol>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadSql}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--ink-obsidian)] px-5 py-2.5 text-xs font-bold text-[#F7F5F0] cursor-pointer hover:opacity-90"
                  >
                    <Download className="h-4 w-4 text-[var(--neon-teal)]" />
                    Export Live MySQL (.sql)
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-5 py-2.5 text-xs font-bold text-[var(--ink-obsidian)] cursor-pointer hover:border-[var(--teal-deep)]"
                  >
                    <Download className="h-4 w-4" />
                    Download JSON Backup
                  </button>
                  {backend === "local-preview" && (
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-700 cursor-pointer hover:bg-red-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Preview Content
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

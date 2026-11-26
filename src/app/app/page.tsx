"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Lock, LogIn } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminAppPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("admin@sura.dev");
  const [backend, setBackend] = useState<"php-mysql" | "local-preview">("local-preview");

  const [email, setEmail] = useState("admin@sura.dev");
  const [password, setPassword] = useState("admin1234");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (json?.backend) setBackend(json.backend);
        if (res.ok && json?.authenticated) {
          setAuthenticated(true);
          if (json.user?.email) setUserEmail(json.user.email);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Sign in failed.");
      }
      if (json.backend) setBackend(json.backend);
      setUserEmail(json.user?.email || email);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="sunlit-aura flex min-h-screen items-center justify-center p-6">
        <div className="text-sm font-semibold text-[var(--ink-slate)]">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (authenticated) {
    return (
      <AdminDashboard
        userEmail={userEmail}
        backend={backend}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="sunlit-aura flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-slate)] hover:text-[var(--ink-obsidian)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Portfolio Website
        </Link>

        <div className="porcelain-glass dichroic-ring rounded-[32px] p-7 sm:p-9 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--ink-obsidian)] text-[var(--neon-teal)]">
                <Lock className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--teal-mist)] px-3 py-1 text-[11px] font-bold text-[var(--teal-deep)]">
                <Database className="h-3 w-3" />
                {backend === "php-mysql" ? "PHP + MySQL Live" : "PHP + MySQL Ready"}
              </span>
            </div>

            <h1 className="pt-2 text-2xl font-bold text-[var(--ink-obsidian)]">
              Portfolio Admin Panel
            </h1>
            <p className="text-xs text-[var(--ink-slate)] leading-relaxed">
              Manage every section of your website — projects, product images, themes, services,
              about, testimonials, and contact form messages.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-[var(--ink-slate)] mb-1.5"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-mineral)] bg-white px-4 py-3 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[var(--ink-slate)] mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-mineral)] bg-white px-4 py-3 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-[#FF5A1F]/40 bg-[#FFF1E8] px-4 py-2.5 text-xs font-semibold text-[#B83200]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--neon-orange)] px-6 py-3 text-sm font-bold text-[#0F171A] shadow-[0_10px_25px_-10px_rgba(255,90,31,0.65)] transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? "Signing in..." : "Sign In to Admin Panel"}
            </button>
          </form>

          <div className="rounded-2xl border border-[var(--border-mineral)] bg-white/80 p-3.5 text-[11px] text-[var(--ink-slate)]">
            <strong className="text-[var(--ink-obsidian)]">cPanel Database &amp; Login Config:</strong>{" "}
            Configure directly in <code className="font-mono font-semibold">app/config.php</code>{" "}
            (no <code>.env</code> file needed). Preview default:{" "}
            <span className="font-mono">admin@sura.dev</span> /{" "}
            <span className="font-mono">admin1234</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

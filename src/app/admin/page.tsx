"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LegacyAdminRedirectPage() {
  useEffect(() => {
    window.location.replace("/app/");
  }, []);

  return (
    <div className="sunlit-aura flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-3">
        <p className="text-sm font-semibold text-[var(--ink-slate)]">
          Redirecting to Admin Panel (/app)...
        </p>
        <Link
          href="/app"
          className="inline-flex rounded-full bg-[var(--ink-obsidian)] px-5 py-2.5 text-xs font-bold text-[#F7F5F0]"
        >
          Open /app
        </Link>
      </div>
    </div>
  );
}

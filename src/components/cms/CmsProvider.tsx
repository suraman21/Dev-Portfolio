"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import type { CmsData } from "@/types/cms";
import { defaultCmsData } from "@/data/cms-defaults";

declare global {
  interface Window {
    __PORTFOLIO_CMS__?: Partial<CmsData> | null;
    __PORTFOLIO_BACKEND__?: "php-mysql" | "local-preview";
  }
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function mergeCmsPayload(d?: Partial<CmsData> | null): CmsData {
  if (!d) return defaultCmsData;

  const mergedSite = {
    ...defaultCmsData.site,
    ...(d.site || {}),
    faviconUrl:
      d.site?.faviconUrl && d.site.faviconUrl.trim()
        ? d.site.faviconUrl.trim()
        : defaultCmsData.site.faviconUrl,
    heroStats:
      d.site?.heroStats && d.site.heroStats.length > 0
        ? d.site.heroStats
        : defaultCmsData.site.heroStats,
    profileHighlights:
      d.site?.profileHighlights && d.site.profileHighlights.length > 0
        ? d.site.profileHighlights
        : defaultCmsData.site.profileHighlights,
    contactBudgetOptions:
      d.site?.contactBudgetOptions && d.site.contactBudgetOptions.length > 0
        ? d.site.contactBudgetOptions
        : defaultCmsData.site.contactBudgetOptions,
  };

  const mergedAbout = {
    ...defaultCmsData.about,
    ...(d.about || {}),
  };

  return {
    ...defaultCmsData,
    ...d,
    site: mergedSite,
    about: mergedAbout,
    services: d.services && d.services.length > 0 ? d.services : defaultCmsData.services,
    projects: d.projects && d.projects.length > 0 ? d.projects : defaultCmsData.projects,
    buildSteps: d.buildSteps && d.buildSteps.length > 0 ? d.buildSteps : defaultCmsData.buildSteps,
    testimonials:
      d.testimonials && d.testimonials.length > 0 ? d.testimonials : defaultCmsData.testimonials,
    experiences:
      d.experiences && d.experiences.length > 0 ? d.experiences : defaultCmsData.experiences,
    skillGroups:
      d.skillGroups && d.skillGroups.length > 0 ? d.skillGroups : defaultCmsData.skillGroups,
    mediaLibrary:
      d.mediaLibrary && d.mediaLibrary.length > 0 ? d.mediaLibrary : defaultCmsData.mediaLibrary,
  };
}

interface CmsContextValue {
  data: CmsData;
  backend: "php-mysql" | "local-preview";
  /** True during background fetches */
  loading: boolean;
  /**
   * False during static build & before live CMS data is resolved (either synchronously
   * from server-injected `window.__PORTFOLIO_CMS__` on cPanel OR from `/api/cms`).
   * `AppShell` gates public UI rendering on `ready` so default demo data NEVER renders!
   */
  ready: boolean;
  refresh: () => Promise<void>;
  setCmsLocal: (next: CmsData) => void;
}

const CmsContext = createContext<CmsContextValue>({
  data: defaultCmsData,
  backend: "local-preview",
  loading: true,
  ready: false,
  refresh: async () => {},
  setCmsLocal: () => {},
});

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsData>(defaultCmsData);
  const [backend, setBackend] = useState<"php-mysql" | "local-preview">("local-preview");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const setCmsLocal = useCallback((next: CmsData) => {
    const merged = mergeCmsPayload(next);
    setData(merged);
    setReady(true);
    if (typeof window !== "undefined") {
      window.__PORTFOLIO_CMS__ = merged;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) {
        const merged = mergeCmsPayload(json.data as Partial<CmsData>);
        setData(merged);
        if (typeof window !== "undefined") {
          window.__PORTFOLIO_CMS__ = merged;
        }
      }
      if (json?.backend === "php-mysql" || json?.backend === "local-preview") {
        setBackend(json.backend);
      }
    } catch {
      // Offline / unconfigured fallback — gracefully resolves ready in finally
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  // Synchronously ingest live MySQL CMS injected by cPanel `/public/index.php` BEFORE first paint!
  useIsomorphicLayoutEffect(() => {
    const serverCms = window.__PORTFOLIO_CMS__;
    if (serverCms && typeof serverCms === "object") {
      const merged = mergeCmsPayload(serverCms);
      setData(merged);
      if (
        window.__PORTFOLIO_BACKEND__ === "php-mysql" ||
        window.__PORTFOLIO_BACKEND__ === "local-preview"
      ) {
        setBackend(window.__PORTFOLIO_BACKEND__);
      }
      setLoading(false);
      setReady(true);
      return;
    }

    // Fallback (Next.js Node preview or first-time setup): fetch live `/api/cms` before mounting public UI
    refresh();
  }, [refresh]);

  return (
    <CmsContext.Provider value={{ data, backend, loading, ready, refresh, setCmsLocal }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}

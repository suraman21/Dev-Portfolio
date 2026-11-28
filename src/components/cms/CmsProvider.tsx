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
    __CMS_BOOT_FALLBACK__?: ReturnType<typeof setTimeout>;
  }
}

const CMS_CACHE_KEY = "portfolio_cms_cache_v1";

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

function revealBootShield() {
  if (typeof window === "undefined") return;
  if (window.__CMS_BOOT_FALLBACK__) {
    clearTimeout(window.__CMS_BOOT_FALLBACK__);
    window.__CMS_BOOT_FALLBACK__ = undefined;
  }
  document.documentElement.setAttribute("data-cms-boot", "ready");
}

function writeLocalCache(cms: CmsData) {
  try {
    window.localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(cms));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

interface CmsContextValue {
  data: CmsData;
  backend: "php-mysql" | "local-preview";
  loading: boolean;
  refresh: () => Promise<void>;
  setCmsLocal: (next: CmsData) => void;
}

const CmsContext = createContext<CmsContextValue>({
  data: defaultCmsData,
  backend: "local-preview",
  loading: false,
  refresh: async () => {},
  setCmsLocal: () => {},
});

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsData>(defaultCmsData);
  const [backend, setBackend] = useState<"php-mysql" | "local-preview">("local-preview");
  const [loading, setLoading] = useState(true);
  const [bootResolved, setBootResolved] = useState(false);

  const setCmsLocal = useCallback((next: CmsData) => {
    const merged = mergeCmsPayload(next);
    setData(merged);
    if (typeof window !== "undefined") {
      window.__PORTFOLIO_CMS__ = merged;
      writeLocalCache(merged);
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
          writeLocalCache(merged);
        }
      }
      if (json?.backend === "php-mysql" || json?.backend === "local-preview") {
        setBackend(json.backend);
      }
    } catch {
      // Retain server-bootstrapped or default CMS content if offline
    } finally {
      setLoading(false);
      setBootResolved(true);
    }
  }, []);

  // Synchronously ingest server-injected MySQL CMS payload BEFORE the browser paints!
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
      writeLocalCache(merged);
      setLoading(false);
      setBootResolved(true);
      return;
    }

    // Fallback (Next.js Node preview or unconfigured DB): fetch live `/api/cms` before reveal
    refresh();
  }, [refresh]);

  // Reveal the page ONLY AFTER React has committed the live CMS data to the DOM
  useIsomorphicLayoutEffect(() => {
    if (!bootResolved) return;
    revealBootShield();
  }, [bootResolved, data]);

  return (
    <CmsContext.Provider value={{ data, backend, loading, refresh, setCmsLocal }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}

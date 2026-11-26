"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CmsData } from "@/types/cms";
import { defaultCmsData } from "@/data/cms-defaults";

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

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) {
        const d = json.data as Partial<CmsData>;
        const mergedSite = {
          ...defaultCmsData.site,
          ...(d.site || {}),
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
        setData({
          ...defaultCmsData,
          ...d,
          site: mergedSite,
          about: mergedAbout,
          services: d.services && d.services.length > 0 ? d.services : defaultCmsData.services,
          projects: d.projects && d.projects.length > 0 ? d.projects : defaultCmsData.projects,
          buildSteps:
            d.buildSteps && d.buildSteps.length > 0 ? d.buildSteps : defaultCmsData.buildSteps,
          testimonials:
            d.testimonials && d.testimonials.length > 0
              ? d.testimonials
              : defaultCmsData.testimonials,
          experiences:
            d.experiences && d.experiences.length > 0 ? d.experiences : defaultCmsData.experiences,
          skillGroups:
            d.skillGroups && d.skillGroups.length > 0 ? d.skillGroups : defaultCmsData.skillGroups,
          mediaLibrary:
            d.mediaLibrary && d.mediaLibrary.length > 0
              ? d.mediaLibrary
              : defaultCmsData.mediaLibrary,
        });
      }
      if (json?.backend === "php-mysql" || json?.backend === "local-preview") {
        setBackend(json.backend);
      }
    } catch {
      // Retain default CMS content if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CmsContext.Provider value={{ data, backend, loading, refresh, setCmsLocal: setData }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}

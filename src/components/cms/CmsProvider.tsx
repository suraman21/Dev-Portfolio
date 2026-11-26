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
        setData(json.data);
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

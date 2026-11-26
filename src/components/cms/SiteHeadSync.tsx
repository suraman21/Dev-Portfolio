"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCms } from "./CmsProvider";
import { DEFAULT_FAVICON_URL } from "@/data/cms-defaults";

function inferIconMimeType(url: string): string | null {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (clean.endsWith(".svg")) return "image/svg+xml";
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".ico")) return "image/x-icon";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  return null;
}

/**
 * Live Head & Metadata Synchronizer
 * Keeps browser tab `<title>`, `<meta name="description">`, and `<link rel="icon">`
 * 100% synchronized with live CMS `site.name`, `site.role`, `site.faviconUrl`,
 * and active route — including on static cPanel builds where HTML metadata is pre-rendered.
 */
export function SiteHeadSync() {
  const pathname = usePathname() || "/";
  const { data } = useCms();
  const { site, projects } = data;

  useEffect(() => {
    const cleanPath = pathname.replace(/\/+$/, "") || "/";
    let pageTitle = `${site.name} — ${site.role}`;

    if (cleanPath === "/about") {
      pageTitle = `About · ${site.name}`;
    } else if (cleanPath === "/work") {
      pageTitle = `${site.workPageEyebrow || "Selected Work"} · ${site.name}`;
    } else if (cleanPath.startsWith("/work/")) {
      const slug = decodeURIComponent(cleanPath.slice("/work/".length));
      const matched = projects.find((p) => p.slug === slug);
      pageTitle = matched ? `${matched.title} · ${site.name}` : `Case Study · ${site.name}`;
    } else if (cleanPath === "/contact") {
      pageTitle = `Contact · ${site.name}`;
    } else if (cleanPath === "/app" || cleanPath === "/admin") {
      pageTitle = `Admin Panel · ${site.name}`;
    }

    document.title = pageTitle;

    // Keep meta description synced to live developer identity
    const descContent = `${site.name} — ${site.role}. ${site.heroDescription}`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", descContent);

    // Sync browser tab favicon strictly to the dedicated favicon setting (never the profile photo)
    const activeFavicon = site.faviconUrl?.trim() || DEFAULT_FAVICON_URL;
    const mimeType = inferIconMimeType(activeFavicon);
    const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');

    if (existingIcons.length === 0) {
      const link = document.createElement("link");
      link.setAttribute("rel", "icon");
      link.setAttribute("href", activeFavicon);
      if (mimeType) link.setAttribute("type", mimeType);
      document.head.appendChild(link);
    } else {
      existingIcons.forEach((el) => {
        el.setAttribute("href", activeFavicon);
        if (mimeType) {
          el.setAttribute("type", mimeType);
        } else {
          el.removeAttribute("type");
        }
      });
    }
  }, [
    pathname,
    site.name,
    site.role,
    site.heroDescription,
    site.workPageEyebrow,
    site.faviconUrl,
    projects,
  ]);

  return null;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCms } from "./CmsProvider";

/**
 * Live Head & Metadata Synchronizer
 * Keeps browser tab `<title>`, `<meta name="description">`, and `<link rel="icon">`
 * 100% synchronized with live CMS `site.name`, `site.role`, `site.profileImage`,
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

    // Sync browser tab favicon to developer profile image when available
    if (site.profileImage) {
      let iconLink = document.querySelector('link[rel="icon"]');
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.setAttribute("rel", "icon");
        document.head.appendChild(iconLink);
      }
      iconLink.setAttribute("href", site.profileImage);
    }
  }, [
    pathname,
    site.name,
    site.role,
    site.heroDescription,
    site.workPageEyebrow,
    site.profileImage,
    projects,
  ]);

  return null;
}

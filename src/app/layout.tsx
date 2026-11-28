import type { Metadata, Viewport } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import { AppShell } from "@/components/cinema/AppShell";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: `${siteConfig.name} — ${siteConfig.role}. Designing and building fast SaaS products, web apps, and modern luxury websites.`,
  icons: {
    icon: [{ url: "/images/favicons/code-brackets.svg", type: "image/svg+xml" }],
    shortcut: "/images/favicons/code-brackets.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F0",
};

/**
 * Runs synchronously before first paint:
 * Keeps prerendered static fallback HTML hidden behind warm alabaster `#F7F5F0`
 * until `CmsProvider` applies the live Admin Panel / MySQL CMS payload (either
 * synchronously from `window.__PORTFOLIO_CMS__` on cPanel or from `/api/cms`).
 * Guarantees ZERO flash of default demo data or default images on reload/hard refresh.
 */
const CMS_BOOT_SHIELD_SCRIPT = `(function(){try{var p=location.pathname||"/";if(/^\\/(app|admin)(\\/|$)/.test(p)){document.documentElement.setAttribute("data-cms-boot","ready");return;}document.documentElement.setAttribute("data-cms-boot","pending");window.__CMS_BOOT_FALLBACK__=setTimeout(function(){document.documentElement.setAttribute("data-cms-boot","ready");},2500);}catch(e){document.documentElement.setAttribute("data-cms-boot","ready");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          id="cms-boot-shield"
          dangerouslySetInnerHTML={{
            __html: `html[data-cms-boot="pending"] body{visibility:hidden!important;opacity:0!important;background:#F7F5F0!important;}html[data-cms-boot="ready"] body{visibility:visible;opacity:1;transition:opacity 150ms ease-out;}`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: CMS_BOOT_SHIELD_SCRIPT }} />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `html[data-cms-boot="pending"] body{visibility:visible!important;opacity:1!important;}`,
            }}
          />
        </noscript>
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

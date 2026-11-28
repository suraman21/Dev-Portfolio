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

/**
 * Neutral build-time metadata — dynamically rewritten server-side by `/public/index.php`
 * (from live MySQL CMS on cPanel) and synced client-side by `SiteHeadSync`.
 * Zero hardcoded demo names or demo images ever ship in static HTML.
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Software Engineering & Web Development Portfolio",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

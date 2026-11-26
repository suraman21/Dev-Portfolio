import type { SiteSettings } from "@/types/cms";

/**
 * Normalizes a WhatsApp phone number or URL into a direct chat link (`https://wa.me/...`).
 */
export function buildWhatsAppUrl(raw?: string): string | null {
  const val = raw?.trim();
  if (!val) return null;
  if (/^https?:\/\//i.test(val)) return val;
  const digits = val.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

/**
 * Normalizes a Telegram username (`@user`, `user`) or URL into a direct `https://t.me/...` link.
 */
export function buildTelegramUrl(raw?: string): string | null {
  const val = raw?.trim();
  if (!val) return null;
  if (/^https?:\/\//i.test(val)) return val;
  const cleanHandle = val.replace(/^@+/, "").replace(/^t\.me\//i, "").trim();
  if (!cleanHandle) return null;
  return `https://t.me/${cleanHandle}`;
}

/**
 * Resolves enabled social & messaging channels strictly honoring Admin Panel On/Off toggles.
 */
export function resolveActiveSocials(site: SiteSettings) {
  const githubUrl = site.showGithub !== false && site.github?.trim() ? site.github.trim() : null;
  const linkedinUrl =
    site.showLinkedin !== false && site.linkedin?.trim() ? site.linkedin.trim() : null;
  const whatsappUrl =
    site.showWhatsapp !== false ? buildWhatsAppUrl(site.whatsapp) : null;
  const telegramUrl =
    site.showTelegram !== false ? buildTelegramUrl(site.telegram) : null;

  return {
    githubUrl,
    linkedinUrl,
    whatsappUrl,
    telegramUrl,
  };
}

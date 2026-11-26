"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { resolveActiveSocials } from "@/lib/social-links";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .15 5.34.15 11.91c0 2.1.55 4.15 1.59 5.96L0 24l6.31-1.65a11.86 11.86 0 0 0 5.75 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.46-8.43Zm-8.46 18.32h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.84 9.84 0 0 1-1.52-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 6.99 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.88-9.88 9.88Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function TelegramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm5.56 8.16-1.88 8.87c-.14.63-.52.78-1.05.49l-2.9-2.14-1.4 1.35c-.15.15-.29.29-.59.29l.21-2.95 5.37-4.85c.23-.21-.05-.32-.36-.12l-6.64 4.18-2.86-.89c-.62-.2-.63-.62.13-.92l11.18-4.31c.52-.19.97.12.79.95Z" />
    </svg>
  );
}

/**
 * Floating Direct Contact Popup (WhatsApp & Telegram)
 * Controlled from `/app` -> Profile & Brand -> Social & Direct Messaging.
 */
export function FloatingContactWidget() {
  const { data } = useCms();
  const { site } = data;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const { whatsappUrl, telegramUrl } = resolveActiveSocials(site);
  const hasChannel = Boolean(whatsappUrl || telegramUrl);
  const enabled = site.showFloatingContact !== false && hasChannel;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className="fixed bottom-[82px] right-4 md:bottom-7 md:right-7 z-40 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="porcelain-glass dichroic-ring w-[256px] rounded-[24px] p-3.5 shadow-[0_24px_56px_-16px_rgba(15,23,26,0.28)]"
          >
            <div className="px-2 pb-2.5 border-b border-[var(--border-mineral)]">
              <div className="text-xs font-bold text-[var(--ink-obsidian)]">
                Message {site.name}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--ink-slate)]">
                Direct chat — opens your app instantly
              </div>
            </div>

            <div className="mt-2.5 space-y-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-[#25D366]/30 bg-white/95 p-2.5 transition-all hover:border-[#25D366] hover:bg-[#F2FDF6] hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--ink-obsidian)]">WhatsApp</div>
                      <div className="truncate text-[11px] text-[var(--ink-slate)]">
                        Chat directly
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}

              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-[#229ED9]/30 bg-white/95 p-2.5 transition-all hover:border-[#229ED9] hover:bg-[#F0F9FF] hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#229ED9] text-white shadow-sm">
                      <TelegramIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--ink-obsidian)]">Telegram</div>
                      <div className="truncate text-[11px] text-[var(--ink-slate)]">
                        Direct message
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#0284C7] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Contact Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close direct chat options" : "Open WhatsApp and Telegram contact"}
        className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[var(--ink-obsidian)] text-[#F7F5F0] shadow-[0_18px_42px_-10px_rgba(15,23,26,0.48)] ring-2 ring-[var(--neon-teal)]/70 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span
          aria-hidden="true"
          className="pulse-teal absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#F7F5F0] bg-[var(--neon-teal)]"
        />
        {open ? (
          <X className="h-5 w-5 text-[var(--neon-orange)]" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--neon-teal)]" />
        )}
      </button>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Clock, Copy, Mail, MapPin, Send } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { resolveActiveSocials } from "@/lib/social-links";

const BUDGET_OPTIONS = [
  "Not sure yet / Let's discuss",
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $35,000",
  "$35,000+",
  "Full-Time Compensation",
];

function ContactFormInner() {
  const { data } = useCms();
  const { site, services } = data;
  const searchParams = useSearchParams();
  const { githubUrl, linkedinUrl, whatsappUrl, telegramUrl } = resolveActiveSocials(site);

  const activeServices = useMemo(
    () => services.filter((s) => s.active),
    [services]
  );

  const budgetOptions = useMemo(
    () =>
      site.contactBudgetOptions && site.contactBudgetOptions.length > 0
        ? site.contactBudgetOptions
        : BUDGET_OPTIONS,
    [site.contactBudgetOptions]
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [budget, setBudget] = useState<string>(budgetOptions[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync default or ?service=... dropdown choice whenever active services load
  useEffect(() => {
    const querySvc = searchParams.get("service");
    if (querySvc && activeServices.some((s) => s.id === querySvc)) {
      setSelectedServiceId(querySvc);
      return;
    }
    if (!selectedServiceId && activeServices.length > 0) {
      setSelectedServiceId(activeServices[0].id);
    } else if (
      selectedServiceId &&
      activeServices.length > 0 &&
      !activeServices.some((s) => s.id === selectedServiceId)
    ) {
      setSelectedServiceId(activeServices[0].id);
    }
  }, [activeServices, searchParams, selectedServiceId]);

  const currentService =
    activeServices.find((s) => s.id === selectedServiceId) || activeServices[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          serviceId: currentService?.id,
          serviceName: currentService?.name || "General Inquiry",
          budget,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Could not send message.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sunlit-aura pt-24 pb-24 md:pt-36">
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--teal-deep)]">
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              {site.availability}
            </div>

            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              {site.contactHeadline}{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                {site.contactHighlight}
              </span>
            </h1>

            <p className="text-body-lg text-[var(--ink-slate)]">{site.contactDescription}</p>

            <div className="porcelain-card rounded-3xl p-6 space-y-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[var(--ink-slate)]">
                  <Mail className="h-4 w-4 text-[var(--teal-deep)]" /> Direct Email
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--neon-teal)] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--teal-deep)]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[var(--teal-deep)]" /> {site.email}
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-mineral)] pt-3">
                <span className="inline-flex items-center gap-2 text-[var(--ink-slate)]">
                  <MapPin className="h-4 w-4 text-[var(--orange-lacquer)]" /> Location
                </span>
                <span className="font-semibold text-[var(--ink-obsidian)]">{site.location}</span>
              </div>

              {(whatsappUrl || telegramUrl || githubUrl || linkedinUrl) && (
                <div className="border-t border-[var(--border-mineral)] pt-3 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Direct Channels
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/35 bg-[#F2FDF6] px-3.5 py-1.5 text-xs font-semibold text-[#15803D] hover:border-[#25D366]"
                      >
                        WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {telegramUrl && (
                      <a
                        href={telegramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#229ED9]/35 bg-[#F0F9FF] px-3.5 py-1.5 text-xs font-semibold text-[#0369A1] hover:border-[#229ED9]"
                      >
                        Telegram <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--teal-deep)]"
                      >
                        GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-obsidian)] hover:border-[var(--teal-deep)]"
                      >
                        LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Contact Form with Clean Service Dropdown */}
          <div className="lg:col-span-7">
            <div className="porcelain-card dichroic-ring rounded-[28px] sm:rounded-[32px] p-6 sm:p-10">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--teal-mist)] border border-[var(--neon-teal)]">
                    <Check className="h-7 w-7 text-[var(--teal-deep)]" />
                  </div>
                  <h2 className="text-h3 font-bold text-[var(--ink-obsidian)]">
                    Message received — thank you, {name}.
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-[var(--ink-slate)]">
                    Your inquiry for{" "}
                    <strong className="text-[var(--ink-obsidian)]">
                      {currentService?.name || "your project"}
                    </strong>{" "}
                    has been saved directly to the inbox. I&apos;ll reply to{" "}
                    <strong className="text-[var(--ink-obsidian)]">{email}</strong> soon.
                  </p>
                  <div className="pt-2">
                    <MagneticButton
                      onClick={() => {
                        setSent(false);
                        setMessage("");
                      }}
                      variant="teal"
                    >
                      Send Another Message
                    </MagneticButton>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Selector Dropdown (Admin-Managed!) */}
                  <div>
                    <label
                      htmlFor="service-select"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)] mb-2"
                    >
                      Select a Service *
                    </label>
                    <div className="relative">
                      <select
                        id="service-select"
                        required
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] py-3.5 pl-4 pr-11 text-sm font-semibold text-[var(--ink-obsidian)] transition-colors focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none cursor-pointer"
                      >
                        {activeServices.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name}
                            {svc.timeline ? ` (${svc.timeline})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-slate)]" />
                    </div>

                    {/* Helpful Selected Service Detail Pill */}
                    {currentService && (
                      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-[var(--border-mineral)]/80 bg-white/85 px-4 py-3 text-xs">
                        <p className="text-[var(--ink-slate)] leading-relaxed">
                          {currentService.shortDescription}
                        </p>
                        {currentService.timeline && (
                          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--teal-mist)] px-2.5 py-1 font-semibold text-[var(--teal-deep)]">
                            <Clock className="h-3 w-3" /> {currentService.timeline}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Estimated Budget Dropdown */}
                  <div>
                    <label
                      htmlFor="budget-select"
                      className="block text-xs font-semibold text-[var(--ink-slate)] mb-1.5"
                    >
                      Estimated Budget / Engagement
                    </label>
                    <div className="relative">
                      <select
                        id="budget-select"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] py-3.5 pl-4 pr-11 text-sm text-[var(--ink-obsidian)] transition-colors focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none cursor-pointer"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-slate)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-[var(--ink-slate)] mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-[var(--ink-slate)] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold text-[var(--ink-slate)] mb-1.5"
                    >
                      Project or Role Details *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me a little about what you're building, your goals, or your timeline..."
                      className="w-full resize-none rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-[#FF5A1F]/40 bg-[#FFF1E8] px-4 py-3 text-xs font-semibold text-[#B83200]">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <span className="text-xs text-[var(--ink-muted)]">{site.contactReplyNote}</span>
                    <MagneticButton type="submit" variant="primary" disabled={submitting}>
                      {submitting ? "Sending..." : site.contactSubmitLabel || "Send Message"}{" "}
                      <Send className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="sunlit-aura min-h-[70vh] pt-36" />}>
      <ContactFormInner />
    </Suspense>
  );
}

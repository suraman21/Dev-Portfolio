"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Mail, MapPin, Send } from "lucide-react";
import { siteConfig } from "@/data/site";
import { MagneticButton } from "@/components/ui/MagneticButton";

const inquiryTypes = [
  "Full-Time Senior / Staff Role",
  "SaaS Product or Dashboard",
  "Luxury Website / Redesign",
  "Technical Advisory",
];

export default function ContactPage() {
  const [topic, setTopic] = useState(inquiryTypes[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSent(true);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sunlit-aura pt-28 pb-24 md:pt-36">
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-mineral)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--teal-deep)]">
              <span className="pulse-teal h-2 w-2 rounded-full bg-[var(--neon-teal)]" />
              {siteConfig.availability}
            </div>

            <h1 className="text-hero font-bold text-[var(--ink-obsidian)]">
              Let&apos;s work{" "}
              <span className="font-editorial italic font-normal text-[var(--orange-lacquer)]">
                together.
              </span>
            </h1>

            <p className="text-body-lg text-[var(--ink-slate)]">
              Share a quick overview of your product, role, or timeline. I reply personally to every
              message within 24 hours.
            </p>

            <div className="porcelain-card rounded-3xl p-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
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
                      <Copy className="h-3.5 w-3.5 text-[var(--teal-deep)]" /> {siteConfig.email}
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-mineral)] pt-3">
                <span className="inline-flex items-center gap-2 text-[var(--ink-slate)]">
                  <MapPin className="h-4 w-4 text-[var(--orange-lacquer)]" /> Location
                </span>
                <span className="font-semibold text-[var(--ink-obsidian)]">
                  {siteConfig.location}
                </span>
              </div>
            </div>
          </div>

          {/* Right Clean Contact Form */}
          <div className="lg:col-span-7">
            <div className="porcelain-card dichroic-ring rounded-[32px] p-6 sm:p-10">
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
                    Message sent — thank you, {name}.
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-[var(--ink-slate)]">
                    I&apos;ve received your note about{" "}
                    <strong className="text-[var(--ink-obsidian)]">{topic}</strong> and will reply
                    to <strong className="text-[var(--ink-obsidian)]">{email}</strong> within 24
                    hours.
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)] mb-3">
                      What can I help you with?
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {inquiryTypes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTopic(item)}
                          className={`rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                            topic === item
                              ? "border-[var(--ink-obsidian)] bg-[var(--ink-obsidian)] text-[#F7F5F0]"
                              : "border-[var(--border-mineral)] bg-[var(--bg-alabaster)] text-[var(--ink-slate)] hover:border-[var(--neon-teal)]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
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
                      Project or Role Details
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me a little about what you're building, your timeline, or the role..."
                      className="w-full resize-none rounded-2xl border border-[var(--border-mineral)] bg-[var(--bg-alabaster)] px-4 py-3.5 text-sm text-[var(--ink-obsidian)] focus:border-[var(--teal-deep)] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <span className="text-xs text-[var(--ink-muted)]">
                      Usually replies within 24 hours
                    </span>
                    <MagneticButton type="submit" variant="primary">
                      Send Message <Send className="h-4 w-4" />
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

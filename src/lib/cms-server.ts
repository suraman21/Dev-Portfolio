import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { CmsData, ContactMessage, MediaAsset } from "@/types/cms";
import { defaultCmsData, defaultContactMessages } from "@/data/cms-defaults";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "cms-store.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

interface LocalStore {
  cms: CmsData;
  messages: ContactMessage[];
  sessions: { tokenHash: string; email: string; expiresAt: number }[];
}

export function getPhpApiUrl(): string | null {
  const url = process.env.PHP_API_URL?.trim();
  return url ? url.replace(/\/+$/, "") : null;
}

export function getBackendMode(): "php-mysql" | "local-preview" {
  return getPhpApiUrl() ? "php-mysql" : "local-preview";
}

function ensureLocalStore(): LocalStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: LocalStore = {
      cms: structuredClone(defaultCmsData),
      messages: structuredClone(defaultContactMessages),
      sessions: [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_PATH, "utf8")) as Partial<LocalStore>;
    return {
      cms: {
        ...structuredClone(defaultCmsData),
        ...(parsed.cms || {}),
        site: {
          ...defaultCmsData.site,
          ...(parsed.cms?.site || {}),
        },
        about: {
          ...defaultCmsData.about,
          ...(parsed.cms?.about || {}),
        },
      },
      messages: Array.isArray(parsed.messages)
        ? parsed.messages
        : structuredClone(defaultContactMessages),
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return {
      cms: structuredClone(defaultCmsData),
      messages: structuredClone(defaultContactMessages),
      sessions: [],
    };
  }
}

function writeLocalStore(store: LocalStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value || null;
}

export async function verifyAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
  token?: string;
}> {
  const token = await getSessionToken();
  if (!token) return { authenticated: false };

  const phpUrl = getPhpApiUrl();
  if (phpUrl) {
    try {
      const res = await fetch(`${phpUrl}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return { authenticated: false };
      const data = await res.json();
      return { authenticated: true, email: data.user?.email, token };
    } catch {
      return { authenticated: false };
    }
  }

  const store = ensureLocalStore();
  const tokenHash = sha256(token);
  const now = Date.now();
  const valid = store.sessions.find((s) => s.tokenHash === tokenHash && s.expiresAt > now);
  if (!valid) return { authenticated: false };
  return { authenticated: true, email: valid.email, token };
}

export async function loginAdmin(email: string, password: string): Promise<{
  ok: boolean;
  token?: string;
  email?: string;
  error?: string;
}> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl) {
    const res = await fetch(`${phpUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      return { ok: false, error: data.error || "Invalid credentials." };
    }
    return { ok: true, token: data.token, email: data.user?.email || email };
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@sura.dev").toLowerCase().trim();
  const expectedPass = process.env.ADMIN_PASSWORD || "admin1234";

  if (email.toLowerCase().trim() !== expectedEmail || password !== expectedPass) {
    return { ok: false, error: "Invalid email or password." };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const store = ensureLocalStore();
  const now = Date.now();
  store.sessions = store.sessions.filter((s) => s.expiresAt > now);
  store.sessions.push({
    tokenHash: sha256(rawToken),
    email: expectedEmail,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  });
  writeLocalStore(store);

  return { ok: true, token: rawToken, email: expectedEmail };
}

export async function logoutAdmin(): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;

  const phpUrl = getPhpApiUrl();
  if (phpUrl) {
    await fetch(`${phpUrl}/api/admin/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
    return;
  }

  const store = ensureLocalStore();
  const tokenHash = sha256(token);
  store.sessions = store.sessions.filter((s) => s.tokenHash !== tokenHash);
  writeLocalStore(store);
}

export async function readCmsData(): Promise<CmsData> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl) {
    try {
      const res = await fetch(`${phpUrl}/api/cms`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return {
            ...structuredClone(defaultCmsData),
            ...json.data,
            site: { ...defaultCmsData.site, ...(json.data.site || {}) },
            about: { ...defaultCmsData.about, ...(json.data.about || {}) },
          };
        }
      }
    } catch {
      // Fall through cleanly if PHP backend is unreachable during build
    }
  }
  return ensureLocalStore().cms;
}

export async function saveCmsData(
  patch: Partial<CmsData>,
  token?: string
): Promise<CmsData> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl && token) {
    const res = await fetch(`${phpUrl}/api/admin/cms`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "PHP MySQL backend rejected save.");
    }
    return json.data;
  }

  const store = ensureLocalStore();
  store.cms = {
    ...store.cms,
    ...patch,
    site: patch.site ? { ...store.cms.site, ...patch.site } : store.cms.site,
    about: patch.about ? { ...store.cms.about, ...patch.about } : store.cms.about,
  };
  writeLocalStore(store);
  return store.cms;
}

export async function resetLocalCms(): Promise<CmsData> {
  const store = ensureLocalStore();
  store.cms = structuredClone(defaultCmsData);
  writeLocalStore(store);
  return store.cms;
}

export async function createContactSubmission(input: {
  name: string;
  email: string;
  serviceId?: string;
  serviceName: string;
  budget?: string;
  message: string;
}): Promise<ContactMessage> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl) {
    const res = await fetch(`${phpUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Could not submit message.");
    return json.message;
  }

  const store = ensureLocalStore();
  const msg: ContactMessage = {
    id: `msg-${crypto.randomBytes(6).toString("hex")}`,
    name: input.name.trim(),
    email: input.email.trim(),
    serviceId: input.serviceId,
    serviceName: input.serviceName.trim(),
    budget: input.budget?.trim() || "",
    message: input.message.trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  store.messages.unshift(msg);
  writeLocalStore(store);
  return msg;
}

export async function listContactMessages(token?: string): Promise<ContactMessage[]> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl && token) {
    const res = await fetch(`${phpUrl}/api/admin/messages`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load messages.");
    return json.messages || [];
  }
  return ensureLocalStore().messages;
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessage["status"],
  token?: string
): Promise<boolean> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl && token) {
    const res = await fetch(`${phpUrl}/api/admin/messages/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    return res.ok;
  }

  const store = ensureLocalStore();
  const target = store.messages.find((m) => m.id === id);
  if (!target) return false;
  target.status = status;
  writeLocalStore(store);
  return true;
}

export async function deleteContactMessage(id: string, token?: string): Promise<boolean> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl && token) {
    const res = await fetch(`${phpUrl}/api/admin/messages/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  }

  const store = ensureLocalStore();
  const before = store.messages.length;
  store.messages = store.messages.filter((m) => m.id !== id);
  writeLocalStore(store);
  return store.messages.length < before;
}

export async function saveUploadedMedia(
  file: File,
  alt: string,
  token?: string
): Promise<MediaAsset> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl && token) {
    const form = new FormData();
    form.append("file", file);
    form.append("alt", alt);
    const res = await fetch(`${phpUrl}/api/admin/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Image upload failed.");
    return json.asset;
  }

  const allowed: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  const ext = allowed[file.type];
  if (!ext) {
    throw new Error("Unsupported image format. Upload JPG, PNG, WebP, GIF, or AVIF.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image exceeds 8MB limit.");
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const baseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "product-image";
  const filename = `${baseName}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

  const asset: MediaAsset = {
    id: `media-${crypto.randomBytes(5).toString("hex")}`,
    filename,
    url: `/uploads/${filename}`,
    alt: alt.trim() || baseName,
    mimeType: file.type,
    sizeBytes: file.size,
    createdAt: new Date().toISOString(),
  };

  const store = ensureLocalStore();
  store.cms.mediaLibrary.unshift(asset);
  writeLocalStore(store);

  return asset;
}

export async function deleteMediaAsset(id: string, token?: string): Promise<boolean> {
  const phpUrl = getPhpApiUrl();
  if (phpUrl && token) {
    const res = await fetch(`${phpUrl}/api/admin/media/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  }

  const store = ensureLocalStore();
  const found = store.cms.mediaLibrary.find((m) => m.id === id);
  if (!found) return false;

  if (found.url.startsWith("/uploads/")) {
    const filePath = path.join(UPLOAD_DIR, path.basename(found.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  store.cms.mediaLibrary = store.cms.mediaLibrary.filter((m) => m.id !== id);
  writeLocalStore(store);
  return true;
}

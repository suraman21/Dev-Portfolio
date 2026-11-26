import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, logoutAdmin } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function POST() {
  await logoutAdmin();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}

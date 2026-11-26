import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getBackendMode, loginAdmin } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "");
    const password = String(body?.password || "");

    const result = await loginAdmin(email, password);
    if (!result.ok || !result.token) {
      return NextResponse.json(
        { error: result.error || "Invalid credentials." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      ok: true,
      user: { email: result.email },
      backend: getBackendMode(),
    });

    res.cookies.set(ADMIN_SESSION_COOKIE, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed." },
      { status: 500 }
    );
  }
}

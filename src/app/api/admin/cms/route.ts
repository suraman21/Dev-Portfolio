import { NextResponse } from "next/server";
import {
  getBackendMode,
  resetLocalCms,
  saveCmsData,
  verifyAdminSession,
} from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (body?.__reset === true) {
      const data = await resetLocalCms();
      return NextResponse.json({ ok: true, data, backend: getBackendMode() });
    }
    const data = await saveCmsData(body, session.token);
    return NextResponse.json({ ok: true, data, backend: getBackendMode() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save CMS changes." },
      { status: 500 }
    );
  }
}

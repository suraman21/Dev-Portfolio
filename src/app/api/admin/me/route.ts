import { NextResponse } from "next/server";
import { getBackendMode, verifyAdminSession } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json(
      { authenticated: false, backend: getBackendMode() },
      { status: 401 }
    );
  }
  return NextResponse.json({
    authenticated: true,
    user: { email: session.email },
    backend: getBackendMode(),
  });
}

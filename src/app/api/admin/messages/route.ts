import { NextResponse } from "next/server";
import { listContactMessages, verifyAdminSession } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const messages = await listContactMessages(session.token);
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load inbox." },
      { status: 500 }
    );
  }
}

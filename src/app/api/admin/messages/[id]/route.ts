import { NextResponse } from "next/server";
import {
  deleteContactMessage,
  updateContactMessageStatus,
  verifyAdminSession,
} from "@/lib/cms-server";
import type { ContactMessageStatus } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await req.json();
  const status = String(body?.status || "read") as ContactMessageStatus;
  const ok = await updateContactMessageStatus(id, status, session.token);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const ok = await deleteContactMessage(id, session.token);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

import { NextResponse } from "next/server";
import { deleteMediaAsset, verifyAdminSession } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const ok = await deleteMediaAsset(id, session.token);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

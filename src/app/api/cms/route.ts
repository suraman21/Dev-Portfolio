import { NextResponse } from "next/server";
import { getBackendMode, readCmsData } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readCmsData();
    return NextResponse.json(
      { data, backend: getBackendMode() },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load CMS data." },
      { status: 500 }
    );
  }
}

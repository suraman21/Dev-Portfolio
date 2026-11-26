import { NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const serviceName = String(body?.serviceName || "").trim();
    const serviceId = body?.serviceId ? String(body.serviceId) : undefined;
    const budget = body?.budget ? String(body.budget) : "";
    const message = String(body?.message || "").trim();

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid name and email address." },
        { status: 422 }
      );
    }
    if (!serviceName) {
      return NextResponse.json(
        { error: "Please select a service from the dropdown." },
        { status: 422 }
      );
    }

    const saved = await createContactSubmission({
      name,
      email,
      serviceId,
      serviceName,
      budget,
      message,
    });

    return NextResponse.json({ ok: true, message: saved }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to submit contact form." },
      { status: 500 }
    );
  }
}

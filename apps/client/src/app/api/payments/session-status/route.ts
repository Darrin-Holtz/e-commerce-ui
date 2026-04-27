import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const paymentServiceUrl =
    process.env.PAYMENT_SERVICE_INTERNAL_URL || "http://localhost:8002";

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(
      `${paymentServiceUrl}/sessions/${encodeURIComponent(sessionId)}`,
      { cache: "no-store" }
    );
  } catch (err) {
    console.error("[session-status] Payment service unreachable:", err);
    return NextResponse.json(
      { error: "Payment service is unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const data = await upstreamResponse.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstreamResponse.status });
}

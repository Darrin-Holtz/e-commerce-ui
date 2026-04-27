import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken();

  if (!token) {
    return NextResponse.json(
      { error: "Could not obtain session token" },
      { status: 401 }
    );
  }

  const paymentServiceUrl =
    process.env.PAYMENT_SERVICE_INTERNAL_URL || "http://localhost:8002";

  const bodyJson = await req.json();
  const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.nextUrl.host;
  const returnUrl = `${proto}://${host}/return?session_id={CHECKOUT_SESSION_ID}`;
  const body = JSON.stringify({ ...bodyJson, returnUrl });

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(
      `${paymentServiceUrl}/sessions/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
        cache: "no-store",
      }
    );
  } catch (err) {
    console.error("[create-checkout-session] Payment service unreachable:", err);
    return NextResponse.json(
      { error: "Payment service is unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const contentType = upstreamResponse.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await upstreamResponse.json();
    return NextResponse.json(data, { status: upstreamResponse.status });
  }

  const text = await upstreamResponse.text();
  return new NextResponse(text, {
    status: upstreamResponse.status,
    headers: { "Content-Type": "text/plain" },
  });
}
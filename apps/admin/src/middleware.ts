import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)","/unauthorized(.*)"]);

const authorizedParties = [
  "http://localhost:3001",
  process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-3001.app.github.dev`
    : undefined,
].filter(Boolean) as string[];

// In GitHub Codespaces the tunnel relay attaches a Microsoft/Azure Bearer
// token in the Authorization header for forwarded requests. Clerk would
// otherwise try to validate it as a session token (token-carrier=header)
// and fail with `jwk-kid-mismatch`. Strip it so Clerk uses the cookie.
function stripCodespacesAuthHeader(req: NextRequest) {
  const authz = req.headers.get("authorization");
  if (authz && authz.startsWith("Bearer ")) {
    try {
      const payloadB64 = authz.slice(7).split(".")[1];
      if (payloadB64) {
        const payload = JSON.parse(
          Buffer.from(payloadB64, "base64").toString("utf8")
        );
        if (
          typeof payload.iss === "string" &&
          payload.iss.includes("sts.windows.net")
        ) {
          req.headers.delete("authorization");
        }
      }
    } catch {
      // ignore — not a JWT we recognise
    }
  }
}

const clerk = clerkMiddleware(async (auth, req) => {
  const a = await auth();
  console.log("[mw]", req.nextUrl.pathname, "userId:", a.userId, "authz:", req.headers.get("authorization")?.slice(0, 30) ?? "none", "hasSession:", req.cookies.has("__session"), "reason:", a.debug?.()?.reason);

  // Redirect already-signed-in users away from the sign-in page
  if (a.userId && req.nextUrl.pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicRoute(req)) {
    // Only check authentication here. Role-based authorization is handled
    // in the dashboard layout using currentUser() for fresh, reliable data.
    await auth.protect();
  }
}, { authorizedParties });

export default function middleware(req: NextRequest, evt: NextFetchEvent) {
  // Must run BEFORE clerkMiddleware reads the request
  stripCodespacesAuthHeader(req);
  return clerk(req, evt);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
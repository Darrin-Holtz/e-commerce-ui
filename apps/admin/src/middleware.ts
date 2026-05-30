import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse, type NextFetchEvent } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)","/unauthorized(.*)"]);

const authorizedParties = [
  "http://localhost:3001",
  process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-3001.app.github.dev`
    : undefined,
].filter(Boolean) as string[];

const clerk = clerkMiddleware(async (auth, req) => {
  const a = await auth();

  // Redirect already-signed-in users away from the sign-in page
  if (a.userId && req.nextUrl.pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  // Let Clerk return its own NextResponse so its `x-middleware-*` override
  // headers reach downstream RSCs (otherwise `auth()` in server components
  // throws "Clerk can't detect usage of clerkMiddleware()").
}, { authorizedParties });

// GitHub Codespaces previously injected an Azure AD `Authorization: Bearer`
// header on proxied requests, which Clerk would mistakenly try to verify
// (jwk-kid-mismatch) and ignore the valid `__session` cookie. We strip that
// header before handing the request to clerkMiddleware. We must NOT touch
// Clerk's own response headers afterwards — Clerk uses an
// `x-middleware-override-headers` protocol to signal "middleware ran" to
// downstream RSCs, and overwriting it breaks `auth()` in server components
// with: "Clerk can't detect usage of clerkMiddleware()".
export default function middleware(req: NextRequest, evt: NextFetchEvent) {
  if (!req.headers.has("authorization")) {
    return clerk(req, evt);
  }
  const headers = new Headers(req.headers);
  headers.delete("authorization");
  return clerk(new NextRequest(req, { headers }), evt);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
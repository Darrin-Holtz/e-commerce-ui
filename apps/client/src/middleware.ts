import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

const getSafeRedirectPath = (rawRedirectUrl?: string | null) => {
  if (!rawRedirectUrl) return '/'

  try {
    const decodedRedirect = decodeURIComponent(rawRedirectUrl)
    const parsedPath = decodedRedirect.startsWith('/')
      ? decodedRedirect
      : `${new URL(decodedRedirect).pathname}${new URL(decodedRedirect).search}${new URL(decodedRedirect).hash}`

    if (!parsedPath || parsedPath.startsWith('/sign-in') || parsedPath.startsWith('/sign-up')) {
      return '/'
    }

    return parsedPath
  } catch {
    return '/'
  }
}

const clerkHandler = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (isPublicRoute(req) && userId) {
    const redirectPath = getSafeRedirectPath(req.nextUrl.searchParams.get('redirect_url'))
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

// GitHub Codespaces injects an Azure AD Authorization: Bearer header on every proxied
// request. Clerk v7 hardcodes acceptsToken:'any' so it picks up that foreign token,
// fails JWKS validation (jwk-kid-mismatch), and ignores the valid __session cookie.
// Strip the Authorization header before Clerk sees the request.
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const headers = new Headers(req.headers)
  headers.delete('authorization')
  return clerkHandler(new NextRequest(req, { headers }), event)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
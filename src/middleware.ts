// middleware.ts
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { routing } from './i18n/routing'

// Let next-intl create its own middleware based on your routing
const intlMiddleware = createMiddleware(routing)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1) Your old behavior: redirect root "/" -> "/sl"
  if (pathname === '/' || pathname === '') {
    const url = req.nextUrl.clone()
    url.pathname = `/${routing.defaultLocale}` // "sl"
    return NextResponse.redirect(url)
  }

  // 2) For all other matched routes, let next-intl handle locale parsing
  return intlMiddleware(req)
}

// Only run on your frontend routes, NOT on assets, api, or admin
export const config = {
  matcher: [
    '/', // root
    '/((?!api|_next|.*\\..*|admin).*)', // everything except api, _next, static files, admin
  ],
}

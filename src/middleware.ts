import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // If it's exactly root, send to /sl
  if (pathname === '/' || pathname === '') {
    const url = req.nextUrl.clone()
    url.pathname = '/sl'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Match all paths (you can narrow this if needed)
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}

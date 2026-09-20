import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'paytrack_session'

// Fast-path unauthenticated navigation to login. The protected layout validates
// the signed session on the server before rendering any workspace content.
export function middleware(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/dashboard/:path*', '/employees/:path*', '/payroll/:path*', '/analytics/:path*', '/settings/:path*'],
}

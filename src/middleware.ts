import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'experimental-edge'

const adminRoutes = [
  '/dashboard',
  '/dashboard/claims',
  '/dashboard/categories',
  '/dashboard/products',
  '/dashboard/warranty-pricing',
  '/dashboard/customers',
  '/dashboard/applications',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const userCookie = request.cookies.get('user')?.value

  if (!token) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.next()
  }

  let isAdmin = false
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie)
      isAdmin = user?.name === 'Super Admin' || user?.email.toLowerCase() === "brett@getcover.com" || user?.email.toLowerCase() === "jesse@getcover.com" || user?.email.toLowerCase() === "mina.saleeb@nmscg.com"
    } catch {
      // Invalid cookie, treat as non-admin
    }
  }

  if (pathname === '/admin-login') {
    const redirectPath = isAdmin ? '/dashboard' : ''
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}

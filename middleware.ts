import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'
import { getDevSessionFromRequest, isDevAuthBypassEnabled } from '@/lib/dev-auth-bypass'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const protectedPaths = ['/customer', '/worker', '/employer', '/admin']
  const isProtectedRoute = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isDevAuthBypassEnabled()) {
    const devUser = getDevSessionFromRequest(request)

    if (isProtectedRoute && !devUser) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith('/admin') && devUser && devUser.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  const supabase = createMiddlewareClient({ req: request, res: response })

  const { data: { user } } = await supabase.auth.getUser()

  if (isProtectedRoute && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (dbUser?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/(customer|worker|employer|admin)/:path*',
    '/api/admin/:path*',
  ],
}

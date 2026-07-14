import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login') || request.nextUrl.pathname.startsWith('/api/admin/login')
  
  if (isAdminRoute && user) {
    const lastActivityCookie = request.cookies.get('sb_last_activity')
    if (lastActivityCookie) {
      const lastActivity = parseInt(lastActivityCookie.value, 10)
      const fourHours = 4 * 60 * 60 * 1000 // 4 hours in milliseconds
      
      if (Date.now() - lastActivity > fourHours) {
        // Inactivity timeout reached, clear session
        await supabase.auth.signOut()
        
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        url.searchParams.set('error', 'Session expired due to 4 hours of inactivity')
        
        const response = NextResponse.redirect(url)
        response.cookies.delete('sb_last_activity')
        return response
      }
    }
    
    // Update last activity timestamp
    supabaseResponse.cookies.set('sb_last_activity', Date.now().toString(), {
      path: '/',
      maxAge: 4 * 60 * 60, // matches 4 hours
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  if (isAdminRoute && !isLoginPage && !user) {
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

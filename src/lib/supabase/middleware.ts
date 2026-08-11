import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach((c) => request.cookies.set(c.name, c.value))
          response = NextResponse.next({ request })
          list.forEach((c) => response.cookies.set(c.name, c.value, c.options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdmin = path.startsWith("/admin")
  const isLogin = path === "/admin/login"

  // Belum login tapi buka area admin -> lempar ke login
  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // Sudah login tapi buka halaman login -> lempar ke dashboard
  if (isLogin && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return response
}

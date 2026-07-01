import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const protectedRoutes = [
    // Core learning opened for self-study guest mode (no login)
    // "/dashboard",
    // "/learn",
    // "/flashcards",
    // "/speaking",
    "/progress",
    "/roadmap",
    "/writing",
    "/leaderboard",
    "/grammar",
    "/business",
    "/challenge",
    "/pronunciation",
    "/placement-test",
    "/invite",
    "/certificate",
    "/settings",
    "/checkpoint",
    "/quiz",
  ];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isLoginRoute = pathname === "/login";

  // Skip auth check for public routes (like the landing page) to minimize TTFB latency
  if (!isProtectedRoute && !isLoginRoute) {
    return supabaseResponse;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Nếu truy cập trang bảo vệ mà chưa đăng nhập -> chuyển hướng về /login
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    url.searchParams.set("mode", "login");
    
    const redirectResponse = NextResponse.redirect(url);
    // Đồng bộ cookies sang redirect response mới
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
      });
    });
    return redirectResponse;
  }

  // 2. Nếu đã đăng nhập mà truy cập trang /login -> chuyển hướng sang /dashboard
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    
    const redirectResponse = NextResponse.redirect(url);
    // Đồng bộ cookies sang redirect response mới
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
      });
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
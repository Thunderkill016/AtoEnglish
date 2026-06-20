import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/supabase";

/**
 * Tạo Supabase client dành riêng cho Middleware context.
 * Middleware chạy ở Edge — không có access tới cookieStore async như Server Components.
 * Phải dùng request/response cookie pattern để refresh session token.
 */
export function createMiddlewareClient(request: NextRequest) {
  // Tạo response mới để middleware có thể set cookies (refresh token)
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies lên request (để Supabase client đọc được)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Tạo lại response với cookies mới (để browser nhận được)
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response: supabaseResponse };
}

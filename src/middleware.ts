import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { InMemoryRateLimiter, getClientIp } from "@/lib/security/rate-limit";

// Rate limit auth routes (login, callback) to 30 requests per minute
const authRateLimiter = new InMemoryRateLimiter(30, 60 * 1000);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" || pathname.startsWith("/auth/")) {
    const ip = getClientIp(request);
    const { success, limit, remaining, resetTime } = authRateLimiter.check(ip);

    if (!success) {
      return new NextResponse(
        "Too Many Requests. Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.",
        {
          status: 429,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": resetTime.toString(),
          },
        }
      );
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
import { headers } from "next/headers";
import type { RateLimiter, RateLimitResult } from "@/lib/security/rate-limit";

const RATE_LIMIT_MSG = "Yêu cầu quá thường xuyên. Vui lòng thử lại sau.";

/**
 * Client IP for Server Actions (from Next headers).
 * Prefer x-forwarded-for first hop, then x-real-ip.
 */
export async function getActionClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "127.0.0.1";
}

/**
 * Run rate limiter with action client IP.
 * Returns null when allowed; error message string when blocked.
 */
export async function checkActionRateLimit(
  limiter: RateLimiter,
  errorMessage: string = RATE_LIMIT_MSG,
): Promise<string | null> {
  const ip = await getActionClientIp();
  const result: RateLimitResult = await limiter.check(ip);
  if (!result.success) return errorMessage;
  return null;
}

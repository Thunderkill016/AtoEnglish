import { type NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Global cache in module scope to persist between serverless function invocations (if warm)
const cache = new Map<string, RateLimitRecord>();

export class InMemoryRateLimiter {
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Checks if the IP has exceeded the limit in the current window.
   */
  public check(ip: string): { success: boolean; limit: number; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = cache.get(ip);

    // Random cleanup of expired entries (1% probability on each check)
    if (Math.random() < 0.01) {
      const cacheNow = Date.now();
      cache.forEach((val, key) => {
        if (cacheNow > val.resetTime) {
          cache.delete(key);
        }
      });
    }

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs;
      const newRecord = { count: 1, resetTime };
      cache.set(ip, newRecord);
      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        resetTime,
      };
    }

    record.count++;
    const remaining = Math.max(0, this.limit - record.count);

    if (record.count > this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    return {
      success: true,
      limit: this.limit,
      remaining,
      resetTime: record.resetTime,
    };
  }
}

/**
 * Helper to resolve the client IP address from a request.
 */
export function getClientIp(req: Request | NextRequest): string {
  if ("ip" in req && req.ip) {
    return req.ip;
  }

  const headers = req.headers;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}

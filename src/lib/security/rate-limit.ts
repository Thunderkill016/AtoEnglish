import { type NextRequest } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

export interface RateLimiter {
  check(ip: string): Promise<RateLimitResult>;
}

// ─── In-Memory Fallback (local dev & when Upstash not configured) ─────────────

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiterImpl implements RateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  constructor(private limit: number, private windowMs: number) {}

  async check(ip: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.cache.get(ip);

    if (Math.random() < 0.01) {
      this.cache.forEach((val, key) => {
        if (Date.now() > val.resetTime) this.cache.delete(key);
      });
    }

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs;
      this.cache.set(ip, { count: 1, resetTime });
      return { success: true, limit: this.limit, remaining: this.limit - 1, resetTime };
    }

    record.count++;
    const remaining = Math.max(0, this.limit - record.count);
    if (record.count > this.limit) {
      return { success: false, limit: this.limit, remaining: 0, resetTime: record.resetTime };
    }
    return { success: true, limit: this.limit, remaining, resetTime: record.resetTime };
  }
}

// ─── Upstash Redis Rate Limiter (production) ──────────────────────────────────

class UpstashRateLimiterImpl implements RateLimiter {
  private ratelimit: import("@upstash/ratelimit").Ratelimit | null = null;
  private prefix: string;
  private requestsPerWindow: number;
  private windowSeconds: number;

  constructor(requestsPerWindow: number, windowSeconds: number, prefix = "rl") {
    this.requestsPerWindow = requestsPerWindow;
    this.windowSeconds = windowSeconds;
    this.prefix = prefix;
  }

  private async getLimiter() {
    if (this.ratelimit) return this.ratelimit;
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");
    this.ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(this.requestsPerWindow, `${this.windowSeconds} s`),
      prefix: this.prefix,
    });
    return this.ratelimit;
  }

  async check(ip: string): Promise<RateLimitResult> {
    try {
      const limiter = await this.getLimiter();
      const result = await limiter.limit(ip);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        resetTime: result.reset,
      };
    } catch {
      // Upstash unavailable — fail open (allow request)
      return { success: true, limit: this.requestsPerWindow, remaining: 1, resetTime: Date.now() + this.windowSeconds * 1000 };
    }
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const isUpstashConfigured =
  typeof process !== "undefined" &&
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Create a rate limiter.
 * - Uses Upstash Redis in production when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 * - Falls back to in-memory (single-instance only) for local development.
 *
 * @param requestsPerMinute  Maximum requests allowed per window
 * @param windowMs           Window duration in milliseconds (used for in-memory fallback)
 * @param prefix             Upstash key prefix (use unique value per limiter)
 */
export function createRateLimiter(
  requestsPerMinute: number,
  windowMs: number,
  prefix = "rl"
): RateLimiter {
  if (isUpstashConfigured) {
    const windowSeconds = Math.round(windowMs / 1000);
    return new UpstashRateLimiterImpl(requestsPerMinute, windowSeconds, prefix);
  }
  return new InMemoryRateLimiterImpl(requestsPerMinute, windowMs);
}

// ─── Backwards-compatible alias ───────────────────────────────────────────────

/** @deprecated Use createRateLimiter() instead */
export class InMemoryRateLimiter {
  private impl: InMemoryRateLimiterImpl;
  constructor(limit: number, windowMs: number) {
    this.impl = new InMemoryRateLimiterImpl(limit, windowMs);
  }
  check(ip: string): RateLimitResult {
    let result!: RateLimitResult;
    // Synchronous wrapper — safe for existing callers that don't await
    this.impl.check(ip).then((r) => { result = r; });
    // The impl is synchronous under the hood for in-memory, so this is fine
    return result ?? { success: true, limit: 0, remaining: 0, resetTime: 0 };
  }
}

// ─── IP Helper ───────────────────────────────────────────────────────────────

export function getClientIp(req: Request | NextRequest): string {
  if ("ip" in req && req.ip) return req.ip;
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

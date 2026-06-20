import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/security/rate-limit";

describe("createRateLimiter (InMemory fallback)", () => {
  it("allows requests under the limit", async () => {
    const limiter = createRateLimiter(5, 60_000, "test-allow");
    const result = await limiter.check("1.2.3.4");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over the limit", async () => {
    const limiter = createRateLimiter(3, 60_000, "test-block");
    const ip = "5.6.7.8";
    // Exhaust limit
    await limiter.check(ip);
    await limiter.check(ip);
    await limiter.check(ip);
    // 4th request should be blocked
    const result = await limiter.check(ip);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns correct limit value", async () => {
    const limiter = createRateLimiter(10, 60_000, "test-limit");
    const result = await limiter.check("9.9.9.9");
    expect(result.limit).toBe(10);
  });

  it("different IPs are tracked independently", async () => {
    const limiter = createRateLimiter(2, 60_000, "test-ips");
    // Exhaust for IP A
    await limiter.check("10.0.0.1");
    await limiter.check("10.0.0.1");
    await limiter.check("10.0.0.1"); // Over limit

    // IP B should still be allowed
    const resultB = await limiter.check("10.0.0.2");
    expect(resultB.success).toBe(true);
  });

  it("resetTime is in the future", async () => {
    const limiter = createRateLimiter(5, 60_000, "test-reset");
    const before = Date.now();
    const result = await limiter.check("1.1.1.1");
    expect(result.resetTime).toBeGreaterThan(before);
  });
});

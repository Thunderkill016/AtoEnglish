import { describe, it, expect, vi } from "vitest";
import { createRateLimiter, getClientIp } from "@/lib/security/rate-limit";

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
    await limiter.check(ip);
    await limiter.check(ip);
    await limiter.check(ip);
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
    await limiter.check("10.0.0.1");
    await limiter.check("10.0.0.1");
    await limiter.check("10.0.0.1");
    const resultB = await limiter.check("10.0.0.2");
    expect(resultB.success).toBe(true);
  });

  it("resetTime is in the future", async () => {
    const limiter = createRateLimiter(5, 60_000, "test-reset");
    const before = Date.now();
    const result = await limiter.check("1.1.1.1");
    expect(result.resetTime).toBeGreaterThan(before);
  });

  it("resets count after window expires", async () => {
    vi.useFakeTimers();
    const limiter = createRateLimiter(2, 1_000, "test-expire-window");
    const ip = "2.2.2.2";

    await limiter.check(ip);
    await limiter.check(ip);
    const blocked = await limiter.check(ip);
    expect(blocked.success).toBe(false);

    vi.advanceTimersByTime(1_001);

    const allowed = await limiter.check(ip);
    expect(allowed.success).toBe(true);
    expect(allowed.remaining).toBe(1);

    vi.useRealTimers();
  });
});

describe("getClientIp", () => {
  const makeRequest = (overrides: {
    ip?: string;
    headers?: Record<string, string>;
  } = {}) => {
    const headers = new Headers(overrides.headers ?? {});
    const req = {
      headers,
      ...(overrides.ip !== undefined ? { ip: overrides.ip } : {}),
    } as unknown as Request;
    return req;
  };

  it("returns req.ip when available", () => {
    const req = makeRequest({ ip: "1.2.3.4" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("returns first IP from x-forwarded-for header", () => {
    const req = makeRequest({
      headers: { "x-forwarded-for": "5.6.7.8, 9.10.11.12" },
    });
    expect(getClientIp(req)).toBe("5.6.7.8");
  });

  it("returns x-real-ip when x-forwarded-for is absent", () => {
    const req = makeRequest({ headers: { "x-real-ip": "13.14.15.16" } });
    expect(getClientIp(req)).toBe("13.14.15.16");
  });

  it("falls back to 127.0.0.1 when no IP headers present", () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBe("127.0.0.1");
  });

  it("trims whitespace from x-forwarded-for IP", () => {
    const req = makeRequest({
      headers: { "x-forwarded-for": "  192.168.1.1  , 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("192.168.1.1");
  });
});

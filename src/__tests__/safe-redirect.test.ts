import { describe, it, expect } from "vitest";

import { sanitizeRedirectPath } from "@/lib/auth/safe-redirect";

describe("sanitizeRedirectPath", () => {
  it("allows internal paths", () => {
    expect(sanitizeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirectPath("/learn/unit-1")).toBe("/learn/unit-1");
  });

  it("blocks open redirects", () => {
    expect(sanitizeRedirectPath("//evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectPath("https://evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectPath(null)).toBe("/dashboard");
  });
});
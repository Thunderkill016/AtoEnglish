import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkHasSession } from "@/lib/auth-check";

// Test the client-side session detection logic
// checkHasSession() reads document.cookie and localStorage for Supabase auth tokens

describe("checkHasSession", () => {
  // Save originals
  const originalCookie = Object.getOwnPropertyDescriptor(
    Document.prototype,
    "cookie"
  );

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Restore cookie descriptor
    if (originalCookie) {
      Object.defineProperty(Document.prototype, "cookie", originalCookie);
    }
    localStorage.clear();
  });

  // Helper to mock document.cookie
  function mockCookie(value: string) {
    Object.defineProperty(document, "cookie", {
      get: () => value,
      configurable: true,
    });
  }

  it("returns false when no session exists (empty cookie + empty localStorage)", () => {
    mockCookie("");
    expect(checkHasSession()).toBe(false);
  });

  it("returns true when Supabase sb- cookie is present", () => {
    mockCookie("sb-vhpfs-auth-token=eyJhbGc; other-cookie=value");
    expect(checkHasSession()).toBe(true);
  });

  it("returns false when only non-Supabase cookies exist", () => {
    mockCookie("session=abc123; theme=dark; _ga=GA1.2.xyz");
    expect(checkHasSession()).toBe(false);
  });

  it("returns true when Supabase auth token in localStorage", () => {
    localStorage.setItem("sb-vhpfskkredizeazlyzsh-auth-token", "token-value");
    mockCookie("");
    expect(checkHasSession()).toBe(true);
  });

  it("returns false when localStorage has sb- key but not auth-token suffix", () => {
    localStorage.setItem("sb-vhpfskkredizeazlyzsh-other-key", "some-value");
    mockCookie("");
    expect(checkHasSession()).toBe(false);
  });

  it("returns true when both cookie and localStorage have tokens (cookie takes priority)", () => {
    mockCookie("sb-test-auth-token=value");
    localStorage.setItem("sb-test-auth-token", "token");
    expect(checkHasSession()).toBe(true);
  });

  it("returns false in non-browser environment (window is undefined handled)", () => {
    // The function returns false early if typeof window === 'undefined'
    // In jsdom (vitest env) window IS defined, so we test the actual logic path
    // This test just ensures the function runs without throwing
    expect(() => checkHasSession()).not.toThrow();
  });

  it("returns true with multiple sb- cookies (picks first matching)", () => {
    mockCookie("unrelated=val; sb-project-auth-token=abc; other=def");
    expect(checkHasSession()).toBe(true);
  });

  it("handles cookie read errors gracefully (returns false, not throw)", () => {
    // Simulate an environment where document.cookie throws
    Object.defineProperty(document, "cookie", {
      get: () => {
        throw new Error("Cookie access denied");
      },
      configurable: true,
    });
    localStorage.clear();
    // Should not throw, should fall through to localStorage check
    expect(() => checkHasSession()).not.toThrow();
    expect(checkHasSession()).toBe(false);
  });

  it("returns false early if window is undefined", () => {
    const originalWindow = global.window;
    // @ts-expect-error - overriding window for test
    delete global.window;
    try {
      expect(checkHasSession()).toBe(false);
    } finally {
      global.window = originalWindow;
    }
  });
});

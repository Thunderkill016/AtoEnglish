import { describe, it, expect } from "vitest";

import { isProtectedRoute } from "@/lib/constants/protected-routes";

describe("isProtectedRoute", () => {
  it("returns true for all main app routes", () => {
    const protectedPaths = [
      "/dashboard",
      "/learn",
      "/learn/unit-a0-1",
      "/flashcards",
      "/progress",
      "/speaking",
      "/roadmap",
      "/quiz",
      "/quality",
      "/settings",
      "/certificate/B1",
    ];

    for (const path of protectedPaths) {
      expect(isProtectedRoute(path)).toBe(true);
    }
  });

  it("returns false for public routes", () => {
    const publicPaths = ["/", "/login", "/privacy", "/terms", "/auth/callback"];

    for (const path of publicPaths) {
      expect(isProtectedRoute(path)).toBe(false);
    }
  });
});
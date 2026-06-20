import { describe, it, expect } from "vitest";
import {
  LoginSchema,
  SaveCardSchema,
  ReviewCardSchema,
  CompleteUnitSchema,
  SpeakingSessionSchema,
} from "@/lib/security/validation";

// ─── LoginSchema ─────────────────────────────────────────────────────────────
describe("LoginSchema", () => {
  it("accepts valid email + password", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "secret123" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = LoginSchema.safeParse({ email: "notanemail", password: "secret123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Email không hợp lệ");
  });

  it("rejects short password", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "abc" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("6 ký tự");
  });

  it("normalises email to lowercase", () => {
    const result = LoginSchema.safeParse({ email: "USER@EXAMPLE.COM", password: "secret123" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });
});

// ─── SaveCardSchema ──────────────────────────────────────────────────────────
describe("SaveCardSchema", () => {
  it("accepts valid card", () => {
    const result = SaveCardSchema.safeParse({
      word: "hello",
      meaning_vn: "xin chào",
      level: "A1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty word", () => {
    const result = SaveCardSchema.safeParse({ word: "", meaning_vn: "xin chào" });
    expect(result.success).toBe(false);
  });

  it("rejects word longer than 100 chars", () => {
    const result = SaveCardSchema.safeParse({ word: "a".repeat(101), meaning_vn: "test" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid level", () => {
    const result = SaveCardSchema.safeParse({ word: "hello", meaning_vn: "test", level: "D1" });
    expect(result.success).toBe(false);
  });

  it("allows null optional fields", () => {
    const result = SaveCardSchema.safeParse({
      word: "hello",
      meaning_vn: "xin chào",
      phonetic: null,
      example_en: null,
      topic: null,
    });
    expect(result.success).toBe(true);
  });
});

// ─── ReviewCardSchema ────────────────────────────────────────────────────────
describe("ReviewCardSchema", () => {
  const validRatings = ["Again", "Hard", "Good", "Easy"] as const;

  validRatings.forEach((rating) => {
    it(`accepts rating "${rating}"`, () => {
      const result = ReviewCardSchema.safeParse({ cardId: "uuid-123", rating });
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid rating", () => {
    const result = ReviewCardSchema.safeParse({ cardId: "uuid-123", rating: "Perfect" });
    expect(result.success).toBe(false);
  });

  it("rejects empty cardId", () => {
    const result = ReviewCardSchema.safeParse({ cardId: "", rating: "Good" });
    expect(result.success).toBe(false);
  });
});

// ─── CompleteUnitSchema ──────────────────────────────────────────────────────
describe("CompleteUnitSchema", () => {
  it("accepts valid unitId", () => {
    const result = CompleteUnitSchema.safeParse({ unitId: "unit-1" });
    expect(result.success).toBe(true);
  });

  it("rejects empty unitId", () => {
    const result = CompleteUnitSchema.safeParse({ unitId: "" });
    expect(result.success).toBe(false);
  });

  it("accepts valid starCount values (1, 2, 3)", () => {
    [1, 2, 3].forEach(starCount => {
      const result = CompleteUnitSchema.safeParse({ unitId: "unit-1", starCount });
      expect(result.success).toBe(true);
    });
  });

  it("uses default starCount of 3 when omitted", () => {
    const result = CompleteUnitSchema.safeParse({ unitId: "unit-1" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.starCount).toBe(3);
  });

  it("rejects invalid starCount (0, 4, non-integer)", () => {
    [0, 4, 1.5, -1].forEach(starCount => {
      const result = CompleteUnitSchema.safeParse({ unitId: "unit-1", starCount });
      expect(result.success).toBe(false);
    });
  });
});

// ─── SpeakingSessionSchema ───────────────────────────────────────────────────
describe("SpeakingSessionSchema", () => {
  it("accepts valid shadowing session", () => {
    const result = SpeakingSessionSchema.safeParse({
      practiceType: "shadowing",
      duration: 300,
      accuracyScore: 85,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative duration", () => {
    const result = SpeakingSessionSchema.safeParse({ practiceType: "roleplay", duration: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects accuracyScore above 100", () => {
    const result = SpeakingSessionSchema.safeParse({
      practiceType: "journal",
      duration: 60,
      accuracyScore: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects accuracyScore below 0", () => {
    const result = SpeakingSessionSchema.safeParse({
      practiceType: "journal",
      duration: 60,
      accuracyScore: -5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid practiceType", () => {
    const result = SpeakingSessionSchema.safeParse({ practiceType: "karaoke", duration: 60 });
    expect(result.success).toBe(false);
  });

  it("allows zero duration", () => {
    const result = SpeakingSessionSchema.safeParse({ practiceType: "journal", duration: 0 });
    expect(result.success).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import {
  lexisToSeedVocab,
  phrasesToSeedVocab,
  lessonToSeedVocab,
  mergeSeedVocab,
  V2_SEED_LEXIS_MAX,
} from "@/lib/v2/seed-lexis";
import { getLessonV2 } from "@/lib/v2/lessons";
import { SeedV2LessonLexisSchema } from "@/lib/security/validation";
import type { FluencyItem, LexisItem } from "@/lib/v2/lesson-spec";

function item(
  partial: Partial<LexisItem> &
    Pick<LexisItem, "id" | "word" | "meaning_vi" | "example_en">,
): LexisItem {
  return {
    phonetic: partial.phonetic,
    l1_note_vi: partial.l1_note_vi,
    audio: partial.audio,
    ...partial,
  };
}

describe("lexisToSeedVocab (TASK-280)", () => {
  it("maps lexis fields to seed rows", () => {
    const rows = lexisToSeedVocab([
      item({
        id: "v1",
        word: "Hello",
        phonetic: "/həˈloʊ/",
        meaning_vi: "xin chào",
        example_en: "Hello! My name is Linh.",
      }),
    ]);
    expect(rows).toEqual([
      {
        word: "Hello",
        phonetic: "/həˈloʊ/",
        meaning_vn: "xin chào",
        example_en: "Hello! My name is Linh.",
        source: "lexis",
      },
    ]);
  });

  it("dedupes by lowercased word and skips blanks", () => {
    const rows = lexisToSeedVocab([
      item({ id: "a", word: "Hi", meaning_vi: "chào", example_en: "Hi!" }),
      item({ id: "b", word: "  hi  ", meaning_vi: "chào 2", example_en: "Hi again" }),
      item({ id: "c", word: "   ", meaning_vi: "x", example_en: "x" }),
      item({ id: "d", word: "Bye", meaning_vi: "tạm biệt", example_en: "Bye!" }),
    ]);
    expect(rows.map((r) => r.word)).toEqual(["Hi", "Bye"]);
    expect(rows[0].meaning_vn).toBe("chào");
  });

  it("caps at V2_SEED_LEXIS_MAX", () => {
    const many: LexisItem[] = Array.from(
      { length: V2_SEED_LEXIS_MAX + 5 },
      (_, i) =>
        item({
          id: `v${i}`,
          word: `word${i}`,
          meaning_vi: `nghĩa ${i}`,
          example_en: `Example ${i}.`,
        }),
    );
    expect(lexisToSeedVocab(many)).toHaveLength(V2_SEED_LEXIS_MAX);
  });

  it("seeds real gold lesson l-a1-01 lexis (≥6 words)", () => {
    const lesson = getLessonV2("l-a1-01");
    expect(lesson).not.toBeNull();
    if (!lesson) return;
    const rows = lexisToSeedVocab(lesson.lexis);
    expect(rows.length).toBeGreaterThanOrEqual(6);
    expect(rows.length).toBe(lesson.lexis.length);
    expect(rows.every((r) => r.word.length > 0 && r.meaning_vn.length > 0)).toBe(
      true,
    );
    expect(rows.some((r) => /hello/i.test(r.word))).toBe(true);
  });
});

describe("phrasesToSeedVocab + lessonToSeedVocab (TASK-314)", () => {
  it("maps fluency phrases to seed rows", () => {
    const phrases: FluencyItem[] = [
      { en: "How are you?", vi: "Bạn khỏe không?" },
      { en: "  Nice to meet you  ", vi: "Rất vui được gặp bạn" },
      { en: "", vi: "skip" },
      { en: "How are you?", vi: "dup" },
    ];
    const rows = phrasesToSeedVocab(phrases);
    expect(rows.map((r) => r.word)).toEqual([
      "How are you?",
      "Nice to meet you",
    ]);
    expect(rows[0]).toMatchObject({
      meaning_vn: "Bạn khỏe không?",
      example_en: "How are you?",
      phonetic: null,
      source: "phrase",
    });
  });

  it("lessonToSeedVocab prefers lexis then adds unique phrases", () => {
    const lesson = {
      lexis: [
        item({
          id: "v1",
          word: "hello",
          meaning_vi: "xin chào",
          example_en: "Hello!",
        }),
      ],
      fluency: {
        items: [
          { en: "Hello", vi: "Xin chào (phrase)" },
          { en: "Good morning", vi: "Chào buổi sáng" },
        ],
      },
    };
    const rows = lessonToSeedVocab(lesson);
    expect(rows.map((r) => r.word.toLowerCase())).toEqual([
      "hello",
      "good morning",
    ]);
    expect(rows[0].source).toBe("lexis");
    expect(rows[0].meaning_vn).toBe("xin chào");
    expect(rows[1].source).toBe("phrase");
  });

  it("mergeSeedVocab respects max across parts", () => {
    const a = lexisToSeedVocab(
      Array.from({ length: 5 }, (_, i) =>
        item({
          id: `a${i}`,
          word: `a${i}`,
          meaning_vi: `ma${i}`,
          example_en: `ea${i}`,
        }),
      ),
    );
    const b = phrasesToSeedVocab(
      Array.from({ length: 10 }, (_, i) => ({
        en: `phrase ${i}`,
        vi: `câu ${i}`,
      })),
    );
    expect(mergeSeedVocab([a, b], 8)).toHaveLength(8);
  });

  it("seeds real lesson with lexis + fluency (≥ lexis count)", () => {
    const lesson = getLessonV2("l-a0-01");
    expect(lesson).not.toBeNull();
    if (!lesson) return;
    const rows = lessonToSeedVocab(lesson);
    expect(rows.length).toBeGreaterThanOrEqual(lesson.lexis.length);
    expect(rows.length).toBeLessThanOrEqual(V2_SEED_LEXIS_MAX);
    const phraseCount = rows.filter((r) => r.source === "phrase").length;
    expect(phraseCount).toBeGreaterThan(0);
    expect(rows.every((r) => r.word && r.meaning_vn)).toBe(true);
  });
});

describe("SeedV2LessonLexisSchema", () => {
  it("accepts valid v2 lesson ids", () => {
    expect(SeedV2LessonLexisSchema.safeParse({ lessonId: "l-a1-01" }).success).toBe(
      true,
    );
    expect(SeedV2LessonLexisSchema.safeParse({ lessonId: "l-a0-08" }).success).toBe(
      true,
    );
    expect(SeedV2LessonLexisSchema.safeParse({ lessonId: "l-b1-01" }).success).toBe(
      true,
    );
  });

  it("rejects unit ids and garbage", () => {
    expect(SeedV2LessonLexisSchema.safeParse({ lessonId: "unit-1" }).success).toBe(
      false,
    );
    expect(SeedV2LessonLexisSchema.safeParse({ lessonId: "l-a1-1" }).success).toBe(
      false,
    );
    expect(SeedV2LessonLexisSchema.safeParse({ lessonId: "" }).success).toBe(false);
  });
});

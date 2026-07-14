import { describe, it, expect, beforeEach } from "vitest";
import {
  mergeSeedIntoLocalCards,
  getDueLocalCardsFrom,
  reviewLocalCardPure,
  localCardId,
  type LocalCard,
} from "@/lib/v2/local-cards";
import type { SeedLexisItem } from "@/lib/v2/seed-lexis";
import { lessonToSeedVocab } from "@/lib/v2/seed-lexis";
import { getLessonV2 } from "@/lib/v2/lessons";

const NOW = "2026-07-15T12:00:00.000Z";

function seedItem(
  partial: Partial<SeedLexisItem> & Pick<SeedLexisItem, "word" | "meaning_vn">,
): SeedLexisItem {
  return {
    phonetic: partial.phonetic ?? null,
    example_en: partial.example_en ?? null,
    source: partial.source ?? "lexis",
    ...partial,
  };
}

describe("local-cards pure helpers (TASK-314)", () => {
  it("localCardId is stable and lowercased", () => {
    expect(localCardId("Hello World")).toBe("local-hello-world");
    expect(localCardId("  hi  ")).toBe("local-hi");
  });

  it("mergeSeedIntoLocalCards adds new words only", () => {
    const existing: LocalCard[] = [
      {
        id: "local-hello",
        word: "hello",
        phonetic: null,
        meaning_vn: "xin chào",
        example_en: "Hello!",
        topic: "l-a1-01",
        level: "A1",
        interval: 0,
        repetitions: 0,
        due_date: NOW,
        state: 0,
        difficulty: 0,
        stability: 0,
        last_review: null,
        next_review: NOW,
        created_at: NOW,
        updated_at: NOW,
      },
    ];
    const seed = [
      seedItem({ word: "Hello", meaning_vn: "dup" }),
      seedItem({
        word: "Good morning",
        meaning_vn: "chào buổi sáng",
        source: "phrase",
        example_en: "Good morning",
      }),
    ];
    const { cards, added } = mergeSeedIntoLocalCards(existing, seed, {
      lessonId: "l-a0-01",
      level: "A0",
      now: NOW,
    });
    expect(added).toBe(1);
    expect(cards).toHaveLength(2);
    expect(cards.find((c) => c.word === "good morning")?.topic).toBe("l-a0-01");
    expect(cards.find((c) => c.word === "hello")?.meaning_vn).toBe("xin chào");
  });

  it("getDueLocalCardsFrom filters by due_date", () => {
    const cards: LocalCard[] = [
      {
        id: "a",
        word: "a",
        phonetic: null,
        meaning_vn: "a",
        example_en: null,
        topic: "t",
        level: "A1",
        interval: 0,
        repetitions: 0,
        due_date: "2026-07-14T00:00:00.000Z",
        state: 0,
        difficulty: 0,
        stability: 0,
        last_review: null,
        next_review: null,
        created_at: NOW,
        updated_at: NOW,
      },
      {
        id: "b",
        word: "b",
        phonetic: null,
        meaning_vn: "b",
        example_en: null,
        topic: "t",
        level: "A1",
        interval: 1,
        repetitions: 1,
        due_date: "2026-07-20T00:00:00.000Z",
        state: 1,
        difficulty: 1,
        stability: 1,
        last_review: NOW,
        next_review: "2026-07-20T00:00:00.000Z",
        created_at: NOW,
        updated_at: NOW,
      },
    ];
    const due = getDueLocalCardsFrom(cards, NOW);
    expect(due.map((c) => c.word)).toEqual(["a"]);
  });

  it("reviewLocalCardPure updates FSRS fields", () => {
    const card: LocalCard = {
      id: "local-test",
      word: "test",
      phonetic: null,
      meaning_vn: "thử",
      example_en: "Test.",
      topic: "l-a0-01",
      level: "A0",
      interval: 0,
      repetitions: 0,
      due_date: NOW,
      state: 0,
      difficulty: 0,
      stability: 0,
      last_review: null,
      next_review: NOW,
      created_at: NOW,
      updated_at: NOW,
    };
    const next = reviewLocalCardPure(card, "Good", NOW);
    expect(next.last_review).toBeTruthy();
    expect(next.repetitions).toBeGreaterThanOrEqual(0);
    expect(next.next_review).toBeTruthy();
    expect(next.word).toBe("test");
  });

  it("lesson seed from l-a0-01 merges into empty deck with phrases", () => {
    const lesson = getLessonV2("l-a0-01");
    expect(lesson).not.toBeNull();
    if (!lesson) return;
    const seed = lessonToSeedVocab(lesson);
    const { cards, added } = mergeSeedIntoLocalCards([], seed, {
      lessonId: lesson.id,
      level: lesson.cefr,
      now: NOW,
    });
    expect(added).toBe(seed.length);
    expect(cards.length).toBe(seed.length);
    expect(cards.every((c) => c.due_date === NOW)).toBe(true);
    expect(cards.some((c) => c.word.includes(" "))).toBe(true); // phrase
  });
});

describe("local-cards browser storage (jsdom)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seedLessonToLocalCards + load + review roundtrip", async () => {
    const {
      seedLessonToLocalCards,
      loadLocalCards,
      getDueLocalCards,
      reviewLocalCard,
    } = await import("@/lib/v2/local-cards");

    const added = seedLessonToLocalCards(
      [
        seedItem({ word: "alphabet", meaning_vn: "bảng chữ cái", example_en: "ABC" }),
        seedItem({
          word: "How do you spell it?",
          meaning_vn: "Bạn đánh vần thế nào?",
          source: "phrase",
          example_en: "How do you spell it?",
        }),
      ],
      { lessonId: "l-a0-01", level: "A0" },
    );
    expect(added).toBe(2);
    expect(loadLocalCards().cards).toHaveLength(2);
    expect(getDueLocalCards().length).toBe(2);

    const id = loadLocalCards().cards[0].id;
    const res = reviewLocalCard(id, "Easy");
    expect(res.success).toBe(true);
    expect(res.card?.last_review).toBeTruthy();

    // second seed of same words → added 0
    const again = seedLessonToLocalCards(
      [seedItem({ word: "alphabet", meaning_vn: "x" })],
      { lessonId: "l-a0-01", level: "A0" },
    );
    expect(again).toBe(0);
    expect(loadLocalCards().cards).toHaveLength(2);
  });
});

import { z } from "zod";

/** LessonSpec v2 — research-balanced stages (see docs/V2_PRODUCT.md) */

export const LessonPhaseSchema = z.enum(["P0", "P1", "P2", "P3"]);
export const LessonCefrSchema = z.enum(["A0", "A1", "A2", "B1"]);

export const LexisItemSchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1).max(80),
  phonetic: z.string().max(80).optional(),
  meaning_vi: z.string().min(1).max(200),
  example_en: z.string().min(1).max(200),
  l1_note_vi: z.string().min(10).max(400).optional(),
  audio: z.string().max(200).optional(),
});

export const GrammarSpineSchema = z.object({
  title: z.string().min(1).max(100),
  rule: z.string().min(1).max(120),
  examples: z
    .array(
      z.object({
        en: z.string().min(1),
        vi: z.string().min(1),
      }),
    )
    .min(2)
    .max(6),
  vnNote: z.string().min(10).max(400),
  ccq: z.object({
    question: z.string().min(1),
    options: z.array(z.string()).length(4),
    answer: z.string().min(1),
    explanation_vi: z.string().max(300).optional(),
  }),
});

export const ControlledExerciseSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["mcq", "cloze", "scramble", "match", "correction"]),
  prompt_vi: z.string().min(1).max(300),
  /** Display / stem in EN or mixed */
  stem: z.string().min(1).max(300).optional(),
  options: z.array(z.string()).min(2).max(6).optional(),
  answer: z.string().min(1).max(200),
  words: z.array(z.string()).optional(),
  explanation_vi: z.string().max(300).optional(),
});

export const DialogueLineSchema = z.object({
  id: z.string().min(1),
  speaker: z.string().min(1).max(40),
  text: z.string().min(1).max(300),
  translation_vi: z.string().min(1).max(400),
});

export const DialogueSchema = z.object({
  id: z.string().min(1),
  title_vi: z.string().min(1).max(100),
  context_vi: z.string().max(300).optional(),
  lines: z.array(DialogueLineSchema).min(3).max(12),
});

export const ListenItemSchema = z.object({
  id: z.string().min(1),
  audio_text: z.string().min(1).max(200),
  options: z.array(z.string()).min(3).max(5),
  answer: z.string().min(1),
});

export const FluencyItemSchema = z.object({
  en: z.string().min(1).max(120),
  vi: z.string().min(1).max(160),
});

export const TaskSchema = z.object({
  type: z.enum(["speak", "write", "roleplay"]),
  prompt_vi: z.string().min(10).max(500),
  successCriteria_vi: z.array(z.string().min(1)).min(1).max(5),
  scaffold_en: z.array(z.string()).max(8).optional(),
});

export const QuizItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["mcq", "cloze", "true-false"]),
  question: z.string().min(1).max(400),
  options: z.array(z.string()).min(2).max(5).optional(),
  answer: z.string().min(1).max(200),
  explanation_vi: z.string().max(300).optional(),
});

export const PronunciationFocusSchema = z.object({
  phoneme: z.string().min(1).max(40),
  description_vi: z.string().min(1).max(300),
  examples: z
    .array(
      z.object({
        word: z.string(),
        ipa: z.string().optional(),
        tip_vi: z.string().optional(),
      }),
    )
    .min(1)
    .max(6),
});

export const LessonSpecSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^l-(a0|a1|a2|b1)-\d{2}$/,
        "id must match l-a0-01 … l-b1-14 style",
      ),
    phase: LessonPhaseSchema,
    cefr: LessonCefrSchema,
    title_vi: z.string().min(3).max(120),
    estimatedMin: z.number().int().min(20).max(60),
    canDo: z.array(z.string().min(5).max(200)).min(2).max(4),
    situation: z.string().min(30).max(600),
    culturalNote_vi: z.string().min(40).max(800),
    jobAngle: z.string().max(200).optional(),
    lexis: z.array(LexisItemSchema).min(6).max(12),
    grammar: GrammarSpineSchema,
    controlled: z.array(ControlledExerciseSchema).min(3).max(12),
    input: z.object({
      dialogues: z.array(DialogueSchema).min(1).max(3),
      listenItems: z.array(ListenItemSchema).min(3).max(8),
    }),
    fluency: z.object({
      items: z.array(FluencyItemSchema).min(5).max(12),
    }),
    task: TaskSchema,
    review: z.object({
      quiz: z.array(QuizItemSchema).min(4).max(10),
      spiral: z.array(QuizItemSchema).min(2).max(6),
    }),
    pronunciationFocus: PronunciationFocusSchema.optional(),
  })
  .superRefine((lesson, ctx) => {
    // L1 coverage by band
    const withL1 = lesson.lexis.filter((x) => (x.l1_note_vi?.length ?? 0) >= 10).length;
    const ratio = withL1 / lesson.lexis.length;
    const minRatio =
      lesson.cefr === "A1" || lesson.cefr === "A2"
        ? 1
        : lesson.cefr === "A0"
          ? 0.5
          : 0.5;
    if (ratio < minRatio) {
      ctx.addIssue({
        code: "custom",
        message: `L1 notes ${Math.round(ratio * 100)}% < ${Math.round(minRatio * 100)}% for ${lesson.cefr}`,
        path: ["lexis"],
      });
    }

    // Phase must match CEFR
    const phaseCefr: Record<string, string> = {
      P0: "A0",
      P1: "A1",
      P2: "A2",
      P3: "B1",
    };
    if (phaseCefr[lesson.phase] !== lesson.cefr) {
      ctx.addIssue({
        code: "custom",
        message: `phase ${lesson.phase} incompatible with cefr ${lesson.cefr}`,
        path: ["phase"],
      });
    }
  });

export type LessonSpec = z.infer<typeof LessonSpecSchema>;
export type LexisItem = z.infer<typeof LexisItemSchema>;
export type LessonPhase = z.infer<typeof LessonPhaseSchema>;

export const LESSON_STAGES = [
  { id: "engage", label_vi: "Bắt đầu", strand: "engage" },
  { id: "lexis", label_vi: "Từ vựng", strand: "language" },
  { id: "grammar", label_vi: "Ngữ pháp", strand: "language" },
  { id: "controlled", label_vi: "Luyện tập", strand: "language" },
  { id: "input", label_vi: "Hội thoại & nghe", strand: "input" },
  { id: "fluency", label_vi: "Phản xạ", strand: "fluency" },
  { id: "task", label_vi: "Nhiệm vụ", strand: "output" },
  { id: "review", label_vi: "Tổng kết", strand: "review" },
] as const;

export type LessonStageId = (typeof LESSON_STAGES)[number]["id"];

export function parseLessonSpec(data: unknown): LessonSpec {
  return LessonSpecSchema.parse(data);
}

export function safeParseLessonSpec(data: unknown) {
  return LessonSpecSchema.safeParse(data);
}

import { z } from "zod";

import type { RealTalkLesson } from "@/types/real-talk";

export const REAL_TALK_LEVELS = ["A0", "A1", "A2", "B1", "B2"] as const;

const shortText = z.string().trim().min(1).max(240);
const longText = z.string().trim().min(1).max(900);
const timestamp = z.number().finite().min(0).max(18_000);

const questionSchema = z
  .object({
    questionVi: longText,
    options: z.array(shortText).min(2).max(4),
    correctIndex: z.number().int().min(0),
  })
  .superRefine((question, context) => {
    if (question.correctIndex >= question.options.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctIndex"],
        message: "correctIndex must reference an option.",
      });
    }
  });

const transcriptSegmentSchema = z
  .object({
    index: z.number().int().nonnegative(),
    speaker: shortText,
    startTime: timestamp,
    endTime: timestamp,
    textEn: longText,
    textVi: longText,
  })
  .superRefine((segment, context) => {
    if (segment.endTime <= segment.startTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "endTime must be after startTime.",
      });
    }
  });

const vocabularySchema = z.object({
  word: shortText,
  phonetic: z.string().trim().max(100),
  definition: longText,
  meaningVi: longText,
  contextSentence: longText,
  timestamp,
  pronunciationNote: z.string().trim().max(400).optional(),
  l1InterferenceVn: z.string().trim().max(400).optional(),
});

const focusPointSchema = z.object({
  type: z.enum(["grammar", "discourse_marker", "collocation", "idiom"]),
  pattern: shortText,
  explanationVi: longText,
  segmentIndices: z.array(z.number().int().nonnegative()).min(1).max(3),
});

const generatedLessonSchema = z
  .object({
    title: shortText,
    titleVi: shortText,
    level: z.enum(REAL_TALK_LEVELS),
    estimatedMinutes: z.number().int().min(8).max(30),
    canDoStatement: shortText,
    canDoStatementVi: shortText,
    speakers: z
      .array(
        z.object({
          label: shortText,
          color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
        }),
      )
      .min(1)
      .max(4),
    transcript: z.array(transcriptSegmentSchema).min(3).max(60),
    preWatch: z.object({
      contextVi: longText,
      vocabulary: z.array(vocabularySchema).min(4).max(8),
      prediction: questionSchema,
      soundAlerts: z
        .array(
          z.object({
            sound: shortText,
            explanationVi: longText,
            exampleWords: z.array(shortText).min(1).max(4),
            commonMistakeVi: longText,
          }),
        )
        .min(1)
        .max(2),
    }),
    whileWatch: z.object({
      gistQuestion: questionSchema,
      focusPoints: z.array(focusPointSchema).min(1).max(3),
      keyMoments: z
        .array(
          z.object({
            timestamp,
            descriptionVi: longText,
            listenForVi: longText,
          }),
        )
        .min(1)
        .max(3),
    }),
    postWatch: z.object({
      comprehensionQuiz: z
        .array(
          questionSchema.extend({
            id: z.string().trim().regex(/^[a-z0-9-]{1,64}$/),
            explanationVi: longText,
          }),
        )
        .min(2)
        .max(4),
      fillInTheBlank: z
        .array(
          z.object({
            id: z.string().trim().regex(/^[a-z0-9-]{1,64}$/),
            sentence: longText.refine((value) => value.includes("___"), {
              message: "The sentence must contain a blank.",
            }),
            hintVi: shortText,
            answer: shortText,
            alternatives: z.array(shortText).max(3).default([]),
          }),
        )
        .min(2)
        .max(4),
      speakingDrills: z
        .array(
          z.object({
            id: z.string().trim().regex(/^[a-z0-9-]{1,64}$/),
            phrase: shortText,
            meaningVi: longText,
            timestamp,
            tipVi: longText,
          }),
        )
        .min(1)
        .max(3),
      culturalNotes: z
        .array(
          z.object({
            titleVi: shortText,
            contentVi: longText,
            segmentIndex: z.number().int().nonnegative().optional(),
          }),
        )
        .max(2),
    }),
  })
  .superRefine((lesson, context) => {
    const speakerLabels = new Set(lesson.speakers.map((speaker) => speaker.label));
    const knownSegmentIndexes = new Set(lesson.transcript.map((segment) => segment.index));

    lesson.transcript.forEach((segment, index) => {
      if (!speakerLabels.has(segment.speaker)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["transcript", index, "speaker"],
          message: "Each transcript speaker must be declared in speakers.",
        });
      }
    });

    lesson.whileWatch.focusPoints.forEach((focusPoint, index) => {
      focusPoint.segmentIndices.forEach((segmentIndex) => {
        if (!knownSegmentIndexes.has(segmentIndex)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["whileWatch", "focusPoints", index, "segmentIndices"],
            message: "Focus points must reference transcript segments.",
          });
        }
      });
    });
  });

export type GeneratedRealTalkLesson = z.infer<typeof generatedLessonSchema>;

export function validateGeneratedLesson(
  value: unknown,
):
  | { success: true; lesson: GeneratedRealTalkLesson }
  | { success: false; error: string } {
  const parsed = generatedLessonSchema.safeParse(value);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues
        .slice(0, 3)
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    };
  }

  return { success: true, lesson: parsed.data };
}

export function toRealTalkLesson(
  videoId: string,
  lesson: GeneratedRealTalkLesson,
): RealTalkLesson {
  return {
    videoId,
    title: lesson.title,
    titleVi: lesson.titleVi,
    level: lesson.level,
    estimatedMinutes: lesson.estimatedMinutes,
    canDoStatement: lesson.canDoStatement,
    canDoStatementVi: lesson.canDoStatementVi,
    transcript: lesson.transcript,
    preWatch: lesson.preWatch,
    whileWatch: lesson.whileWatch,
    postWatch: lesson.postWatch,
  };
}

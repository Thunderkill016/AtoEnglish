import { z } from "zod";

export const realTalkLevelSchema = z.enum(["A0", "A1", "A2", "B1", "B2"]);

export const generateRealTalkInputSchema = z.object({
  youtubeUrl: z.string().trim().min(1).max(500),
  level: realTalkLevelSchema,
});

const shortText = z.string().trim().min(1).max(240);
const mediumText = z.string().trim().min(1).max(800);
const optionsSchema = z.array(shortText).min(2).max(4);

const multipleChoiceShape = {
  questionVi: mediumText,
  options: optionsSchema,
  correctIndex: z.number().int().min(0).max(3),
};

function validCorrectIndex(
  value: { options: string[]; correctIndex: number },
  ctx: z.RefinementCtx,
) {
  if (value.correctIndex >= value.options.length) {
    ctx.addIssue({
      code: "custom",
      path: ["correctIndex"],
      message: "correctIndex must reference an existing option",
    });
  }
}

const multipleChoiceSchema = z
  .object(multipleChoiceShape)
  .superRefine(validCorrectIndex);

const evidenceMultipleChoiceSchema = z
  .object({
    ...multipleChoiceShape,
    id: z.string().trim().min(1).max(80),
    explanationVi: mediumText,
    evidenceSegmentIndices: z.array(z.number().int().min(0)).min(1).max(6),
  })
  .superRefine(validCorrectIndex);

const transcriptSegmentSchema = z.object({
  index: z.number().int().min(0),
  speaker: z.string().trim().min(1).max(80),
  startTime: z.number().finite().min(0),
  endTime: z.number().finite().positive(),
  textEn: z.string().trim().min(1).max(600),
  textVi: z.string().trim().min(1).max(800),
});

const generatedLessonDraftBaseSchema = z.object({
  title: shortText,
  titleVi: shortText,
  level: realTalkLevelSchema,
  estimatedMinutes: z.number().int().min(8).max(25),
  canDoStatement: shortText,
  canDoStatementVi: mediumText,
  topics: z.array(z.string().trim().min(1).max(60)).min(1).max(5),
  environment: z.object({
    titleVi: shortText,
    situationVi: mediumText,
    learnerRoleVi: shortText,
    partnerRoleVi: shortText,
    realWorldGoalVi: mediumText,
  }),
  speakers: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      }),
    )
    .min(1)
    .max(6),
  transcript: z.array(transcriptSegmentSchema).min(2).max(80),
  communicationEvents: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        type: z.enum([
          "open_interaction",
          "exchange_information",
          "ask_follow_up",
          "confirm_information",
          "request_clarification",
          "repair_misunderstanding",
          "respond_and_continue",
          "close_interaction",
          "other",
        ]),
        descriptionVi: mediumText,
        segmentIndices: z.array(z.number().int().min(0)).min(1).max(8),
      }),
    )
    .min(1)
    .max(8),
  preWatch: z.object({
    contextVi: mediumText,
    vocabulary: z
      .array(
        z.object({
          word: z.string().trim().min(1).max(100),
          phonetic: z.string().trim().max(100),
          definition: mediumText,
          meaningVi: mediumText,
          contextSentence: z.string().trim().min(1).max(600),
          timestamp: z.number().finite().min(0),
          pronunciationNote: z.string().trim().max(600).optional(),
          l1InterferenceVn: z.string().trim().max(600).optional(),
        }),
      )
      .min(3)
      .max(8),
    prediction: multipleChoiceSchema,
    soundAlerts: z
      .array(
        z.object({
          sound: z.string().trim().min(1).max(60),
          explanationVi: mediumText,
          exampleWords: z.array(z.string().trim().min(1).max(80)).min(1).max(6),
          commonMistakeVi: mediumText,
        }),
      )
      .max(2),
  }),
  whileWatch: z.object({
    gistQuestion: multipleChoiceSchema,
    focusPoints: z
      .array(
        z.object({
          type: z.enum(["grammar", "discourse_marker", "collocation", "idiom"]),
          pattern: z.string().trim().min(1).max(160),
          explanationVi: mediumText,
          segmentIndices: z.array(z.number().int().min(0)).min(1).max(8),
        }),
      )
      .min(1)
      .max(6),
    keyMoments: z
      .array(
        z.object({
          timestamp: z.number().finite().min(0),
          descriptionVi: mediumText,
          listenForVi: mediumText,
        }),
      )
      .min(1)
      .max(6),
  }),
  postWatch: z.object({
    comprehensionQuiz: z.array(evidenceMultipleChoiceSchema).min(2).max(5),
    fillInTheBlank: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          sentence: z.string().trim().min(1).max(500),
          hintVi: mediumText,
          answer: z.string().trim().min(1).max(120),
          alternatives: z.array(z.string().trim().min(1).max(120)).max(5).optional(),
          evidenceSegmentIndex: z.number().int().min(0),
        }),
      )
      .min(1)
      .max(4),
    speakingDrills: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          phrase: z.string().trim().min(1).max(300),
          meaningVi: mediumText,
          timestamp: z.number().finite().min(0),
          tipVi: mediumText,
          evidenceSegmentIndex: z.number().int().min(0),
        }),
      )
      .min(2)
      .max(5),
    culturalNotes: z
      .array(
        z.object({
          titleVi: shortText,
          contentVi: mediumText,
          segmentIndex: z.number().int().min(0).optional(),
        }),
      )
      .max(3),
  }),
  transferTask: z.object({
    situationVi: mediumText,
    learnerGoalVi: mediumText,
    promptVi: mediumText,
    successCriteriaVi: z.array(shortText).min(2).max(5),
    suggestedLanguage: z.array(z.string().trim().min(1).max(300)).min(1).max(5),
  }),
});

export const generatedLessonDraftSchema = Object.assign(
  generatedLessonDraftBaseSchema,
  {
    toJSONSchema: () => z.toJSONSchema(generatedLessonDraftBaseSchema),
  },
);

export type GeneratedLessonDraft = z.infer<
  typeof generatedLessonDraftBaseSchema
>;

export interface SourceTranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

function normalizeEvidenceText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&(?:amp|quot|#39);/g, " ")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseHasSourceEvidence(phrase: string, sourceText: string) {
  const normalizedPhrase = normalizeEvidenceText(phrase);
  const normalizedSource = normalizeEvidenceText(sourceText);
  return Boolean(normalizedPhrase) && normalizedSource.includes(normalizedPhrase);
}

function scoreConversationItem(text: string) {
  const normalized = text.toLowerCase();
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  let score = 1;

  if (wordCount >= 2 && wordCount <= 18) score += 1;
  if (
    /\?|\b(what|where|when|why|who|how|do you|did you|can you|could you|would you)\b/.test(
      normalized,
    )
  ) {
    score += 2;
  }
  if (/\b(i|i'm|i've|we|you|your|my|me)\b/.test(normalized)) score += 1;
  if (
    /\b(yeah|yes|no|okay|right|really|actually|well|so|but|because|thanks|thank you)\b/.test(
      normalized,
    )
  ) {
    score += 2;
  }
  if (
    /\b(sorry|pardon|say that again|repeat|did you say|what do you mean)\b/.test(
      normalized,
    )
  ) {
    score += 4;
  }

  return score;
}

export function selectConversationWindow(
  transcript: readonly SourceTranscriptItem[],
  options: { maxDurationSeconds?: number; maxItems?: number } = {},
) {
  const maxDurationSeconds = options.maxDurationSeconds ?? 180;
  const maxItems = options.maxItems ?? 80;
  if (transcript.length <= maxItems) {
    const first = transcript[0];
    const last = transcript[transcript.length - 1];
    if (
      !first ||
      !last ||
      last.offset + last.duration - first.offset <= maxDurationSeconds
    ) {
      return [...transcript];
    }
  }

  let bestStart = 0;
  let bestEnd = Math.min(transcript.length, maxItems);
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let start = 0; start < transcript.length; start += 1) {
    const windowStart = transcript[start]?.offset ?? 0;
    let score = 0;
    let end = start;

    while (end < transcript.length && end - start < maxItems) {
      const item = transcript[end];
      if (!item) break;
      if (item.offset + item.duration - windowStart > maxDurationSeconds) break;
      score += scoreConversationItem(item.text);
      end += 1;
    }

    if (end - start >= 2 && score > bestScore) {
      bestScore = score;
      bestStart = start;
      bestEnd = end;
    }
  }

  return transcript.slice(bestStart, bestEnd);
}

export function validateGeneratedDraftEvidence(
  draft: GeneratedLessonDraft,
  source: readonly SourceTranscriptItem[],
) {
  const failures: string[] = [];
  const sourceStart = source[0]?.offset ?? 0;
  const sourceEnd = source.reduce(
    (max, item) => Math.max(max, item.offset + item.duration),
    sourceStart,
  );
  const sourceText = source.map((item) => item.text).join(" ");
  const transcriptIndices = new Set(
    draft.transcript.map((segment) => segment.index),
  );
  const speakerLabels = new Set(
    draft.speakers.map((speaker) => speaker.label),
  );

  if (draft.transcript.some((segment) => segment.endTime <= segment.startTime)) {
    failures.push("invalid_transcript_time_range");
  }
  if (
    draft.transcript.some(
      (segment) =>
        segment.startTime < sourceStart || segment.endTime > sourceEnd + 1,
    )
  ) {
    failures.push("transcript_outside_source_window");
  }
  if (
    new Set(draft.transcript.map((segment) => segment.index)).size !==
    draft.transcript.length
  ) {
    failures.push("duplicate_transcript_index");
  }
  if (draft.transcript.some((segment) => !speakerLabels.has(segment.speaker))) {
    failures.push("unknown_speaker_label");
  }

  const referencedIndices = [
    ...draft.communicationEvents.flatMap((event) => event.segmentIndices),
    ...draft.whileWatch.focusPoints.flatMap((point) => point.segmentIndices),
    ...draft.postWatch.comprehensionQuiz.flatMap(
      (question) => question.evidenceSegmentIndices,
    ),
    ...draft.postWatch.fillInTheBlank.map((item) => item.evidenceSegmentIndex),
    ...draft.postWatch.speakingDrills.map((item) => item.evidenceSegmentIndex),
    ...draft.postWatch.culturalNotes.flatMap((note) =>
      note.segmentIndex === undefined ? [] : [note.segmentIndex],
    ),
  ];
  if (referencedIndices.some((index) => !transcriptIndices.has(index))) {
    failures.push("activity_references_unknown_segment");
  }

  if (
    draft.preWatch.vocabulary.some(
      (item) =>
        item.timestamp < sourceStart ||
        item.timestamp > sourceEnd ||
        !phraseHasSourceEvidence(item.contextSentence, sourceText),
    )
  ) {
    failures.push("vocabulary_missing_source_evidence");
  }
  if (
    draft.whileWatch.keyMoments.some(
      (moment) => moment.timestamp < sourceStart || moment.timestamp > sourceEnd,
    )
  ) {
    failures.push("key_moment_outside_source_window");
  }
  if (
    draft.postWatch.speakingDrills.some(
      (drill) =>
        drill.timestamp < sourceStart ||
        drill.timestamp > sourceEnd ||
        !phraseHasSourceEvidence(drill.phrase, sourceText),
    )
  ) {
    failures.push("speaking_drill_missing_source_evidence");
  }
  if (
    draft.postWatch.fillInTheBlank.some((exercise) => {
      const completedSentence = exercise.sentence.replace("___", exercise.answer);
      return !phraseHasSourceEvidence(completedSentence, sourceText);
    })
  ) {
    failures.push("fill_blank_missing_source_evidence");
  }
  if (
    draft.transferTask.suggestedLanguage.some(
      (phrase) => !phraseHasSourceEvidence(phrase, sourceText),
    )
  ) {
    failures.push("transfer_language_missing_source_evidence");
  }

  return [...new Set(failures)];
}

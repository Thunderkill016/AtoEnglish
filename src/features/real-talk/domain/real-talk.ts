export type RealTalkLevel = "A1" | "A2" | "B1" | "B2";

export type TranscriptReviewStatus =
  | "machine_caption"
  | "editor_normalized"
  | "human_verified";

export interface RealTalkSource {
  provider: "wikimedia_commons" | "dvids" | "youtube" | "owned";
  title: string;
  sourceUrl: string;
  mediaUrl: string;
  author: string;
  publishedAt: string;
  license: {
    name: string;
    url: string;
    attribution: string;
    publicCatalogAllowed: boolean;
  };
  transcript: {
    sourceUrl: string;
    kind: "official" | "machine_caption" | "manual";
    reviewed: boolean;
  };
}

export interface RealTalkTranscriptSegment {
  id: string;
  speaker: string;
  startSeconds: number;
  endSeconds: number;
  /** Verbatim text from the declared transcript source. */
  sourceText: string;
  /** Learner-facing normalization; never silently replaces sourceText. */
  displayText: string;
  translationVi: string;
  reviewStatus: TranscriptReviewStatus;
}

export interface RealTalkEnvironment {
  id: string;
  titleVi: string;
  settingVi: string;
  learnerRoleVi: string;
  communicationGoalVi: string;
}

export type RealTalkCommunicationEventKind =
  | "announce"
  | "name_information"
  | "give_time"
  | "confirm_or_acknowledge"
  | "repair";

export interface RealTalkCommunicationEvent {
  id: string;
  kind: RealTalkCommunicationEventKind;
  labelVi: string;
  functionVi: string;
  segmentIds: string[];
}

export interface RealTalkChunk {
  id: string;
  phrase: string;
  meaningVi: string;
  useWhenVi: string;
  sourceSegmentId: string;
  recallCueVi: string;
}

export interface RealTalkQuestion {
  questionVi: string;
  options: string[];
  correctIndex: number;
  evidenceSegmentIds: string[];
}

export interface RealTalkCloze {
  prompt: string;
  answer: string;
  hintVi: string;
  evidenceSegmentId: string;
}

export interface RealTalkTransferIntent {
  id: string;
  labelVi: string;
  /** One matching signal is enough for this intent. */
  acceptedSignals: string[];
}

export interface RealTalkTransferTask {
  situationVi: string;
  promptVi: string;
  changedContext: true;
  minimumWords: number;
  intents: RealTalkTransferIntent[];
  exampleAnswer: string;
}

export interface RealTalkLesson {
  id: string;
  titleVi: string;
  titleEn: string;
  level: RealTalkLevel;
  estimatedMinutes: number;
  canDoVi: string;
  status: "internal_pilot" | "approved";
  source: RealTalkSource;
  environment: RealTalkEnvironment;
  clip: {
    startSeconds: number;
    endSeconds: number;
  };
  transcript: RealTalkTranscriptSegment[];
  communicationEvents: RealTalkCommunicationEvent[];
  gistQuestion: RealTalkQuestion;
  chunks: RealTalkChunk[];
  cloze: RealTalkCloze;
  recall: {
    cueVi: string;
    acceptedAnswers: string[];
    evidenceSegmentId: string;
  };
  transfer: RealTalkTransferTask;
}

export interface RealTalkTransferEvaluation {
  passed: boolean;
  wordCount: number;
  matchedIntentIds: string[];
  missingIntentIds: string[];
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeRecallAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function recallAnswerMatches(
  value: string,
  acceptedAnswers: readonly string[],
) {
  const normalized = normalizeRecallAnswer(value);
  return acceptedAnswers.some(
    (answer) => normalizeRecallAnswer(answer) === normalized,
  );
}

export function evaluateTransferResponse(
  value: string,
  task: RealTalkTransferTask,
): RealTalkTransferEvaluation {
  const normalized = normalizeRecallAnswer(value);
  const words = normalized ? normalized.split(" ") : [];
  const matchedIntentIds = task.intents
    .filter((intent) =>
      intent.acceptedSignals.some((signal) =>
        normalized.includes(normalizeRecallAnswer(signal)),
      ),
    )
    .map((intent) => intent.id);
  const matched = new Set(matchedIntentIds);
  const missingIntentIds = task.intents
    .filter((intent) => !matched.has(intent.id))
    .map((intent) => intent.id);

  return {
    passed: words.length >= task.minimumWords && missingIntentIds.length === 0,
    wordCount: words.length,
    matchedIntentIds,
    missingIntentIds,
  };
}

export function validateRealTalkLesson(lesson: RealTalkLesson): string[] {
  const failures: string[] = [];
  const segmentIds = new Set(lesson.transcript.map((segment) => segment.id));

  if (!lesson.canDoVi.trim()) failures.push("missing_can_do");
  if (lesson.estimatedMinutes < 5 || lesson.estimatedMinutes > 20) {
    failures.push("duration_out_of_range");
  }
  if (lesson.clip.startSeconds < 0 || lesson.clip.endSeconds <= lesson.clip.startSeconds) {
    failures.push("invalid_clip_window");
  }
  if (
    !isHttpsUrl(lesson.source.sourceUrl) ||
    !isHttpsUrl(lesson.source.mediaUrl) ||
    !isHttpsUrl(lesson.source.license.url) ||
    !isHttpsUrl(lesson.source.transcript.sourceUrl)
  ) {
    failures.push("source_urls_must_be_https");
  }
  if (!lesson.source.license.attribution.trim()) {
    failures.push("missing_attribution");
  }
  if (
    !lesson.environment.id.trim() ||
    !lesson.environment.titleVi.trim() ||
    !lesson.environment.settingVi.trim() ||
    !lesson.environment.learnerRoleVi.trim() ||
    !lesson.environment.communicationGoalVi.trim()
  ) {
    failures.push("incomplete_environment");
  }
  if (lesson.status === "approved") {
    if (!lesson.source.license.publicCatalogAllowed) {
      failures.push("approved_lesson_requires_catalog_permission");
    }
    if (!lesson.source.transcript.reviewed) {
      failures.push("approved_lesson_requires_reviewed_transcript");
    }
    if (
      lesson.transcript.some(
        (segment) => segment.reviewStatus !== "human_verified",
      )
    ) {
      failures.push("approved_lesson_requires_verified_segments");
    }
  }
  if (lesson.transcript.length < 2) failures.push("transcript_too_short");
  if (
    lesson.transcript.some(
      (segment) =>
        !segment.id.trim() ||
        !segment.speaker.trim() ||
        !segment.sourceText.trim() ||
        !segment.displayText.trim() ||
        !segment.translationVi.trim(),
    )
  ) {
    failures.push("incomplete_transcript_segment");
  }
  if (
    lesson.transcript.some(
      (segment) =>
        segment.startSeconds < lesson.clip.startSeconds ||
        segment.endSeconds > lesson.clip.endSeconds ||
        segment.endSeconds <= segment.startSeconds,
    )
  ) {
    failures.push("transcript_outside_clip");
  }
  if (
    lesson.transcript.some((segment, index) => {
      const previous = lesson.transcript[index - 1];
      return previous ? segment.startSeconds < previous.endSeconds : false;
    })
  ) {
    failures.push("transcript_overlaps_or_unsorted");
  }
  if (lesson.chunks.length < 3 || lesson.chunks.length > 6) {
    failures.push("chunks_out_of_range");
  }
  if (
    lesson.chunks.some((chunk) => !segmentIds.has(chunk.sourceSegmentId)) ||
    lesson.gistQuestion.evidenceSegmentIds.some((id) => !segmentIds.has(id)) ||
    !segmentIds.has(lesson.cloze.evidenceSegmentId) ||
    !segmentIds.has(lesson.recall.evidenceSegmentId)
  ) {
    failures.push("activity_references_unknown_segment");
  }
  if (lesson.communicationEvents.length < 3) {
    failures.push("insufficient_communication_events");
  }
  if (
    lesson.communicationEvents.some(
      (event) =>
        !event.id.trim() ||
        !event.labelVi.trim() ||
        !event.functionVi.trim() ||
        event.segmentIds.length === 0 ||
        event.segmentIds.some((id) => !segmentIds.has(id)),
    )
  ) {
    failures.push("invalid_communication_event");
  }
  if (
    !lesson.communicationEvents.some(
      (event) => event.kind === "confirm_or_acknowledge" || event.kind === "repair",
    )
  ) {
    failures.push("missing_interaction_event");
  }
  if (
    lesson.gistQuestion.correctIndex < 0 ||
    lesson.gistQuestion.correctIndex >= lesson.gistQuestion.options.length
  ) {
    failures.push("invalid_gist_answer");
  }
  if (lesson.recall.acceptedAnswers.length === 0) {
    failures.push("missing_recall_answer");
  }
  if (
    !lesson.transfer.changedContext ||
    !lesson.transfer.situationVi.trim() ||
    !lesson.transfer.promptVi.trim() ||
    lesson.transfer.minimumWords < 3 ||
    lesson.transfer.intents.length < 2 ||
    lesson.transfer.intents.some(
      (intent) =>
        !intent.id.trim() ||
        !intent.labelVi.trim() ||
        intent.acceptedSignals.length === 0 ||
        intent.acceptedSignals.some((signal) => !signal.trim()),
    )
  ) {
    failures.push("invalid_transfer_task");
  }

  return failures;
}

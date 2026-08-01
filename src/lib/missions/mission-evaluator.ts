import type {
  MissionIntent,
  MissionSpecV1,
  MissionTransferVariant,
} from "@/lib/missions/mission-spec";

export interface MissionCorrection {
  code: string;
  original?: string;
  suggestion: string;
  explanationVi: string;
}

export interface MissionEvaluationResult {
  status: "scored" | "unscored";
  taskCompleted: boolean;
  taskScore: number | null;
  completedIntentIds: string[];
  missingIntentIds: string[];
  corrections: MissionCorrection[];
  retryRequired: boolean;
  retryInstructionVi: string;
  rubric: {
    taskCompletion: number | null;
    interaction: number | null;
    languageControl: number | null;
    comprehensibility: null;
    pronunciation: null;
  };
  evidence: {
    transcriptAvailable: boolean;
    acousticEvidenceAvailable: false;
    evaluator: "deterministic-intent-match";
    evaluatorVersion: "1.1.0";
  };
}

function normalizeTranscript(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\bi'm\b/g, "i am")
    .replace(/\bi've\b/g, "i have")
    .replace(/\bdidn't\b/g, "did not")
    .replace(/\bwhat's\b/g, "what is")
    .replace(/[.,!?;:"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesIntent(transcript: string, intent: MissionIntent) {
  return intent.matchers.some((source) => {
    try {
      return new RegExp(source, "i").test(transcript);
    } catch {
      return transcript.includes(source.toLowerCase());
    }
  });
}

function findLanguageCorrections(transcript: string): MissionCorrection[] {
  const corrections: MissionCorrection[] = [];
  const missingBe = transcript.match(/\bmy name\s+([a-z]+)\b/);
  if (missingBe && !/\bmy name is\b/.test(transcript)) {
    corrections.push({
      code: "missing_be_after_my_name",
      original: missingBe[0],
      suggestion: `My name is ${missingBe[1]}.`,
      explanationVi: "Tiếng Anh cần động từ 'is' sau 'My name'.",
    });
  }

  const missingWorkAs = transcript.match(
    /\bi work\s+(designer|developer|engineer|teacher|student|manager|accountant|marketer|salesperson|assistant)\b/,
  );
  if (missingWorkAs) {
    corrections.push({
      code: "missing_work_as",
      original: missingWorkAs[0],
      suggestion: `I work as a ${missingWorkAs[1]}.`,
      explanationVi: "Dùng 'work as' trước nghề nghiệp hoặc vai trò.",
    });
  }

  return corrections;
}

function missingIntentCorrection(intent: MissionIntent): MissionCorrection {
  return {
    code: `missing_intent:${intent.id}`,
    suggestion: intent.examples[0] ?? "Hãy thử nói lại ý còn thiếu.",
    explanationVi: `Bạn chưa thể hiện rõ mục tiêu: ${intent.descriptionVi}`,
  };
}

export function evaluateMissionTranscript(
  mission: MissionSpecV1,
  transcripts: string[],
): MissionEvaluationResult {
  const combined = normalizeTranscript(transcripts.filter(Boolean).join(" "));
  if (!combined) {
    return {
      status: "unscored",
      taskCompleted: false,
      taskScore: null,
      completedIntentIds: [],
      missingIntentIds: mission.intents
        .filter((intent) => intent.required)
        .map((intent) => intent.id),
      corrections: [],
      retryRequired: true,
      retryInstructionVi:
        "Chưa có transcript đáng tin cậy. Hãy nói lại thành tiếng hoặc dùng trình duyệt hỗ trợ nhận diện giọng nói.",
      rubric: {
        taskCompletion: null,
        interaction: null,
        languageControl: null,
        comprehensibility: null,
        pronunciation: null,
      },
      evidence: {
        transcriptAvailable: false,
        acousticEvidenceAvailable: false,
        evaluator: "deterministic-intent-match",
        evaluatorVersion: "1.1.0",
      },
    };
  }

  const completedIntents = mission.intents.filter((intent) =>
    matchesIntent(combined, intent),
  );
  const requiredIntents = mission.intents.filter((intent) => intent.required);
  const missingRequired = requiredIntents.filter(
    (intent) => !completedIntents.some((completed) => completed.id === intent.id),
  );
  const completionRatio =
    requiredIntents.length === 0
      ? 1
      : (requiredIntents.length - missingRequired.length) / requiredIntents.length;
  const taskCompleted =
    completionRatio >= mission.evaluation.requiredIntentPassRatio;

  const corrections = [
    ...findLanguageCorrections(combined),
    ...missingRequired.map(missingIntentCorrection),
  ].slice(0, mission.evaluation.maxCorrections);

  const hasQuestion = completedIntents.some((intent) => intent.id === "ask_name");
  const hasRepair = completedIntents.some(
    (intent) => intent.id === "repair_request",
  );
  const interactionScore = hasQuestion && hasRepair ? 4 : hasQuestion || hasRepair ? 2 : 0;
  const taskRubric = Math.round(completionRatio * 4);
  const languageControl = findLanguageCorrections(combined).length === 0 ? 4 : 2;

  return {
    status: "scored",
    taskCompleted,
    taskScore: Math.round(completionRatio * 100),
    completedIntentIds: completedIntents.map((intent) => intent.id),
    missingIntentIds: missingRequired.map((intent) => intent.id),
    corrections,
    // Retrieval practice happens immediately even after a perfect first attempt.
    retryRequired: mission.retry.requiredAfterFeedback,
    retryInstructionVi:
      corrections.length > 0
        ? `Hãy nói lại, tập trung vào: ${corrections
            .map((correction) => correction.suggestion)
            .join(" / ")}`
        : "Bạn đã hoàn thành nhiệm vụ. Hãy nói lại một lần nữa mà không nhìn câu mẫu.",
    rubric: {
      taskCompletion: taskRubric,
      interaction: interactionScore,
      languageControl,
      comprehensibility: null,
      pronunciation: null,
    },
    evidence: {
      transcriptAvailable: true,
      acousticEvidenceAvailable: false,
      evaluator: "deterministic-intent-match",
      evaluatorVersion: "1.1.0",
    },
  };
}

export function selectDueTransferVariant(
  mission: MissionSpecV1,
  completedAt: Date,
  now: Date,
): MissionTransferVariant | null {
  const elapsedDays = Math.floor(
    (now.getTime() - completedAt.getTime()) / (24 * 60 * 60 * 1000),
  );

  return (
    [...mission.transferVariants]
      .sort((a, b) => b.dueAfterDays - a.dueAfterDays)
      .find((variant) => elapsedDays >= variant.dueAfterDays) ?? null
  );
}

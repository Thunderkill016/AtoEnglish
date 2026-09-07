export interface SpeakingTaskCriterionResult {
  id: "greeting" | "identity" | "personal-info" | "interaction" | "closing";
  labelVi: string;
  met: boolean;
}

export interface SpeakingTaskEvaluation {
  unitId: string;
  criteria: SpeakingTaskCriterionResult[];
  metCount: number;
  total: number;
  accomplished: boolean;
  /** Practice feedback only. This must never be promoted to CEFR mastery evidence. */
  evidenceKind: "practice-task-feedback";
}

const normalize = (transcript: string) =>
  transcript
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z'?\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function evaluateUnit1(transcript: string): SpeakingTaskEvaluation {
  const text = normalize(transcript);

  const criteria: SpeakingTaskCriterionResult[] = [
    {
      id: "greeting",
      labelVi: "Mở đầu bằng lời chào phù hợp.",
      met: /\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text),
    },
    {
      id: "identity",
      labelVi: "Tự giới thiệu tên.",
      met: /\bmy name is\b/.test(text) || /\bi(?:'m| am)\s+(?!from\b)[a-z]+\b/.test(text),
    },
    {
      id: "personal-info",
      labelVi: "Nói ít nhất một thông tin cá nhân đơn giản.",
      met:
        /\bi(?:'m| am) from\b/.test(text) ||
        /\bi (?:live|work|study) (?:in|at)\b/.test(text) ||
        /\bi(?:'m| am) (?:a|an)\s+[a-z]+\b/.test(text),
    },
    {
      id: "interaction",
      labelVi: "Hỏi người đối thoại ít nhất một câu đơn giản.",
      met:
        /\b(where are you from|what(?:'s| is) your name|how are you|and you|how about you|what about you)\b/.test(text) ||
        /\b(?:where|what|how|do|are|can)\b[^?]{0,50}\b(?:you|your)\b\??/.test(text),
    },
    {
      id: "closing",
      labelVi: "Kết thúc cuộc gặp lịch sự.",
      met: /\b(goodbye|bye|see you|see you later|have a nice day|nice meeting you)\b/.test(text),
    },
  ];

  const metCount = criteria.filter((criterion) => criterion.met).length;

  return {
    unitId: "unit-1",
    criteria,
    metCount,
    total: criteria.length,
    accomplished: metCount === criteria.length,
    evidenceKind: "practice-task-feedback",
  };
}

/**
 * Returns task-accomplishment feedback only for units with an explicitly designed evaluator.
 * Undefined means the unit must continue using its existing practice feedback until a rubric is authored.
 */
export function evaluateSpeakingTask(
  unitId: string,
  transcript: string
): SpeakingTaskEvaluation | undefined {
  if (unitId === "unit-1") return evaluateUnit1(transcript);
  return undefined;
}

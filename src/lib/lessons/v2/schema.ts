export type CefrLevel = "PRE_A1" | "A1" | "A2" | "B1" | "B2";
export type LegacyLevel = "A0" | "A1" | "A2" | "B1" | "B2";

export type CommunicativeActivity =
  | "reception"
  | "production"
  | "interaction"
  | "mediation";

export type LessonDomain =
  | "personal"
  | "public"
  | "occupational"
  | "educational";

export type EvidenceType =
  | "selected_response"
  | "constructed_response"
  | "asr_transcript"
  | "audio_recording"
  | "task_checklist"
  | "self_assessment";

export interface CanDoOutcome {
  id: string;
  level: CefrLevel;
  activity: CommunicativeActivity;
  domain: LessonDomain;
  statementEn: string;
  statementVi: string;
  source: "cefr" | "ato-adapted";
  sourceReference?: string;
}

export type LanguageTargetKind =
  | "chunk"
  | "grammar_pattern"
  | "pronunciation"
  | "discourse_move"
  | "repair_strategy"
  | "pragmatics";

export interface LanguageTarget {
  id: string;
  kind: LanguageTargetKind;
  form: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  priority: "core" | "support";
  l1NoteVi?: string;
  pronunciationGoal?: string;
}

export interface DialogueTurnV2 {
  speaker: string;
  text: string;
  translationVi?: string;
  targetIds?: string[];
}

export interface ScenarioStep {
  id: string;
  kind: "scenario";
  estimatedMinutes: number;
  titleVi: string;
  roleVi: string;
  situationVi: string;
  goalVi: string;
}

export interface ModelStep {
  id: string;
  kind: "model";
  estimatedMinutes: number;
  titleVi: string;
  turns: DialogueTurnV2[];
  audioSrc?: string;
  replayRates?: number[];
}

export interface NoticeStep {
  id: string;
  kind: "notice";
  estimatedMinutes: number;
  titleVi: string;
  targetIds: string[];
  explanationVi?: string;
}

export type PracticeExercise =
  | {
      id: string;
      kind: "select";
      promptVi: string;
      options: string[];
      answer: string;
      targetIds: string[];
    }
  | {
      id: string;
      kind: "order";
      promptVi: string;
      tokens: string[];
      answer: string;
      targetIds: string[];
    }
  | {
      id: string;
      kind: "recall";
      promptVi: string;
      answer: string;
      acceptedAnswers?: string[];
      targetIds: string[];
    }
  | {
      id: string;
      kind: "listen";
      promptVi: string;
      audioText: string;
      options: string[];
      answer: string;
      targetIds: string[];
    };

export interface PracticeStep {
  id: string;
  kind: "practice";
  estimatedMinutes: number;
  titleVi: string;
  exercises: PracticeExercise[];
  adaptive?: boolean;
}

export interface RehearsalStep {
  id: string;
  kind: "rehearsal";
  estimatedMinutes: number;
  titleVi: string;
  promptVi: string;
  frameEn?: string;
  keyWords?: string[];
  targetIds: string[];
}

export type RubricDimension =
  | "task_achievement"
  | "comprehensibility"
  | "fluency"
  | "language_control"
  | "interaction_repair";

export interface PerformanceTask {
  roleVi: string;
  contextVi: string;
  goalVi: string;
  promptEn?: string;
  promptVi: string;
  successCriteriaVi: string[];
  targetIds: string[];
  evidence: EvidenceType[];
  attempts: 1 | 2 | 3;
  preparationSeconds?: number;
  responseSeconds?: number;
  rubric: RubricDimension[];
}

export interface PerformanceStep {
  id: string;
  kind: "performance";
  estimatedMinutes: number;
  titleVi: string;
  task: PerformanceTask;
}

export interface FeedbackStep {
  id: string;
  kind: "feedback";
  estimatedMinutes: number;
  titleVi: string;
  priorityOrder: RubricDimension[];
  repairPromptsVi: string[];
}

export interface ExitStep {
  id: string;
  kind: "exit";
  estimatedMinutes: number;
  titleVi: string;
  canDoCheckVi: string;
  reviewTargetIds: string[];
  confidencePromptVi?: string;
}

export type LessonStepV2 =
  | ScenarioStep
  | ModelStep
  | NoticeStep
  | PracticeStep
  | RehearsalStep
  | PerformanceStep
  | FeedbackStep
  | ExitStep;

export interface LessonV2 {
  schemaVersion: 2;
  id: string;
  missionId: string;
  legacyUnitId?: string;
  titleVi: string;
  titleEn: string;
  level: CefrLevel;
  legacyLevel?: LegacyLevel;
  estimatedMinutes: number;
  primaryOutcome: CanDoOutcome;
  secondaryOutcomes?: CanDoOutcome[];
  prerequisiteLessonIds: string[];
  targets: LanguageTarget[];
  steps: LessonStepV2[];
  tags: string[];
}

export interface LevelDesignBudget {
  minMinutes: number;
  maxMinutes: number;
  minCoreTargets: number;
  maxCoreTargets: number;
  minPerformanceSeconds: number;
  maxPerformanceSeconds: number;
}

/**
 * AtoEnglish product constraints. These are not official CEFR limits.
 */
export const LEVEL_DESIGN_BUDGETS: Record<CefrLevel, LevelDesignBudget> = {
  PRE_A1: {
    minMinutes: 8,
    maxMinutes: 12,
    minCoreTargets: 3,
    maxCoreTargets: 5,
    minPerformanceSeconds: 10,
    maxPerformanceSeconds: 25,
  },
  A1: {
    minMinutes: 10,
    maxMinutes: 15,
    minCoreTargets: 4,
    maxCoreTargets: 7,
    minPerformanceSeconds: 20,
    maxPerformanceSeconds: 45,
  },
  A2: {
    minMinutes: 12,
    maxMinutes: 18,
    minCoreTargets: 5,
    maxCoreTargets: 8,
    minPerformanceSeconds: 40,
    maxPerformanceSeconds: 75,
  },
  B1: {
    minMinutes: 15,
    maxMinutes: 20,
    minCoreTargets: 6,
    maxCoreTargets: 10,
    minPerformanceSeconds: 60,
    maxPerformanceSeconds: 120,
  },
  B2: {
    minMinutes: 18,
    maxMinutes: 25,
    minCoreTargets: 6,
    maxCoreTargets: 12,
    minPerformanceSeconds: 90,
    maxPerformanceSeconds: 180,
  },
};

export const LEGACY_TO_CEFR_LEVEL: Record<LegacyLevel, CefrLevel> = {
  A0: "PRE_A1",
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
};

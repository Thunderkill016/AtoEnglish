import type { UnitData } from "@/components/learn/UnitTemplate";
import { UNITS } from "@/lib/constants/units";
import { UNIT_DATA_ENTRIES } from "@/lib/data/unit-registry";
import {
  LESSON_QUALITY_CRITERIA,
  LESSON_QUALITY_MAX_SCORE,
  LESSON_QUALITY_PASS_SCORE,
} from "@/lib/learning/atoenglish-plan";

export interface CriterionResult {
  id: string;
  label: string;
  maxPoints: number;
  points: number;
  evidence: string;
  fix?: string;
}

export interface UnitQualityReport {
  unitId: string;
  title: string;
  level: string;
  score: number;
  maxScore: number;
  passed: boolean;
  criticalIssues: string[];
  strengths: string[];
  criteria: CriterionResult[];
}

export interface QualitySummary {
  averageScore: number;
  passCount: number;
  failCount: number;
  totalUnits: number;
  weakestCriteria: Array<{
    id: string;
    label: string;
    averagePercent: number;
  }>;
  reports: UnitQualityReport[];
}

const criterionById = Object.fromEntries(
  LESSON_QUALITY_CRITERIA.map((criterion) => [criterion.id, criterion])
);

function points(id: string, awarded: number, evidence: string, fix?: string): CriterionResult {
  const criterion = criterionById[id];
  if (!criterion) {
    throw new Error(`Unknown lesson quality criterion: ${id}`);
  }

  return {
    id,
    label: criterion.label,
    maxPoints: criterion.points,
    points: Math.max(0, Math.min(awarded, criterion.points)),
    evidence,
    fix,
  };
}

function textIncludes(text: string, terms: string[]) {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
}

function getUnitMeta(unitId: string) {
  return UNITS.find((unit) => unit.id === unitId);
}

function scoreCanDo(unit: UnitData) {
  const outcomes = unit.learningOutcomes?.length ?? 0;
  if (outcomes >= 2 && unit.situation) {
    return points("can_do", 10, `${outcomes} learning outcomes plus real-world situation.`);
  }
  if (outcomes >= 1) {
    return points(
      "can_do",
      7,
      `${outcomes} learning outcome(s), but the real-world situation is thin.`,
      "Add a concrete situation and 2-3 observable can-do outcomes."
    );
  }

  return points(
    "can_do",
    3,
    "No explicit learningOutcomes found.",
    "Add learningOutcomes that start with what the learner can do after this unit."
  );
}

function scoreComprehensibleInput(unit: UnitData) {
  const vocabCount = unit.vocab.length;
  const hasAudioOrPhonetic = unit.vocab.filter((item) => item.audio || item.phonetic).length;
  const hasDialogue = unit.dialogues.length > 0;
  const hasListenCheck = unit.listenAndChoose.length > 0;
  const hasWarmup = unit.warmupGreetings.length > 0;

  let score = 0;
  if (vocabCount >= 4 && vocabCount <= 20) score += 5;
  else if (vocabCount > 0) score += 3;
  if (hasAudioOrPhonetic >= Math.max(1, Math.round(vocabCount * 0.8))) score += 4;
  else if (hasAudioOrPhonetic > 0) score += 2;
  if (hasWarmup) score += 2;
  if (hasDialogue) score += 2;
  if (hasListenCheck) score += 2;

  return points(
    "comprehensible_input",
    score,
    `${vocabCount} vocab items, ${hasAudioOrPhonetic} with audio/phonetic support, dialogue=${hasDialogue}, listen check=${hasListenCheck}.`,
    score < 12
      ? "Keep input small, add audio/phonetic support, and include a short listening check."
      : undefined
  );
}

function scoreRetrievalOutput(unit: UnitData) {
  const hasPractice =
    (unit.practiceQuiz?.length ?? 0) > 0 ||
    (unit.matchingExercise?.pairs.length ?? 0) > 0 ||
    (unit.scrambleExercises?.length ?? 0) > 0;
  const hasTranslation = (unit.practiceTranslate?.length ?? 0) > 0;
  const hasSpeaking = Boolean(unit.speaking?.level1Prompt && unit.speaking.level2Situation);
  const hasFinalQuiz = unit.quiz.length > 0;

  let score = 0;
  if (hasPractice) score += 5;
  if (hasTranslation) score += 3;
  if (hasSpeaking) score += 4;
  if (hasFinalQuiz) score += 3;

  return points(
    "retrieval_output",
    score,
    `practice=${hasPractice}, translation=${hasTranslation}, speaking=${hasSpeaking}, final quiz=${hasFinalQuiz}.`,
    score < 12 ? "Add recognition, sentence-building, spoken output, and final retrieval quiz." : undefined
  );
}

function scoreFeedback(unit: UnitData) {
  const hasGrammarNote = Boolean(unit.grammar?.tip || unit.grammar?.vnNote || unit.grammar?.ccq?.explanation);
  const hasPronunciationTip =
    (unit.pronunciationFocus?.examples.some((example) => example.tip.length > 0) ?? false) ||
    textIncludes(unit.culturalNote, ["loi", "phat am", "am cuoi", "nguoi viet"]);
  const hasRetryableSpeaking = Boolean(unit.speaking?.level1Prompt && unit.speaking.level2Hint);

  let score = 0;
  if (hasGrammarNote) score += 5;
  if (hasPronunciationTip) score += 5;
  if (hasRetryableSpeaking) score += 5;

  return points(
    "feedback",
    score,
    `grammar note=${hasGrammarNote}, pronunciation tip=${hasPronunciationTip}, retryable speaking=${hasRetryableSpeaking}.`,
    score < 12 ? "Add short Vietnamese correction notes and a clear retry action for speaking/writing." : undefined
  );
}

function scoreSrs(unit: UnitData) {
  const vocabWithExamples = unit.vocab.filter((item) => item.example && item.meaning).length;
  const hasFluencyDrill = (unit.fluencyDrill?.items.length ?? 0) > 0;
  const hasCumulativeReview = (unit.cumulativeReviewQuestions?.length ?? 0) > 0;

  let score = 0;
  if (vocabWithExamples >= Math.max(1, Math.round(unit.vocab.length * 0.8))) score += 5;
  else if (vocabWithExamples > 0) score += 3;
  if (hasFluencyDrill) score += 3;
  if (hasCumulativeReview) score += 2;

  return points(
    "srs",
    score,
    `${vocabWithExamples}/${unit.vocab.length} vocab items have meaning+example, fluency drill=${hasFluencyDrill}, cumulative review=${hasCumulativeReview}.`,
    score < 8 ? "Ensure reviewable items have meaning, example, and a later review/fluency activity." : undefined
  );
}

function scoreVietnameseErrors(unit: UnitData) {
  const combinedText = [
    unit.description,
    unit.culturalNote,
    unit.grammar?.vnNote,
    unit.pronunciationFocus?.description,
    ...(unit.pronunciationFocus?.examples.map((example) => example.tip) ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  const hasVietnameseErrorFocus = textIncludes(combinedText, [
    "nguoi viet",
    "tieng viet",
    "am cuoi",
    "coda",
    "final",
    "word order",
    "be",
    "plural",
    "stress",
    "trong am",
  ]);
  const hasPronunciationFocus = Boolean(unit.pronunciationFocus);

  const score = hasVietnameseErrorFocus && hasPronunciationFocus ? 10 : hasVietnameseErrorFocus ? 7 : 3;

  return points(
    "vietnamese_errors",
    score,
    `Vietnamese transfer focus=${hasVietnameseErrorFocus}, pronunciationFocus=${hasPronunciationFocus}.`,
    score < 8 ? "Tag one likely Vietnamese learner error and add a pronunciation or grammar contrast note." : undefined
  );
}

function scoreCognitiveLoad(unit: UnitData) {
  const meta = getUnitMeta(unit.unitId);
  const estimatedTime = meta?.estimatedTime ?? unit.estimatedTime;
  const vocabCount = unit.vocab.length;
  const outcomes = unit.learningOutcomes?.length ?? 0;

  let score = 0;
  if (estimatedTime <= 60) score += 3;
  else if (estimatedTime <= 75) score += 2;
  if (vocabCount <= 14) score += 4;
  else if (vocabCount <= 20) score += 2;
  if (outcomes <= 3) score += 3;
  else score += 1;

  return points(
    "cognitive_load",
    score,
    `${estimatedTime} minutes, ${vocabCount} vocab items, ${outcomes} outcomes.`,
    score < 8 ? "Reduce new items or split the unit into smaller lessons." : undefined
  );
}

function scoreAssessment(unit: UnitData) {
  const hasFinalQuiz = unit.quiz.length >= 3;
  const hasListeningAssessment = unit.listenAndChoose.length >= 1;
  const hasSpeakingAssessment = Boolean(unit.speaking?.level2Situation);
  const hasProduction = (unit.practiceTranslate?.length ?? 0) > 0 || (unit.scrambleExercises?.length ?? 0) > 0;

  let score = 0;
  if (hasFinalQuiz) score += 3;
  if (hasListeningAssessment) score += 2;
  if (hasSpeakingAssessment) score += 3;
  if (hasProduction) score += 2;

  return points(
    "assessment",
    score,
    `final quiz=${hasFinalQuiz}, listening=${hasListeningAssessment}, speaking=${hasSpeakingAssessment}, production=${hasProduction}.`,
    score < 8 ? "Add a mastery check that includes listening plus spoken or written production." : undefined
  );
}

function scoreSafety(unit: UnitData) {
  const text = [unit.description, unit.culturalNote, unit.grammar?.tip, unit.grammar?.vnNote]
    .filter(Boolean)
    .join(" ");
  const hasOverpromise = textIncludes(text, [
    "dam bao",
    "chac chan",
    "native",
    "ban xu",
    "ielts 6.5+",
    "band 7+",
  ]);

  return points(
    "safety",
    hasOverpromise ? 2 : 5,
    hasOverpromise ? "Potential overpromise language found." : "No obvious overpromise wording found.",
    hasOverpromise ? "Replace guaranteed-score/native-accent wording with readiness or intelligibility language." : undefined
  );
}

export function evaluateUnitQuality(unit: UnitData): UnitQualityReport {
  const criteria = [
    scoreCanDo(unit),
    scoreComprehensibleInput(unit),
    scoreRetrievalOutput(unit),
    scoreFeedback(unit),
    scoreSrs(unit),
    scoreVietnameseErrors(unit),
    scoreCognitiveLoad(unit),
    scoreAssessment(unit),
    scoreSafety(unit),
  ];
  const score = criteria.reduce((sum, criterion) => sum + criterion.points, 0);
  const criticalIssues = criteria
    .filter((criterion) => criterion.points < Math.ceil(criterion.maxPoints * 0.55))
    .map((criterion) => criterion.fix ?? `${criterion.label} needs improvement.`);
  const strengths = criteria
    .filter((criterion) => criterion.points >= Math.ceil(criterion.maxPoints * 0.85))
    .map((criterion) => criterion.label);

  return {
    unitId: unit.unitId,
    title: unit.title,
    level: unit.level,
    score,
    maxScore: LESSON_QUALITY_MAX_SCORE,
    passed: score >= LESSON_QUALITY_PASS_SCORE && criticalIssues.length === 0,
    criticalIssues,
    strengths,
    criteria,
  };
}

export function getQualitySummary(): QualitySummary {
  const reports = UNIT_DATA_ENTRIES.map((entry) => evaluateUnitQuality(entry.data));
  const totalUnits = reports.length;
  const passCount = reports.filter((report) => report.passed).length;
  const averageScore = Math.round(
    reports.reduce((sum, report) => sum + report.score, 0) / Math.max(totalUnits, 1)
  );

  const weakestCriteria = LESSON_QUALITY_CRITERIA.map((criterion) => {
    const awarded = reports.reduce((sum, report) => {
      const result = report.criteria.find((item) => item.id === criterion.id);
      return sum + (result?.points ?? 0);
    }, 0);
    const possible = reports.length * criterion.points;

    return {
      id: criterion.id,
      label: criterion.label,
      averagePercent: Math.round((awarded / Math.max(possible, 1)) * 100),
    };
  })
    .sort((a, b) => a.averagePercent - b.averagePercent)
    .slice(0, 3);

  return {
    averageScore,
    passCount,
    failCount: totalUnits - passCount,
    totalUnits,
    weakestCriteria,
    reports: reports.sort((a, b) => a.score - b.score),
  };
}

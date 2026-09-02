import type { EvidenceType } from "../learning/evidence";
import type { EvidenceChannel } from "./capabilities.v1";

export type ProvenanceKind = "source_derived" | "product_inference";
export type LessonModality = "listen" | "read" | "speech" | "text" | "choice";
export type LessonActionKind =
  | "context"
  | "comprehend"
  | "notice"
  | "retrieve"
  | "produce"
  | "feedback"
  | "repair"
  | "retry"
  | "transfer";

export type LessonAssessment = {
  /** Capability that this exact learner response attempted to demonstrate. */
  targetCapabilityId: string;
  /** Null means persist the attempt only; do not promote it to mastery evidence. */
  evidenceType: EvidenceType | null;
  /** Stable task context used by persisted-history transfer checks. */
  contextId: string;
  evaluator: string;
};

export type LessonAction = {
  id: string;
  kind: LessonActionKind;
  title: string;
  instruction: string;
  modality: LessonModality;
  prompt?: string;
  model?: string;
  supportVi?: string;
  targetSignals?: string[];
  /** Every group is required; one signal from each group must be observed. */
  requiredSignalGroups?: string[][];
  changedContext?: boolean;
  revealsAnswer?: boolean;
  assessment?: LessonAssessment;
};

export type LessonContract = {
  id: string;
  version: 1;
  capabilityId: string;
  embeddedCapabilityIds: string[];
  prerequisites: string[];
  mission: string;
  learnerCanDo: string;
  newItems: string[];
  reviewTargets: string[];
  evidenceChannels: EvidenceChannel[];
  sourceDerived: {
    principleIds: string[];
    claimIds: string[];
  };
  productInference: {
    maxNewItems: number;
    notes: string[];
  };
  actions: LessonAction[];
};

export type QaIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  provenance: ProvenanceKind;
};

const evaluatedKinds = new Set<LessonActionKind>([
  "comprehend",
  "retrieve",
  "produce",
  "repair",
  "retry",
  "transfer",
]);

function hasEvaluatorTargets(action: LessonAction) {
  return (action.targetSignals?.length ?? 0) > 0 || (action.requiredSignalGroups?.some((group) => group.length > 0) ?? false);
}

export function qaLesson(lesson: LessonContract): QaIssue[] {
  const issues: QaIssue[] = [];
  const kinds = lesson.actions.map((action) => action.kind);
  const firstRetrieve = kinds.indexOf("retrieve");
  const firstReveal = lesson.actions.findIndex((action) => action.revealsAnswer === true);
  const production = lesson.actions.find((action) => action.kind === "produce");
  const repair = lesson.actions.find((action) => action.kind === "repair");
  const retry = lesson.actions.find((action) => action.kind === "retry");
  const transfer = lesson.actions.find((action) => action.kind === "transfer");
  const declaredTargets = new Set([lesson.capabilityId, ...lesson.embeddedCapabilityIds]);

  if (!lesson.capabilityId) {
    issues.push({ severity: "error", code: "CAPABILITY_REQUIRED", message: "Lesson must declare a capability ID.", provenance: "product_inference" });
  }
  if (!Array.isArray(lesson.prerequisites)) {
    issues.push({ severity: "error", code: "PREREQUISITES_REQUIRED", message: "Lesson must declare prerequisite metadata.", provenance: "product_inference" });
  }
  if (lesson.newItems.length > lesson.productInference.maxNewItems) {
    issues.push({ severity: "error", code: "TOO_MANY_NEW_ITEMS", message: `Lesson introduces ${lesson.newItems.length} items; V1 preview cap is ${lesson.productInference.maxNewItems}.`, provenance: "product_inference" });
  }
  if (firstRetrieve === -1 || (firstReveal !== -1 && firstReveal < firstRetrieve)) {
    issues.push({ severity: "error", code: "ATTEMPT_BEFORE_REVEAL", message: "Retrieval attempt must happen before answer-bearing reveal.", provenance: "source_derived" });
  }
  if (!production || production.modality !== "speech") {
    issues.push({ severity: "error", code: "SPEAKING_NEEDS_SPEECH", message: "A speaking claim requires an observable speech response path.", provenance: "source_derived" });
  }
  for (const required of ["feedback", "repair", "retry"] as const) {
    if (!kinds.includes(required)) {
      issues.push({ severity: "error", code: `MISSING_${required.toUpperCase()}`, message: `Lesson must include ${required}.`, provenance: "source_derived" });
    }
  }
  if (!transfer || transfer.modality !== "speech" || !transfer.changedContext) {
    issues.push({ severity: "error", code: "TRANSFER_NEEDS_CHANGED_SPEECH", message: "Transfer requires productive speech in a changed context.", provenance: "source_derived" });
  }
  if (lesson.reviewTargets.length === 0 || !lesson.evidenceChannels.includes("retention")) {
    issues.push({ severity: "error", code: "DELAYED_REVIEW_REQUIRED", message: "Lesson must publish review targets and a retention evidence channel.", provenance: "source_derived" });
  }
  if (lesson.sourceDerived.principleIds.length === 0 || lesson.sourceDerived.claimIds.length === 0) {
    issues.push({ severity: "error", code: "EVIDENCE_TRACE_REQUIRED", message: "Lesson must trace to research principle and claim IDs.", provenance: "product_inference" });
  }

  for (const action of lesson.actions) {
    if (evaluatedKinds.has(action.kind) && !action.assessment) {
      issues.push({ severity: "error", code: "ASSESSMENT_TARGET_REQUIRED", message: `${action.id} must declare its learning-core assessment target.`, provenance: "product_inference" });
      continue;
    }
    if (evaluatedKinds.has(action.kind) && !hasEvaluatorTargets(action)) {
      issues.push({ severity: "error", code: "EVALUATOR_TARGET_REQUIRED", message: `${action.id} must declare deterministic target signals for evaluation.`, provenance: "product_inference" });
    }
    if (action.assessment && !declaredTargets.has(action.assessment.targetCapabilityId)) {
      issues.push({ severity: "error", code: "ASSESSMENT_TARGET_UNDECLARED", message: `${action.id} targets ${action.assessment.targetCapabilityId}, which is not the lesson capability or an embedded capability.`, provenance: "product_inference" });
    }
  }

  const comprehension = lesson.actions.find((action) => action.kind === "comprehend");
  const retrieval = lesson.actions.find((action) => action.kind === "retrieve");
  if (comprehension?.assessment && comprehension.assessment.evidenceType !== "recognition") {
    issues.push({ severity: "error", code: "COMPREHENSION_PERSISTS_MODAL_EVIDENCE", message: "Choice comprehension in this slice must persist low-level recognition evidence, not a product-level comprehension label.", provenance: "product_inference" });
  }
  if (retrieval?.assessment && retrieval.assessment.evidenceType !== "retrieval") {
    issues.push({ severity: "error", code: "RETRIEVAL_EVIDENCE_MISMATCH", message: "Retrieval action must persist retrieval evidence.", provenance: "product_inference" });
  }
  if (production?.assessment && production.assessment.evidenceType !== "production") {
    issues.push({ severity: "error", code: "PRODUCTION_EVIDENCE_MISMATCH", message: "Production action must persist production evidence.", provenance: "product_inference" });
  }
  if (repair?.assessment && repair.assessment.evidenceType !== "repair") {
    issues.push({ severity: "error", code: "REPAIR_EVIDENCE_MISMATCH", message: "Repair action must persist repair evidence.", provenance: "product_inference" });
  }
  if (retry?.assessment && firstReveal !== -1 && lesson.actions.indexOf(retry) > firstReveal && retry.assessment.evidenceType !== null) {
    issues.push({ severity: "error", code: "SUPPORTED_RETRY_ATTEMPT_ONLY", message: "Retry after answer-bearing feedback must be stored as an attempt without independent mastery evidence.", provenance: "product_inference" });
  }
  if (transfer?.assessment) {
    if (transfer.assessment.evidenceType !== "transfer") {
      issues.push({ severity: "error", code: "TRANSFER_EVIDENCE_MISMATCH", message: "Transfer action must persist transfer evidence.", provenance: "product_inference" });
    }
    if (production?.assessment && transfer.assessment.targetCapabilityId !== production.assessment.targetCapabilityId) {
      issues.push({ severity: "error", code: "TRANSFER_TARGET_MISMATCH", message: "Transfer must test the same capability target as the independent production it is transferring.", provenance: "product_inference" });
    }
    if (production?.assessment && transfer.assessment.contextId === production.assessment.contextId) {
      issues.push({ severity: "error", code: "TRANSFER_CONTEXT_NOT_CHANGED", message: "Transfer must declare a context different from the earlier successful production context.", provenance: "source_derived" });
    }
    if ((transfer.requiredSignalGroups?.length ?? 0) < 2) {
      issues.push({ severity: "error", code: "TRANSFER_REQUIRES_MULTI_DEMAND_EVALUATION", message: "This transfer task must require both the repair move and the transferred introduction response.", provenance: "product_inference" });
    }
  }
  if (lesson.actions.some((action) => /this is a pen|that is the phone/i.test(action.model ?? action.prompt ?? ""))) {
    issues.push({ severity: "warning", code: "TEXTBOOK_LIKE_LANGUAGE", message: "Editorial review: language resembles isolated textbook examples.", provenance: "product_inference" });
  }
  return issues;
}

const introduceSignals = ["my name is", "i'm", "i am"];
const repairSignals = ["could you say that again", "say that again", "sorry"];

export const firstMeetingLessonV1: LessonContract = {
  id: "LESSON-CAP002-FIRST-MEETING-V1",
  version: 1,
  capabilityId: "CAP-002",
  embeddedCapabilityIds: ["CAP-003"],
  prerequisites: ["CAP-001"],
  mission: "Meet a new colleague, introduce yourself, recover from one missed turn, then do it again when the prompt changes.",
  learnerCanDo: "Introduce myself and ask for repetition during a short first meeting.",
  newItems: ["I'm …", "My name is …", "That's …", "Could you say that again?"],
  reviewTargets: ["My name is …", "That's …", "Could you say that again?"],
  evidenceChannels: ["comprehension", "retrieval", "production", "repair", "transfer", "retention"],
  sourceDerived: {
    principleIds: ["PRN-003", "PRN-050", "PRN-054", "PRN-058", "PRN-040", "PRN-045", "PRN-056", "PRN-016", "PRN-018", "PRN-001", "PRN-002"],
    claimIds: ["CLM-VOC-001", "CLM-SPK-001", "CLM-SPK-002", "CLM-SPK-007", "CLM-SPK-010", "CLM-SPK-008", "CLM-TRN-001", "CLM-TRN-005", "CLM-TRN-006", "CLM-SPK-006", "CLM-SCF-001", "CLM-SCF-004", "CLM-FND-001", "CLM-VOC-005"],
  },
  productInference: {
    maxNewItems: 6,
    notes: [
      "The six-item cap is a V1 editorial constraint to test, not a research conclusion.",
      "Transcript matching is language feedback only; it is not pronunciation scoring.",
      "Text fallback can demonstrate flow but cannot count as speaking evidence.",
      "Retry after answer-bearing feedback is attempt-only evidence.",
    ],
  },
  actions: [
    {
      id: "context",
      kind: "context",
      title: "A colleague meets you for the first time",
      instruction: "Listen for the job of each turn, not every word.",
      modality: "listen",
      model: "Hi, I'm Maya. What's your name?",
      supportVi: "Bối cảnh: gặp đồng nghiệp mới. Hỗ trợ tiếng Việt chỉ giải thích nhiệm vụ.",
    },
    {
      id: "comprehend",
      kind: "comprehend",
      title: "What does Maya need from you?",
      instruction: "Choose the information the question is asking for.",
      modality: "choice",
      prompt: "What's your name?",
      targetSignals: ["name"],
      assessment: {
        targetCapabilityId: "CAP-002",
        evidenceType: "recognition",
        contextId: "first-meeting:name-question:v1",
        evaluator: "nep-choice-v1",
      },
    },
    {
      id: "notice",
      kind: "notice",
      title: "Keep only the chunks needed for the mission",
      instruction: "Notice the frames; do not open a grammar chapter.",
      modality: "read",
      model: "My name is … / That's … / Could you say that again?",
      revealsAnswer: false,
    },
    {
      id: "retrieve",
      kind: "retrieve",
      title: "Pull the line out before seeing a full answer",
      instruction: "From the Vietnamese cue, say the English line from memory.",
      modality: "speech",
      prompt: "Chào. Tôi tên là Hoàng.",
      supportVi: "Không hiện đáp án trước lần thử đầu.",
      targetSignals: introduceSignals,
      requiredSignalGroups: [introduceSignals],
      assessment: {
        targetCapabilityId: "CAP-002",
        evidenceType: "retrieval",
        contextId: "first-meeting:vi-cue-introduction:v1",
        evaluator: "nep-target-signal-v1",
      },
    },
    {
      id: "produce",
      kind: "produce",
      title: "Introduce yourself aloud",
      instruction: "Say the response aloud. Browser transcript is used only to check target-language coverage.",
      modality: "speech",
      prompt: "Hi, I'm Maya. What's your name?",
      targetSignals: introduceSignals,
      requiredSignalGroups: [introduceSignals],
      assessment: {
        targetCapabilityId: "CAP-002",
        evidenceType: "production",
        contextId: "first-meeting:name-question:v1",
        evaluator: "nep-target-signal-v1",
      },
    },
    {
      id: "feedback",
      kind: "feedback",
      title: "Get one actionable language cue",
      instruction: "Feedback identifies missing target language; it does not score pronunciation.",
      modality: "read",
      revealsAnswer: true,
      model: "Try: My name is Hoang. That's H-O-A-N-G.",
    },
    {
      id: "repair",
      kind: "repair",
      title: "Repair the breakdown yourself",
      instruction: "The colleague's next turn is unclear. Ask for repetition before continuing.",
      modality: "speech",
      prompt: "Sorry — [you missed the question].",
      targetSignals: repairSignals,
      requiredSignalGroups: [repairSignals],
      assessment: {
        targetCapabilityId: "CAP-003",
        evidenceType: "repair",
        contextId: "first-meeting:missed-turn:v1",
        evaluator: "nep-target-signal-v1",
      },
    },
    {
      id: "retry",
      kind: "retry",
      title: "Retry the first-meeting response",
      instruction: "Use the repair move, then introduce yourself again.",
      modality: "speech",
      prompt: "Let's try that again. What's your name?",
      targetSignals: [...repairSignals, ...introduceSignals],
      requiredSignalGroups: [repairSignals, introduceSignals],
      assessment: {
        targetCapabilityId: "CAP-002",
        evidenceType: null,
        contextId: "first-meeting:name-question:retry:v1",
        evaluator: "nep-target-signal-v1",
      },
    },
    {
      id: "transfer",
      kind: "transfer",
      title: "Changed situation: the order flips",
      instruction: "This time you must ask for repetition first, then answer a differently phrased name question.",
      modality: "speech",
      prompt: "I didn't catch that. And what should I call you?",
      targetSignals: [...repairSignals, ...introduceSignals],
      requiredSignalGroups: [repairSignals, introduceSignals],
      changedContext: true,
      assessment: {
        targetCapabilityId: "CAP-002",
        evidenceType: "transfer",
        contextId: "first-meeting:changed-order-name-question:v1",
        evaluator: "nep-target-signal-v1",
      },
    },
  ],
};

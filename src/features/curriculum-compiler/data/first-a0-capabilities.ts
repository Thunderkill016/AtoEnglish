import type { CommunicativeCapability } from "@/features/curriculum-compiler/domain/contracts";

const FIRST_A0_EVIDENCE_POLICY = {
  requiresComprehension: true,
  requiresProductiveRecall: true,
  requiresInteractionalUse: true,
  requiresDelayedTransfer: true,
  minimumDistinctClips: 3,
  minimumDistinctSpeakers: 3,
} as const;

/**
 * First seven-day validation slice.
 *
 * recommendedOrder is editorial sequencing. prerequisiteIds only contains
 * capabilities that are genuinely required, so survival repair language can be
 * introduced without pretending it depends on the whole introduction sequence.
 */
export const FIRST_A0_CAPABILITIES: CommunicativeCapability[] = [
  {
    id: "a0.greet_someone",
    level: "A0",
    canDoVi: "Tôi có thể nhận ra và đáp lại một lời chào ngắn.",
    canDoEn: "I can recognize and respond to a short greeting.",
    recommendedOrder: 1,
    prerequisiteIds: [],
    communicativeFunctions: ["greeting", "acknowledging"],
    evidencePolicy: FIRST_A0_EVIDENCE_POLICY,
  },
  {
    id: "a0.say_ones_name",
    level: "A0",
    canDoVi: "Tôi có thể nói tên của mình sau khi chào.",
    canDoEn: "I can say my name after a greeting.",
    recommendedOrder: 2,
    prerequisiteIds: ["a0.greet_someone"],
    communicativeFunctions: ["introducing_self", "giving_name"],
    evidencePolicy: FIRST_A0_EVIDENCE_POLICY,
  },
  {
    id: "a0.ask_others_name",
    level: "A0",
    canDoVi: "Tôi có thể hỏi tên người đối diện và nghe câu trả lời ngắn.",
    canDoEn: "I can ask another person's name and understand a short answer.",
    recommendedOrder: 3,
    prerequisiteIds: ["a0.greet_someone", "a0.say_ones_name"],
    communicativeFunctions: ["asking_name", "turn_exchange"],
    evidencePolicy: FIRST_A0_EVIDENCE_POLICY,
  },
  {
    id: "a0.say_where_from",
    level: "A0",
    canDoVi: "Tôi có thể nói ngắn gọn mình đến từ đâu.",
    canDoEn: "I can briefly say where I am from.",
    recommendedOrder: 4,
    prerequisiteIds: ["a0.say_ones_name"],
    communicativeFunctions: ["giving_origin", "sharing_basic_information"],
    evidencePolicy: FIRST_A0_EVIDENCE_POLICY,
  },
  {
    id: "a0.request_repetition",
    level: "A0",
    canDoVi: "Tôi có thể yêu cầu người khác nhắc lại khi không nghe rõ.",
    canDoEn: "I can ask someone to repeat when I do not hear clearly.",
    recommendedOrder: 5,
    prerequisiteIds: [],
    communicativeFunctions: [
      "requesting_repetition",
      "repairing_misunderstanding",
    ],
    evidencePolicy: FIRST_A0_EVIDENCE_POLICY,
  },
];

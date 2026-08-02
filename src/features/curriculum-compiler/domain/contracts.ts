export type CurriculumLevel = "A0" | "A1" | "A2" | "B1";

export type PublicationStatus = "draft" | "pilot" | "approved" | "retired";

export type HumanReviewStatus =
  | "machine_draft"
  | "editor_reviewed"
  | "human_verified";

export type SourceProvider =
  | "youtube"
  | "owned"
  | "licensed_host"
  | "public_archive"
  | "other";

export type MediaAccessMethod =
  | "youtube_embed"
  | "self_hosted"
  | "external_embed";

export type RightsBasis =
  | "owned"
  | "written_permission"
  | "cc_by"
  | "public_domain"
  | "other";

export type RightsReviewStatus =
  | "unreviewed"
  | "needs_permission"
  | "human_verified"
  | "rejected";

export interface AllowedSourceUses {
  canEmbed: boolean;
  canStoreTranscript: boolean;
  canRunAsr: boolean;
  canCreateDerivedLesson: boolean;
  canSelfHostMedia: boolean;
  canUseCommercially: boolean;
}

export interface SourceRights {
  basis: RightsBasis;
  status: RightsReviewStatus;
  evidenceUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  attribution: string;
  requiresAttribution: boolean;
  allowedUses: AllowedSourceUses;
}

export interface SourceAsset {
  id: string;
  provider: SourceProvider;
  title: string;
  creator: string;
  sourceUrl: string;
  mediaUrl: string;
  mediaAccess: MediaAccessMethod;
  durationMs: number;
  language: "en";
  rights: SourceRights;
  transcriptProvenance:
    | "official"
    | "creator_provided"
    | "manual"
    | "asr_draft";
  transcriptSourceUrl?: string;
  publicationStatus: PublicationStatus;
}

export interface TranscriptSegment {
  id: string;
  sourceAssetId: string;
  speakerId: string | null;
  startMs: number;
  endMs: number;
  /** Verbatim text from the declared transcript source or reviewed audio. */
  sourceText: string;
  /** Learner-facing normalization. It never replaces sourceText. */
  displayText: string;
  translationVi: string;
  transcriptStatus: HumanReviewStatus;
  translationStatus: HumanReviewStatus;
}

export type SocialRelationship =
  | "strangers"
  | "friends"
  | "coworkers"
  | "customer_staff"
  | "teacher_student"
  | "other";

export type Formality = "casual" | "neutral" | "formal";

export type CommunicationChannel =
  | "in_person"
  | "phone"
  | "video_call"
  | "other";

export type SpeechFeature =
  | "linking"
  | "weak_forms"
  | "reduction"
  | "elision"
  | "assimilation"
  | "stress"
  | "intonation"
  | "hesitation"
  | "fast_speech"
  | "other";

export interface CommunicationContext {
  relationship: SocialRelationship;
  setting: string;
  formality: Formality;
  channel: CommunicationChannel;
}

export interface CommunicationClip {
  id: string;
  sourceAssetId: string;
  segmentIds: string[];
  startMs: number;
  endMs: number;
  primaryCapabilityId: string;
  secondaryCapabilityIds: string[];
  lexicalItems: string[];
  grammarPatterns: string[];
  speechFeatures: SpeechFeature[];
  context: CommunicationContext;
  reviewStatus: HumanReviewStatus;
  publicationStatus: PublicationStatus;
}

export interface CapabilityEvidencePolicy {
  requiresComprehension: true;
  requiresProductiveRecall: true;
  requiresInteractionalUse: true;
  requiresDelayedTransfer: true;
  minimumDistinctSpeakers: number;
}

export interface CommunicativeCapability {
  id: string;
  level: CurriculumLevel;
  canDoVi: string;
  canDoEn: string;
  recommendedOrder: number;
  prerequisiteIds: string[];
  communicativeFunctions: string[];
  evidencePolicy: CapabilityEvidencePolicy;
}

export type ActivityLayer = "comprehension" | "acquisition" | "transfer";

export type ActivityKind =
  | "gist_choice"
  | "detail_choice"
  | "keyword_detection"
  | "transcript_decode"
  | "listen_and_reconstruct"
  | "productive_recall"
  | "controlled_variation"
  | "shadowing"
  | "personal_response"
  | "changed_context_response"
  | "unseen_speaker_response"
  | "multi_turn_interaction";

export interface LearningActivity {
  id: string;
  layer: ActivityLayer;
  kind: ActivityKind;
  promptVi: string;
  evidenceSegmentIds: string[];
  targetItems: string[];
  requiresRetrieval: boolean;
  requiresLearnerProduction: boolean;
  exposesFullAnswer: boolean;
  changedContext: boolean;
  unseenInput: boolean;
}

export type CaptionMode = "none" | "english" | "bilingual";

export type ScaffoldStep =
  | "replay"
  | "context_hint"
  | "keyword_hint"
  | "english_caption"
  | "chunking"
  | "vietnamese_meaning"
  | "slow_playback";

export interface TreatmentSupportPolicy {
  initialCaption: CaptionMode;
  finalAttemptCaption: Exclude<CaptionMode, "bilingual">;
  allowSlowPlayback: boolean;
  scaffoldOrder: ScaffoldStep[];
}

export interface ClipTreatment {
  id: string;
  clipId: string;
  level: CurriculumLevel;
  targetCapabilityId: string;
  requiredCapabilityIds: string[];
  activities: LearningActivity[];
  supportPolicy: TreatmentSupportPolicy;
  reviewStatus: HumanReviewStatus;
  publicationStatus: PublicationStatus;
}

export interface CapabilityEvidenceRecord {
  capabilityId: string;
  comprehension: boolean;
  productiveRecall: boolean;
  interactionalUse: boolean;
  delayedTransfer: boolean;
  distinctSpeakerIds: string[];
  treatmentIds: string[];
  observedAt: string;
}

export interface CurriculumPackage {
  id: string;
  version: string;
  titleVi: string;
  capabilities: CommunicativeCapability[];
  sourceAssets: SourceAsset[];
  transcriptSegments: TranscriptSegment[];
  clips: CommunicationClip[];
  treatments: ClipTreatment[];
  publicationStatus: PublicationStatus;
}

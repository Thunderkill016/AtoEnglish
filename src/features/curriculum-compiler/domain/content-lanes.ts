import type {
  CurriculumPackage,
  PublicationStatus,
} from "@/features/curriculum-compiler/domain/contracts";
import { validateCurriculumPackage } from "@/features/curriculum-compiler/domain/validation";

export type CompanionPurpose =
  | "authentic_exposure"
  | "speaker_variability"
  | "context_variability"
  | "learner_interest"
  | "listening_challenge";

export type CompanionActivityKind =
  | "prewatch_prediction"
  | "gist_reflection"
  | "communicative_intent_spotting"
  | "speaker_context_observation"
  | "personal_reaction";

export type CompanionEmbedStatus =
  | "unreviewed"
  | "embed_verified"
  | "blocked"
  | "retired";

export interface YouTubeCompanionUsagePolicy {
  canEmbed: true;
  canStoreTranscript: false;
  canRunAsr: false;
  canCreateDerivedLesson: false;
  canSelfHostMedia: false;
  canDownloadMedia: false;
  canDetachAudio: false;
}

export const YOUTUBE_COMPANION_USAGE_POLICY: YouTubeCompanionUsagePolicy = {
  canEmbed: true,
  canStoreTranscript: false,
  canRunAsr: false,
  canCreateDerivedLesson: false,
  canSelfHostMedia: false,
  canDownloadMedia: false,
  canDetachAudio: false,
};

export interface CompanionActivity {
  id: string;
  kind: CompanionActivityKind;
  promptVi: string;
  learningPurpose: string;
  /** Companion prompts cannot depend on a stored transcript or source wording. */
  requiresTranscript: false;
  storesSourceText: false;
  contributesToMastery: false;
}

export interface YouTubeCompanionAsset {
  id: string;
  youtubeVideoId: string;
  title: string;
  creator: string;
  watchUrl: string;
  embedUrl: string;
  capabilityIds: string[];
  purpose: CompanionPurpose;
  accentTags: string[];
  topicTags: string[];
  startSeconds?: number;
  endSeconds?: number;
  embedStatus: CompanionEmbedStatus;
  usagePolicy: YouTubeCompanionUsagePolicy;
  activities: CompanionActivity[];
  publicationStatus: PublicationStatus;
}

export interface CapabilityKnowledgeCoverage {
  meaningAndUse: string[];
  formulaicChunks: string[];
  grammarPatterns: string[];
  speechFeatures: string[];
  interactionStrategies: string[];
  pragmaticsAndRegister: string[];
  vietnameseLearnerRisks: string[];
}

export interface CapabilityLearningSpecification {
  capabilityId: string;
  knowledge: CapabilityKnowledgeCoverage;
  /** Every licensed treatment for this capability must be listed here. */
  coreTreatmentIds: string[];
  /** Optional exposure only. These IDs can never satisfy core coverage. */
  companionAssetIds: string[];
}

export interface CapabilityLearningBundle {
  id: string;
  version: string;
  titleVi: string;
  coreCurriculum: CurriculumPackage;
  capabilitySpecifications: CapabilityLearningSpecification[];
  youtubeCompanions: YouTubeCompanionAsset[];
  publicationStatus: PublicationStatus;
}

export type LearningBundleValidationCode =
  | "missing_bundle_identity"
  | "core_curriculum_invalid"
  | "core_status_mismatch"
  | "duplicate_specification"
  | "duplicate_companion_id"
  | "missing_capability_specification"
  | "unknown_capability"
  | "incomplete_knowledge_coverage"
  | "missing_core_treatment"
  | "invalid_core_treatment_reference"
  | "unknown_companion_reference"
  | "companion_capability_mismatch"
  | "invalid_youtube_url"
  | "invalid_companion_window"
  | "invalid_companion_policy"
  | "invalid_companion_activity"
  | "companion_not_embed_verified"
  | "companion_status_mismatch";

export interface LearningBundleValidationIssue {
  code: LearningBundleValidationCode;
  path: string;
  message: string;
}

const KNOWLEDGE_FIELDS: Array<keyof CapabilityKnowledgeCoverage> = [
  "meaningAndUse",
  "formulaicChunks",
  "grammarPatterns",
  "speechFeatures",
  "interactionStrategies",
  "pragmaticsAndRegister",
  "vietnameseLearnerRisks",
];

const POLICY_FIELDS: Array<keyof YouTubeCompanionUsagePolicy> = [
  "canEmbed",
  "canStoreTranscript",
  "canRunAsr",
  "canCreateDerivedLesson",
  "canSelfHostMedia",
  "canDownloadMedia",
  "canDetachAudio",
];

function isLearnerFacing(status: PublicationStatus) {
  return status === "pilot" || status === "approved";
}

function statusMeetsBundle(
  bundleStatus: PublicationStatus,
  itemStatus: PublicationStatus,
) {
  if (bundleStatus === "pilot") {
    return itemStatus === "pilot" || itemStatus === "approved";
  }
  if (bundleStatus === "approved") return itemStatus === "approved";
  return true;
}

function addIssue(
  issues: LearningBundleValidationIssue[],
  code: LearningBundleValidationCode,
  path: string,
  message: string,
) {
  issues.push({ code, path, message });
}

function duplicateStrings(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function parseHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function isYouTubeWatchUrl(value: string, videoId: string) {
  const url = parseHttpsUrl(value);
  if (!url) return false;

  const host = url.hostname.toLowerCase();
  if (host === "youtu.be") return url.pathname.slice(1) === videoId;

  if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com"
  ) {
    return url.pathname === "/watch" && url.searchParams.get("v") === videoId;
  }

  return false;
}

function isYouTubeEmbedUrl(value: string, videoId: string) {
  const url = parseHttpsUrl(value);
  if (!url) return false;

  const host = url.hostname.toLowerCase();
  const allowedHost =
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "www.youtube-nocookie.com";

  return allowedHost && url.pathname === `/embed/${videoId}`;
}

function validateCompanion(
  companion: YouTubeCompanionAsset,
  bundle: CapabilityLearningBundle,
  capabilityIds: ReadonlySet<string>,
  issues: LearningBundleValidationIssue[],
) {
  const path = `youtubeCompanions.${companion.id}`;

  if (
    !companion.id.trim() ||
    !companion.youtubeVideoId.trim() ||
    !companion.title.trim() ||
    !companion.creator.trim() ||
    companion.capabilityIds.length === 0 ||
    companion.activities.length === 0
  ) {
    addIssue(
      issues,
      "invalid_companion_activity",
      path,
      "Companion identity, capability links, and activities are required.",
    );
  }

  if (
    !isYouTubeWatchUrl(companion.watchUrl, companion.youtubeVideoId) ||
    !isYouTubeEmbedUrl(companion.embedUrl, companion.youtubeVideoId)
  ) {
    addIssue(
      issues,
      "invalid_youtube_url",
      path,
      "Companion URLs must use the declared video ID and official YouTube watch/embed forms.",
    );
  }

  if (
    companion.startSeconds !== undefined &&
    (!Number.isFinite(companion.startSeconds) || companion.startSeconds < 0)
  ) {
    addIssue(
      issues,
      "invalid_companion_window",
      `${path}.startSeconds`,
      "Companion start time must be a non-negative number.",
    );
  }

  if (
    companion.endSeconds !== undefined &&
    (!Number.isFinite(companion.endSeconds) ||
      companion.endSeconds <= (companion.startSeconds ?? 0))
  ) {
    addIssue(
      issues,
      "invalid_companion_window",
      `${path}.endSeconds`,
      "Companion end time must be greater than its start time.",
    );
  }

  for (const field of POLICY_FIELDS) {
    if (companion.usagePolicy[field] !== YOUTUBE_COMPANION_USAGE_POLICY[field]) {
      addIssue(
        issues,
        "invalid_companion_policy",
        `${path}.usagePolicy.${field}`,
        `YouTube Companion policy must keep ${field}=${String(YOUTUBE_COMPANION_USAGE_POLICY[field])}.`,
      );
    }
  }

  for (const capabilityId of companion.capabilityIds) {
    if (!capabilityIds.has(capabilityId)) {
      addIssue(
        issues,
        "unknown_capability",
        `${path}.capabilityIds`,
        `Unknown capability: ${capabilityId}`,
      );
    }
  }

  for (const activity of companion.activities) {
    if (
      !activity.id.trim() ||
      !activity.promptVi.trim() ||
      !activity.learningPurpose.trim() ||
      activity.requiresTranscript !== false ||
      activity.storesSourceText !== false ||
      activity.contributesToMastery !== false
    ) {
      addIssue(
        issues,
        "invalid_companion_activity",
        `${path}.activities.${activity.id}`,
        "Companion activities must be transcript-free, store no source wording, and contribute no mastery evidence.",
      );
    }
  }

  if (isLearnerFacing(bundle.publicationStatus)) {
    if (companion.embedStatus !== "embed_verified") {
      addIssue(
        issues,
        "companion_not_embed_verified",
        `${path}.embedStatus`,
        "Learner-facing companion videos require a current embed check.",
      );
    }

    if (!statusMeetsBundle(bundle.publicationStatus, companion.publicationStatus)) {
      addIssue(
        issues,
        "companion_status_mismatch",
        `${path}.publicationStatus`,
        `Companion status ${companion.publicationStatus} cannot ship in a ${bundle.publicationStatus} bundle.`,
      );
    }
  }
}

export function validateCapabilityLearningBundle(
  bundle: CapabilityLearningBundle,
): LearningBundleValidationIssue[] {
  const issues: LearningBundleValidationIssue[] = [];

  if (!bundle.id.trim() || !bundle.version.trim() || !bundle.titleVi.trim()) {
    addIssue(
      issues,
      "missing_bundle_identity",
      "bundle",
      "Bundle ID, version, and Vietnamese title are required.",
    );
  }

  for (const coreIssue of validateCurriculumPackage(bundle.coreCurriculum)) {
    addIssue(
      issues,
      "core_curriculum_invalid",
      `coreCurriculum.${coreIssue.path}`,
      `${coreIssue.code}: ${coreIssue.message}`,
    );
  }

  if (
    isLearnerFacing(bundle.publicationStatus) &&
    !statusMeetsBundle(
      bundle.publicationStatus,
      bundle.coreCurriculum.publicationStatus,
    )
  ) {
    addIssue(
      issues,
      "core_status_mismatch",
      "coreCurriculum.publicationStatus",
      `Core curriculum status ${bundle.coreCurriculum.publicationStatus} cannot ship in a ${bundle.publicationStatus} bundle.`,
    );
  }

  const capabilityById = new Map(
    bundle.coreCurriculum.capabilities.map((capability) => [
      capability.id,
      capability,
    ]),
  );
  const treatmentById = new Map(
    bundle.coreCurriculum.treatments.map((treatment) => [
      treatment.id,
      treatment,
    ]),
  );
  const companionById = new Map(
    bundle.youtubeCompanions.map((companion) => [companion.id, companion]),
  );
  const specificationByCapability = new Map(
    bundle.capabilitySpecifications.map((specification) => [
      specification.capabilityId,
      specification,
    ]),
  );

  for (const duplicateId of duplicateStrings(
    bundle.capabilitySpecifications.map(
      (specification) => specification.capabilityId,
    ),
  )) {
    addIssue(
      issues,
      "duplicate_specification",
      "capabilitySpecifications",
      `Duplicate capability specification: ${duplicateId}`,
    );
  }

  for (const duplicateId of duplicateStrings(
    bundle.youtubeCompanions.map((companion) => companion.id),
  )) {
    addIssue(
      issues,
      "duplicate_companion_id",
      "youtubeCompanions",
      `Duplicate companion ID: ${duplicateId}`,
    );
  }

  for (const capability of bundle.coreCurriculum.capabilities) {
    if (!specificationByCapability.has(capability.id)) {
      addIssue(
        issues,
        "missing_capability_specification",
        `capabilities.${capability.id}`,
        "Every core capability requires a complete learning specification.",
      );
    }
  }

  for (const specification of bundle.capabilitySpecifications) {
    const path = `capabilitySpecifications.${specification.capabilityId}`;
    if (!capabilityById.has(specification.capabilityId)) {
      addIssue(
        issues,
        "unknown_capability",
        `${path}.capabilityId`,
        `Unknown capability: ${specification.capabilityId}`,
      );
      continue;
    }

    for (const field of KNOWLEDGE_FIELDS) {
      const values = specification.knowledge[field];
      if (values.length === 0 || values.some((value) => !value.trim())) {
        addIssue(
          issues,
          "incomplete_knowledge_coverage",
          `${path}.knowledge.${field}`,
          `Required knowledge category ${field} must contain reviewed content.`,
        );
      }
    }

    const expectedTreatmentIds = bundle.coreCurriculum.treatments
      .filter(
        (treatment) =>
          treatment.targetCapabilityId === specification.capabilityId,
      )
      .map((treatment) => treatment.id);
    const referencedTreatmentIds = new Set(specification.coreTreatmentIds);

    if (specification.coreTreatmentIds.length === 0) {
      addIssue(
        issues,
        "missing_core_treatment",
        `${path}.coreTreatmentIds`,
        "A companion-only capability is forbidden; licensed core treatments are required.",
      );
    }

    for (const treatmentId of specification.coreTreatmentIds) {
      const treatment = treatmentById.get(treatmentId);
      if (
        !treatment ||
        treatment.targetCapabilityId !== specification.capabilityId
      ) {
        addIssue(
          issues,
          "invalid_core_treatment_reference",
          `${path}.coreTreatmentIds`,
          `Treatment ${treatmentId} is missing or targets another capability.`,
        );
      }
    }

    for (const expectedTreatmentId of expectedTreatmentIds) {
      if (!referencedTreatmentIds.has(expectedTreatmentId)) {
        addIssue(
          issues,
          "missing_core_treatment",
          `${path}.coreTreatmentIds`,
          `Licensed treatment ${expectedTreatmentId} is not represented in the capability specification.`,
        );
      }
    }

    for (const companionId of specification.companionAssetIds) {
      const companion = companionById.get(companionId);
      if (!companion) {
        addIssue(
          issues,
          "unknown_companion_reference",
          `${path}.companionAssetIds`,
          `Unknown YouTube Companion: ${companionId}`,
        );
      } else if (!companion.capabilityIds.includes(specification.capabilityId)) {
        addIssue(
          issues,
          "companion_capability_mismatch",
          `${path}.companionAssetIds`,
          `Companion ${companionId} does not declare capability ${specification.capabilityId}.`,
        );
      }
    }
  }

  const capabilityIds = new Set(capabilityById.keys());
  for (const companion of bundle.youtubeCompanions) {
    validateCompanion(companion, bundle, capabilityIds, issues);
  }

  return issues;
}

export function canPublishCapabilityLearningBundle(
  bundle: CapabilityLearningBundle,
) {
  return validateCapabilityLearningBundle(bundle).length === 0;
}

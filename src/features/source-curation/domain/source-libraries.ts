export type SourceLibraryRightsModel =
  | "owned"
  | "per_item_open_license"
  | "government_media_guidelines"
  | "platform_content_license"
  | "discovery_index_only";

export type SourceLibraryCoreSuitability =
  | "preferred"
  | "conditional"
  | "context_only"
  | "discovery_only";

export type ConversationAvailability = "high" | "medium" | "low" | "unknown";

export type SourceReviewDimension =
  | "item_identity"
  | "license_and_allowed_uses"
  | "attribution"
  | "third_party_material"
  | "privacy_and_publicity"
  | "trademark_and_endorsement"
  | "audio_and_playback"
  | "transcript_and_speakers"
  | "clip_window"
  | "pedagogical_fit"
  | "share_alike_compatibility";

export type SupportedRightsFamily =
  | "owned"
  | "written_permission"
  | "public_domain"
  | "cc0"
  | "cc_by"
  | "cc_by_sa_conditional"
  | "us_government_with_guidelines"
  | "pexels_license"
  | "pixabay_license";

export interface SourceLibraryDefinition {
  id: string;
  name: string;
  homepageUrl: string;
  termsUrl: string;
  rightsModel: SourceLibraryRightsModel;
  supportedRightsFamilies: SupportedRightsFamily[];
  coreSuitability: SourceLibraryCoreSuitability;
  conversationAvailability: ConversationAvailability;
  fallbackPriority: number;
  strengths: string[];
  limitations: string[];
  requiredReviews: SourceReviewDimension[];
  discoveryQueries: string[];
}

export interface SourceLibraryRegistry {
  version: string;
  libraries: SourceLibraryDefinition[];
}

export type SourceLibraryValidationCode =
  | "missing_registry_version"
  | "duplicate_library_id"
  | "missing_library_field"
  | "invalid_url"
  | "invalid_fallback_priority"
  | "missing_rights_family"
  | "missing_required_review"
  | "unsafe_core_suitability"
  | "discovery_index_misclassified";

export interface SourceLibraryValidationIssue {
  code: SourceLibraryValidationCode;
  path: string;
  message: string;
}

const MANDATORY_ITEM_REVIEWS: SourceReviewDimension[] = [
  "item_identity",
  "license_and_allowed_uses",
  "third_party_material",
  "privacy_and_publicity",
  "audio_and_playback",
  "transcript_and_speakers",
  "clip_window",
  "pedagogical_fit",
];

function addIssue(
  issues: SourceLibraryValidationIssue[],
  code: SourceLibraryValidationCode,
  path: string,
  message: string,
) {
  issues.push({ code, path, message });
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function duplicates(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicateValues = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicateValues.add(value);
    seen.add(value);
  }
  return [...duplicateValues];
}

export function validateSourceLibraryRegistry(
  registry: SourceLibraryRegistry,
): SourceLibraryValidationIssue[] {
  const issues: SourceLibraryValidationIssue[] = [];

  if (!registry.version.trim()) {
    addIssue(
      issues,
      "missing_registry_version",
      "registry.version",
      "Source library registry version is required.",
    );
  }

  for (const duplicateId of duplicates(
    registry.libraries.map((library) => library.id),
  )) {
    addIssue(
      issues,
      "duplicate_library_id",
      "registry.libraries",
      `Duplicate library ID: ${duplicateId}`,
    );
  }

  for (const library of registry.libraries) {
    const path = `libraries.${library.id}`;

    if (
      !library.id.trim() ||
      !library.name.trim() ||
      library.strengths.length === 0 ||
      library.limitations.length === 0 ||
      library.discoveryQueries.length === 0
    ) {
      addIssue(
        issues,
        "missing_library_field",
        path,
        "Library identity, strengths, limitations, and discovery queries are required.",
      );
    }

    if (!isHttpsUrl(library.homepageUrl) || !isHttpsUrl(library.termsUrl)) {
      addIssue(
        issues,
        "invalid_url",
        path,
        "Library homepage and terms URLs must be valid HTTPS URLs.",
      );
    }

    if (!Number.isInteger(library.fallbackPriority) || library.fallbackPriority < 1) {
      addIssue(
        issues,
        "invalid_fallback_priority",
        `${path}.fallbackPriority`,
        "Fallback priority must be a positive integer.",
      );
    }

    if (library.supportedRightsFamilies.length === 0) {
      addIssue(
        issues,
        "missing_rights_family",
        `${path}.supportedRightsFamilies`,
        "At least one supported rights family is required.",
      );
    }

    for (const review of MANDATORY_ITEM_REVIEWS) {
      if (!library.requiredReviews.includes(review)) {
        addIssue(
          issues,
          "missing_required_review",
          `${path}.requiredReviews`,
          `Every reusable video source requires ${review} review.`,
        );
      }
    }

    if (
      library.rightsModel !== "owned" &&
      library.coreSuitability === "preferred"
    ) {
      addIssue(
        issues,
        "unsafe_core_suitability",
        `${path}.coreSuitability`,
        "Only owned material can be preferred without per-item external-rights uncertainty.",
      );
    }

    if (
      library.rightsModel === "discovery_index_only" &&
      library.coreSuitability !== "discovery_only"
    ) {
      addIssue(
        issues,
        "discovery_index_misclassified",
        `${path}.coreSuitability`,
        "A discovery index cannot itself be classified as reusable core media.",
      );
    }
  }

  return issues;
}

export function canUseSourceLibraryRegistry(registry: SourceLibraryRegistry) {
  return validateSourceLibraryRegistry(registry).length === 0;
}

export interface SourceGapSearchRequest {
  capabilityId: string;
  needsMultiTurnConversation: boolean;
  needsAuthenticAudio: boolean;
  excludeLibraryIds?: string[];
}

export function rankSourceLibrariesForGap(
  registry: SourceLibraryRegistry,
  request: SourceGapSearchRequest,
) {
  const excluded = new Set(request.excludeLibraryIds ?? []);

  return registry.libraries
    .filter((library) => !excluded.has(library.id))
    .filter((library) => library.coreSuitability !== "discovery_only")
    .map((library) => {
      let score = 100 - library.fallbackPriority * 5;

      if (library.coreSuitability === "preferred") score += 30;
      if (library.coreSuitability === "conditional") score += 15;
      if (library.coreSuitability === "context_only") score -= 25;

      if (request.needsAuthenticAudio) {
        if (library.conversationAvailability === "high") score += 25;
        if (library.conversationAvailability === "medium") score += 10;
        if (library.conversationAvailability === "low") score -= 30;
      }

      if (request.needsMultiTurnConversation) {
        if (library.conversationAvailability === "high") score += 20;
        if (library.conversationAvailability === "low") score -= 25;
      }

      return { library, score };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.library.fallbackPriority - right.library.fallbackPriority,
    );
}

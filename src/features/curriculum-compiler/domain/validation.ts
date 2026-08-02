import type {
  ClipTreatment,
  CommunicationClip,
  CommunicativeCapability,
  CurriculumPackage,
  PublicationStatus,
  SourceAsset,
  TranscriptSegment,
} from "@/features/curriculum-compiler/domain/contracts";

export type CurriculumValidationCode =
  | "missing_field"
  | "duplicate_id"
  | "invalid_url"
  | "invalid_duration"
  | "invalid_rights"
  | "invalid_media_permission"
  | "invalid_publication_status"
  | "unknown_reference"
  | "invalid_timestamp"
  | "segment_outside_source"
  | "segment_outside_clip"
  | "segment_order_mismatch"
  | "missing_human_review"
  | "missing_activity_layer"
  | "missing_retrieval"
  | "invalid_transfer"
  | "invalid_interaction"
  | "invalid_cold_transfer"
  | "invalid_scaffold"
  | "invalid_learner_choice"
  | "prerequisite_cycle"
  | "missing_prerequisite"
  | "insufficient_clip_coverage"
  | "insufficient_speaker_coverage"
  | "missing_clip_role";

export interface CurriculumValidationIssue {
  code: CurriculumValidationCode;
  path: string;
  message: string;
}

type Identified = { id: string };

function addIssue(
  issues: CurriculumValidationIssue[],
  code: CurriculumValidationCode,
  path: string,
  message: string,
) {
  issues.push({ code, path, message });
}

function isLearnerFacing(status: PublicationStatus) {
  return status === "pilot" || status === "approved";
}

function statusMeetsPackage(
  packageStatus: PublicationStatus,
  itemStatus: PublicationStatus,
) {
  if (packageStatus === "pilot") {
    return itemStatus === "pilot" || itemStatus === "approved";
  }
  if (packageStatus === "approved") return itemStatus === "approved";
  return true;
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function duplicateIds(items: readonly Identified[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }

  return [...duplicates];
}

function validateCapabilityGraph(
  capabilities: readonly CommunicativeCapability[],
  issues: CurriculumValidationIssue[],
) {
  const capabilityById = new Map(
    capabilities.map((capability) => [capability.id, capability]),
  );

  for (const capability of capabilities) {
    for (const prerequisiteId of capability.prerequisiteIds) {
      if (!capabilityById.has(prerequisiteId)) {
        addIssue(
          issues,
          "missing_prerequisite",
          `capabilities.${capability.id}.prerequisiteIds`,
          `Unknown prerequisite: ${prerequisiteId}`,
        );
      }
      if (prerequisiteId === capability.id) {
        addIssue(
          issues,
          "prerequisite_cycle",
          `capabilities.${capability.id}.prerequisiteIds`,
          "A capability cannot require itself.",
        );
      }
    }
  }

  const state = new Map<string, "visiting" | "visited">();
  const stack: string[] = [];
  const reported = new Set<string>();

  function visit(capabilityId: string) {
    if (state.get(capabilityId) === "visited") return;
    if (state.get(capabilityId) === "visiting") {
      const start = stack.indexOf(capabilityId);
      const cycle = [...stack.slice(start), capabilityId].join(" -> ");
      if (!reported.has(cycle)) {
        reported.add(cycle);
        addIssue(
          issues,
          "prerequisite_cycle",
          "capabilities",
          `Prerequisite cycle: ${cycle}`,
        );
      }
      return;
    }

    const capability = capabilityById.get(capabilityId);
    if (!capability) return;

    state.set(capabilityId, "visiting");
    stack.push(capabilityId);
    for (const prerequisiteId of capability.prerequisiteIds) {
      if (capabilityById.has(prerequisiteId)) visit(prerequisiteId);
    }
    stack.pop();
    state.set(capabilityId, "visited");
  }

  for (const capability of capabilities) visit(capability.id);
}

function validateSource(
  source: SourceAsset,
  packageStatus: PublicationStatus,
  issues: CurriculumValidationIssue[],
) {
  const path = `sourceAssets.${source.id}`;

  if (!source.id.trim() || !source.title.trim() || !source.creator.trim()) {
    addIssue(issues, "missing_field", path, "Source identity is incomplete.");
  }

  for (const [field, value] of [
    ["sourceUrl", source.sourceUrl],
    ["mediaUrl", source.mediaUrl],
  ] as const) {
    if (!isHttpsUrl(value)) {
      addIssue(
        issues,
        "invalid_url",
        `${path}.${field}`,
        `${field} must be HTTPS.`,
      );
    }
  }

  if (source.transcriptSourceUrl && !isHttpsUrl(source.transcriptSourceUrl)) {
    addIssue(
      issues,
      "invalid_url",
      `${path}.transcriptSourceUrl`,
      "Transcript source must be HTTPS.",
    );
  }

  if (
    ["official", "creator_provided"].includes(source.transcriptProvenance) &&
    !source.transcriptSourceUrl
  ) {
    addIssue(
      issues,
      "missing_field",
      `${path}.transcriptSourceUrl`,
      "Declared external transcripts require a source URL.",
    );
  }

  if (!Number.isFinite(source.durationMs) || source.durationMs <= 0) {
    addIssue(
      issues,
      "invalid_duration",
      `${path}.durationMs`,
      "Source duration must be positive.",
    );
  }

  if (!statusMeetsPackage(packageStatus, source.publicationStatus)) {
    addIssue(
      issues,
      "invalid_publication_status",
      `${path}.publicationStatus`,
      `Source cannot ship in a ${packageStatus} package.`,
    );
  }

  if (!isLearnerFacing(packageStatus)) return;

  const rights = source.rights;
  if (
    rights.status !== "human_verified" ||
    !rights.reviewedBy?.trim() ||
    !rights.reviewedAt?.trim() ||
    !rights.evidenceUrl ||
    !isHttpsUrl(rights.evidenceUrl)
  ) {
    addIssue(
      issues,
      "invalid_rights",
      `${path}.rights`,
      "Learner-facing sources require human-reviewed rights evidence.",
    );
  }

  if (rights.requiresAttribution && !rights.attribution.trim()) {
    addIssue(
      issues,
      "invalid_rights",
      `${path}.rights.attribution`,
      "Required attribution is missing.",
    );
  }

  if (
    !rights.allowedUses.canStoreTranscript ||
    !rights.allowedUses.canCreateDerivedLesson
  ) {
    addIssue(
      issues,
      "invalid_rights",
      `${path}.rights.allowedUses`,
      "Transcript storage and derived lessons must both be permitted.",
    );
  }

  const playbackAllowed =
    source.mediaAccess === "self_hosted"
      ? rights.allowedUses.canSelfHostMedia
      : rights.allowedUses.canEmbed;

  if (!playbackAllowed) {
    addIssue(
      issues,
      "invalid_media_permission",
      `${path}.rights.allowedUses`,
      "The declared playback method is not permitted.",
    );
  }

  if (
    packageStatus === "approved" &&
    !rights.allowedUses.canUseCommercially
  ) {
    addIssue(
      issues,
      "invalid_rights",
      `${path}.rights.allowedUses.canUseCommercially`,
      "Approved catalog content must permit commercial use.",
    );
  }
}

function validateSegment(
  segment: TranscriptSegment,
  sourceById: ReadonlyMap<string, SourceAsset>,
  issues: CurriculumValidationIssue[],
) {
  const path = `transcriptSegments.${segment.id}`;
  const source = sourceById.get(segment.sourceAssetId);

  if (!source) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.sourceAssetId`,
      `Unknown source: ${segment.sourceAssetId}`,
    );
    return;
  }

  if (
    !Number.isFinite(segment.startMs) ||
    !Number.isFinite(segment.endMs) ||
    segment.startMs < 0 ||
    segment.endMs <= segment.startMs
  ) {
    addIssue(
      issues,
      "invalid_timestamp",
      path,
      "Segment timestamps must form a positive window.",
    );
  }

  if (segment.endMs > source.durationMs) {
    addIssue(
      issues,
      "segment_outside_source",
      path,
      "Segment exceeds source duration.",
    );
  }

  if (
    !segment.sourceText.trim() ||
    !segment.displayText.trim() ||
    !segment.translationVi.trim()
  ) {
    addIssue(
      issues,
      "missing_field",
      path,
      "Source text, display text, and Vietnamese translation are required.",
    );
  }
}

function validateClip(
  clip: CommunicationClip,
  packageStatus: PublicationStatus,
  sourceById: ReadonlyMap<string, SourceAsset>,
  segmentById: ReadonlyMap<string, TranscriptSegment>,
  capabilityById: ReadonlyMap<string, CommunicativeCapability>,
  issues: CurriculumValidationIssue[],
) {
  const path = `clips.${clip.id}`;
  const source = sourceById.get(clip.sourceAssetId);

  if (!source) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.sourceAssetId`,
      `Unknown source: ${clip.sourceAssetId}`,
    );
  }

  const duration = clip.endMs - clip.startMs;
  if (
    !Number.isFinite(clip.startMs) ||
    !Number.isFinite(clip.endMs) ||
    clip.startMs < 0 ||
    duration < 3_000 ||
    duration > 60_000
  ) {
    addIssue(
      issues,
      "invalid_duration",
      path,
      "Communication Clips must be 3–60 seconds.",
    );
  }

  if (source && clip.endMs > source.durationMs) {
    addIssue(
      issues,
      "segment_outside_source",
      path,
      "Clip exceeds source duration.",
    );
  }

  const declaredCapabilities = [
    clip.primaryCapabilityId,
    ...clip.secondaryCapabilityIds,
  ];
  for (const capabilityId of declaredCapabilities) {
    if (!capabilityById.has(capabilityId)) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.capabilities`,
        `Unknown capability: ${capabilityId}`,
      );
    }
  }

  if (
    clip.secondaryCapabilityIds.includes(clip.primaryCapabilityId) ||
    new Set(clip.secondaryCapabilityIds).size !==
      clip.secondaryCapabilityIds.length
  ) {
    addIssue(
      issues,
      "duplicate_id",
      `${path}.secondaryCapabilityIds`,
      "Clip capability IDs must be unique.",
    );
  }

  if (new Set(clip.segmentIds).size !== clip.segmentIds.length) {
    addIssue(
      issues,
      "duplicate_id",
      `${path}.segmentIds`,
      "Clip segment IDs must be unique.",
    );
  }

  const segments: TranscriptSegment[] = [];
  for (const segmentId of clip.segmentIds) {
    const segment = segmentById.get(segmentId);
    if (!segment) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.segmentIds`,
        `Unknown segment: ${segmentId}`,
      );
      continue;
    }

    segments.push(segment);
    if (segment.sourceAssetId !== clip.sourceAssetId) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.segmentIds`,
        `Segment ${segmentId} belongs to another source.`,
      );
    }
    if (segment.startMs < clip.startMs || segment.endMs > clip.endMs) {
      addIssue(
        issues,
        "segment_outside_clip",
        `${path}.segmentIds`,
        `Segment ${segmentId} falls outside the clip window.`,
      );
    }
  }

  const sortedIds = [...segments]
    .sort((left, right) => left.startMs - right.startMs)
    .map((segment) => segment.id);
  if (sortedIds.join("|") !== clip.segmentIds.join("|")) {
    addIssue(
      issues,
      "segment_order_mismatch",
      `${path}.segmentIds`,
      "Segments must follow timestamp order.",
    );
  }

  if (!statusMeetsPackage(packageStatus, clip.publicationStatus)) {
    addIssue(
      issues,
      "invalid_publication_status",
      `${path}.publicationStatus`,
      `Clip cannot ship in a ${packageStatus} package.`,
    );
  }

  if (!isLearnerFacing(packageStatus)) return;

  if (clip.reviewStatus !== "human_verified") {
    addIssue(
      issues,
      "missing_human_review",
      `${path}.reviewStatus`,
      "Learner-facing clips require human review.",
    );
  }

  for (const segment of segments) {
    if (
      segment.transcriptStatus !== "human_verified" ||
      segment.translationStatus !== "human_verified" ||
      !segment.speakerId?.trim()
    ) {
      addIssue(
        issues,
        "missing_human_review",
        `transcriptSegments.${segment.id}`,
        "Learner-facing segments require verified text, translation, and speaker labels.",
      );
    }
  }
}

function validateTreatment(
  treatment: ClipTreatment,
  packageStatus: PublicationStatus,
  clipById: ReadonlyMap<string, CommunicationClip>,
  segmentById: ReadonlyMap<string, TranscriptSegment>,
  capabilityById: ReadonlyMap<string, CommunicativeCapability>,
  issues: CurriculumValidationIssue[],
) {
  const path = `treatments.${treatment.id}`;
  const clip = clipById.get(treatment.clipId);
  const capability = capabilityById.get(treatment.targetCapabilityId);

  if (!clip) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.clipId`,
      `Unknown clip: ${treatment.clipId}`,
    );
  }
  if (!capability) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.targetCapabilityId`,
      `Unknown capability: ${treatment.targetCapabilityId}`,
    );
  }

  if (
    clip &&
    ![
      clip.primaryCapabilityId,
      ...clip.secondaryCapabilityIds,
    ].includes(treatment.targetCapabilityId)
  ) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.targetCapabilityId`,
      "Treatment target must be declared by the clip.",
    );
  }

  if (capability && capability.level !== treatment.level) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.level`,
      "Treatment and capability levels do not match.",
    );
  }

  for (const prerequisiteId of treatment.requiredCapabilityIds) {
    if (!capabilityById.has(prerequisiteId)) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.requiredCapabilityIds`,
        `Unknown required capability: ${prerequisiteId}`,
      );
    }
    if (prerequisiteId === treatment.targetCapabilityId) {
      addIssue(
        issues,
        "prerequisite_cycle",
        `${path}.requiredCapabilityIds`,
        "A treatment cannot require its target capability.",
      );
    }
  }

  if (capability) {
    for (const prerequisiteId of capability.prerequisiteIds) {
      if (!treatment.requiredCapabilityIds.includes(prerequisiteId)) {
        addIssue(
          issues,
          "missing_prerequisite",
          `${path}.requiredCapabilityIds`,
          `Treatment omits hard prerequisite: ${prerequisiteId}`,
        );
      }
    }
  }

  if (duplicateIds(treatment.activities).length > 0) {
    addIssue(
      issues,
      "duplicate_id",
      `${path}.activities`,
      "Activity IDs must be unique.",
    );
  }

  const byLayer = {
    comprehension: treatment.activities.filter(
      (activity) => activity.layer === "comprehension",
    ),
    acquisition: treatment.activities.filter(
      (activity) => activity.layer === "acquisition",
    ),
    transfer: treatment.activities.filter(
      (activity) => activity.layer === "transfer",
    ),
  };

  for (const layer of ["comprehension", "acquisition", "transfer"] as const) {
    if (byLayer[layer].length === 0) {
      addIssue(
        issues,
        "missing_activity_layer",
        `${path}.activities`,
        `Missing ${layer} layer.`,
      );
    }
  }

  if (
    !byLayer.acquisition.some(
      (activity) =>
        activity.requiresRetrieval && activity.requiresLearnerProduction,
    )
  ) {
    addIssue(
      issues,
      "missing_retrieval",
      `${path}.activities`,
      "Acquisition requires productive retrieval.",
    );
  }

  if (
    !byLayer.transfer.some(
      (activity) =>
        activity.requiresLearnerProduction &&
        !activity.exposesFullAnswer &&
        (activity.changedContext || activity.unseenInput),
    )
  ) {
    addIssue(
      issues,
      "invalid_transfer",
      `${path}.activities`,
      "Transfer requires independent production in changed or unseen input.",
    );
  }

  if (
    treatment.role === "interaction" &&
    !treatment.activities.some(
      (activity) => activity.kind === "multi_turn_interaction",
    )
  ) {
    addIssue(
      issues,
      "invalid_interaction",
      `${path}.activities`,
      "Interaction treatments require a multi-turn activity.",
    );
  }

  if (
    treatment.role === "cold_transfer" &&
    !byLayer.transfer.some((activity) => activity.unseenInput)
  ) {
    addIssue(
      issues,
      "invalid_cold_transfer",
      `${path}.activities`,
      "Cold transfer requires unseen input.",
    );
  }

  if (
    new Set(treatment.supportPolicy.scaffoldOrder).size !==
      treatment.supportPolicy.scaffoldOrder.length ||
    (treatment.supportPolicy.scaffoldOrder.includes("slow_playback") &&
      !treatment.supportPolicy.allowSlowPlayback)
  ) {
    addIssue(
      issues,
      "invalid_scaffold",
      `${path}.supportPolicy`,
      "Scaffold order is inconsistent.",
    );
  }

  const choice = treatment.learnerChoice;
  if (
    !choice.titleVi.trim() ||
    !choice.summaryVi.trim() ||
    choice.estimatedMinutes < 5 ||
    choice.estimatedMinutes > 20 ||
    choice.accentTags.length === 0 ||
    choice.topicTags.length === 0
  ) {
    addIssue(
      issues,
      "invalid_learner_choice",
      `${path}.learnerChoice`,
      "Learner choice metadata is incomplete.",
    );
  }

  if (clip) {
    const clipSegmentIds = new Set(clip.segmentIds);
    for (const activity of treatment.activities) {
      if (!activity.promptVi.trim() || activity.evidenceSegmentIds.length === 0) {
        addIssue(
          issues,
          "missing_field",
          `${path}.activities.${activity.id}`,
          "Activity prompt and source evidence are required.",
        );
      }
      for (const segmentId of activity.evidenceSegmentIds) {
        if (!segmentById.has(segmentId) || !clipSegmentIds.has(segmentId)) {
          addIssue(
            issues,
            "unknown_reference",
            `${path}.activities.${activity.id}.evidenceSegmentIds`,
            `Evidence must belong to the clip: ${segmentId}`,
          );
        }
      }
    }
  }

  if (!statusMeetsPackage(packageStatus, treatment.publicationStatus)) {
    addIssue(
      issues,
      "invalid_publication_status",
      `${path}.publicationStatus`,
      `Treatment cannot ship in a ${packageStatus} package.`,
    );
  }

  if (
    isLearnerFacing(packageStatus) &&
    treatment.reviewStatus !== "human_verified"
  ) {
    addIssue(
      issues,
      "missing_human_review",
      `${path}.reviewStatus`,
      "Learner-facing treatments require human pedagogical review.",
    );
  }
}

function validateCoverage(
  curriculum: CurriculumPackage,
  segmentById: ReadonlyMap<string, TranscriptSegment>,
  clipById: ReadonlyMap<string, CommunicationClip>,
  issues: CurriculumValidationIssue[],
) {
  if (!isLearnerFacing(curriculum.publicationStatus)) return;

  for (const capability of curriculum.capabilities) {
    const treatments = curriculum.treatments.filter(
      (treatment) => treatment.targetCapabilityId === capability.id,
    );
    const clipIds = new Set(treatments.map((treatment) => treatment.clipId));
    const roles = new Set(treatments.map((treatment) => treatment.role));
    const speakerIds = new Set<string>();

    for (const clipId of clipIds) {
      const clip = clipById.get(clipId);
      if (!clip) continue;
      for (const segmentId of clip.segmentIds) {
        const speakerId = segmentById.get(segmentId)?.speakerId;
        if (speakerId) speakerIds.add(speakerId);
      }
    }

    if (clipIds.size < capability.evidencePolicy.minimumDistinctClips) {
      addIssue(
        issues,
        "insufficient_clip_coverage",
        `capabilities.${capability.id}`,
        `Expected ${capability.evidencePolicy.minimumDistinctClips} clips; found ${clipIds.size}.`,
      );
    }
    if (speakerIds.size < capability.evidencePolicy.minimumDistinctSpeakers) {
      addIssue(
        issues,
        "insufficient_speaker_coverage",
        `capabilities.${capability.id}`,
        `Expected ${capability.evidencePolicy.minimumDistinctSpeakers} speakers; found ${speakerIds.size}.`,
      );
    }
    for (const role of ["anchor", "interaction", "cold_transfer"] as const) {
      if (!roles.has(role)) {
        addIssue(
          issues,
          "missing_clip_role",
          `capabilities.${capability.id}`,
          `Missing ${role} treatment.`,
        );
      }
    }
  }
}

export function validateCurriculumPackage(
  curriculum: CurriculumPackage,
): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];

  if (!curriculum.id.trim() || !curriculum.version.trim() || !curriculum.titleVi.trim()) {
    addIssue(
      issues,
      "missing_field",
      "curriculum",
      "Curriculum identity, version, and title are required.",
    );
  }

  const collections: Array<[string, readonly Identified[]]> = [
    ["capabilities", curriculum.capabilities],
    ["sourceAssets", curriculum.sourceAssets],
    ["transcriptSegments", curriculum.transcriptSegments],
    ["clips", curriculum.clips],
    ["treatments", curriculum.treatments],
  ];
  for (const [name, items] of collections) {
    for (const id of duplicateIds(items)) {
      addIssue(issues, "duplicate_id", name, `Duplicate ID: ${id}`);
    }
  }

  const sourceById = new Map(
    curriculum.sourceAssets.map((source) => [source.id, source]),
  );
  const segmentById = new Map(
    curriculum.transcriptSegments.map((segment) => [segment.id, segment]),
  );
  const clipById = new Map(curriculum.clips.map((clip) => [clip.id, clip]));
  const capabilityById = new Map(
    curriculum.capabilities.map((capability) => [capability.id, capability]),
  );

  for (const capability of curriculum.capabilities) {
    if (
      !capability.canDoVi.trim() ||
      !capability.canDoEn.trim() ||
      capability.recommendedOrder < 1 ||
      capability.communicativeFunctions.length === 0 ||
      capability.evidencePolicy.minimumDistinctClips < 1 ||
      capability.evidencePolicy.minimumDistinctSpeakers < 1
    ) {
      addIssue(
        issues,
        "missing_field",
        `capabilities.${capability.id}`,
        "Capability metadata or evidence policy is incomplete.",
      );
    }
  }

  validateCapabilityGraph(curriculum.capabilities, issues);
  for (const source of curriculum.sourceAssets) {
    validateSource(source, curriculum.publicationStatus, issues);
  }
  for (const segment of curriculum.transcriptSegments) {
    validateSegment(segment, sourceById, issues);
  }
  for (const clip of curriculum.clips) {
    validateClip(
      clip,
      curriculum.publicationStatus,
      sourceById,
      segmentById,
      capabilityById,
      issues,
    );
  }
  for (const treatment of curriculum.treatments) {
    validateTreatment(
      treatment,
      curriculum.publicationStatus,
      clipById,
      segmentById,
      capabilityById,
      issues,
    );
  }
  validateCoverage(curriculum, segmentById, clipById, issues);

  return issues;
}

export function canPublishCurriculum(curriculum: CurriculumPackage) {
  return validateCurriculumPackage(curriculum).length === 0;
}

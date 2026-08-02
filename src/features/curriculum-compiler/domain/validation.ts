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

function isLearnerFacing(status: PublicationStatus) {
  return status === "pilot" || status === "approved";
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function statusMeetsPackage(
  packageStatus: PublicationStatus,
  itemStatus: PublicationStatus,
) {
  if (packageStatus === "pilot") {
    return itemStatus === "pilot" || itemStatus === "approved";
  }

  if (packageStatus === "approved") {
    return itemStatus === "approved";
  }

  return true;
}

function duplicateIds<T extends { id: string }>(items: readonly T[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }

  return [...duplicates];
}

function addIssue(
  issues: CurriculumValidationIssue[],
  code: CurriculumValidationCode,
  path: string,
  message: string,
) {
  issues.push({ code, path, message });
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
  const reportedCycles = new Set<string>();

  function visit(capabilityId: string) {
    if (state.get(capabilityId) === "visited") return;

    if (state.get(capabilityId) === "visiting") {
      const cycleStart = stack.indexOf(capabilityId);
      const cycle = [...stack.slice(cycleStart), capabilityId];
      const key = cycle.join(" -> ");

      if (!reportedCycles.has(key)) {
        reportedCycles.add(key);
        addIssue(
          issues,
          "prerequisite_cycle",
          "capabilities",
          `Prerequisite cycle: ${key}`,
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
        `${field} must be an HTTPS URL.`,
      );
    }
  }

  if (
    source.transcriptSourceUrl &&
    !isHttpsUrl(source.transcriptSourceUrl)
  ) {
    addIssue(
      issues,
      "invalid_url",
      `${path}.transcriptSourceUrl`,
      "Transcript source must be an HTTPS URL.",
    );
  }

  if (
    (source.transcriptProvenance === "official" ||
      source.transcriptProvenance === "creator_provided") &&
    !source.transcriptSourceUrl
  ) {
    addIssue(
      issues,
      "missing_field",
      `${path}.transcriptSourceUrl`,
      "Official or creator-provided transcripts require a source URL.",
    );
  }

  if (!Number.isFinite(source.durationMs) || source.durationMs <= 0) {
    addIssue(
      issues,
      "invalid_duration",
      `${path}.durationMs`,
      "Source duration must be a positive number of milliseconds.",
    );
  }

  if (!statusMeetsPackage(packageStatus, source.publicationStatus)) {
    addIssue(
      issues,
      "invalid_publication_status",
      `${path}.publicationStatus`,
      `Source status ${source.publicationStatus} cannot ship in a ${packageStatus} package.`,
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
      "The source must permit transcript storage and derived lessons.",
    );
  }

  if (
    source.mediaAccess === "youtube_embed" &&
    !rights.allowedUses.canEmbed
  ) {
    addIssue(
      issues,
      "invalid_media_permission",
      `${path}.rights.allowedUses.canEmbed`,
      "YouTube playback requires confirmed embed permission.",
    );
  }

  if (
    source.mediaAccess === "external_embed" &&
    !rights.allowedUses.canEmbed
  ) {
    addIssue(
      issues,
      "invalid_media_permission",
      `${path}.rights.allowedUses.canEmbed`,
      "External playback requires confirmed embed permission.",
    );
  }

  if (
    source.mediaAccess === "self_hosted" &&
    !rights.allowedUses.canSelfHostMedia
  ) {
    addIssue(
      issues,
      "invalid_media_permission",
      `${path}.rights.allowedUses.canSelfHostMedia`,
      "Self-hosted playback requires explicit media-hosting permission.",
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
      "Transcript timestamps must form a positive window.",
    );
  }

  if (segment.endMs > source.durationMs) {
    addIssue(
      issues,
      "segment_outside_source",
      path,
      "Transcript segment exceeds source duration.",
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
      "Communication Clips must be between 3 and 60 seconds.",
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

  if (!capabilityById.has(clip.primaryCapabilityId)) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.primaryCapabilityId`,
      `Unknown capability: ${clip.primaryCapabilityId}`,
    );
  }

  if (clip.secondaryCapabilityIds.includes(clip.primaryCapabilityId)) {
    addIssue(
      issues,
      "duplicate_id",
      `${path}.secondaryCapabilityIds`,
      "Primary capability cannot also be secondary.",
    );
  }

  for (const capabilityId of clip.secondaryCapabilityIds) {
    if (!capabilityById.has(capabilityId)) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.secondaryCapabilityIds`,
        `Unknown capability: ${capabilityId}`,
      );
    }
  }

  if (new Set(clip.segmentIds).size !== clip.segmentIds.length) {
    addIssue(
      issues,
      "duplicate_id",
      `${path}.segmentIds`,
      "A clip cannot reference the same segment twice.",
    );
  }

  const clipSegments = clip.segmentIds
    .map((segmentId) => segmentById.get(segmentId))
    .filter((segment): segment is TranscriptSegment => Boolean(segment));

  for (const segmentId of clip.segmentIds) {
    const segment = segmentById.get(segmentId);
    if (!segment) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.segmentIds`,
        `Unknown transcript segment: ${segmentId}`,
      );
      continue;
    }

    if (segment.sourceAssetId !== clip.sourceAssetId) {
      addIssue(
        issues,
        "unknown_reference",
        `${path}.segmentIds`,
        `Segment ${segmentId} belongs to a different source.`,
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

  const sortedSegmentIds = [...clipSegments]
    .sort((left, right) => left.startMs - right.startMs)
    .map((segment) => segment.id);

  if (sortedSegmentIds.join("|") !== clip.segmentIds.join("|")) {
    addIssue(
      issues,
      "segment_order_mismatch",
      `${path}.segmentIds`,
      "Segment IDs must follow transcript timestamp order.",
    );
  }

  if (!statusMeetsPackage(packageStatus, clip.publicationStatus)) {
    addIssue(
      issues,
      "invalid_publication_status",
      `${path}.publicationStatus`,
      `Clip status ${clip.publicationStatus} cannot ship in a ${packageStatus} package.`,
    );
  }

  if (isLearnerFacing(packageStatus)) {
    if (clip.reviewStatus !== "human_verified") {
      addIssue(
        issues,
        "missing_human_review",
        `${path}.reviewStatus`,
        "Learner-facing clips require human review.",
      );
    }

    for (const segment of clipSegments) {
      if (
        segment.transcriptStatus !== "human_verified" ||
        segment.translationStatus !== "human_verified" ||
        !segment.speakerId?.trim()
      ) {
        addIssue(
          issues,
          "missing_human_review",
          `transcriptSegments.${segment.id}`,
          "Learner-facing segments require verified transcript, translation, and speaker identity.",
        );
      }
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
      "Treatment target must be declared on its clip.",
    );
  }

  if (capability && capability.level !== treatment.level) {
    addIssue(
      issues,
      "unknown_reference",
      `${path}.level`,
      `Treatment level ${treatment.level} does not match capability level ${capability.level}.`,
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
        "A treatment cannot require its own target capability.",
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
      "Activity IDs must be unique within a treatment.",
    );
  }

  const layers = new Set(treatment.activities.map((activity) => activity.layer));
  for (const layer of ["comprehension", "acquisition", "transfer"] as const) {
    if (!layers.has(layer)) {
      addIssue(
        issues,
        "missing_activity_layer",
        `${path}.activities`,
        `Missing required ${layer} layer.`,
      );
    }
  }

  const acquisitionActivities = treatment.activities.filter(
    (activity) => activity.layer === "acquisition",
  );
  if (
    !acquisitionActivities.some(
      (activity) =>
        activity.requiresRetrieval && activity.requiresLearnerProduction,
    )
  ) {
    addIssue(
      issues,
      "missing_retrieval",
      `${path}.activities`,
      "Acquisition must include productive retrieval, not recognition alone.",
    );
  }

  const transferActivities = treatment.activities.filter(
    (activity) => activity.layer === "transfer",
  );
  if (
    !transferActivities.some(
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
      "Transfer must require production without the full answer in a changed or unseen situation.",
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
    !transferActivities.some((activity) => activity.unseenInput)
  ) {
    addIssue(
      issues,
      "invalid_cold_transfer",
      `${path}.activities`,
      "Cold-transfer treatments require unseen input.",
    );
  }

  if (
    new Set(treatment.supportPolicy.scaffoldOrder).size !==
    treatment.supportPolicy.scaffoldOrder.length
  ) {
    addIssue(
      issues,
      "invalid_scaffold",
      `${path}.supportPolicy.scaffoldOrder`,
      "Scaffold steps must not repeat.",
    );
  }

  if (
    treatment.supportPolicy.scaffoldOrder.includes("slow_playback") &&
    !treatment.supportPolicy.allowSlowPlayback
  ) {
    addIssue(
      issues,
      "invalid_scaffold",
      `${path}.supportPolicy`,
      "Slow playback cannot appear when it is disabled.",
    );
  }

  const learnerChoice = treatment.learnerChoice;
  if (
    !learnerChoice.titleVi.trim() ||
    !learnerChoice.summaryVi.trim() ||
    learnerChoice.estimatedMinutes < 5 ||
    learnerChoice.estimatedMinutes > 20 ||
    learnerChoice.accentTags.length === 0 ||
    learnerChoice.topicTags.length === 0
  ) {
    addIssue(
      issues,
      "invalid_learner_choice",
      `${path}.learnerChoice`,
      "Learner choice metadata must describe a 5–20 minute option with accent and topic tags.",
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
          "Every activity needs a prompt and source evidence.",
        );
      }

      for (const segmentId of activity.evidenceSegmentIds) {
        if (!segmentById.has(segmentId) || !clipSegmentIds.has(segmentId)) {
          addIssue(
            issues,
            "unknown_reference",
            `${path}.activities.${activity.id}.evidenceSegmentIds`,
            `Activity evidence must belong to the clip: ${segmentId}`,
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
      `Treatment status ${treatment.publicationStatus} cannot ship in a ${packageStatus} package.`,
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

function validateCapabilityCoverage(
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
        `Capability requires at least ${capability.evidencePolicy.minimumDistinctClips} distinct clips; found ${clipIds.size}.`,
      );
    }

    if (speakerIds.size < capability.evidencePolicy.minimumDistinctSpeakers) {
      addIssue(
        issues,
        "insufficient_speaker_coverage",
        `capabilities.${capability.id}`,
        `Capability requires at least ${capability.evidencePolicy.minimumDistinctSpeakers} distinct speakers; found ${speakerIds.size}.`,
      );
    }

    for (const requiredRole of ["anchor", "interaction", "cold_transfer"] as const) {
      if (!roles.has(requiredRole)) {
        addIssue(
          issues,
          "missing_clip_role",
          `capabilities.${capability.id}`,
          `Capability is missing the ${requiredRole} treatment role.`,
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

  for (const [collectionName, items] of [
    ["capabilities", curriculum.capabilities],
    ["sourceAssets", curriculum.sourceAssets],
    ["transcriptSegments", curriculum.transcriptSegments],
    ["clips", curriculum.clips],
    ["treatments", curriculum.treatments],
  ] as const) {
    for (const duplicateId of duplicateIds(items)) {
      addIssue(
        issues,
        "duplicate_id",
        collectionName,
        `Duplicate ID: ${duplicateId}`,
      );
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
        "Capability metadata and evidence policy are incomplete.",
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

  validateCapabilityCoverage(curriculum, segmentById, clipById, issues);

  return issues;
}

export function canPublishCurriculum(curriculum: CurriculumPackage) {
  return validateCurriculumPackage(curriculum).length === 0;
}

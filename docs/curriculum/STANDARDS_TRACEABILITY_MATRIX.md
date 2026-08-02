# Curriculum standards traceability matrix

**Status:** required reference for authentic-clip contracts and validation  
**Updated:** 2026-08-02  
**Code registry:** `src/features/curriculum-compiler/domain/traceability.ts`  
**Validation:** `src/features/curriculum-compiler/domain/validation.ts`

## Purpose

AtoEnglish does not claim that one external standard defines a YouTube-to-Curriculum product.

This matrix separates four different kinds of authority:

1. **External requirements** — official frameworks, web standards, platform constraints, and source permissions that the product must respect.
2. **Research-supported principles** — findings that inform lesson design but do not prescribe one exact implementation.
3. **Pilot hypotheses** — deliberately chosen values that must be tested with real learners and may change.
4. **Internal invariants** — engineering rules required to keep curriculum data coherent and auditable.

A rule must never be described as an international standard when it is only a pilot hypothesis.

## Strength vocabulary

| Strength | Meaning |
| --- | --- |
| `required` | A learner-facing package must comply unless an explicit owner decision changes the governing requirement. |
| `evidence_informed` | The design follows research evidence, but the exact implementation remains a product decision to test. |
| `experimental` | The value or threshold is a pilot assumption and must not be presented as externally mandated. |

## Source hierarchy

When claims conflict, use this order:

1. applicable law, license, written creator permission, and platform terms;
2. official technical standards and API documentation;
3. official language-framework publications;
4. peer-reviewed systematic reviews, meta-analyses, and primary studies;
5. AtoEnglish pilot hypotheses and internal engineering decisions.

Passing a validator does not prove that a source is legally usable or that a learner will improve. Human review and learner evidence remain separate gates.

## Rule matrix

| Rule ID | Type / strength | Product requirement | Enforced or represented by | Primary evidence |
| --- | --- | --- | --- | --- |
| `CEFR-ACTION-001` | Official framework / required | Define curriculum around communicative `can-do` capabilities and meaningful interaction, not only video titles, vocabulary counts, or grammar points. | `CommunicativeCapability`, required activity layers, interaction checks | Council of Europe, CEFR in the classroom: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-in-the-classroom |
| `CEFR-ALIGNMENT-001` | Official framework / required | Align objective, learning activity, and assessment. A speaking outcome must include learner production and transfer evidence. | `missing_activity_layer`, `missing_retrieval`, `invalid_transfer` | Council of Europe classroom guidance above |
| `CEFR-PROGRESSION-001` | Official framework / required | Adapt CEFR to the target learner and make progression explicit; do not treat CEFR as a ready-made syllabus or certification claim. | prerequisite graph, bounded learner choice | Council of Europe, uses and objectives: https://www.coe.int/en/web/common-european-framework-reference-languages/uses-and-objectives |
| `WCAG-CAPTIONS-001` | Web standard / required | Prerecorded synchronized media requires captions; learner-facing timed text must be accessible and accurate. | human review and scaffold validation; future player accessibility tests | WCAG 2.2 SC 1.2.2: https://www.w3.org/TR/WCAG22/#captions-prerecorded |
| `WEBVTT-TIMING-001` | Web standard / required | Timed-text cues require valid, ordered timing linked to media. | timestamp, clip-window, and segment-order validation | WebVTT: https://www.w3.org/TR/webvtt1/ |
| `YT-EMBED-001` | Platform constraint / required | YouTube media is played through supported embed/player behavior and only within declared permissions. | `mediaAccess`, `canEmbed`, `invalid_media_permission` | YouTube IFrame API: https://developers.google.com/youtube/iframe_api_reference |
| `YT-CAPTIONS-001` | Platform constraint / required | Public availability does not imply downloadable caption content. Official caption download requires authorization and permission to edit the video. | transcript provenance and rights flags | Captions download: https://developers.google.com/youtube/v3/docs/captions/download; captions list: https://developers.google.com/youtube/v3/docs/captions/list |
| `RIGHTS-PROVENANCE-001` | Source/platform constraint / required | Review embed, transcript storage, ASR, derived lesson, self-hosting, commercial use, and attribution as separate permissions with evidence. | `SourceRights`, publication gates | YouTube API terms: https://developers.google.com/youtube/terms/api-services-terms-of-service; YouTube copyright/license guidance: https://support.google.com/youtube/answer/2797468 |
| `HUMAN-REVIEW-001` | Internal publication invariant / required | AI output remains draft until a human verifies rights, transcript, translation, speaker boundaries, treatment, and publication status. | `HumanReviewStatus`, `missing_human_review` | WCAG caption guidance plus AtoEnglish risk boundary; this exact workflow is an internal policy. |
| `RETRIEVAL-001` | Research evidence / evidence-informed | Acquisition must require retrieval from memory, not repeated exposure or answer copying alone. | `requiresRetrieval`, productive acquisition gate | Karpicke & Blunt (2011), DOI: https://doi.org/10.1126/science.1199327 |
| `TASK-TRANSFER-001` | Research evidence / evidence-informed | Same-task repetition may support fluency, but evidence of capability also requires changed or unseen use. | `invalid_transfer`, interaction and cold-transfer gates | Lambert, Kormos & Minn, DOI: https://doi.org/10.1017/S0272263116000085 |
| `SPEAKER-VARIABILITY-001` | Research evidence / evidence-informed | Introduce multiple speakers progressively and include novel-speaker evidence; do not equate maximum variability with maximum benefit. | speaker-coverage and cold-transfer gates | Uchihara, Karas & Thomson, DOI: https://doi.org/10.1017/S0272263125100879; Zhang et al., DOI: https://doi.org/10.1044/2021_JSLHR-21-00181 |
| `CAPTION-SCAFFOLD-001` | Research evidence / evidence-informed | Captions can support comprehension and vocabulary learning, but support should be adjustable and independent listening must be measured separately. | scaffold policy and final-attempt checks | Montero Perez et al., DOI: https://doi.org/10.1016/j.system.2013.07.013; Kurokawa et al., DOI: https://doi.org/10.1111/lang.12697 |
| `PILOT-CLIP-WINDOW-001` | Pilot hypothesis / experimental | Constrain the first corpus to 3–60 second clips. | `invalid_duration` | No external standard. Test completion, overload, replay behavior, authoring cost, and transfer by clip duration. |
| `PILOT-COVERAGE-001` | Pilot hypothesis / experimental | Require multiple clips and speakers plus anchor, interaction, and cold-transfer roles for each capability. | coverage and role validation | Research supports variability and transfer, but current minimum counts and roles are AtoEnglish assumptions. |
| `PILOT-CHOICE-001` | Pilot hypothesis / experimental | Offer a small reviewed choice set without allowing prerequisite bypass. | learner-choice validation | No external standard. Test decision time, completion, learner agency, and inappropriate choice rate. |
| `INTERNAL-INTEGRITY-001` | Internal invariant / required | Keep IDs unique, references resolvable, timestamps valid, segment order stable, and prerequisite graphs acyclic. | ID, reference, timestamp, and graph validation | Engineering requirement internal to the curriculum compiler. |

## Validation-code mapping

The compile-time source of truth is `TRACEABILITY_BY_VALIDATION_CODE`. TypeScript uses:

```ts
satisfies Record<CurriculumValidationCode, readonly TraceabilityRuleId[]>
```

This means adding a new `CurriculumValidationCode` without assigning evidence or hypothesis rules causes type-check failure.

| Validation code | Rule IDs |
| --- | --- |
| `missing_field` | `INTERNAL-INTEGRITY-001` |
| `duplicate_id` | `INTERNAL-INTEGRITY-001` |
| `invalid_url` | `RIGHTS-PROVENANCE-001`, `INTERNAL-INTEGRITY-001` |
| `invalid_duration` | `PILOT-CLIP-WINDOW-001`, `INTERNAL-INTEGRITY-001` |
| `invalid_rights` | `RIGHTS-PROVENANCE-001`, `YT-CAPTIONS-001` |
| `invalid_media_permission` | `RIGHTS-PROVENANCE-001`, `YT-EMBED-001` |
| `invalid_publication_status` | `HUMAN-REVIEW-001`, `INTERNAL-INTEGRITY-001` |
| `unknown_reference` | `INTERNAL-INTEGRITY-001` |
| `invalid_timestamp` | `WEBVTT-TIMING-001`, `INTERNAL-INTEGRITY-001` |
| `segment_outside_source` | `WEBVTT-TIMING-001`, `INTERNAL-INTEGRITY-001` |
| `segment_outside_clip` | `WEBVTT-TIMING-001`, `INTERNAL-INTEGRITY-001` |
| `segment_order_mismatch` | `WEBVTT-TIMING-001`, `INTERNAL-INTEGRITY-001` |
| `missing_human_review` | `HUMAN-REVIEW-001`, `WCAG-CAPTIONS-001` |
| `missing_activity_layer` | `CEFR-ACTION-001`, `CEFR-ALIGNMENT-001` |
| `missing_retrieval` | `RETRIEVAL-001`, `CEFR-ALIGNMENT-001` |
| `invalid_transfer` | `TASK-TRANSFER-001`, `CEFR-ALIGNMENT-001` |
| `invalid_interaction` | `CEFR-ACTION-001`, `TASK-TRANSFER-001` |
| `invalid_cold_transfer` | `TASK-TRANSFER-001`, `SPEAKER-VARIABILITY-001` |
| `invalid_scaffold` | `CAPTION-SCAFFOLD-001`, `WCAG-CAPTIONS-001` |
| `invalid_learner_choice` | `PILOT-CHOICE-001`, `CEFR-PROGRESSION-001` |
| `prerequisite_cycle` | `CEFR-PROGRESSION-001`, `INTERNAL-INTEGRITY-001` |
| `missing_prerequisite` | `CEFR-PROGRESSION-001`, `INTERNAL-INTEGRITY-001` |
| `insufficient_clip_coverage` | `PILOT-COVERAGE-001`, `TASK-TRANSFER-001` |
| `insufficient_speaker_coverage` | `PILOT-COVERAGE-001`, `SPEAKER-VARIABILITY-001` |
| `missing_clip_role` | `PILOT-COVERAGE-001`, `TASK-TRANSFER-001` |

## What this matrix does not prove

It does not prove that:

- the selected source is legally usable in every jurisdiction;
- a transcript, translation, speaker label, or level assignment is correct;
- 3–60 seconds is the optimal clip range;
- current minimum clip or speaker counts are sufficient;
- a seven-day sequence causes durable language acquisition;
- passing a lesson causes natural conversation ability;
- AtoEnglish outcomes are equivalent to CEFR certification.

These require human review, learner testing, delayed assessment, and product evidence.

## Pilot-hypothesis review protocol

After the first curated corpus and learner cohort, review every `PILOT-*` rule against:

- completion time and abandonment;
- scaffold use;
- immediate productive recall;
- delayed recall;
- changed-context transfer;
- novel-speaker recognition and response;
- learner confusion and facilitator intervention;
- authoring and review cost;
- source rejection and defect rates.

A pilot threshold may be retained, revised, split by level, or removed. Record the evidence and owner decision before changing its strength or describing it as established practice.

## Change-control rule

Every new publication gate must include:

1. a stable validation code;
2. one or more traceability rule IDs;
3. a rule type and strength;
4. a primary source when the rule makes an external or research claim;
5. a test that prevents missing mappings;
6. a statement of what evidence could revise the rule.

Do not cite a source merely because it discusses a related topic. The product interpretation must remain narrower than or equal to what the source supports.

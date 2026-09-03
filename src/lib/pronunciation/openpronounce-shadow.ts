import { z } from "zod";

import { ALL_SOUNDS } from "@/lib/data/ipa-sounds";

export const OPENPRONOUNCE_SHADOW_CALIBRATION = "shadow-unvalidated" as const;
export const OPENPRONOUNCE_MAX_AUDIO_BYTES = 5 * 1024 * 1024;

const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/aac",
]);

const PhoneObservationSchema = z.object({
  expected: z.string().max(64).nullable().optional(),
  heard: z.string().max(64).nullable().optional(),
  confidence: z.number().finite().min(0).max(1).nullable().optional(),
});

const ErrorObservationSchema = z.object({
  word: z.string().max(120),
  expected: z.string().max(160).nullable().optional(),
  actual: z.string().max(160).nullable().optional(),
  confidence: z.number().finite().min(0).max(1).nullable().optional(),
  phones: z.array(PhoneObservationSchema).max(32).optional().default([]),
});

const ProsodySummarySchema = z.object({
  f0_mean: z.number().finite().nullable().optional(),
  f0_std: z.number().finite().nullable().optional(),
  energy_mean: z.number().finite().nullable().optional(),
  energy_std: z.number().finite().nullable().optional(),
});

const OpenPronounceProviderPayloadSchema = z.object({
  provider: z.object({
    name: z.literal("openpronounce"),
    version: z.string().trim().min(1).max(40),
  }),
  candidate_score: z.number().finite().min(0).max(100).nullable().optional(),
  acoustic_distance: z.number().finite().nonnegative().nullable().optional(),
  phoneme_error_rate: z.number().finite().nonnegative().nullable().optional(),
  word_error_rate: z.number().finite().nonnegative().nullable().optional(),
  errors: z.array(ErrorObservationSchema).max(16).optional().default([]),
  prosody_summary: ProsodySummarySchema.nullable().optional(),
});

export type OpenPronounceProviderPayload = z.infer<typeof OpenPronounceProviderPayloadSchema>;

export type PronunciationShadowTarget = {
  soundId: string;
  word: string;
  ipa: string;
};

export type PronunciationShadowObservation = {
  source: "openpronounce";
  calibration: typeof OPENPRONOUNCE_SHADOW_CALIBRATION;
  target: PronunciationShadowTarget;
  provider: {
    name: "openpronounce";
    version: string;
  };
  diagnostics: {
    acousticDistance: number | null;
    phonemeErrorRate: number | null;
    wordErrorRate: number | null;
    prosody: {
      f0Mean: number | null;
      f0Std: number | null;
      energyMean: number | null;
      energyStd: number | null;
    } | null;
  };
  suspectedErrors: Array<{
    word: string;
    expectedPhones: string | null;
    observedPhones: string | null;
    confidence: number | null;
    phones: Array<{
      expected: string | null;
      observed: string | null;
      confidence: number | null;
    }>;
  }>;
};

function nullableNumber(value: number | null | undefined) {
  return value ?? null;
}

function nullableString(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function isAllowedPronunciationAudioType(contentType: string) {
  const normalized = contentType.split(";", 1)[0]?.trim().toLowerCase() ?? "";
  return ALLOWED_AUDIO_TYPES.has(normalized);
}

export function resolvePronunciationShadowTarget(
  soundId: string,
): PronunciationShadowTarget | null {
  const normalizedId = soundId.trim();
  if (!normalizedId || normalizedId.length > 80) return null;

  const sound = ALL_SOUNDS.find((candidate) => candidate.id === normalizedId);
  if (!sound) return null;

  return {
    soundId: sound.id,
    word: sound.exampleWord,
    ipa: sound.exampleIpa,
  };
}

export function parseOpenPronounceProviderPayload(
  payload: unknown,
): OpenPronounceProviderPayload | null {
  const parsed = OpenPronounceProviderPayloadSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

/**
 * Convert the private provider payload into the only shape allowed to cross the AtoEnglish
 * learner-facing boundary. OpenPronounce's candidate 0-100 score is intentionally omitted.
 * Raw transcript, raw audio, F0/energy curves and aligned phone vectors never enter this type.
 */
export function toPronunciationShadowObservation(
  target: PronunciationShadowTarget,
  providerPayload: OpenPronounceProviderPayload,
): PronunciationShadowObservation {
  const prosody = providerPayload.prosody_summary
    ? {
        f0Mean: nullableNumber(providerPayload.prosody_summary.f0_mean),
        f0Std: nullableNumber(providerPayload.prosody_summary.f0_std),
        energyMean: nullableNumber(providerPayload.prosody_summary.energy_mean),
        energyStd: nullableNumber(providerPayload.prosody_summary.energy_std),
      }
    : null;

  return {
    source: "openpronounce",
    calibration: OPENPRONOUNCE_SHADOW_CALIBRATION,
    target,
    provider: providerPayload.provider,
    diagnostics: {
      acousticDistance: nullableNumber(providerPayload.acoustic_distance),
      phonemeErrorRate: nullableNumber(providerPayload.phoneme_error_rate),
      wordErrorRate: nullableNumber(providerPayload.word_error_rate),
      prosody,
    },
    suspectedErrors: providerPayload.errors.map((error) => ({
      word: error.word,
      expectedPhones: nullableString(error.expected),
      observedPhones: nullableString(error.actual),
      confidence: nullableNumber(error.confidence),
      phones: error.phones.map((phone) => ({
        expected: nullableString(phone.expected),
        observed: nullableString(phone.heard),
        confidence: nullableNumber(phone.confidence),
      })),
    })),
  };
}

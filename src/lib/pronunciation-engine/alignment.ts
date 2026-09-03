import {
  articulatoryDeltaForPhones,
  normalizeEnglishPhone,
  phonologicalDistance,
} from "./phonology";
import type {
  CanonicalPronunciation,
  ObservedPhone,
  PhoneAlignmentEvidence,
  PhoneCandidate,
  PronunciationAlignmentResult,
} from "./types";

const DEFAULT_DELETION_COST = 0.95;
const DEFAULT_INSERTION_COST = 0.9;
const COST_EPSILON = 1e-9;

type WeightedCandidate = {
  phone: string;
  weight: number;
  probability: number | null;
};

type CandidateView = {
  weighted: WeightedCandidate[];
  topPhone: string;
  topProbability: number | null;
  posteriorMargin: number | null;
};

type AlignmentOptions = {
  deletionCost?: number;
  insertionCost?: number;
};

type TraceOperation = "diagonal" | "deletion" | "insertion" | null;

type MatrixCell = {
  cost: number;
  operation: TraceOperation;
};

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value));
}

function normalizePhoneCandidates(candidates: readonly PhoneCandidate[]): CandidateView {
  const cleaned = candidates
    .map((candidate) => ({
      phone: normalizeEnglishPhone(candidate.phone),
      probability:
        candidate.probability !== null &&
        Number.isFinite(candidate.probability) &&
        candidate.probability >= 0 &&
        candidate.probability <= 1
          ? candidate.probability
          : null,
    }))
    .filter((candidate) => candidate.phone.length > 0);

  if (cleaned.length === 0) {
    throw new Error("phone_observation_has_no_candidates");
  }

  const hasCompleteProbabilityDistribution = cleaned.every(
    (candidate) => candidate.probability !== null,
  );

  if (hasCompleteProbabilityDistribution) {
    const merged = new Map<string, number>();

    for (const candidate of cleaned) {
      merged.set(
        candidate.phone,
        (merged.get(candidate.phone) ?? 0) + (candidate.probability ?? 0),
      );
    }

    const total = [...merged.values()].reduce((sum, value) => sum + value, 0);

    if (total > 0) {
      const ranked = [...merged.entries()]
        .map(([phone, probability]) => ({
          phone,
          probability: probability / total,
        }))
        .sort((left, right) => right.probability - left.probability);

      const first = ranked[0];
      if (!first) throw new Error("phone_observation_has_no_candidates");

      const second = ranked[1];

      return {
        weighted: ranked.map((candidate) => ({
          phone: candidate.phone,
          weight: candidate.probability,
          probability: candidate.probability,
        })),
        topPhone: first.phone,
        topProbability: first.probability,
        posteriorMargin: clampUnit(
          first.probability - (second?.probability ?? 0),
        ),
      };
    }
  }

  // Rank-only sensors are still useful evidence, but these weights are an
  // internal alignment prior. They are never surfaced as probabilities.
  const deduplicated: string[] = [];
  const seen = new Set<string>();

  for (const candidate of cleaned) {
    if (!seen.has(candidate.phone)) {
      seen.add(candidate.phone);
      deduplicated.push(candidate.phone);
    }
  }

  const rawWeights = deduplicated.map((_, index) => Math.pow(0.55, index));
  const totalWeight = rawWeights.reduce((sum, value) => sum + value, 0);
  const topPhone = deduplicated[0];

  if (!topPhone) throw new Error("phone_observation_has_no_candidates");

  return {
    weighted: deduplicated.map((phone, index) => ({
      phone,
      weight: rawWeights[index] / totalWeight,
      probability: null,
    })),
    topPhone,
    topProbability: null,
    posteriorMargin: null,
  };
}

function substitutionEvidence(expected: string, observed: ObservedPhone) {
  const candidates = normalizePhoneCandidates(observed.candidates);
  const cost = candidates.weighted.reduce(
    (sum, candidate) =>
      sum + candidate.weight * phonologicalDistance(expected, candidate.phone),
    0,
  );

  return {
    cost: clampUnit(cost),
    topPhone: candidates.topPhone,
    topProbability: candidates.topProbability,
    posteriorMargin: candidates.posteriorMargin,
  };
}

function insertionEvidence(observed: ObservedPhone, cost: number): PhoneAlignmentEvidence {
  const candidates = normalizePhoneCandidates(observed.candidates);

  return {
    kind: "insertion",
    expected: null,
    observed: candidates.topPhone,
    cost,
    observedProbability: candidates.topProbability,
    posteriorMargin: candidates.posteriorMargin,
    articulatoryDelta: null,
  };
}

function chooseOperation(
  diagonal: number,
  deletion: number,
  insertion: number,
): MatrixCell {
  const minimum = Math.min(diagonal, deletion, insertion);

  // Prefer a direct acoustic/phonological comparison on ties. This avoids a
  // substitution being represented as a deletion+insertion pair when both
  // explanations have effectively identical cost.
  if (Math.abs(diagonal - minimum) <= COST_EPSILON) {
    return { cost: diagonal, operation: "diagonal" };
  }

  if (Math.abs(deletion - minimum) <= COST_EPSILON) {
    return { cost: deletion, operation: "deletion" };
  }

  return { cost: insertion, operation: "insertion" };
}

export function alignCanonicalPronunciation(
  pronunciation: CanonicalPronunciation,
  observations: readonly ObservedPhone[],
  options: AlignmentOptions = {},
): PronunciationAlignmentResult {
  const deletionCost = clampUnit(options.deletionCost ?? DEFAULT_DELETION_COST);
  const insertionCost = clampUnit(options.insertionCost ?? DEFAULT_INSERTION_COST);
  const expectedPhones = pronunciation.phones.map(normalizeEnglishPhone);

  const rows = expectedPhones.length + 1;
  const columns = observations.length + 1;
  const matrix: MatrixCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ cost: 0, operation: null })),
  );

  for (let row = 1; row < rows; row += 1) {
    matrix[row][0] = {
      cost: matrix[row - 1][0].cost + deletionCost,
      operation: "deletion",
    };
  }

  for (let column = 1; column < columns; column += 1) {
    matrix[0][column] = {
      cost: matrix[0][column - 1].cost + insertionCost,
      operation: "insertion",
    };
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const expected = expectedPhones[row - 1];
      const observed = observations[column - 1];

      if (!expected || !observed) {
        throw new Error("invalid_alignment_matrix_state");
      }

      const substitution = substitutionEvidence(expected, observed);
      const diagonal =
        matrix[row - 1][column - 1].cost + substitution.cost;
      const deletion = matrix[row - 1][column].cost + deletionCost;
      const insertion = matrix[row][column - 1].cost + insertionCost;

      matrix[row][column] = chooseOperation(diagonal, deletion, insertion);
    }
  }

  const alignment: PhoneAlignmentEvidence[] = [];
  let row = expectedPhones.length;
  let column = observations.length;

  while (row > 0 || column > 0) {
    const cell = matrix[row][column];

    if (cell.operation === "diagonal" && row > 0 && column > 0) {
      const expected = expectedPhones[row - 1];
      const observed = observations[column - 1];

      if (!expected || !observed) {
        throw new Error("invalid_alignment_backtrace_state");
      }

      const evidence = substitutionEvidence(expected, observed);
      const normalizedObserved = normalizeEnglishPhone(evidence.topPhone);
      const isMatch = normalizeEnglishPhone(expected) === normalizedObserved;

      alignment.push({
        kind: isMatch ? "match" : "substitution",
        expected,
        observed: normalizedObserved,
        cost: evidence.cost,
        observedProbability: evidence.topProbability,
        posteriorMargin: evidence.posteriorMargin,
        articulatoryDelta: isMatch
          ? null
          : articulatoryDeltaForPhones(expected, normalizedObserved),
      });

      row -= 1;
      column -= 1;
      continue;
    }

    if (cell.operation === "deletion" && row > 0) {
      alignment.push({
        kind: "deletion",
        expected: expectedPhones[row - 1] ?? null,
        observed: null,
        cost: deletionCost,
        observedProbability: null,
        posteriorMargin: null,
        articulatoryDelta: null,
      });
      row -= 1;
      continue;
    }

    if (cell.operation === "insertion" && column > 0) {
      const observed = observations[column - 1];
      if (!observed) throw new Error("invalid_alignment_backtrace_state");
      alignment.push(insertionEvidence(observed, insertionCost));
      column -= 1;
      continue;
    }

    throw new Error("alignment_backtrace_failed");
  }

  alignment.reverse();

  const totalCost = matrix[expectedPhones.length][observations.length].cost;
  const normalizationLength = Math.max(expectedPhones.length, observations.length, 1);

  return {
    pronunciationId: pronunciation.id,
    totalCost,
    normalizedCost: clampUnit(totalCost / normalizationLength),
    alignment,
  };
}

export function selectBestCanonicalPronunciation(
  pronunciations: readonly CanonicalPronunciation[],
  observations: readonly ObservedPhone[],
  options: AlignmentOptions = {},
) {
  if (pronunciations.length === 0) {
    throw new Error("canonical_pronunciation_required");
  }

  let best: PronunciationAlignmentResult | null = null;

  for (const pronunciation of pronunciations) {
    const result = alignCanonicalPronunciation(
      pronunciation,
      observations,
      options,
    );

    if (
      !best ||
      result.normalizedCost < best.normalizedCost - COST_EPSILON
    ) {
      best = result;
    }
  }

  if (!best) throw new Error("canonical_pronunciation_required");
  return best;
}

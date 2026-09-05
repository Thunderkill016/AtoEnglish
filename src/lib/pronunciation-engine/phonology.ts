import type { ArticulatoryDelta } from "./types";

type ConsonantManner =
  | "stop"
  | "affricate"
  | "fricative"
  | "nasal"
  | "approximant"
  | "lateral"
  | "tap";

type ConsonantPlace =
  | "bilabial"
  | "labiodental"
  | "dental"
  | "alveolar"
  | "postalveolar"
  | "palatal"
  | "velar"
  | "glottal"
  | "labial-velar";

type ConsonantFeatures = {
  kind: "consonant";
  place: ConsonantPlace;
  manner: ConsonantManner;
  voiced: boolean;
  nasal: boolean;
  lateral: boolean;
  sonorant: boolean;
};

type VowelPoint = {
  /** 0 = close, 1 = open. */
  height: number;
  /** 0 = front, 0.5 = central, 1 = back. */
  backness: number;
  rounded: boolean;
  rhotic: boolean;
};

type VowelFeatures = {
  kind: "vowel";
  start: VowelPoint;
  end: VowelPoint;
  /** 0 = short/lax proxy, 1 = explicitly long. */
  length: number;
};

type EnglishPhoneFeatures = ConsonantFeatures | VowelFeatures;

const placeCoordinate: Record<Exclude<ConsonantPlace, "labial-velar">, number> = {
  bilabial: 0,
  labiodental: 0.7,
  dental: 1.6,
  alveolar: 2.2,
  postalveolar: 3.1,
  palatal: 4,
  velar: 5,
  glottal: 6,
};

function consonant(
  place: ConsonantPlace,
  manner: ConsonantManner,
  voiced: boolean,
): ConsonantFeatures {
  const nasal = manner === "nasal";
  const lateral = manner === "lateral";
  const sonorant =
    nasal || lateral || manner === "approximant" || manner === "tap";

  return {
    kind: "consonant",
    place,
    manner,
    voiced,
    nasal,
    lateral,
    sonorant,
  };
}

function point(
  height: number,
  backness: number,
  rounded = false,
  rhotic = false,
): VowelPoint {
  return { height, backness, rounded, rhotic };
}

function vowel(
  start: VowelPoint,
  end: VowelPoint = start,
  length = 0,
): VowelFeatures {
  return { kind: "vowel", start, end, length };
}

const VOWEL_POINTS = {
  i: point(0, 0),
  ɪ: point(0.16, 0.08),
  e: point(0.32, 0.05),
  ɛ: point(0.64, 0.05),
  æ: point(0.86, 0.08),
  a: point(0.98, 0.35),
  ɑ: point(1, 0.95),
  ɒ: point(0.96, 1, true),
  ɔ: point(0.66, 1, true),
  o: point(0.34, 1, true),
  ʊ: point(0.18, 0.92, true),
  u: point(0, 1, true),
  ʌ: point(0.66, 0.62),
  ɜ: point(0.62, 0.5),
  ə: point(0.5, 0.5),
  ɐ: point(0.78, 0.5),
  ɚ: point(0.5, 0.5, false, true),
  ɝ: point(0.62, 0.5, false, true),
} as const;

const PHONE_FEATURES: Record<string, EnglishPhoneFeatures> = {
  p: consonant("bilabial", "stop", false),
  b: consonant("bilabial", "stop", true),
  t: consonant("alveolar", "stop", false),
  d: consonant("alveolar", "stop", true),
  k: consonant("velar", "stop", false),
  g: consonant("velar", "stop", true),
  ʔ: consonant("glottal", "stop", false),
  f: consonant("labiodental", "fricative", false),
  v: consonant("labiodental", "fricative", true),
  θ: consonant("dental", "fricative", false),
  ð: consonant("dental", "fricative", true),
  s: consonant("alveolar", "fricative", false),
  z: consonant("alveolar", "fricative", true),
  ʃ: consonant("postalveolar", "fricative", false),
  ʒ: consonant("postalveolar", "fricative", true),
  h: consonant("glottal", "fricative", false),
  tʃ: consonant("postalveolar", "affricate", false),
  dʒ: consonant("postalveolar", "affricate", true),
  m: consonant("bilabial", "nasal", true),
  n: consonant("alveolar", "nasal", true),
  ŋ: consonant("velar", "nasal", true),
  l: consonant("alveolar", "lateral", true),
  ɹ: consonant("alveolar", "approximant", true),
  j: consonant("palatal", "approximant", true),
  w: consonant("labial-velar", "approximant", true),
  ɾ: consonant("alveolar", "tap", true),

  i: vowel(VOWEL_POINTS.i, VOWEL_POINTS.i, 0.6),
  "iː": vowel(VOWEL_POINTS.i, VOWEL_POINTS.i, 1),
  ɪ: vowel(VOWEL_POINTS.ɪ, VOWEL_POINTS.ɪ, 0),
  e: vowel(VOWEL_POINTS.e, VOWEL_POINTS.e, 0.45),
  ɛ: vowel(VOWEL_POINTS.ɛ, VOWEL_POINTS.ɛ, 0),
  æ: vowel(VOWEL_POINTS.æ, VOWEL_POINTS.æ, 0),
  a: vowel(VOWEL_POINTS.a, VOWEL_POINTS.a, 0.2),
  ɑ: vowel(VOWEL_POINTS.ɑ, VOWEL_POINTS.ɑ, 0.5),
  "ɑː": vowel(VOWEL_POINTS.ɑ, VOWEL_POINTS.ɑ, 1),
  ɒ: vowel(VOWEL_POINTS.ɒ, VOWEL_POINTS.ɒ, 0),
  ɔ: vowel(VOWEL_POINTS.ɔ, VOWEL_POINTS.ɔ, 0.5),
  "ɔː": vowel(VOWEL_POINTS.ɔ, VOWEL_POINTS.ɔ, 1),
  o: vowel(VOWEL_POINTS.o, VOWEL_POINTS.o, 0.5),
  ʊ: vowel(VOWEL_POINTS.ʊ, VOWEL_POINTS.ʊ, 0),
  u: vowel(VOWEL_POINTS.u, VOWEL_POINTS.u, 0.6),
  "uː": vowel(VOWEL_POINTS.u, VOWEL_POINTS.u, 1),
  ʌ: vowel(VOWEL_POINTS.ʌ, VOWEL_POINTS.ʌ, 0),
  ɜ: vowel(VOWEL_POINTS.ɜ, VOWEL_POINTS.ɜ, 0.5),
  "ɜː": vowel(VOWEL_POINTS.ɜ, VOWEL_POINTS.ɜ, 1),
  ə: vowel(VOWEL_POINTS.ə, VOWEL_POINTS.ə, 0),
  ɐ: vowel(VOWEL_POINTS.ɐ, VOWEL_POINTS.ɐ, 0),
  ɚ: vowel(VOWEL_POINTS.ɚ, VOWEL_POINTS.ɚ, 0),
  ɝ: vowel(VOWEL_POINTS.ɝ, VOWEL_POINTS.ɝ, 0.8),

  eɪ: vowel(VOWEL_POINTS.e, VOWEL_POINTS.ɪ, 0.75),
  aɪ: vowel(VOWEL_POINTS.a, VOWEL_POINTS.ɪ, 0.75),
  ɔɪ: vowel(VOWEL_POINTS.ɔ, VOWEL_POINTS.ɪ, 0.75),
  aʊ: vowel(VOWEL_POINTS.a, VOWEL_POINTS.ʊ, 0.75),
  oʊ: vowel(VOWEL_POINTS.o, VOWEL_POINTS.ʊ, 0.75),
  əʊ: vowel(VOWEL_POINTS.ə, VOWEL_POINTS.ʊ, 0.75),
  ɪə: vowel(VOWEL_POINTS.ɪ, VOWEL_POINTS.ə, 0.65),
  eə: vowel(VOWEL_POINTS.e, VOWEL_POINTS.ə, 0.65),
  ɛə: vowel(VOWEL_POINTS.ɛ, VOWEL_POINTS.ə, 0.65),
  ʊə: vowel(VOWEL_POINTS.ʊ, VOWEL_POINTS.ə, 0.65),
};

export function normalizeEnglishPhone(value: string) {
  return value
    .normalize("NFC")
    .replaceAll("t͡ʃ", "tʃ")
    .replaceAll("d͡ʒ", "dʒ")
    .replaceAll("ɡ", "g")
    .replaceAll("r", "ɹ")
    .replace(/[\/\[\]ˈˌ.\s]/gu, "")
    .trim();
}

function placeDistance(left: ConsonantPlace, right: ConsonantPlace) {
  if (left === right) return 0;

  const coordinate = (place: ConsonantPlace) => {
    if (place === "labial-velar") {
      return [placeCoordinate.bilabial, placeCoordinate.velar];
    }

    return [placeCoordinate[place]];
  };

  const leftCoordinates = coordinate(left);
  const rightCoordinates = coordinate(right);
  let minimum = 1;

  for (const leftCoordinate of leftCoordinates) {
    for (const rightCoordinate of rightCoordinates) {
      minimum = Math.min(
        minimum,
        Math.abs(leftCoordinate - rightCoordinate) / placeCoordinate.glottal,
      );
    }
  }

  // Complex labial-velar articulation should not be considered identical to
  // either of its component places merely because one coordinate overlaps.
  if (minimum === 0 && (left === "labial-velar" || right === "labial-velar")) {
    return 0.2;
  }

  return minimum;
}

function mannerDistance(left: ConsonantManner, right: ConsonantManner) {
  if (left === right) return 0;

  const pair = new Set([left, right]);

  if (pair.has("stop") && pair.has("affricate")) return 0.45;
  if (pair.has("affricate") && pair.has("fricative")) return 0.35;
  if (pair.has("stop") && pair.has("tap")) return 0.25;
  if (pair.has("approximant") && pair.has("lateral")) return 0.35;
  if (pair.has("stop") && pair.has("nasal")) return 0.55;
  if (pair.has("approximant") && pair.has("tap")) return 0.45;

  return 1;
}

function consonantDistance(left: ConsonantFeatures, right: ConsonantFeatures) {
  const place = placeDistance(left.place, right.place);
  const manner = mannerDistance(left.manner, right.manner);
  const voicing = left.voiced === right.voiced ? 0 : 1;
  const sonorant = left.sonorant === right.sonorant ? 0 : 1;
  const nasalOrLateral =
    (left.nasal === right.nasal ? 0 : 0.5) +
    (left.lateral === right.lateral ? 0 : 0.5);

  return Math.min(
    1,
    0.3 * place +
      0.35 * manner +
      0.15 * voicing +
      0.1 * sonorant +
      0.1 * nasalOrLateral,
  );
}

function vowelPointDistance(left: VowelPoint, right: VowelPoint) {
  return Math.min(
    1,
    0.45 * Math.abs(left.height - right.height) +
      0.35 * Math.abs(left.backness - right.backness) +
      0.15 * (left.rounded === right.rounded ? 0 : 1) +
      0.05 * (left.rhotic === right.rhotic ? 0 : 1),
  );
}

function vowelDistance(left: VowelFeatures, right: VowelFeatures) {
  const trajectory =
    0.45 * vowelPointDistance(left.start, right.start) +
    0.45 * vowelPointDistance(left.end, right.end);
  const length = 0.1 * Math.abs(left.length - right.length);

  return Math.min(1, trajectory + length);
}

/**
 * A bounded articulatory prior inspired by feature-edit-distance work such as
 * PanPhon. It is intentionally transparent and trainable later: these weights
 * are hypotheses to validate against human labels, not pronunciation truth.
 */
export function phonologicalDistance(expected: string, observed: string) {
  const normalizedExpected = normalizeEnglishPhone(expected);
  const normalizedObserved = normalizeEnglishPhone(observed);

  if (normalizedExpected === normalizedObserved) return 0;

  const expectedFeatures = PHONE_FEATURES[normalizedExpected];
  const observedFeatures = PHONE_FEATURES[normalizedObserved];

  if (!expectedFeatures || !observedFeatures) return 1;
  if (expectedFeatures.kind !== observedFeatures.kind) return 1;

  return expectedFeatures.kind === "consonant"
    ? consonantDistance(
        expectedFeatures,
        observedFeatures as ConsonantFeatures,
      )
    : vowelDistance(expectedFeatures, observedFeatures as VowelFeatures);
}

function averageVowelPoint(features: VowelFeatures) {
  return {
    height: (features.start.height + features.end.height) / 2,
    backness: (features.start.backness + features.end.backness) / 2,
    rounded: features.start.rounded || features.end.rounded,
    rhotic: features.start.rhotic || features.end.rhotic,
  };
}

export function articulatoryDeltaForPhones(
  expected: string,
  observed: string,
): ArticulatoryDelta | null {
  const normalizedExpected = normalizeEnglishPhone(expected);
  const normalizedObserved = normalizeEnglishPhone(observed);
  const expectedFeatures = PHONE_FEATURES[normalizedExpected];
  const observedFeatures = PHONE_FEATURES[normalizedObserved];

  if (!expectedFeatures || !observedFeatures) return null;

  if (expectedFeatures.kind !== observedFeatures.kind) {
    return {
      majorClass: {
        expected: expectedFeatures.kind,
        observed: observedFeatures.kind,
      },
    };
  }

  if (expectedFeatures.kind === "consonant") {
    const observedConsonant = observedFeatures as ConsonantFeatures;

    return {
      place:
        expectedFeatures.place === observedConsonant.place
          ? null
          : {
              expected: expectedFeatures.place,
              observed: observedConsonant.place,
            },
      manner:
        expectedFeatures.manner === observedConsonant.manner
          ? null
          : {
              expected: expectedFeatures.manner,
              observed: observedConsonant.manner,
            },
      voicing:
        expectedFeatures.voiced === observedConsonant.voiced
          ? null
          : {
              expected: expectedFeatures.voiced,
              observed: observedConsonant.voiced,
            },
    };
  }

  const expectedVowel = expectedFeatures;
  const observedVowel = observedFeatures as VowelFeatures;
  const expectedPoint = averageVowelPoint(expectedVowel);
  const observedPoint = averageVowelPoint(observedVowel);

  return {
    vowelHeight:
      Math.abs(expectedPoint.height - observedPoint.height) < 0.05
        ? null
        : {
            expected: expectedPoint.height,
            observed: observedPoint.height,
          },
    vowelBackness:
      Math.abs(expectedPoint.backness - observedPoint.backness) < 0.05
        ? null
        : {
            expected: expectedPoint.backness,
            observed: observedPoint.backness,
          },
    rounded:
      expectedPoint.rounded === observedPoint.rounded
        ? null
        : {
            expected: expectedPoint.rounded,
            observed: observedPoint.rounded,
          },
    rhotic:
      expectedPoint.rhotic === observedPoint.rhotic
        ? null
        : {
            expected: expectedPoint.rhotic,
            observed: observedPoint.rhotic,
          },
    length:
      Math.abs(expectedVowel.length - observedVowel.length) < 0.05
        ? null
        : {
            expected: expectedVowel.length,
            observed: observedVowel.length,
          },
  };
}

export function isKnownEnglishPhone(phone: string) {
  return Boolean(PHONE_FEATURES[normalizeEnglishPhone(phone)]);
}

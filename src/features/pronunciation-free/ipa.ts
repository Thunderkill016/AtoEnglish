import type { PhoneAlignment } from "./types";

const MULTI_CHARACTER_PHONES = [
  "tʃ",
  "dʒ",
  "iː",
  "ɑː",
  "ɔː",
  "uː",
  "ɜː",
  "eɪ",
  "aɪ",
  "ɔɪ",
  "aʊ",
  "əʊ",
  "oʊ",
  "ɪə",
  "eə",
  "ʊə",
].sort((left, right) => right.length - left.length);

const IPA_MARKS = new Set(["/", "[", "]", "ˈ", "ˌ", ".", " ", "\t", "\n"]);

function normalizePhoneToken(value: string) {
  return value
    .normalize("NFC")
    .replaceAll("t͡ʃ", "tʃ")
    .replaceAll("d͡ʒ", "dʒ")
    .replaceAll("ɡ", "g")
    .trim();
}

function comparisonPhone(value: string | null) {
  if (value === null) return null;
  return normalizePhoneToken(value);
}

export function tokenizeExpectedIpa(ipa: string) {
  const normalized = normalizePhoneToken(ipa);
  const phones: string[] = [];

  let index = 0;

  while (index < normalized.length) {
    const current = normalized[index];

    if (IPA_MARKS.has(current)) {
      index += 1;
      continue;
    }

    const multiPhone = MULTI_CHARACTER_PHONES.find((candidate) =>
      normalized.startsWith(candidate, index),
    );

    if (multiPhone) {
      phones.push(multiPhone);
      index += multiPhone.length;
      continue;
    }

    const codePoint = normalized.codePointAt(index);
    if (codePoint === undefined) break;

    const phone = String.fromCodePoint(codePoint);
    phones.push(phone);
    index += phone.length;
  }

  return phones.filter(Boolean);
}

export function parseObservedPhonemes(value: string) {
  const normalized = normalizePhoneToken(value);

  if (!normalized) return [];

  const whitespaceTokens = normalized
    .split(/\s+/u)
    .map(normalizePhoneToken)
    .filter(Boolean);

  if (whitespaceTokens.length > 1) {
    return whitespaceTokens;
  }

  return tokenizeExpectedIpa(normalized);
}

function substitutionCost(expected: string, observed: string) {
  return comparisonPhone(expected) === comparisonPhone(observed) ? 0 : 1;
}

export function alignPhoneSequences(
  expectedPhones: readonly string[],
  observedPhones: readonly string[],
): PhoneAlignment[] {
  const rows = expectedPhones.length + 1;
  const columns = observedPhones.length + 1;
  const matrix = Array.from({ length: rows }, () =>
    Array<number>(columns).fill(0),
  );

  for (let row = 1; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let column = 1; column < columns; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const substitution =
        matrix[row - 1][column - 1] +
        substitutionCost(expectedPhones[row - 1], observedPhones[column - 1]);
      const deletion = matrix[row - 1][column] + 1;
      const insertion = matrix[row][column - 1] + 1;

      matrix[row][column] = Math.min(substitution, deletion, insertion);
    }
  }

  const alignment: PhoneAlignment[] = [];
  let row = expectedPhones.length;
  let column = observedPhones.length;

  while (row > 0 || column > 0) {
    if (row > 0 && column > 0) {
      const expected = expectedPhones[row - 1];
      const observed = observedPhones[column - 1];
      const diagonalCost =
        matrix[row - 1][column - 1] + substitutionCost(expected, observed);

      if (matrix[row][column] === diagonalCost) {
        alignment.push({
          kind:
            comparisonPhone(expected) === comparisonPhone(observed)
              ? "match"
              : "substitution",
          expected,
          observed,
        });
        row -= 1;
        column -= 1;
        continue;
      }
    }

    if (row > 0 && matrix[row][column] === matrix[row - 1][column] + 1) {
      alignment.push({
        kind: "deletion",
        expected: expectedPhones[row - 1],
        observed: null,
      });
      row -= 1;
      continue;
    }

    if (column > 0) {
      alignment.push({
        kind: "insertion",
        expected: null,
        observed: observedPhones[column - 1],
      });
      column -= 1;
      continue;
    }
  }

  return alignment.reverse();
}

/** Normalize free-text / scramble answers for lenient compare (cloze, scramble, correction). */
export function normalizeExerciseAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/[.,!?]+$/g, "")
    .replace(/\s+/g, " ");
}

export function answersMatch(user: string, expected: string): boolean {
  return normalizeExerciseAnswer(user) === normalizeExerciseAnswer(expected);
}

/** Fisher–Yates shuffle (copy). */
export function shuffleWords(words: string[]): string[] {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

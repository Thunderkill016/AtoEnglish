import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Find all unit files in the directory
const unitsDir = path.join(__dirname, "../lib/data/units");
const files = fs.readdirSync(unitsDir).filter(f => f.endsWith(".ts"));

describe("Curriculum Quality Rigorous Assessment Suite", () => {
  for (const file of files) {
    describe(`Unit File: ${file}`, () => {
      it("should load without errors and conform to pedagogical & technical specs", async () => {
        const filePath = path.join(unitsDir, file);
        // Dynamic import
        const importedModule = await import(filePath);
        const unit = importedModule.default || Object.values(importedModule)[0];

        expect(unit).toBeDefined();

        // 1. Technical Schema Validation
        expect(unit.unitId).toBeDefined();
        expect(typeof unit.unitId).toBe("string");
        expect(unit.unitId.length).toBeGreaterThan(0);

        // unitId must match file name (ignoring casing and dashes)
        const normalizedFileBase = file.replace(".ts", "").toLowerCase(); // e.g. "unita01" or "unit1"
        const normalizedUnitId = unit.unitId.replace(/-/g, "").toLowerCase(); // e.g. "unita01" or "unit1"
        expect(normalizedUnitId).toBe(normalizedFileBase);

        expect(unit.title).toBeDefined();
        expect(typeof unit.title).toBe("string");
        expect(unit.title.length).toBeGreaterThan(0);

        expect(unit.level).toBeDefined();
        expect(["A0", "A1", "A2", "B1", "B2", "C1"]).toContain(unit.level);

        expect(unit.xp).toBeDefined();
        expect(typeof unit.xp).toBe("number");
        expect(unit.xp).toBeGreaterThan(0);

        expect(unit.estimatedTime).toBeDefined();
        expect(typeof unit.estimatedTime).toBe("number");
        expect(unit.estimatedTime).toBeGreaterThan(0);

        expect(unit.badgeName).toBeDefined();
        expect(typeof unit.badgeName).toBe("string");
        expect(unit.badgeName.length).toBeGreaterThan(0);

        expect(unit.badgeEmoji).toBeDefined();
        expect(typeof unit.badgeEmoji).toBe("string");
        expect(unit.badgeEmoji.length).toBeGreaterThan(0);

        expect(unit.description).toBeDefined();
        expect(typeof unit.description).toBe("string");
        expect(unit.description.length).toBeGreaterThan(0);

        // 2. Pedagogical Vocab Size & Structure Check
        expect(unit.vocab).toBeDefined();
        expect(Array.isArray(unit.vocab)).toBe(true);
        // Expect vocabulary items count to be within optimal cognitive load (8 to 20)
        expect(unit.vocab.length).toBeGreaterThanOrEqual(8);
        expect(unit.vocab.length).toBeLessThanOrEqual(20);

        const leakRegex = /[✓✔️]/;
        const isAdvancedLevel = ["A2", "B1", "B2"].includes(unit.level);

        unit.vocab.forEach((item: any, index: number) => {
          const vocabDesc = `Vocab item #${index + 1} (${item.word || "unknown"})`;
          expect(item.id, `${vocabDesc}: missing id`).toBeDefined();
          expect(item.word, `${vocabDesc}: missing word`).toBeDefined();
          expect(typeof item.word).toBe("string");
          expect(item.word.length).toBeGreaterThan(0);

          expect(item.phonetic, `${vocabDesc}: missing phonetic`).toBeDefined();
          expect(item.phonetic.length).toBeGreaterThan(0);

          expect(item.meaning, `${vocabDesc}: missing meaning`).toBeDefined();
          expect(item.meaning.length).toBeGreaterThan(0);
          expect(item.meaning).not.toMatch(leakRegex);

          expect(item.example, `${vocabDesc}: missing example`).toBeDefined();
          expect(item.example.length).toBeGreaterThan(0);

          // Advanced levels require dual-context (example2 & collocation)
          if (isAdvancedLevel) {
            expect(item.example2, `${vocabDesc}: missing example2 (dual context requirement for advanced levels)`).toBeDefined();
            expect(item.example2.length).toBeGreaterThan(0);

            expect(item.collocation, `${vocabDesc}: missing collocation (dual context requirement for advanced levels)`).toBeDefined();
            expect(item.collocation.length).toBeGreaterThan(0);
          } else {
            if (item.example2 !== undefined) {
              expect(item.example2.length).toBeGreaterThan(0);
            }
            if (item.collocation !== undefined) {
              expect(item.collocation.length).toBeGreaterThan(0);
            }
          }

          expect(item.audio, `${vocabDesc}: missing audio path`).toBeDefined();
          expect(item.audio).toMatch(/^\/audio\//);
        });

        // 3. Dialogues Validation
        expect(unit.dialogues).toBeDefined();
        expect(Array.isArray(unit.dialogues)).toBe(true);
        expect(unit.dialogues.length).toBeGreaterThanOrEqual(1);

        unit.dialogues.forEach((dialogue: any, index: number) => {
          const dialogueDesc = `Dialogue #${index + 1} (${dialogue.title || "unknown"})`;
          expect(dialogue.id, `${dialogueDesc}: missing id`).toBeDefined();
          expect(dialogue.title, `${dialogueDesc}: missing title`).toBeDefined();
          expect(dialogue.audio, `${dialogueDesc}: missing audio`).toBeDefined();
          expect(dialogue.audio).toMatch(/^\/audio\//);
          expect(dialogue.desc, `${dialogueDesc}: missing desc`).toBeDefined();
          expect(dialogue.lines, `${dialogueDesc}: missing lines`).toBeDefined();
          expect(Array.isArray(dialogue.lines)).toBe(true);
          expect(dialogue.lines.length).toBeGreaterThanOrEqual(2);

          dialogue.lines.forEach((line: any, lineIdx: number) => {
            const lineDesc = `${dialogueDesc} line #${lineIdx + 1}`;
            expect(line.id, `${lineDesc}: missing id`).toBeDefined();
            expect(line.speaker, `${lineDesc}: missing speaker`).toBeDefined();
            expect(line.text, `${lineDesc}: missing text`).toBeDefined();
            expect(line.translation, `${lineDesc}: missing translation`).toBeDefined();
            expect(line.translation).not.toMatch(leakRegex);
          });
        });

        // 4. Grammar PPP Stage Validation
        if (unit.grammar) {
          expect(unit.grammar.title).toBeDefined();
          expect(unit.grammar.title.length).toBeGreaterThan(0);
          expect(unit.grammar.rule).toBeDefined();
          expect(unit.grammar.rule.length).toBeGreaterThan(0);
          expect(unit.grammar.examples).toBeDefined();
          expect(Array.isArray(unit.grammar.examples)).toBe(true);
          expect(unit.grammar.examples.length).toBeGreaterThanOrEqual(1);

          unit.grammar.examples.forEach((ex: any, exIdx: number) => {
            expect(ex.en, `Grammar example #${exIdx + 1} missing English`).toBeDefined();
            expect(ex.vn, `Grammar example #${exIdx + 1} missing Vietnamese`).toBeDefined();
            expect(ex.vn).not.toMatch(leakRegex);
          });

          expect(unit.grammar.tip, `Grammar missing tip`).toBeDefined();
          expect(unit.grammar.vnNote, `Grammar missing vnNote (L1 contrast)`).toBeDefined();

          if (unit.grammar.ccq) {
            const ccq = unit.grammar.ccq;
            expect(ccq.question, "CCQ question missing").toBeDefined();
            expect(ccq.options, "CCQ options missing").toBeDefined();
            expect(Array.isArray(ccq.options)).toBe(true);
            expect(ccq.options.length).toBe(4);
            expect(ccq.answer, "CCQ answer missing").toBeDefined();
            expect(ccq.options).toContain(ccq.answer);
            expect(ccq.answer).not.toMatch(leakRegex);
            ccq.options.forEach((opt: string) => expect(opt).not.toMatch(leakRegex));
            if (ccq.explanation) {
              expect(ccq.explanation).not.toMatch(leakRegex);
            }
          }
        }

        // 5. Exercises Integrity & Matching pairs
        if (unit.matchingExercise) {
          expect(unit.matchingExercise.pairs).toBeDefined();
          expect(Array.isArray(unit.matchingExercise.pairs)).toBe(true);
          expect(unit.matchingExercise.pairs.length).toBeGreaterThanOrEqual(4);
          unit.matchingExercise.pairs.forEach((pair: any, pairIdx: number) => {
            expect(pair.left, `Matching pair #${pairIdx + 1} missing left`).toBeDefined();
            expect(pair.right, `Matching pair #${pairIdx + 1} missing right`).toBeDefined();
            expect(pair.right).not.toMatch(leakRegex);
          });
        }

        // Scramble Exercises checking
        if (unit.scrambleExercises) {
          expect(Array.isArray(unit.scrambleExercises)).toBe(true);
          expect(unit.scrambleExercises.length).toBeGreaterThanOrEqual(3);
          unit.scrambleExercises.forEach((scramble: any, idx: number) => {
            const desc = `Scramble #${idx + 1} (ID: ${scramble.id || "unknown"})`;
            expect(scramble.id, `${desc}: missing id`).toBeDefined();
            expect(scramble.prompt_vn, `${desc}: missing prompt_vn`).toBeDefined();
            expect(scramble.prompt_vn).not.toMatch(leakRegex);
            expect(scramble.words, `${desc}: missing words`).toBeDefined();
            expect(Array.isArray(scramble.words)).toBe(true);
            expect(scramble.answer, `${desc}: missing answer`).toBeDefined();

            // Word pool permutation validation: check that all words can form the answer exactly
            const cleanText = (t: string) => t.toLowerCase().trim().replace(/\s+/g, ' ');
            const answerNormalized = cleanText(scramble.answer);

            // Tokenize answer by space
            const answerTokens = answerNormalized.split(' ').sort();
            const poolTokens = scramble.words.map((w: string) => w.toLowerCase().trim()).sort();

            expect(poolTokens, `${desc}: Words pool does not match the answer words exactly. Answer: "${scramble.answer}"`).toEqual(answerTokens);
          });
        }

        // 6. Practice Quiz & Final Quiz validation
        const validateQuizList = (list: any[], name: string) => {
          if (!list) return;
          expect(Array.isArray(list)).toBe(true);
          list.forEach((q: any, idx: number) => {
            const desc = `${name} question #${idx + 1} (ID: ${q.id || "unknown"})`;
            expect(q.id, `${desc}: missing id`).toBeDefined();
            expect(q.question, `${desc}: missing question`).toBeDefined();
            expect(q.type, `${desc}: missing type`).toBeDefined();
            expect(["multiple-choice", "cloze", "translate"]).toContain(q.type);
            expect(q.answer, `${desc}: missing answer`).toBeDefined();
            expect(q.answer).not.toMatch(leakRegex);

            if (q.type === "multiple-choice") {
              expect(q.options, `${desc}: missing options for multiple-choice`).toBeDefined();
              expect(Array.isArray(q.options)).toBe(true);
              expect(q.options.length).toBe(4);
              expect(q.options).toContain(q.answer);
              q.options.forEach((opt: string) => expect(opt).not.toMatch(leakRegex));
            } else {
              // cloze or translate
              expect(q.options === undefined || q.options.length === 0, `${desc}: cloze/translate should not have options`).toBe(true);
            }
          });
        };

        validateQuizList(unit.practiceQuiz, "practiceQuiz");
        validateQuizList(unit.quiz, "quiz");

        // 7. Cumulative Review Questions validation
        if (unit.cumulativeReviewQuestions) {
          validateQuizList(unit.cumulativeReviewQuestions, "cumulativeReviewQuestions");
        }

        // 8. ID Uniqueness Check within respective lists (React key compliance)
        const checkUniqueness = (array: any[], desc: string) => {
          if (!array) return;
          const ids = array.map(item => String(item.id || item.question || ""));
          const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
          expect(duplicates, `Duplicate IDs found in list "${desc}": ${JSON.stringify(duplicates)}`).toEqual([]);
        };

        checkUniqueness(unit.vocab, "vocab");
        checkUniqueness(unit.dialogues, "dialogues");
        unit.dialogues.forEach((d: any, idx: number) => {
          checkUniqueness(d.lines, `dialogues[${idx}].lines`);
        });
        if (unit.scrambleExercises) checkUniqueness(unit.scrambleExercises, "scrambleExercises");
        if (unit.practiceQuiz) checkUniqueness(unit.practiceQuiz, "practiceQuiz");
        if (unit.quiz) checkUniqueness(unit.quiz, "quiz");
        if (unit.cumulativeReviewQuestions) checkUniqueness(unit.cumulativeReviewQuestions, "cumulativeReviewQuestions");

        // 9. Reading Passage Validation — all units must have a readingPassage
        expect(unit.readingPassage, `${file}: missing readingPassage (all 50 units must have one)`).toBeDefined();
        if (unit.readingPassage) {
          const rp = unit.readingPassage;
          expect(rp.id, "readingPassage missing id").toBeDefined();
          expect(rp.id).toMatch(/^u[A-Za-z0-9]+-?[A-Za-z0-9]+-reading-/);
          expect(rp.title, "readingPassage missing title").toBeDefined();
          expect(rp.title.length).toBeGreaterThan(0);
          expect(rp.title_vn, "readingPassage missing title_vn").toBeDefined();
          expect(rp.text, "readingPassage missing text").toBeDefined();
          expect(rp.text.length).toBeGreaterThan(30);
          expect(rp.level, "readingPassage missing level").toBeDefined();
          expect(["A0", "A1", "A2", "B1", "B2"]).toContain(rp.level);
          expect(rp.questions, "readingPassage missing questions").toBeDefined();
          expect(Array.isArray(rp.questions)).toBe(true);
          expect(rp.questions.length, "readingPassage must have at least 4 questions").toBeGreaterThanOrEqual(4);

          rp.questions.forEach((q: any, qIdx: number) => {
            const qDesc = `readingPassage question #${qIdx + 1}`;
            expect(q.id, `${qDesc}: missing id`).toBeDefined();
            expect(q.question_vn, `${qDesc}: missing question_vn`).toBeDefined();
            expect(q.question_vn.length).toBeGreaterThan(0);
            expect(q.options, `${qDesc}: missing options`).toBeDefined();
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBe(4);
            expect(q.answer, `${qDesc}: missing answer`).toBeDefined();
            expect(q.options).toContain(q.answer);
            expect(q.explanation_vn, `${qDesc}: missing explanation_vn`).toBeDefined();
          });
        }
      });
    });
  }
});

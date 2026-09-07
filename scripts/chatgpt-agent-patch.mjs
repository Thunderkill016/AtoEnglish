import fs from "node:fs";
import path from "node:path";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.writeFileSync(file, text);
}

function patchFile(file, edits) {
  let text = read(file);
  for (const [label, before, after] of edits) {
    const first = text.indexOf(before);
    if (first === -1) throw new Error(`${file}: missing expected block: ${label}`);
    if (text.indexOf(before, first + before.length) !== -1) {
      throw new Error(`${file}: expected unique block but found duplicate: ${label}`);
    }
    text = text.replace(before, after);
  }
  write(file, text);
}

function patchBetween(file, label, start, end, replacement = "") {
  const text = read(file);
  const startIndex = text.indexOf(start);
  if (startIndex === -1) throw new Error(`${file}: missing start marker: ${label}`);
  const endIndex = text.indexOf(end, startIndex + start.length);
  if (endIndex === -1) throw new Error(`${file}: missing end marker: ${label}`);
  if (text.indexOf(start, startIndex + start.length) !== -1) {
    throw new Error(`${file}: duplicate start marker: ${label}`);
  }
  write(file, text.slice(0, startIndex) + replacement + text.slice(endIndex));
}

function assertAbsent(file, terms) {
  const text = read(file);
  for (const term of terms) {
    if (text.includes(term)) throw new Error(`${file}: retired term still present: ${term}`);
  }
}

function assertAbsentInTree(root, terms) {
  const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!extensions.has(path.extname(entry.name))) continue;
      const text = read(full);
      for (const term of terms) {
        if (text.includes(term)) throw new Error(`${full}: retired dependency reference still present: ${term}`);
      }
    }
  };
  walk(root);
}

const practice = "src/components/learn/sections/PracticeSection.tsx";
patchFile(practice, [
  [
    "live XP prop declaration",
    "  goNext: () => void;\n  addSessionXp?: (amount?: number) => void; // S2-3: live XP counter\n",
    "  goNext: () => void;\n",
  ],
  [
    "live XP prop destructuring",
    "  playWrongSound,\n  goNext,\n  addSessionXp,\n}: PracticeSectionProps) {",
    "  playWrongSound,\n  goNext,\n}: PracticeSectionProps) {",
  ],
  [
    "matching XP award",
    "        playCorrectSound();\n        addSessionXp?.(3); // S2-3: +3 XP per matched pair\n        recordAttempt(unit.unitId, \"matching\", true); // S3-3\n",
    "        playCorrectSound();\n        recordAttempt(unit.unitId, \"matching\", true); // S3-3\n",
  ],
  [
    "scramble XP award",
    "                        playCorrectSound();\n                        addSessionXp?.(5); // S2-3: +5 XP for correct scramble\n                        recordAttempt(unit.unitId, \"scramble\", true); // S3-3\n",
    "                        playCorrectSound();\n                        recordAttempt(unit.unitId, \"scramble\", true); // S3-3\n",
  ],
  [
    "sentence correction XP award",
    "                if (correct) { playCorrectSound(); addSessionXp?.(5); }\n                else playWrongSound();\n                recordAttempt(unit.unitId, \"correction\", correct); // S3-3\n",
    "                if (correct) playCorrectSound();\n                else playWrongSound();\n                recordAttempt(unit.unitId, \"correction\", correct); // S3-3\n",
  ],
  [
    "listen arrange XP award",
    "              setArrangeScore(s => s + 1);\n              addSessionXp?.(8); // S2-3: +8 XP per audio arrangement\n              recordAttempt(unit.unitId, \"listen-arrange\", true);\n",
    "              setArrangeScore(s => s + 1);\n              recordAttempt(unit.unitId, \"listen-arrange\", true);\n",
  ],
  [
    "word bank XP award",
    "              if (correct) { playCorrectSound(); addSessionXp?.(5); } // S2-3\n              else playWrongSound();\n              recordAttempt(unit.unitId, \"wordbank\", correct); // S3-3\n",
    "              if (correct) playCorrectSound();\n              else playWrongSound();\n              recordAttempt(unit.unitId, \"wordbank\", correct); // S3-3\n",
  ],
  [
    "dictation XP award",
    "              if (correct) { playCorrectSound(); addSessionXp?.(5); } // S2-3\n              else playWrongSound();\n              recordAttempt(unit.unitId, \"dictation\", correct); // S3-3\n",
    "              if (correct) playCorrectSound();\n              else playWrongSound();\n              recordAttempt(unit.unitId, \"dictation\", correct); // S3-3\n",
  ],
  [
    "practice pass XP award",
    "            if (practiceScore >= Math.ceil(PRACTICE_QS.length * 0.7)) {\n              playCorrectSound();\n              addSessionXp?.(10); // S2-3: +10 XP for passing quiz\n            } else playWrongSound();\n",
    "            if (practiceScore >= Math.ceil(PRACTICE_QS.length * 0.7)) {\n              playCorrectSound();\n            } else playWrongSound();\n",
  ],
]);
assertAbsent(practice, ["addSessionXp"]);

const quiz = "src/components/learn/sections/QuizSection.tsx";
patchFile(quiz, [
  [
    "XP completion prop declaration",
    "  effectiveScore: number;\n  effectiveStarCount: number;\n  xpToEarn: number;\n  nextRoute: string;\n",
    "  effectiveScore: number;\n  effectiveStarCount: number;\n  nextRoute: string;\n",
  ],
  [
    "XP completion prop destructuring",
    "  effectiveScore,\n  effectiveStarCount,\n  xpToEarn,\n  nextRoute,\n}: QuizSectionProps) {",
    "  effectiveScore,\n  effectiveStarCount,\n  nextRoute,\n}: QuizSectionProps) {",
  ],
  [
    "XP completion subtitle",
    "        subtitle=\"Hoàn thành để nhận XP\"\n",
    "        subtitle=\"Hoàn thành bài và xem kết quả học tập\"\n",
  ],
  [
    "XP completion button label",
    "                : `🎉 Hoàn thành bài học (+${xpToEarn} XP)`}\n",
    "                : \"Hoàn thành bài học\"}\n",
  ],
]);
patchBetween(quiz, "share achievement handler", "  const handleShare = async () => {", "\n\n  return (");
patchBetween(
  quiz,
  "share achievement button",
  "                <button\n                  onClick={handleShare}",
  "                <Link\n                  href=\"/quiz\"",
);
assertAbsent(quiz, ["xpToEarn", "handleShare", "Chia sẻ thành tích", "Hoàn thành để nhận XP"]);

const unitTemplate = "src/components/learn/UnitTemplate.tsx";
patchFile(unitTemplate, [
  [
    "retired icon imports",
    "import { ChevronLeft, Star, BookOpen, Zap, Flame, ChevronRight } from \"lucide-react\";\n",
    "import { ChevronLeft, Star, BookOpen, ChevronRight } from \"lucide-react\";\n",
  ],
  ["confetti import", "import confetti from \"canvas-confetti\";\n", ""],
  [
    "streak milestone imports",
    "import { useStreakMilestone } from \"@/features/streak/hooks/useStreakMilestone\";\nimport StreakMilestoneOverlay from \"@/features/streak/components/StreakMilestoneOverlay\";\n",
    "",
  ],
  [
    "completion data gamification fields",
    "interface CompletionData {\n  xpEarned: number;\n  starCount: 1 | 2 | 3;\n  effectiveScore: number;\n  newStreak: number;\n  vocabPreview: Array<{ word: string; meaning: string }>;\n  nextRoute: string;\n}\n",
    "interface CompletionData {\n  starCount: 1 | 2 | 3;\n  effectiveScore: number;\n  vocabPreview: Array<{ word: string; meaning: string }>;\n  nextRoute: string;\n}\n",
  ],
  [
    "streak milestone checker",
    "  // Streak milestone checker (Phase B — research doc)\n  const streakMilestoneCheck = useStreakMilestone();\n\n",
    "",
  ],
  [
    "live XP state and popup handler",
    "  // S2-3: Live in-lesson XP counter (Duolingo real-time reinforcement)\n  const [sessionXp, setSessionXp] = useState(0);\n  const [xpPopup, setXpPopup] = useState<{ id: number; value: number } | null>(null);\n  const addSessionXp = (amount = 5) => {\n    setSessionXp(p => p + amount);\n    const id = Date.now();\n    setXpPopup({ id, value: amount });\n    setTimeout(() => setXpPopup(p => p?.id === id ? null : p), 1200);\n  };\n\n",
    "",
  ],
  ["completion confetti", "    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });\n", ""],
  [
    "XP completion toast",
    "      toast.success(`🎉 Chúc mừng! Bạn nhận được ${res.xpEarned ?? xpToEarn} XP!`);\n",
    "      toast.success(\"Đã hoàn thành bài học.\");\n",
  ],
  [
    "completion overlay data",
    "      setCompletionData({\n        xpEarned: res.xpEarned ?? xpToEarn,\n        starCount: effectiveStarCount,\n        effectiveScore,\n        newStreak: res.newStreak ?? 0,\n        vocabPreview: normalizedUnit.vocab.slice(0, 5).map(v => ({ word: v.word, meaning: v.meaning })),\n        nextRoute,\n      });",
    "      setCompletionData({\n        starCount: effectiveStarCount,\n        effectiveScore,\n        vocabPreview: normalizedUnit.vocab.slice(0, 5).map(v => ({ word: v.word, meaning: v.meaning })),\n        nextRoute,\n      });",
  ],
  [
    "guest completion overlay data",
    "      setCompletionData({ xpEarned: xpToEarn, starCount: effectiveStarCount, effectiveScore, newStreak: 0, vocabPreview: normalizedUnit.vocab.slice(0,5).map(v=>({word:v.word,meaning:v.meaning})), nextRoute });\n",
    "      setCompletionData({ starCount: effectiveStarCount, effectiveScore, vocabPreview: normalizedUnit.vocab.slice(0,5).map(v=>({word:v.word,meaning:v.meaning})), nextRoute });\n",
  ],
  [
    "live XP header widget",
    "              {/* S2-3: Live session XP counter */}\n              {sessionXp > 0 && (\n                <div className=\"relative flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400\">\n                  ⚡ {sessionXp} XP\n                  {xpPopup && (\n                    <span\n                      key={xpPopup.id}\n                      className=\"absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-300 animate-bounce pointer-events-none\"\n                    >\n                      +{xpPopup.value}\n                    </span>\n                  )}\n                </div>\n              )}\n",
    "",
  ],
  [
    "PracticeSection live XP wiring",
    "              playWrongSound={playWrongSound}\n              goNext={goNext}\n              addSessionXp={addSessionXp}\n            />",
    "              playWrongSound={playWrongSound}\n              goNext={goNext}\n            />",
  ],
  [
    "QuizSection XP display prop",
    "              effectiveScore={effectiveScore}\n              effectiveStarCount={effectiveStarCount}\n              xpToEarn={xpToEarn}\n              nextRoute={nextRoute}\n",
    "              effectiveScore={effectiveScore}\n              effectiveStarCount={effectiveStarCount}\n              nextRoute={nextRoute}\n",
  ],
]);
patchBetween(
  unitTemplate,
  "animated XP counter",
  "// ── Animated XP counter (counts 0 → target in 1.2 s) ──────────────────────",
  "// ── Video Shadowing Card (lite-embed: thumbnail click → iframe) ──────────────",
);
patchBetween(unitTemplate, "XP calculation", "  const xpToEarn =\n", "\n\n  const handleCompleteUnit = async () => {");
patchBetween(
  unitTemplate,
  "achievement and streak milestone side effects",
  "      // ── Achievement milestone toasts (staggered, zero extra DB queries) ──",
  "      if (res.leveledUp && res.newLevel) {",
);
patchBetween(
  unitTemplate,
  "local XP synchronization",
  "      const earnedXp = res.xpEarned ?? xpToEarn;",
  "    } else if (res.error && res.error.includes(\"đăng nhập\")) {",
);
patchBetween(
  unitTemplate,
  "XP and streak completion cards",
  "                {/* XP + Streak stats row */}",
  "                {/* Vocab recap */}",
);
patchBetween(
  unitTemplate,
  "streak milestone overlay",
  "      {/* Streak Milestone Overlay — fires after lesson completes on milestone days */}",
  "    </div>\n  );\n}",
);
assertAbsent(unitTemplate, [
  "canvas-confetti",
  "useStreakMilestone",
  "StreakMilestoneOverlay",
  "streakMilestoneCheck",
  "sessionXp",
  "xpPopup",
  "addSessionXp",
  "xpToEarn",
  "XpCounter",
  "XP kiếm được",
  "ato:xp-earned",
  "ato_xp_sync_",
]);

const unitTest = "src/components/learn/UnitTemplate.test.tsx";
patchFile(unitTest, [
  [
    "streak mock state",
    "const streakMocks = vi.hoisted(() => ({\n  checkMilestone: vi.fn(),\n  dismissMilestone: vi.fn(),\n}));\n\n",
    "",
  ],
  ["confetti mock", "vi.mock(\"canvas-confetti\", () => ({ default: vi.fn() }));\n\n", ""],
  [
    "streak module mocks",
    "vi.mock(\"@/features/streak/hooks/useStreakMilestone\", () => ({\n  useStreakMilestone: () => ({\n    showOverlay: false,\n    pendingMilestone: null,\n    checkMilestone: streakMocks.checkMilestone,\n    dismissMilestone: streakMocks.dismissMilestone,\n  }),\n}));\n\nvi.mock(\"@/features/streak/components/StreakMilestoneOverlay\", () => ({\n  default: () => null,\n}));\n\n",
    "",
  ],
  ["test mock XP prop", "  effectiveStarCount?: number;\n  xpToEarn?: number;\n", "  effectiveStarCount?: number;\n"],
  [
    "quiz mock XP destructuring",
    "      effectiveScore,\n      effectiveStarCount,\n      xpToEarn,\n    }: SectionMockProps) =>",
    "      effectiveScore,\n      effectiveStarCount,\n    }: SectionMockProps) =>",
  ],
  ["quiz mock XP data attribute", "          \"data-star-count\": effectiveStarCount,\n          \"data-xp-to-earn\": xpToEarn,\n", "          \"data-star-count\": effectiveStarCount,\n"],
  ["three-star XP fixture", "    stars: \"3\",\n    xp: \"100\",\n", "    stars: \"3\",\n"],
  ["two-star XP fixture", "    stars: \"2\",\n    xp: \"85\",\n", "    stars: \"2\",\n"],
  ["one-star XP fixture", "    stars: \"1\",\n    xp: \"70\",\n", "    stars: \"1\",\n"],
  [
    "star contract test args",
    "]) (\"derives $name and preserves the completeUnit action contract\", async ({ unit, score, stars, xp }) => {",
    "]) (\"derives $name and preserves the completeUnit action contract\", async ({ unit, score, stars }) => {",
  ],
  ["XP expectation", "  expect(quiz).toHaveAttribute(\"data-xp-to-earn\", xp);\n\n", "\n"],
]);
patchFile(unitTest, [
  [
    "authenticated completion test setup",
    "it(\"coordinates authenticated completion data, streak checks, XP sync, vocab seeding, and nextRoute\", async () => {\n  const xpEvent = vi.fn();\n  window.addEventListener(\"ato:xp-earned\", xpEvent as EventListener);\n  actionMocks.completeUnit.mockResolvedValue({\n    success: true,\n    xpEarned: 123,\n    newStreak: 7,\n    completedCount: 5,\n    newTotalXp: 500,\n    leveledUp: true,\n    newLevel: \"A2\",\n  });",
    "it(\"coordinates authenticated completion data, vocab seeding, and nextRoute\", async () => {\n  actionMocks.completeUnit.mockResolvedValue({\n    success: true,\n    leveledUp: true,\n    newLevel: \"A2\",\n  });",
  ],
  ["streak completion assertion", "  expect(streakMocks.checkMilestone).toHaveBeenCalledWith(7);\n", ""],
  ["XP sync assertion", "  expect(localStorage.getItem(`ato_xp_sync_${new Date().toDateString()}`)).toBe(\"123\");\n  expect(xpEvent).toHaveBeenCalled();\n", ""],
  ["XP event listener cleanup", "  window.removeEventListener(\"ato:xp-earned\", xpEvent as EventListener);\n", ""],
  ["failed completion streak assertion", "  expect(streakMocks.checkMilestone).not.toHaveBeenCalled();\n", ""],
]);
assertAbsent(unitTest, [
  "streakMocks",
  "canvas-confetti",
  "useStreakMilestone",
  "StreakMilestoneOverlay",
  "xpToEarn",
  "data-xp-to-earn",
  "ato:xp-earned",
  "ato_xp_sync_",
]);

for (const retired of [
  "src/features/streak/hooks/useStreakMilestone.ts",
  "src/features/streak/components/StreakMilestoneOverlay.tsx",
]) {
  if (!fs.existsSync(retired)) throw new Error(`Missing expected retired file: ${retired}`);
  fs.rmSync(retired);
}

if (fs.existsSync("src/features/streak")) {
  const remaining = [];
  const collect = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(full);
      else remaining.push(full);
    }
  };
  collect("src/features/streak");
  if (remaining.length > 0) throw new Error(`Unexpected streak files remain: ${remaining.join(", ")}`);
}

assertAbsentInTree("src", ["canvas-confetti", "web-push"]);

console.log("Applied verified lesson gamification runtime cleanup patch.");

import fs from "node:fs";

function patchFile(path, edits) {
  let text = fs.readFileSync(path, "utf8");
  for (const [label, before, after] of edits) {
    const first = text.indexOf(before);
    if (first === -1) throw new Error(`${path}: missing expected block: ${label}`);
    if (text.indexOf(before, first + before.length) !== -1) {
      throw new Error(`${path}: expected unique block but found duplicate: ${label}`);
    }
    text = text.replace(before, after);
  }
  fs.writeFileSync(path, text);
}

patchFile("src/components/learn/sections/PracticeSection.tsx", [
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
]);

patchFile("src/components/learn/sections/QuizSection.tsx", [
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
]);

patchFile("src/components/learn/UnitTemplate.tsx", [
  [
    "live XP state and popup handler",
    "  // S2-3: Live in-lesson XP counter (Duolingo real-time reinforcement)\n  const [sessionXp, setSessionXp] = useState(0);\n  const [xpPopup, setXpPopup] = useState<{ id: number; value: number } | null>(null);\n  const addSessionXp = (amount = 5) => {\n    setSessionXp(p => p + amount);\n    const id = Date.now();\n    setXpPopup({ id, value: amount });\n    setTimeout(() => setXpPopup(p => p?.id === id ? null : p), 1200);\n  };\n\n",
    "",
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

console.log("Applied lesson live-XP cleanup patch successfully.");

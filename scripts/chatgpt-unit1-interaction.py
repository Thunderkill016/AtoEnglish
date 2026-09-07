from pathlib import Path


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if old not in source:
        raise RuntimeError(f"Missing marker: {label}")
    return source.replace(old, new, 1)

speaking_path = Path("src/components/learn/sections/SpeakingSection.tsx")
speaking = speaking_path.read_text()

speaking = replace_once(speaking, '''interface SpeakingSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  playTTS: (text: string) => void;
  goNext: () => void;
}
''', '''interface SpeakingSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  playTTS: (text: string) => void;
  goNext: () => void;
}

const UNIT1_INTERACTION_TURNS = [
  {
    alex: "Hi! I'm Alex. What's your name?",
    promptVi: "Chào Alex và nói tên của bạn.",
    fallback: "Hi! My name is Minh.",
  },
  {
    alex: "Nice to meet you. Where are you from?",
    promptVi: "Trả lời bạn đến từ đâu.",
    fallback: "I'm from Vietnam.",
  },
  {
    alex: "I'm from Canada. Now ask me how I am.",
    promptVi: "Hỏi thăm Alex bằng một câu đơn giản.",
    fallback: "How are you?",
  },
  {
    alex: "I'm good, thank you! It was nice meeting you.",
    promptVi: "Kết thúc cuộc gặp một cách lịch sự.",
    fallback: "Nice meeting you too. Goodbye.",
  },
] as const;
''', "interaction turns")

speaking = replace_once(speaking, '''  const [level2Done, setLevel2Done] = useState(false);
  const [showHint, setShowHint] = useState(false);
''', '''  const [level2Done, setLevel2Done] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [unit1InteractionIndex, setUnit1InteractionIndex] = useState(0);
  const [unit1LearnerTurns, setUnit1LearnerTurns] = useState<string[]>([]);
''', "interaction state")

speaking = replace_once(speaking, '''  const handleLevel2Record = () => {
''', '''  const handleUnit1InteractionRecord = () => {
    const restarting = level2TaskEvaluation !== null;
    const currentIndex = restarting ? 0 : unit1InteractionIndex;

    if (restarting) {
      setUnit1LearnerTurns([]);
      setUnit1InteractionIndex(0);
      setLevel2Transcript("");
      setLevel2TaskEvaluation(null);
      setLevel2Done(false);
    }

    const turn = UNIT1_INTERACTION_TURNS[currentIndex];
    setLevel2Recording(true);

    startRecognition(turn.fallback, (text) => {
      const nextTurns = restarting ? [] : [...unit1LearnerTurns];
      nextTurns[currentIndex] = text;
      setUnit1LearnerTurns(nextTurns);
      setLevel2Recording(false);

      const combinedTranscript = nextTurns.filter(Boolean).join(" ");
      setLevel2Transcript(combinedTranscript);

      if (currentIndex < UNIT1_INTERACTION_TURNS.length - 1) {
        setUnit1InteractionIndex(currentIndex + 1);
        return;
      }

      const taskEvaluation = evaluateSpeakingTask(unit.unitId, combinedTranscript);
      if (!taskEvaluation) return;

      setLevel2TaskEvaluation(taskEvaluation);
      setLevel2Done(taskEvaluation.accomplished);
      if (taskEvaluation.accomplished) {
        toast.success(`Hoàn thành hội thoại: ${taskEvaluation.metCount}/${taskEvaluation.total} tiêu chí`);
      } else {
        toast.info(
          `Đã làm được ${taskEvaluation.metCount}/${taskEvaluation.total} tiêu chí — thử lại cuộc hội thoại.`
        );
      }
    });
  };

  const handleLevel2Record = () => {
    if (unit.unitId === "unit-1") {
      handleUnit1InteractionRecord();
      return;
    }
''', "unit1 handler")

speaking = replace_once(speaking, '''        {level2Transcript && (
          <div className="bg-muted/30 rounded-xl p-3 mb-3">
''', '''        {unit.unitId === "unit-1" && (
          <div className="space-y-3 mb-4" aria-label="Hội thoại với Alex">
            {UNIT1_INTERACTION_TURNS.map((turn, index) => {
              const learnerText = unit1LearnerTurns[index];
              const isCurrent = index === unit1InteractionIndex && !level2TaskEvaluation;
              if (index > unit1InteractionIndex && !learnerText && !level2TaskEvaluation) return null;

              return (
                <div key={turn.alex} className="space-y-2">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-muted/60 border border-border/60 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-teal-400 mb-1">Alex</p>
                    <p className="text-sm text-foreground">{turn.alex}</p>
                  </div>
                  {learnerText ? (
                    <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-primary/10 border border-primary/20 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">Bạn</p>
                      <p className="text-sm text-foreground">{learnerText}</p>
                    </div>
                  ) : isCurrent ? (
                    <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
                      <p className="text-xs text-muted-foreground">{turn.promptVi}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {level2TaskEvaluation && (
              <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-foreground">Kết quả nhiệm vụ giao tiếp</p>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${level2TaskEvaluation.accomplished ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                    {level2TaskEvaluation.metCount}/{level2TaskEvaluation.total}
                  </span>
                </div>
                {level2TaskEvaluation.criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/30 px-3 py-2">
                    {criterion.met ? <CheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-400" /> : <XCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />}
                    <span className="text-xs text-muted-foreground">{criterion.labelVi}</span>
                  </div>
                ))}
                <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                  Đây là phản hồi luyện tập theo nhiệm vụ giao tiếp, không phải chứng nhận bạn đã đạt CEFR A1.
                </p>
              </div>
            )}
          </div>
        )}

        {unit.unitId !== "unit-1" && level2Transcript && (
          <div className="bg-muted/30 rounded-xl p-3 mb-3">
''', "turn UI")

speaking = replace_once(speaking, '''            {level2Recording ? "Dừng" : level2Transcript ? "Thử lại" : "Bắt đầu nói"}
''', '''            {level2Recording
              ? "Dừng"
              : unit.unitId === "unit-1"
                ? level2TaskEvaluation
                  ? "Thử lại từ đầu"
                  : `Trả lời Alex (${unit1InteractionIndex + 1}/${UNIT1_INTERACTION_TURNS.length})`
                : level2Transcript
                  ? "Thử lại"
                  : "Bắt đầu nói"}
''', "button label")

speaking = replace_once(speaking, '''      {level1Done && (level2Done || level2Transcript !== "") && (
        <LessonContinueButton onClick={goNext}>Xem kết quả</LessonContinueButton>
      )}
      {level1Done && !level2Done && level2Transcript === "" && (
''', '''      {level1Done && (level2Done || (unit.unitId !== "unit-1" && level2Transcript !== "")) && (
        <LessonContinueButton onClick={goNext}>Xem kết quả</LessonContinueButton>
      )}
      {level1Done && !level2Done && (unit.unitId === "unit-1" || level2Transcript === "") && (
''', "continue gate")

speaking_path.write_text(speaking)

unit_path = Path("src/lib/data/units/unit1.ts")
unit = unit_path.read_text()
unit = replace_once(unit, '''    level2Situation:
      "Bạn vừa gặp đồng nghiệp mới tên Alex tại văn phòng. Hãy tự giới thiệu và hỏi thăm Alex.",
    level2Hint: "Hello! My name is [tên bạn]. Nice to meet you! Where are you from?",
''', '''    level2Situation:
      "Bạn vừa gặp đồng nghiệp mới tên Alex tại văn phòng. Hãy thực hiện một cuộc hội thoại ngắn: chào hỏi, tự giới thiệu, trả lời thông tin cá nhân, hỏi thăm Alex và kết thúc lịch sự.",
    level2Hint:
      "Bạn sẽ nói theo từng lượt với Alex. Không cần đọc thuộc một đoạn dài; hãy nghe câu của Alex rồi trả lời đúng mục đích giao tiếp của lượt đó.",
''', "unit1 speaking copy")
unit_path.write_text(unit)

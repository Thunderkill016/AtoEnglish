"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

import type { LessonSpecV1 } from "@/lib/lessons/lesson-spec";
import {
  diagnoseTutorResponse,
  evaluateTutorFullTask,
  evaluateTutorIntent,
  scaffoldForAttempt,
  tutorMasteryPassed,
  type TutorDiagnosis,
} from "@/lib/missions/autonomous-tutor";
import type {
  MissionEvaluationResult,
} from "@/lib/missions/mission-evaluator";
import type {
  MissionIntent,
  MissionSpecV1,
} from "@/lib/missions/mission-spec";

type MissionLesson = LessonSpecV1 & { mission: MissionSpecV1 };

type TutorPhase =
  | "diagnose"
  | "plan"
  | "teach"
  | "retrieve"
  | "apply"
  | "repair"
  | "cold"
  | "complete";

interface AutonomousMissionTutorProps {
  lesson: MissionLesson;
  nextRoute: string;
}

const PHASES: Array<{ id: TutorPhase; label: string }> = [
  { id: "diagnose", label: "Chẩn đoán" },
  { id: "teach", label: "Học đúng chỗ thiếu" },
  { id: "retrieve", label: "Tự nhớ" },
  { id: "apply", label: "Áp dụng" },
  { id: "cold", label: "Tình huống mới" },
];

function requiredIntents(mission: MissionSpecV1) {
  return mission.intents.filter((intent) => intent.required);
}

function intentById(mission: MissionSpecV1, intentId: string) {
  return mission.intents.find((intent) => intent.id === intentId) ?? null;
}

function promptForIntent(mission: MissionSpecV1, intent: MissionIntent) {
  const turn = mission.roleplayTurns.find((candidate) =>
    candidate.expectedIntentIds.includes(intent.id),
  );

  return {
    partnerLine: turn?.partnerLine ?? "Hãy phản hồi trong tình huống này.",
    partnerLineVi: turn?.partnerLineVi ?? intent.descriptionVi,
    hintVi: turn?.hintVi ?? intent.descriptionVi,
  };
}

function scoreLabel(evaluation: MissionEvaluationResult | null) {
  if (!evaluation || evaluation.taskScore === null) return "Chưa có dữ liệu";
  return `${evaluation.taskScore}% mục tiêu`;
}

function buildRescueFrame(mission: MissionSpecV1) {
  return requiredIntents(mission)
    .map((intent) => intent.examples[0])
    .filter(Boolean)
    .join(" ");
}

export default function AutonomousMissionTutor({
  lesson,
  nextRoute,
}: AutonomousMissionTutorProps) {
  const router = useRouter();
  const mission = lesson.mission;
  const [phase, setPhase] = useState<TutorPhase>("diagnose");
  const [error, setError] = useState<string | null>(null);

  const [baselineText, setBaselineText] = useState("");
  const [diagnosis, setDiagnosis] = useState<TutorDiagnosis | null>(null);
  const [focusIntentIds, setFocusIntentIds] = useState<string[]>([]);

  const [retrieveIndex, setRetrieveIndex] = useState(0);
  const [retrieveText, setRetrieveText] = useState("");
  const [retrieveAttempts, setRetrieveAttempts] = useState<Record<string, number>>(
    {},
  );
  const [retrievePassed, setRetrievePassed] = useState<string[]>([]);

  const [applyText, setApplyText] = useState("");
  const [applyEvaluation, setApplyEvaluation] =
    useState<MissionEvaluationResult | null>(null);
  const [repairText, setRepairText] = useState("");
  const [repairAttempts, setRepairAttempts] = useState(0);

  const [coldText, setColdText] = useState("");
  const [coldEvaluation, setColdEvaluation] =
    useState<MissionEvaluationResult | null>(null);

  const required = useMemo(() => requiredIntents(mission), [mission]);
  const activeFocusIntents = focusIntentIds
    .map((intentId) => intentById(mission, intentId))
    .filter((intent): intent is MissionIntent => Boolean(intent));
  const currentRetrieveIntent = activeFocusIntents[retrieveIndex] ?? null;
  const currentRetrieveAttempt = currentRetrieveIntent
    ? retrieveAttempts[currentRetrieveIntent.id] ?? 0
    : 0;
  const currentScaffold = currentRetrieveIntent
    ? scaffoldForAttempt(
        currentRetrieveIntent.examples[0] ?? "",
        currentRetrieveAttempt,
      )
    : null;
  const coldVariant = mission.transferVariants[0] ?? null;
  const rescueFrame = buildRescueFrame(mission);
  const supportCount =
    Object.values(retrieveAttempts).reduce((sum, value) => sum + value, 0) +
    repairAttempts;
  const currentPhaseIndex = Math.max(
    0,
    PHASES.findIndex((candidate) => candidate.id === phase),
  );

  const submitBaseline = () => {
    const answer = baselineText.trim();
    if (!answer) {
      setError("Hãy thử tự làm trước. Câu chưa hoàn chỉnh cũng được.");
      return;
    }

    const nextDiagnosis = diagnoseTutorResponse(mission, answer);
    setDiagnosis(nextDiagnosis);
    setFocusIntentIds(nextDiagnosis.focusIntentIds);
    setError(null);
    setPhase("plan");
  };

  const startAdaptiveLesson = () => {
    setError(null);
    if (focusIntentIds.length === 0) {
      setPhase("cold");
      return;
    }
    setPhase("teach");
  };

  const startRetrieval = () => {
    setRetrieveIndex(0);
    setRetrieveText("");
    setRetrievePassed([]);
    setError(null);
    setPhase("retrieve");
  };

  const submitRetrieval = () => {
    if (!currentRetrieveIntent) {
      setPhase("apply");
      return;
    }

    const answer = retrieveText.trim();
    if (!answer) {
      setError("Hãy tự viết câu trước khi xem thêm hỗ trợ.");
      return;
    }

    const result = evaluateTutorIntent(currentRetrieveIntent, answer);
    if (!result.passed) {
      setRetrieveAttempts((current) => ({
        ...current,
        [currentRetrieveIntent.id]:
          (current[currentRetrieveIntent.id] ?? 0) + 1,
      }));
      setError(result.explanationVi);
      return;
    }

    setRetrievePassed((current) => [
      ...new Set([...current, currentRetrieveIntent.id]),
    ]);
    setRetrieveText("");
    setError(null);

    if (retrieveIndex + 1 >= activeFocusIntents.length) {
      setPhase("apply");
      return;
    }

    setRetrieveIndex((current) => current + 1);
  };

  const submitApplication = () => {
    const answer = applyText.trim();
    if (!answer) {
      setError("Hãy hoàn thành toàn bộ nhiệm vụ bằng một lượt trả lời.");
      return;
    }

    const evaluation = evaluateTutorFullTask(mission, answer);
    setApplyEvaluation(evaluation);
    setError(null);

    if (tutorMasteryPassed(evaluation)) {
      setPhase("cold");
      return;
    }

    setRepairText(answer);
    setPhase("repair");
  };

  const submitRepair = () => {
    const answer = repairText.trim();
    if (!answer) {
      setError("Hãy tự viết lại toàn bộ câu trả lời sau khi xem góp ý.");
      return;
    }

    const evaluation = evaluateTutorFullTask(mission, answer);
    setApplyEvaluation(evaluation);
    setRepairAttempts((current) => current + 1);
    setError(null);

    if (tutorMasteryPassed(evaluation)) {
      setApplyText(answer);
      setPhase("cold");
      return;
    }
  };

  const submitColdTask = () => {
    const answer = coldText.trim();
    if (!answer) {
      setError("Hãy thử xử lý tình huống mới mà không xem lại bài cũ.");
      return;
    }

    const evaluation = evaluateTutorFullTask(mission, answer);
    setColdEvaluation(evaluation);
    setError(null);
    setPhase("complete");
  };

  const relearnColdTask = () => {
    const missingIds = coldEvaluation?.missingIntentIds ?? [];
    const nextFocusIds = missingIds.length > 0
      ? missingIds
      : required.map((intent) => intent.id);

    setFocusIntentIds(nextFocusIds);
    setRetrieveIndex(0);
    setRetrieveText("");
    setRetrievePassed([]);
    setColdText("");
    setColdEvaluation(null);
    setError(null);
    setPhase("teach");
  };

  const renderProgress = () => (
    <div className="border-b border-border/60 bg-background/95 px-4 py-3">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3 text-xs font-bold">
          <span className="text-primary">Gia sư tự học · A0-1</span>
          <span className="text-muted-foreground">
            {Math.min(currentPhaseIndex + 1, PHASES.length)}/{PHASES.length}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1">
          {PHASES.map((item, index) => (
            <div
              key={item.id}
              title={item.label}
              className={`h-1.5 rounded-full ${
                index <= currentPhaseIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderError = () =>
    error ? (
      <p className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
        {error}
      </p>
    ) : null;

  if (phase === "diagnose") {
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section className="rounded-3xl border border-primary/25 bg-primary/5 p-6">
            <div className="flex items-center gap-3 text-primary">
              <ClipboardCheck className="size-6" aria-hidden />
              <p className="text-xs font-black uppercase tracking-widest">
                Bước 1 · Baseline không gợi ý
              </p>
            </div>
            <h1 className="mt-4 text-3xl font-black">{mission.titleVi}</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Hệ thống cần biết chính xác bạn đã làm được gì. Không có điểm phạt,
              không cần viết hoàn hảo và chưa hiển thị câu mẫu.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Tình huống
            </p>
            <p className="mt-2 font-semibold">{mission.scenarioVi}</p>
            <div className="mt-5 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
              {mission.roleplayTurns.map((turn) => (
                <div key={turn.id}>
                  <strong>{mission.partnerName}:</strong> {turn.partnerLine}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Viết một lượt trả lời hoàn chỉnh: giới thiệu bản thân, nói công việc,
              hỏi lại người đối diện và xử lý khi chưa nghe rõ.
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
            <textarea
              value={baselineText}
              onChange={(event) => {
                setBaselineText(event.target.value);
                setError(null);
              }}
              rows={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="Tự viết bằng những gì bạn đang biết..."
            />
            {renderError()}
            <button
              type="button"
              onClick={submitBaseline}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
            >
              Chẩn đoán phần tôi thực sự cần học
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (phase === "plan" && diagnosis) {
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section className="rounded-3xl border border-border/70 bg-card p-6">
            <div className="flex items-center gap-3">
              <Brain className="size-7 text-primary" aria-hidden />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">
                  Bản đồ năng lực ban đầu
                </p>
                <h1 className="mt-1 text-2xl font-black">
                  Chỉ học đúng phần bạn còn thiếu
                </h1>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-bold text-muted-foreground">Baseline</p>
                <p className="mt-1 text-2xl font-black">
                  {scoreLabel(diagnosis.evaluation)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Đã tự làm được
                </p>
                <p className="mt-1 text-2xl font-black">
                  {diagnosis.independentIntentIds.length}/{required.length}
                </p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-4">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Cần can thiệp
                </p>
                <p className="mt-1 text-2xl font-black">
                  {diagnosis.focusIntentIds.length}
                </p>
              </div>
            </div>
          </section>

          {diagnosis.independentIntentIds.length > 0 && (
            <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
              <h2 className="flex items-center gap-2 font-black">
                <CheckCircle2 className="size-5 text-emerald-500" aria-hidden />
                Không bắt bạn học lại
              </h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {diagnosis.independentIntentIds.map((intentId) => (
                  <p key={intentId}>• {intentById(mission, intentId)?.descriptionVi}</p>
                ))}
              </div>
            </section>
          )}

          {diagnosis.focusIntentIds.length > 0 ? (
            <section className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
              <h2 className="flex items-center gap-2 font-black">
                <Target className="size-5 text-amber-500" aria-hidden />
                Phần hệ thống sẽ dạy
              </h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {diagnosis.focusIntentIds.map((intentId) => (
                  <p key={intentId}>• {intentById(mission, intentId)?.descriptionVi}</p>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <p className="font-black">Baseline đã đủ các mục tiêu.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Hệ thống sẽ không dạy lại. Bạn được chuyển thẳng sang tình huống mới để
                kiểm tra có phải chỉ đang học thuộc hay không.
              </p>
            </section>
          )}

          <button
            type="button"
            onClick={startAdaptiveLesson}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
          >
            {focusIntentIds.length > 0
              ? "Học đúng phần còn thiếu"
              : "Làm tình huống mới ngay"}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </main>
    );
  }

  if (phase === "teach") {
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section>
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Bước 2 · Can thiệp thích ứng
            </p>
            <h1 className="mt-2 text-3xl font-black">Chỉ {activeFocusIntents.length} ý cần học</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Xem mẫu một lần. Ở bước tiếp theo, mẫu sẽ bị ẩn và hỗ trợ chỉ xuất hiện khi
              bạn thực sự mắc kẹt.
            </p>
          </section>

          <div className="space-y-4">
            {activeFocusIntents.map((intent) => {
              const prompt = promptForIntent(mission, intent);
              return (
                <section
                  key={intent.id}
                  className="rounded-2xl border border-border/70 bg-card p-5"
                >
                  <p className="text-xs font-black uppercase tracking-widest text-primary">
                    {intent.descriptionVi}
                  </p>
                  <div className="mt-3 rounded-xl bg-muted/50 p-4 text-sm">
                    <p><strong>{mission.partnerName}:</strong> {prompt.partnerLine}</p>
                    <p className="mt-2 text-muted-foreground">{prompt.partnerLineVi}</p>
                  </div>
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-lg font-black">{intent.examples[0]}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{prompt.hintVi}</p>
                  </div>
                </section>
              );
            })}
          </div>

          <button
            type="button"
            onClick={startRetrieval}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
          >
            Ẩn mẫu và bắt đầu tự nhớ
            <Brain className="size-4" aria-hidden />
          </button>
        </div>
      </main>
    );
  }

  if (phase === "retrieve" && currentRetrieveIntent) {
    const prompt = promptForIntent(mission, currentRetrieveIntent);
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section className="rounded-3xl border border-primary/25 bg-primary/5 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Bước 3 · Retrieval {retrieveIndex + 1}/{activeFocusIntents.length}
            </p>
            <h1 className="mt-3 text-2xl font-black">
              {currentRetrieveIntent.descriptionVi}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cố nhớ trước. Mỗi lần sai, hệ thống chỉ mở thêm một mức hỗ trợ.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="text-sm"><strong>{mission.partnerName}:</strong> {prompt.partnerLine}</p>
            <p className="mt-2 text-sm text-muted-foreground">{prompt.partnerLineVi}</p>
          </section>

          {currentScaffold && (
            <section className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
                <Lightbulb className="size-4" aria-hidden />
                Hỗ trợ mức {Math.min(currentRetrieveAttempt, 2)}
              </p>
              <p className="mt-2 font-black">{currentScaffold}</p>
              {currentRetrieveAttempt >= 2 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Đọc mẫu rồi che nó lại và tự viết. Việc nhìn thấy mẫu chưa được tính là nhớ.
                </p>
              )}
            </section>
          )}

          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
            <textarea
              value={retrieveText}
              onChange={(event) => {
                setRetrieveText(event.target.value);
                setError(null);
              }}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="Tự viết câu trả lời..."
            />
            {renderError()}
            <button
              type="button"
              onClick={submitRetrieval}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
            >
              Kiểm tra khả năng tự nhớ
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </section>

          <p className="text-center text-xs text-muted-foreground">
            Đã tự nhớ được {retrievePassed.length}/{activeFocusIntents.length} mục tiêu cần học.
          </p>
        </div>
      </main>
    );
  }

  if (phase === "apply") {
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section className="rounded-3xl border border-primary/25 bg-primary/5 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Bước 4 · Ghép thành nhiệm vụ hoàn chỉnh
            </p>
            <h1 className="mt-3 text-2xl font-black">Không còn câu mẫu</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Dùng lại tình huống ban đầu nhưng tự tạo toàn bộ câu trả lời trong một lượt.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="font-semibold">{mission.scenarioVi}</p>
            <div className="mt-4 space-y-2 rounded-xl bg-muted/50 p-4 text-sm">
              {mission.roleplayTurns.map((turn) => (
                <p key={turn.id}><strong>{mission.partnerName}:</strong> {turn.partnerLine}</p>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
            <textarea
              value={applyText}
              onChange={(event) => {
                setApplyText(event.target.value);
                setError(null);
              }}
              rows={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="Tự hoàn thành toàn bộ nhiệm vụ..."
            />
            {renderError()}
            <button
              type="button"
              onClick={submitApplication}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
            >
              Kiểm tra và yêu cầu tôi tự sửa
              <ShieldCheck className="size-4" aria-hidden />
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (phase === "repair" && applyEvaluation) {
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section className="rounded-3xl border border-amber-500/25 bg-amber-500/10 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
              Bước 5 · Repair bắt buộc
            </p>
            <h1 className="mt-3 text-2xl font-black">Đọc góp ý rồi tự viết lại</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Không có nút “xem đáp án rồi tiếp tục”. Bạn phải sửa được trong chính câu trả lời của mình.
            </p>
          </section>

          <section className="space-y-3">
            {applyEvaluation.corrections.length > 0 ? (
              applyEvaluation.corrections.map((correction) => (
                <div
                  key={`${correction.code}:${correction.suggestion}`}
                  className="rounded-2xl border border-amber-500/25 bg-card p-5"
                >
                  <p className="font-black">{correction.explanationVi}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Gợi ý sửa: <strong className="text-foreground">{correction.suggestion}</strong>
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-amber-500/25 bg-card p-5">
                <p className="font-black">Hãy thực hiện lại toàn bộ nhiệm vụ một lần nữa.</p>
              </div>
            )}
          </section>

          {repairAttempts >= 2 && (
            <section className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                <Sparkles className="size-4" aria-hidden />
                Rescue mode
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Bạn đang mắc kẹt nên hệ thống đưa khung đầy đủ. Đọc xong, hãy tự thay tên và công việc rồi viết lại.
              </p>
              <p className="mt-3 font-black">{rescueFrame}</p>
            </section>
          )}

          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
            <textarea
              value={repairText}
              onChange={(event) => {
                setRepairText(event.target.value);
                setError(null);
              }}
              rows={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="Tự viết lại toàn bộ nhiệm vụ..."
            />
            {renderError()}
            <button
              type="button"
              onClick={submitRepair}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
            >
              Kiểm tra bản tự sửa
              <RefreshCcw className="size-4" aria-hidden />
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (phase === "cold") {
    return (
      <main className="min-h-screen bg-background pb-16">
        {renderProgress()}
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <section className="rounded-3xl border border-violet-500/25 bg-violet-500/10 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-violet-700 dark:text-violet-300">
              Bước 6 · Cold task
            </p>
            <h1 className="mt-3 text-2xl font-black">Tình huống chưa được luyện nguyên mẫu</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Đây là bước phân biệt “nhớ câu mẫu” với “dùng được kỹ năng”. Không có gợi ý trước lượt đầu.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="font-black">
              {coldVariant?.scenarioVi ?? "Bạn gặp một đồng nghiệp khác lần đầu."}
            </p>
            <div className="mt-4 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
              {(coldVariant?.partnerLines ?? mission.roleplayTurns.map((turn) => turn.partnerLine)).map(
                (line, index) => (
                  <p key={`${index}:${line}`}><strong>Người mới:</strong> {line}</p>
                ),
              )}
            </div>
            {coldVariant && (
              <p className="mt-4 text-xs text-muted-foreground">
                Điều kiện thay đổi: {coldVariant.changedConditions.join(" · ")}
              </p>
            )}
          </section>

          <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
            <textarea
              value={coldText}
              onChange={(event) => {
                setColdText(event.target.value);
                setError(null);
              }}
              rows={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="Tự xử lý tình huống mới..."
            />
            {renderError()}
            <button
              type="button"
              onClick={submitColdTask}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
            >
              Chấm khả năng chuyển giao
              <Target className="size-4" aria-hidden />
            </button>
          </section>
        </div>
      </main>
    );
  }

  const coldPassed = coldEvaluation ? tutorMasteryPassed(coldEvaluation) : false;

  return (
    <main className="min-h-screen bg-background pb-16">
      {renderProgress()}
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <section
          className={`rounded-3xl border p-6 ${
            coldPassed
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-amber-500/30 bg-amber-500/10"
          }`}
        >
          <div className="flex items-start gap-3">
            {coldPassed ? (
              <CheckCircle2 className="mt-0.5 size-7 shrink-0 text-emerald-500" aria-hidden />
            ) : (
              <XCircle className="mt-0.5 size-7 shrink-0 text-amber-500" aria-hidden />
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                Kết quả tự học
              </p>
              <h1 className="mt-2 text-2xl font-black">
                {coldPassed
                  ? "Bạn đã dùng được kỹ năng trong tình huống mới"
                  : "Chưa đạt chuyển giao — hệ thống không cho qua giả"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {coldPassed
                  ? "Kết quả này mạnh hơn hoàn thành bài hoặc chọn đúng trắc nghiệm. Bước tiếp theo là kiểm tra lại sau thời gian."
                  : "Bạn có thể học lại đúng các ý còn thiếu. Không cần làm lại toàn bộ nội dung đã đạt."}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-muted-foreground">Baseline</p>
            <p className="mt-1 text-xl font-black">
              {scoreLabel(diagnosis?.evaluation ?? null)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-muted-foreground">Cold task</p>
            <p className="mt-1 text-xl font-black">{scoreLabel(coldEvaluation)}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-xs font-bold text-muted-foreground">Lượt hỗ trợ</p>
            <p className="mt-1 text-xl font-black">{supportCount}</p>
          </div>
        </section>

        {coldEvaluation && coldEvaluation.corrections.length > 0 && (
          <section className="rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="font-black">Điểm còn thiếu</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {coldEvaluation.corrections.map((correction) => (
                <p key={`${correction.code}:${correction.suggestion}`}>
                  • {correction.explanationVi} — {correction.suggestion}
                </p>
              ))}
            </div>
          </section>
        )}

        {coldPassed ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <p className="font-black">Chưa gọi là retained ngay.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Checkpoint sẽ lưu bằng chứng hiện tại. Hệ thống hiện có thể tiếp tục kiểm tra biến thể sau 1, 7 và 30 ngày.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(nextRoute)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
            >
              Lưu bằng chứng và đến checkpoint
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </section>
        ) : (
          <button
            type="button"
            onClick={relearnColdTask}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground"
          >
            Chỉ học lại phần cold task còn thiếu
            <RefreshCcw className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </main>
  );
}

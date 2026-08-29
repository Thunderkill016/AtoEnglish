"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  Headphones,
  Home,
  Mic2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  curriculumInventory,
  learnerSnapshot,
  lessonSteps,
  marketEvidence,
  masteryPreview,
  productEvidence,
  reviewItems,
  todayMission,
} from "./preview-data";

type Tab = "today" | "review" | "progress" | "evidence";

type FeedbackState = "idle" | "good" | "needs-work";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "today", label: "Hôm nay", icon: Home },
  { id: "review", label: "Ôn lại", icon: RotateCcw },
  { id: "progress", label: "Tiến bộ", icon: BarChart3 },
  { id: "evidence", label: "Data", icon: Database },
];

const clean = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.84;
  window.speechSynthesis.speak(utterance);
}

export function DataDrivenPreview() {
  const [tab, setTab] = useState<Tab>("today");
  const [lessonActive, setLessonActive] = useState(false);
  const [step, setStep] = useState(0);
  const [retrieval, setRetrieval] = useState("");
  const [retry, setRetry] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [repairChoice, setRepairChoice] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const completion = useMemo(
    () => Math.round(((step + (completed ? 1 : 0)) / lessonSteps.length) * 100),
    [step, completed]
  );

  const startLesson = () => {
    setLessonActive(true);
    setStep(0);
    setRetrieval("");
    setRetry("");
    setFeedback("idle");
    setRepairChoice(null);
  };

  const exitLesson = () => {
    setLessonActive(false);
    setStep(0);
    setFeedback("idle");
  };

  const goNext = () => {
    setFeedback("idle");
    if (step < lessonSteps.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    setCompleted(true);
    setLessonActive(false);
    setTab("today");
  };

  const checkRetrieval = () => {
    const answer = clean(retrieval);
    const hasNameFrame = answer.includes("my name is") || answer.includes("i'm") || answer.includes("i am");
    const hasSpellingSignal = /\b[a-z](?:[ -][a-z]){2,}\b/.test(answer);
    setFeedback(hasNameFrame && hasSpellingSignal ? "good" : "needs-work");
  };

  const checkRetry = () => {
    const answer = clean(retry);
    const hasRepair = answer.includes("could you say that again") || answer.includes("say that again");
    const hasName = answer.includes("my name is") || answer.includes("i'm") || answer.includes("i am");
    setFeedback(hasRepair && hasName ? "good" : "needs-work");
  };

  if (lessonActive) {
    const current = lessonSteps[step];
    return (
      <main className="min-h-screen bg-[#f7f6f2] text-[#171713]">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-8">
          <header className="mb-8 flex items-center gap-4">
            <button
              type="button"
              onClick={exitLesson}
              className="grid size-10 place-items-center rounded-full border border-black/10 bg-white transition hover:border-black/20 hover:bg-black/[0.03]"
              aria-label="Thoát bài học"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                <span>Day {todayMission.day}</span>
                <span>{Math.min(completion, 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
                <div
                  className="h-full rounded-full bg-[#2d6a4f] transition-all duration-500"
                  style={{ width: `${Math.max(8, Math.min(completion, 100))}%` }}
                />
              </div>
            </div>
          </header>

          <section className="flex flex-1 flex-col justify-center pb-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#2d6a4f]">
              {current.eyebrow}
            </p>
            <h1 className="max-w-2xl text-balance text-3xl font-semibold leading-tight sm:text-5xl">
              {current.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-black/60 sm:text-lg">
              {current.instruction}
            </p>

            {step === 0 && (
              <div className="mt-9 rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,30,20,0.08)] sm:p-8">
                <button
                  type="button"
                  onClick={() => speak(current.english ?? "")}
                  className="mb-6 flex items-center gap-3 rounded-full bg-[#e8f2eb] px-4 py-2 text-sm font-semibold text-[#22543d] transition hover:bg-[#dcebe0]"
                >
                  <Volume2 className="size-4" />
                  Nghe mẫu
                </button>
                <p className="text-2xl font-medium leading-relaxed sm:text-3xl">
                  {current.english}
                </p>
                <p className="mt-5 border-t border-black/[0.07] pt-5 text-sm leading-6 text-black/50">
                  {current.helper}
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {["My name is …", "That’s …"].map((chunk) => (
                  <div key={chunk} className="rounded-[24px] border border-black/10 bg-white p-6">
                    <div className="mb-8 grid size-10 place-items-center rounded-full bg-[#f0ede2]">
                      <Brain className="size-5" />
                    </div>
                    <p className="text-2xl font-semibold">{chunk}</p>
                    <p className="mt-2 text-sm leading-6 text-black/50">Chunk dùng trực tiếp trong final task.</p>
                  </div>
                ))}
                <p className="sm:col-span-2 mt-2 text-sm leading-6 text-black/50">{current.helper}</p>
              </div>
            )}

            {step === 2 && (
              <div className="mt-9 rounded-[28px] border border-black/10 bg-white p-5 sm:p-8">
                <p className="mb-3 text-sm font-semibold text-black/50">Cue</p>
                <p className="mb-6 text-lg font-medium">“Chào. Tôi tên là Hoàng. H-O-A-N-G.”</p>
                <label className="block text-sm font-semibold" htmlFor="retrieval-answer">
                  Câu anh sẽ nói
                </label>
                <textarea
                  id="retrieval-answer"
                  value={retrieval}
                  onChange={(event) => {
                    setRetrieval(event.target.value);
                    setFeedback("idle");
                  }}
                  placeholder="Hi. My name is Hoang. That's H-O-A-N-G."
                  className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f5] px-4 py-4 text-base outline-none transition placeholder:text-black/25 focus:border-[#2d6a4f]/60 focus:ring-4 focus:ring-[#2d6a4f]/10"
                />
                <button
                  type="button"
                  onClick={checkRetrieval}
                  className="mt-4 rounded-full bg-[#171713] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Kiểm tra bản demo
                </button>
                {feedback !== "idle" && (
                  <Feedback kind={feedback} good="Đủ 2 ý: nói tên + đánh vần." needs="Thiếu khung nói tên hoặc phần đánh vần. Thử lại với ít gợi ý hơn." />
                )}
              </div>
            )}

            {step === 3 && (
              <div className="mt-9 rounded-[28px] border border-black/10 bg-white p-5 sm:p-8">
                <div className="mb-6 rounded-2xl bg-[#f5f3ec] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/40">New colleague</p>
                  <p className="mt-2 text-xl font-medium">{current.english}</p>
                </div>
                <p className="mb-4 text-sm font-semibold">Anh muốn họ nhắc lại. Chọn câu phù hợp:</p>
                <div className="grid gap-3">
                  {["Could you say that again?", "I say my name yesterday.", "Please name one more time."].map((choice) => {
                    const selected = repairChoice === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setRepairChoice(choice)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left font-medium transition ${
                          selected
                            ? "border-[#2d6a4f] bg-[#edf5ef]"
                            : "border-black/10 hover:border-black/25 hover:bg-black/[0.02]"
                        }`}
                      >
                        <span>{choice}</span>
                        {selected && <Check className="size-4 text-[#2d6a4f]" />}
                      </button>
                    );
                  })}
                </div>
                {repairChoice && (
                  <Feedback
                    kind={repairChoice === "Could you say that again?" ? "good" : "needs-work"}
                    good="Đúng. Bây giờ dùng câu này rồi giới thiệu lại tên."
                    needs="Câu này chưa tự nhiên cho mục tiêu xin nhắc lại."
                  />
                )}
              </div>
            )}

            {step === 4 && (
              <div className="mt-9 rounded-[28px] border border-black/10 bg-white p-5 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#edf5ef] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2d6a4f]">Giữ lại</p>
                    <p className="mt-2 text-sm font-medium">Khung “My name is …” rõ và đủ ngắn để lấy ra nhanh.</p>
                  </div>
                  <div className="rounded-2xl bg-[#fff5df] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a5b00]">Sửa 1 điểm</p>
                    <p className="mt-2 text-sm font-medium">Khi không nghe rõ, dùng đúng repair chunk trước rồi mới nói lại.</p>
                  </div>
                </div>
                <label className="mt-6 block text-sm font-semibold" htmlFor="retry-answer">
                  Nói lại toàn task bằng text fallback
                </label>
                <textarea
                  id="retry-answer"
                  value={retry}
                  onChange={(event) => {
                    setRetry(event.target.value);
                    setFeedback("idle");
                  }}
                  placeholder="Could you say that again? Hi. My name is Hoang. That's H-O-A-N-G."
                  className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f5] px-4 py-4 text-base outline-none transition placeholder:text-black/25 focus:border-[#2d6a4f]/60 focus:ring-4 focus:ring-[#2d6a4f]/10"
                />
                <button
                  type="button"
                  onClick={checkRetry}
                  className="mt-4 rounded-full bg-[#171713] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Kiểm tra lần nói lại
                </button>
                {feedback !== "idle" && (
                  <Feedback
                    kind={feedback}
                    good="Đạt bản demo: repair + giới thiệu lại. Nếp sẽ đưa các chunk yếu vào Review."
                    needs="Chưa đủ repair + name frame. Sửa đúng một điểm rồi thử lại."
                  />
                )}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFeedback("idle");
                  setStep((currentStep) => Math.max(0, currentStep - 1));
                }}
                disabled={step === 0}
                className="rounded-full px-4 py-3 text-sm font-semibold text-black/55 transition hover:bg-black/[0.04] disabled:pointer-events-none disabled:opacity-25"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={step === 3 && repairChoice === null}
                className="flex items-center gap-2 rounded-full bg-[#2d6a4f] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(45,106,79,0.22)] transition hover:bg-[#24583f] disabled:pointer-events-none disabled:opacity-35"
              >
                {step === lessonSteps.length - 1 ? "Hoàn thành demo" : "Tiếp theo"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171713]">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#2d6a4f] text-white shadow-[0_8px_30px_rgba(45,106,79,0.18)]">
              <span className="text-lg font-black">N</span>
            </div>
            <div>
              <p className="font-semibold leading-none">Nếp</p>
              <p className="mt-1 text-xs text-black/40">data-driven preview</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-black/55 sm:flex">
            <Sparkles className="size-3.5 text-[#2d6a4f]" />
            Preview branch · không đụng main
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <nav className="sticky top-8 space-y-1">
              {tabs.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      active ? "bg-[#171713] text-white" : "text-black/55 hover:bg-black/[0.04] hover:text-black"
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0">
            {tab === "today" && <TodayView completed={completed} onStart={startLesson} onTab={setTab} />}
            {tab === "review" && <ReviewView />}
            {tab === "progress" && <ProgressView />}
            {tab === "evidence" && <EvidenceView />}
          </section>
        </div>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-[24px] border border-black/10 bg-white/95 p-1.5 shadow-[0_18px_60px_rgba(20,20,12,0.14)] backdrop-blur lg:hidden">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-1 rounded-[18px] px-2 py-2.5 text-[11px] font-semibold transition ${
                active ? "bg-[#171713] text-white" : "text-black/45"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </main>
  );
}

function TodayView({
  completed,
  onStart,
  onTab,
}: {
  completed: boolean;
  onStart: () => void;
  onTab: (tab: Tab) => void;
}) {
  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-medium text-black/45">Hôm nay · {learnerSnapshot.dailyMinutes} phút</p>
        <h1 className="mt-2 max-w-3xl text-balance text-3xl font-semibold leading-tight sm:text-5xl">
          Đừng chọn bài. <span className="text-[#2d6a4f]">Cứ làm việc tiếp theo.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-black/55">
          Preview này biến tín hiệu “mất gốc + rối lộ trình” thành một Home chỉ có một nhiệm vụ chính.
        </p>
      </div>

      <article className="overflow-hidden rounded-[32px] border border-black/[0.08] bg-[#183f2d] text-white shadow-[0_30px_100px_rgba(23,54,39,0.18)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_220px] lg:p-10">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">Day {todayMission.day}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                <Clock3 className="size-3.5" /> {todayMission.duration}
              </span>
            </div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">{todayMission.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">{todayMission.subtitle}</p>
            <button
              type="button"
              onClick={onStart}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f2e9c9] px-6 py-3.5 text-sm font-bold text-[#173625] transition hover:bg-white"
            >
              {completed ? "Làm lại bài demo" : "Bắt đầu nhiệm vụ"}
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Can-do outcome</p>
            <p className="mt-3 text-sm font-medium leading-6 text-white/85">{todayMission.canDo}</p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs text-white/45">Không phải mục tiêu:</p>
              <p className="mt-1 text-sm text-white/70">“Học xong Unit 1” hoặc “+50 XP”.</p>
            </div>
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onTab("review")}
          className="group rounded-[26px] border border-black/[0.08] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-black/15 hover:shadow-lg"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#fff3d4] text-[#8a5b00]">
              <RefreshCw className="size-5" />
            </div>
            <ChevronRight className="size-4 text-black/20 transition group-hover:translate-x-1 group-hover:text-black/50" />
          </div>
          <p className="text-sm text-black/45">Đang chờ ôn</p>
          <p className="mt-1 text-2xl font-semibold">3 cụm</p>
          <p className="mt-2 text-sm leading-6 text-black/45">Review theo thứ sắp quên, không phải mở lại nguyên lesson.</p>
        </button>

        <button
          type="button"
          onClick={() => onTab("progress")}
          className="group rounded-[26px] border border-black/[0.08] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-black/15 hover:shadow-lg"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f2eb] text-[#2d6a4f]">
              <Target className="size-5" />
            </div>
            <ChevronRight className="size-4 text-black/20 transition group-hover:translate-x-1 group-hover:text-black/50" />
          </div>
          <p className="text-sm text-black/45">Khả năng đang xây</p>
          <p className="mt-1 text-2xl font-semibold">Tự giới thiệu ngắn</p>
          <p className="mt-2 text-sm leading-6 text-black/45">Đo hiểu → retrieval → output → transfer, không đo “đã xem”.</p>
        </button>
      </div>

      <div className="mt-8 rounded-[28px] border border-black/[0.08] bg-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Learner state</p>
            <p className="mt-2 text-xl font-semibold">{learnerSnapshot.label}</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/50">{learnerSnapshot.currentAbility}</p>
          </div>
          <div className="rounded-2xl bg-[#f5f3ec] px-4 py-3 text-sm">
            <span className="text-black/40">Next gap · </span>
            <span className="font-semibold">{learnerSnapshot.nextGap}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewView() {
  return (
    <div>
      <p className="text-sm font-medium text-black/45">Memory engine</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Ôn thứ sắp quên, không ôn cả khóa.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-black/55">
        Đây là cách vocabulary/SRS trở thành hạ tầng bên dưới learning loop thay vì một sản phẩm riêng.
      </p>
      <div className="mt-8 space-y-3">
        {reviewItems.map((item, index) => (
          <article key={item.phrase} className="rounded-[26px] border border-black/[0.08] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f0ede2] text-sm font-bold">{index + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <p className="text-lg font-semibold">{item.phrase}</p>
                  <span className="w-fit rounded-full bg-[#fff3d4] px-3 py-1 text-xs font-bold text-[#7a5200]">{item.due}</span>
                </div>
                <p className="mt-2 text-sm text-black/45">{item.reason}</p>
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2d6a4f]">
                  <RefreshCw className="size-4" /> {item.mode}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProgressView() {
  return (
    <div>
      <p className="text-sm font-medium text-black/45">Mastery, không phải completion</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">“Đã học” chưa có nghĩa là “dùng được”.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-black/55">
        Một skill chỉ mạnh khi learner hiểu, kéo ra khỏi trí nhớ, tự tạo output và chuyển sang tình huống khác.
      </p>

      <div className="mt-8 rounded-[30px] border border-black/[0.08] bg-white p-5 sm:p-8">
        <div className="space-y-6">
          {masteryPreview.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{item.label}</span>
                <span className="font-mono text-black/45">{item.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                <div className="h-full rounded-full bg-[#2d6a4f]" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {["Hiểu", "Tự nói", "Chuyển cảnh"].map((label, index) => (
          <div key={label} className="rounded-[24px] border border-black/[0.08] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/35">Gate {index + 1}</p>
            <p className="mt-2 text-xl font-semibold">{label}</p>
            <p className="mt-2 text-sm leading-6 text-black/45">
              {index === 0 && "Không đo chỉ bằng xem màn hình hoặc chọn đúng multiple choice."}
              {index === 1 && "Cần learner tự sản sinh utterance với support giảm dần."}
              {index === 2 && "Phải dùng lại trong một tình huống đổi context mới được coi là usable."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceView() {
  return (
    <div>
      <p className="text-sm font-medium text-black/45">Why this shape?</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Data quyết định constraints. Không quyết định UI bằng vote.</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-black/55">
        Facebook trả lời “đau ở đâu”; sách/PDF trả lời “knowledge space gồm gì”. Hai lớp không bị trộn thành cùng một loại evidence.
      </p>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <EvidenceCard title="Organic learner demand" icon={CircleAlert} items={marketEvidence} />
        <EvidenceCard title="Product feedback" icon={BookOpenCheck} items={productEvidence} />
      </div>

      <article className="mt-5 rounded-[28px] border border-black/[0.08] bg-[#171713] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Curriculum reference layer</p>
            <h2 className="mt-2 text-2xl font-semibold">PDF không được render thành course.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
              Nó trở thành coverage/constraint: grammar concepts, CEFR vocabulary, chunks và prerequisite. Lesson UI chỉ lấy phần cần cho can-do outcome hôm nay.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <Metric value={curriculumInventory.grammarConcepts.toLocaleString("vi-VN")} label="grammar units mapped" />
            <Metric value={curriculumInventory.lexicalEntries.toLocaleString("vi-VN")} label="CEFR lexical rows" />
          </div>
        </div>
        <div className="mt-7 grid grid-cols-5 gap-2 border-t border-white/10 pt-6">
          {curriculumInventory.cefr.map((item) => (
            <div key={item.level} className="rounded-2xl bg-white/[0.06] px-3 py-4 text-center">
              <p className="text-xs font-bold text-white/45">{item.level}</p>
              <p className="mt-1 text-sm font-semibold">{item.count.toLocaleString("vi-VN")}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="mt-5 rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f2eb] text-[#2d6a4f]">
            <Target className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Lesson constraints từ data</p>
            <p className="text-xs text-black/40">Day 1 preview</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Constraint label="Grammar" value={todayMission.grammarConstraint} />
          <Constraint label="Vocabulary" value={todayMission.vocabularyConstraint} />
        </div>
      </article>
    </div>
  );
}

function Feedback({ kind, good, needs }: { kind: FeedbackState; good: string; needs: string }) {
  const isGood = kind === "good";
  return (
    <div className={`mt-4 flex gap-3 rounded-2xl p-4 ${isGood ? "bg-[#edf5ef] text-[#214f38]" : "bg-[#fff5df] text-[#755000]"}`}>
      <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-current/10">
        {isGood ? <Check className="size-3.5" /> : <CircleAlert className="size-3.5" />}
      </div>
      <p className="text-sm font-medium leading-6">{isGood ? good : needs}</p>
    </div>
  );
}

function EvidenceCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof CircleAlert;
  items: typeof marketEvidence;
}) {
  return (
    <article className="rounded-[28px] border border-black/[0.08] bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-[#f0ede2]">
          <Icon className="size-4" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="shrink-0 font-mono text-xs text-black/45">{item.value} {item.unit}</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-black/45">{item.note}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.07] p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/40">{label}</p>
    </div>
  );
}

function Constraint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f6f2] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/35">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-black/65">{value}</p>
    </div>
  );
}

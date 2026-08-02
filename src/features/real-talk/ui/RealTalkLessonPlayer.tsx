"use client";

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Headphones,
  RotateCcw,
  Save,
} from "lucide-react";

import { seedUnitVocabToSRS } from "@/app/actions/cards";
import {
  recallAnswerMatches,
  type RealTalkLesson,
} from "@/features/real-talk/domain/real-talk";

type LessonPhase = "watch" | "decode" | "practice" | "complete";
type SaveState = "idle" | "saving" | "saved" | "guest";

interface RealTalkLessonPlayerProps {
  lesson: RealTalkLesson;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default function RealTalkLessonPlayer({
  lesson,
}: RealTalkLessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stopAtRef = useRef(lesson.clip.endSeconds);
  const [phase, setPhase] = useState<LessonPhase>("watch");
  const [currentTime, setCurrentTime] = useState(lesson.clip.startSeconds);
  const [gistChoice, setGistChoice] = useState<number | null>(null);
  const [gistChecked, setGistChecked] = useState(false);
  const [clozeAnswer, setClozeAnswer] = useState("");
  const [recallAnswer, setRecallAnswer] = useState("");
  const [clozeChecked, setClozeChecked] = useState(false);
  const [recallChecked, setRecallChecked] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const activeSegment = useMemo(
    () =>
      lesson.transcript.find(
        (segment) =>
          currentTime >= segment.startSeconds && currentTime < segment.endSeconds,
      ) ?? null,
    [currentTime, lesson.transcript],
  );

  const clozeCorrect =
    clozeAnswer.trim().toLowerCase() === lesson.cloze.answer.toLowerCase();
  const recallCorrect = recallAnswerMatches(
    recallAnswer,
    lesson.recall.acceptedAnswers,
  );
  const practicePassed = clozeChecked && clozeCorrect && recallChecked && recallCorrect;

  const playRange = (startSeconds: number, endSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    stopAtRef.current = endSeconds;
    video.currentTime = startSeconds;
    void video.play();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.currentTime >= stopAtRef.current - 0.08) video.pause();
  };

  const saveChunks = async () => {
    setSaveState("saving");
    const result = await seedUnitVocabToSRS({
      vocab: lesson.chunks.map((chunk) => ({
        word: chunk.phrase,
        meaning_vn: `${chunk.meaningVi} — ${chunk.useWhenVi}`,
        example_en: chunk.phrase,
      })),
      topic: `Real Talk: ${lesson.titleEn}`,
      level: lesson.level,
    });
    setSaveState(result.success ? "saved" : "guest");
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Real Talk · {lesson.level} · {lesson.estimatedMinutes} phút
            </p>
            <h1 className="truncate text-sm font-black sm:text-base">
              {lesson.titleVi}
            </h1>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
            {phase === "watch"
              ? "1/4 Xem"
              : phase === "decode"
                ? "2/4 Giải mã"
                : phase === "practice"
                  ? "3/4 Tự nhớ"
                  : "4/4 Xong"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <video
            ref={videoRef}
            src={lesson.source.mediaUrl}
            controls
            preload="metadata"
            className="aspect-video w-full bg-black"
            onLoadedMetadata={(event) => {
              event.currentTarget.currentTime = lesson.clip.startSeconds;
              stopAtRef.current = lesson.clip.endSeconds;
            }}
            onPlay={(event) => {
              const video = event.currentTarget;
              const outsideClip =
                video.currentTime < lesson.clip.startSeconds ||
                video.currentTime >= lesson.clip.endSeconds;
              const exhaustedRange = stopAtRef.current <= video.currentTime + 0.08;

              if (outsideClip) video.currentTime = lesson.clip.startSeconds;
              if (outsideClip || exhaustedRange) {
                stopAtRef.current = lesson.clip.endSeconds;
              }
            }}
            onTimeUpdate={handleTimeUpdate}
          >
            Trình duyệt của bạn chưa phát được video này.
          </video>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              Đoạn học: {formatTime(lesson.clip.startSeconds)}–
              {formatTime(lesson.clip.endSeconds)}
            </span>
            <a
              href={lesson.source.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Xem nguồn và giấy phép <ExternalLink className="size-3.5" />
            </a>
          </div>
        </section>

        {!lesson.source.transcript.reviewed && (
          <aside className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
            Đây là pilot nội bộ. Caption máy đã được chuẩn hóa để thử trải nghiệm,
            nhưng phải được người biên tập nghe và xác minh trước khi phát hành công khai.
          </aside>
        )}

        {phase === "watch" && (
          <section className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                Xem lần đầu
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Nghe ý chính, chưa nhìn transcript
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {lesson.canDoVi} Phát lại đoạn ngắn rồi trả lời câu hỏi bên dưới.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                playRange(lesson.clip.startSeconds, lesson.clip.endSeconds)
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground"
            >
              <Headphones className="size-4" /> Phát đúng đoạn cần nghe
            </button>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-bold">{lesson.gistQuestion.questionVi}</p>
              <div className="mt-4 grid gap-2">
                {lesson.gistQuestion.options.map((option, index) => {
                  const correct = index === lesson.gistQuestion.correctIndex;
                  const selected = gistChoice === index;
                  const resultClass = gistChecked
                    ? correct
                      ? "border-emerald-500 bg-emerald-500/10"
                      : selected
                        ? "border-red-500 bg-red-500/10"
                        : "border-border opacity-60"
                    : selected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50";

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={gistChecked}
                      onClick={() => setGistChoice(index)}
                      className={`min-h-11 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${resultClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {!gistChecked ? (
                <button
                  type="button"
                  disabled={gistChoice === null}
                  onClick={() => setGistChecked(true)}
                  className="mt-4 min-h-11 w-full rounded-xl bg-foreground px-4 font-bold text-background disabled:opacity-40"
                >
                  Kiểm tra ý chính
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhase("decode")}
                  className="mt-4 min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-foreground"
                >
                  Mở transcript có nguồn
                </button>
              )}
            </div>
          </section>
        )}

        {phase === "decode" && (
          <section className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                Giải mã hội thoại
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Mỗi câu đều quay lại đúng timestamp
              </h2>
            </div>

            <div className="space-y-3">
              {lesson.transcript.map((segment) => {
                const active = activeSegment?.id === segment.id;
                return (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() =>
                      playRange(segment.startSeconds, segment.endSeconds)
                    }
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <strong className="text-foreground">{segment.speaker}</strong>
                      {formatTime(segment.startSeconds)}
                    </span>
                    <span className="mt-2 block font-semibold">
                      {segment.displayText}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {segment.translationVi}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {lesson.chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-black">{chunk.phrase}</p>
                  <p className="mt-1 text-sm text-primary">{chunk.meaningVi}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {chunk.useWhenVi}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPhase("practice")}
              className="min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-foreground"
            >
              Ẩn transcript và tự gọi lại
            </button>
          </section>
        )}

        {phase === "practice" && (
          <section className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                Active recall
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Không chỉ xem hiểu — phải tự nhớ lại
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <label htmlFor="real-talk-cloze" className="font-bold">
                {lesson.cloze.prompt}
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                {lesson.cloze.hintVi}
              </p>
              <input
                id="real-talk-cloze"
                value={clozeAnswer}
                onChange={(event) => {
                  setClozeAnswer(event.target.value);
                  setClozeChecked(false);
                }}
                className="mt-4 min-h-11 w-full rounded-xl border border-border bg-background px-4"
                placeholder="Nhập từ còn thiếu"
              />
              <button
                type="button"
                onClick={() => setClozeChecked(true)}
                className="mt-3 min-h-11 w-full rounded-xl bg-foreground px-4 font-bold text-background"
              >
                Kiểm tra điền từ
              </button>
              {clozeChecked && (
                <p
                  className={`mt-3 text-sm font-semibold ${
                    clozeCorrect ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {clozeCorrect
                    ? "Đúng — bạn đã lấy được tên sự kiện."
                    : "Chưa đúng. Hãy nghe lại đúng timestamp rồi thử lại."}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <label htmlFor="real-talk-recall" className="font-bold">
                {lesson.recall.cueVi}
              </label>
              <textarea
                id="real-talk-recall"
                value={recallAnswer}
                onChange={(event) => {
                  setRecallAnswer(event.target.value);
                  setRecallChecked(false);
                }}
                rows={3}
                className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3"
                placeholder="Tự viết câu tiếng Anh, không quay lại transcript"
              />
              <button
                type="button"
                onClick={() => setRecallChecked(true)}
                className="mt-3 min-h-11 w-full rounded-xl bg-foreground px-4 font-bold text-background"
              >
                Kiểm tra khả năng tự nhớ
              </button>
              {recallChecked && (
                <p
                  className={`mt-3 text-sm font-semibold ${
                    recallCorrect ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {recallCorrect
                    ? "Đúng — bạn đã tự gọi lại được câu từ ngữ cảnh thật."
                    : "Chưa khớp. Hãy quay lại transcript, nghe đúng câu rồi thử lại."}
                </p>
              )}
            </div>

            {!practicePassed && (
              <button
                type="button"
                onClick={() => {
                  setPhase("decode");
                  setClozeChecked(false);
                  setRecallChecked(false);
                }}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 font-bold"
              >
                <RotateCcw className="size-4" /> Nghe và xem lại bằng chứng
              </button>
            )}

            <button
              type="button"
              disabled={!practicePassed}
              onClick={() => setPhase("complete")}
              className="min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-foreground disabled:opacity-40"
            >
              Hoàn thành bài pilot
            </button>
          </section>
        )}

        {phase === "complete" && (
          <section className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <div>
              <h2 className="text-2xl font-black">Đã hoàn thành vòng học thật</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Bạn đã nghe ý chính, truy nguồn từng câu và tự gọi lại một mẫu câu
                mà không nhìn đáp án.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-left">
              <div className="flex items-center gap-2 font-bold">
                <BookOpen className="size-4 text-primary" /> Cụm sẽ được ôn lại
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {lesson.chunks.map((chunk) => (
                  <li key={chunk.id}>
                    <strong className="text-foreground">{chunk.phrase}</strong> —{" "}
                    {chunk.meaningVi}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={saveState === "saving" || saveState === "saved"}
              onClick={() => void saveChunks()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground disabled:opacity-60"
            >
              <Save className="size-4" />
              {saveState === "saving"
                ? "Đang lưu..."
                : saveState === "saved"
                  ? "Đã đưa vào FSRS"
                  : "Đưa 4 cụm vào lịch ôn FSRS"}
            </button>

            {saveState === "guest" && (
              <p className="text-sm text-amber-700 dark:text-amber-200">
                Bài học vẫn hoàn thành trong phiên này. Hãy đăng nhập để lưu cụm vào
                lịch ôn dài hạn.
              </p>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              {lesson.source.license.attribution} Nội dung gốc: {lesson.source.title}.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CloudOff,
  CloudUpload,
  Eye,
  Headphones,
  Lightbulb,
  Loader2,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Volume2,
} from "lucide-react";

import { saveRealTalkAttempt } from "@/app/actions/real-talk-attempt";
import type { RestoredRealTalkAttempt } from "@/features/real-talk/domain/learner-attempt";
import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

interface PrivateLessonRuntimeProps {
  video: RealTalkVideo;
  lesson: RealTalkLesson;
  initialAttempt: RestoredRealTalkAttempt | null;
}

type SupportLevel = 0 | 1 | 2 | 3;
type SaveState = "idle" | "saving" | "saved" | "error";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function restoredGistAnswer(
  attempt: RestoredRealTalkAttempt | null,
  correctIndex: number,
  optionCount: number,
) {
  if (!attempt || attempt.comprehensionTotal === 0) return null;
  if (attempt.comprehensionCorrect > 0) return correctIndex;
  return Array.from({ length: optionCount }, (_, index) => index).find(
    (index) => index !== correctIndex,
  ) ?? null;
}

export default function PrivateLessonRuntime({
  video,
  lesson,
  initialAttempt,
}: PrivateLessonRuntimeProps) {
  const gist = lesson.whileWatch.gistQuestion;
  const [firstListenDone, setFirstListenDone] = useState(
    initialAttempt?.firstListenCompleted ?? false,
  );
  const [gistAnswer, setGistAnswer] = useState<number | null>(() =>
    restoredGistAnswer(initialAttempt, gist.correctIndex, gist.options.length),
  );
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(
    initialAttempt?.maxSupportLevel ?? 0,
  );
  const [retrievalAttempted, setRetrievalAttempted] = useState(
    initialAttempt?.retrievalAttempted ?? false,
  );
  const [answerVisible, setAnswerVisible] = useState(false);
  const [speakConfirmed, setSpeakConfirmed] = useState(
    initialAttempt?.speakConfirmed ?? false,
  );
  const [transferAttempted, setTransferAttempted] = useState(
    initialAttempt?.transferAttempted ?? false,
  );
  const [saveState, setSaveState] = useState<SaveState>(
    initialAttempt ? "saved" : "idle",
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const targetPhrase =
    lesson.postWatch.speakingDrills[0]?.phrase ??
    lesson.transcript[0]?.textEn ??
    "";
  const firstKeyword = lesson.preWatch.vocabulary[0]?.word ?? "";
  const environment = lesson.environment;
  const transfer = lesson.transferTask;
  const completed =
    firstListenDone &&
    retrievalAttempted &&
    speakConfirmed &&
    transferAttempted;
  const hasActivity =
    firstListenDone ||
    gistAnswer !== null ||
    supportLevel > 0 ||
    retrievalAttempted ||
    speakConfirmed ||
    transferAttempted;

  const embedUrl = useMemo(() => {
    const query = new URLSearchParams({
      start: String(Math.floor(video.segment.startSeconds)),
      end: String(Math.ceil(video.segment.endSeconds)),
      rel: "0",
      modestbranding: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${query.toString()}`;
  }, [video]);

  useEffect(() => {
    if (!hasActivity) return;

    const timeout = window.setTimeout(() => {
      setSaveState("saving");
      setSaveError(null);
      void saveRealTalkAttempt({
        lessonSlug: video.id,
        firstListenCompleted: firstListenDone,
        comprehensionCorrect: gistAnswer === gist.correctIndex ? 1 : 0,
        comprehensionTotal: gistAnswer === null ? 0 : 1,
        maxSupportLevel: supportLevel,
        retrievalAttempted,
        speakConfirmed,
        transferAttempted,
      }).then((result) => {
        if (result.success) {
          setSaveState("saved");
        } else {
          setSaveState("error");
          setSaveError(result.error);
        }
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [
    firstListenDone,
    gist.correctIndex,
    gistAnswer,
    hasActivity,
    retrievalAttempted,
    speakConfirmed,
    supportLevel,
    transferAttempted,
    video.id,
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">
      <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-start gap-3 text-xs leading-5 text-amber-100/80">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <p>
            <strong className="text-amber-200">AI draft riêng tư.</strong> Caption,
            speaker, bản dịch và timestamp có thể sai. Đối chiếu với video gốc;
            bài này chưa được phép chia sẻ công khai.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/real-talk"
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Thư viện của tôi
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {saveState === "saving" ? (
              <StatusPill icon={Loader2} label="Đang lưu" tone="cyan" spin />
            ) : null}
            {saveState === "saved" ? (
              <StatusPill icon={CloudUpload} label="Đã lưu checkpoint" tone="green" />
            ) : null}
            {saveState === "error" ? (
              <StatusPill icon={CloudOff} label="Chưa lưu được" tone="red" />
            ) : null}
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-300">
              {lesson.level} · {lesson.estimatedMinutes} phút
            </span>
          </div>
        </div>

        {saveError ? (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-200">
            {saveError} Lượt luyện tập vẫn tiếp tục nhưng chưa được xác nhận là đã
            lưu.
          </div>
        ) : null}

        <header className="mt-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
            {environment?.titleVi ?? "Giao tiếp từ video thật"}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {lesson.titleVi}
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            {video.channelName} · {formatTime(video.segment.startSeconds)}–
            {formatTime(video.segment.endSeconds)}
          </p>
        </header>

        <LessonCard icon={MessageCircle} title="1. Bước vào tình huống" tone="green">
          <p className="text-sm leading-7 text-zinc-300">
            {environment?.situationVi ?? lesson.preWatch.contextVi}
          </p>
          {environment ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoBox label="Vai của bạn" value={environment.learnerRoleVi} />
              <InfoBox label="Mục tiêu" value={environment.realWorldGoalVi} />
            </div>
          ) : null}
        </LessonCard>

        <LessonCard icon={Headphones} title="2. Nghe lần đầu" tone="cyan">
          <p className="text-sm leading-6 text-zinc-400">
            Nghe để hiểu mục đích cuộc nói chuyện. Transcript chưa hiển thị.
          </p>
          <div className="mt-5 aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-black">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <button
            type="button"
            onClick={() => setFirstListenDone(true)}
            className={`mt-4 rounded-xl px-4 py-3 text-sm font-black ${
              firstListenDone
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-cyan-500 text-zinc-950"
            }`}
          >
            {firstListenDone ? "Đã nghe lần đầu" : "Tôi đã nghe hết đoạn"}
          </button>

          {firstListenDone ? (
            <div className="mt-6">
              <p className="font-bold">{gist.questionVi}</p>
              <div className="mt-3 grid gap-2">
                {gist.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGistAnswer(index)}
                    className={`rounded-xl border p-3 text-left text-sm ${
                      gistAnswer === index
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                        : "border-zinc-700 text-zinc-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Câu hỏi này chỉ đo hiểu nhanh, không tự hoàn thành bài.
              </p>
            </div>
          ) : null}
        </LessonCard>

        <LessonCard icon={Lightbulb} title="3. Hỗ trợ tăng dần" tone="amber">
          <div className="rounded-2xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
            {supportLevel === 0 ? <p className="text-zinc-500">Chưa mở hỗ trợ.</p> : null}
            {supportLevel >= 1 ? <p>{lesson.preWatch.contextVi}</p> : null}
            {supportLevel >= 2 && firstKeyword ? (
              <p className="mt-3"><strong>Từ khóa:</strong> {firstKeyword}</p>
            ) : null}
            {supportLevel >= 3 ? (
              <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {lesson.transcript.map((segment) => (
                  <div key={segment.index}>
                    <p className="text-xs font-bold text-emerald-400">
                      {segment.speaker} · {formatTime(segment.startTime)}
                    </p>
                    <p className="mt-1 text-white">{segment.textEn}</p>
                    <p className="text-zinc-500">{segment.textVi}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            disabled={supportLevel >= 3}
            onClick={() => setSupportLevel((value) => Math.min(3, value + 1) as SupportLevel)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-400/30 px-4 py-3 text-sm font-bold text-amber-200 disabled:opacity-40"
          >
            <Eye className="size-4" /> Mở thêm hỗ trợ
          </button>
        </LessonCard>

        <LessonCard icon={RefreshCw} title="4. Tự nhớ lại câu" tone="purple">
          <p className="text-sm text-zinc-400">
            Thử nói hoặc viết lại câu trước khi xem đáp án.
          </p>
          <div className="mt-4 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-5 text-center">
            {answerVisible ? (
              <p className="text-lg font-black">{targetPhrase}</p>
            ) : (
              <p className="text-sm text-zinc-500">Đáp án đang được ẩn</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setRetrievalAttempted(true);
              setAnswerVisible((value) => !value);
            }}
            className="mt-4 rounded-xl bg-purple-500 px-4 py-3 text-sm font-black"
          >
            {answerVisible ? "Ẩn và thử lại" : "Tôi đã thử — xem đáp án"}
          </button>
        </LessonCard>

        <LessonCard icon={Volume2} title="5. Nói thành tiếng" tone="rose">
          <p className="text-sm leading-6 text-zinc-300">
            Nói câu trên. Không cần microphone và không có điểm phát âm.
          </p>
          <ConfirmButton
            confirmed={speakConfirmed}
            idleLabel="Tôi đã nói thành tiếng"
            confirmedLabel="Đã xác nhận lượt nói"
            onClick={() => setSpeakConfirmed(true)}
          />
        </LessonCard>

        <LessonCard icon={Sparkles} title="6. Transfer sang tình huống khác" tone="teal">
          <p className="font-bold">
            {transfer?.situationVi ?? "Dùng câu vừa học trong một bối cảnh khác."}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {transfer?.promptVi ?? "Thay đổi người nghe hoặc thông tin rồi trả lời."}
          </p>
          {transfer?.successCriteriaVi?.length ? (
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {transfer.successCriteriaVi.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-400" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <ConfirmButton
            confirmed={transferAttempted}
            idleLabel="Tôi đã thử tình huống mới"
            confirmedLabel="Đã xác nhận lượt transfer"
            onClick={() => setTransferAttempted(true)}
          />
        </LessonCard>

        <section className={`mt-6 rounded-3xl border p-7 text-center ${completed ? "border-emerald-400/30 bg-emerald-400/10" : "border-zinc-800 bg-zinc-900"}`}>
          {completed ? (
            <>
              <CheckCircle2 className="mx-auto size-10 text-emerald-400" />
              <h2 className="mt-4 text-2xl font-black">Bạn đã hoàn thành lượt luyện tập này</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                Đây là bằng chứng luyện tập ngay lúc này, chưa chứng minh ghi nhớ
                lâu dài, độ trôi chảy hay phát âm chính xác.
              </p>
              <p className={`mt-3 text-xs font-bold ${saveState === "saved" ? "text-emerald-300" : "text-amber-300"}`}>
                {saveState === "saved"
                  ? "Completion evidence đã được lưu vào tài khoản."
                  : "Lượt luyện tập đã xong trên trang nhưng chưa được xác nhận là đã lưu."}
              </p>
              <Link href="/real-talk/create" className="mt-5 inline-flex rounded-xl bg-emerald-500 px-4 py-3 font-bold text-zinc-950">
                Tạo bài từ video khác
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-black">Chưa thể hoàn thành</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Cần nghe lần đầu, thử nhớ lại, nói và làm transfer.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function LessonCard({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: typeof MessageCircle;
  title: string;
  tone: "green" | "cyan" | "amber" | "purple" | "rose" | "teal";
  children: React.ReactNode;
}) {
  const tones = {
    green: "text-emerald-300",
    cyan: "text-cyan-300",
    amber: "text-amber-300",
    purple: "text-purple-300",
    rose: "text-rose-300",
    teal: "text-teal-300",
  };
  return (
    <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
      <div className={`flex items-center gap-2 ${tones[tone]}`}>
        <Icon className="size-5" />
        <h2 className="font-black">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-950 p-4">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function ConfirmButton({
  confirmed,
  idleLabel,
  confirmedLabel,
  onClick,
}: {
  confirmed: boolean;
  idleLabel: string;
  confirmedLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black ${confirmed ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-500 text-zinc-950"}`}
    >
      <CheckCircle2 className="size-4" />
      {confirmed ? confirmedLabel : idleLabel}
    </button>
  );
}

function StatusPill({
  icon: Icon,
  label,
  tone,
  spin = false,
}: {
  icon: typeof CloudUpload;
  label: string;
  tone: "cyan" | "green" | "red";
  spin?: boolean;
}) {
  const tones = {
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    red: "border-red-400/25 bg-red-400/10 text-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      <Icon className={`size-3.5 ${spin ? "animate-spin" : ""}`} /> {label}
    </span>
  );
}

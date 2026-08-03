"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Volume2,
} from "lucide-react";

import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

interface PrivateLessonRuntimeProps {
  video: RealTalkVideo;
  lesson: RealTalkLesson;
}

type SupportLevel = 0 | 1 | 2 | 3;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default function PrivateLessonRuntime({
  video,
  lesson,
}: PrivateLessonRuntimeProps) {
  const [firstListenDone, setFirstListenDone] = useState(false);
  const [gistAnswer, setGistAnswer] = useState<number | null>(null);
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(0);
  const [retrievalAttempted, setRetrievalAttempted] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [speakConfirmed, setSpeakConfirmed] = useState(false);
  const [transferAttempted, setTransferAttempted] = useState(false);

  const targetPhrase = lesson.postWatch.speakingDrills[0]?.phrase ??
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

  const embedUrl = useMemo(() => {
    const parameters = new URLSearchParams({
      start: String(Math.floor(video.segment.startSeconds)),
      end: String(Math.ceil(video.segment.endSeconds)),
      rel: "0",
      modestbranding: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${parameters.toString()}`;
  }, [video]);

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">
      <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-start gap-3 text-xs leading-5 text-amber-100/80">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <p>
            <strong className="text-amber-200">AI draft riêng tư.</strong> Caption,
            người nói, bản dịch và timestamp có thể sai. Đối chiếu với video gốc;
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
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-300">
            {lesson.level} · {lesson.estimatedMinutes} phút
          </span>
        </div>

        <header className="mt-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
            {environment?.titleVi ?? "Giao tiếp từ video thật"}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {lesson.titleVi}
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {video.channelName} · đoạn {formatTime(video.segment.startSeconds)}–
            {formatTime(video.segment.endSeconds)}
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-emerald-300">
            <MessageCircle className="size-5" />
            <h2 className="font-black">1. Bước vào tình huống</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            {environment?.situationVi ?? lesson.preWatch.contextVi}
          </p>
          {environment ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-950 p-4">
                <p className="text-xs font-bold text-zinc-500">Vai của bạn</p>
                <p className="mt-1 font-bold">{environment.learnerRoleVi}</p>
              </div>
              <div className="rounded-2xl bg-zinc-950 p-4">
                <p className="text-xs font-bold text-zinc-500">Mục tiêu thực tế</p>
                <p className="mt-1 font-bold">{environment.realWorldGoalVi}</p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-cyan-300">
            <Headphones className="size-5" />
            <h2 className="font-black">2. Nghe lần đầu — chưa xem transcript</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Nghe để hiểu mục đích và kết quả cuộc nói chuyện. Đừng cố bắt mọi từ.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-black">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFirstListenDone(true)}
            aria-pressed={firstListenDone}
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold ${
              firstListenDone
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-cyan-500 text-zinc-950"
            }`}
          >
            <CheckCircle2 className="size-4" />
            {firstListenDone ? "Đã nghe lần đầu" : "Tôi đã nghe hết đoạn"}
          </button>

          {firstListenDone ? (
            <div className="mt-6">
              <p className="font-bold">
                {lesson.whileWatch.gistQuestion.questionVi}
              </p>
              <div className="mt-3 grid gap-2">
                {lesson.whileWatch.gistQuestion.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGistAnswer(index)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      gistAnswer === index
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                        : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {gistAnswer !== null ? (
                <p className="mt-3 text-xs text-zinc-500">
                  Đây chỉ là kiểm tra hiểu nhanh; đáp án không quyết định hoàn
                  thành bài.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-amber-300">
            <Lightbulb className="size-5" />
            <h2 className="font-black">3. Mở hỗ trợ khi thật sự cần</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Hỗ trợ được mở từng lớp. Mức cao nhất mới hiện lời thoại và nghĩa tiếng
            Việt.
          </p>

          <div className="mt-5 rounded-2xl bg-zinc-950 p-4">
            {supportLevel === 0 ? (
              <p className="text-sm text-zinc-500">Chưa mở hỗ trợ.</p>
            ) : null}
            {supportLevel >= 1 ? (
              <p className="text-sm leading-6 text-zinc-300">
                <strong>Bối cảnh:</strong> {lesson.preWatch.contextVi}
              </p>
            ) : null}
            {supportLevel >= 2 && firstKeyword ? (
              <p className="mt-3 text-sm text-zinc-300">
                <strong>Từ khóa:</strong> {firstKeyword}
              </p>
            ) : null}
            {supportLevel >= 3 ? (
              <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {lesson.transcript.map((segment) => (
                  <div key={segment.index}>
                    <p className="text-xs font-bold text-emerald-400">
                      {segment.speaker} · {formatTime(segment.startTime)}
                    </p>
                    <p className="mt-1 text-sm text-white">{segment.textEn}</p>
                    <p className="mt-1 text-sm text-zinc-500">{segment.textVi}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={supportLevel >= 3}
              onClick={() =>
                setSupportLevel((current) =>
                  Math.min(3, current + 1) as SupportLevel,
                )
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-400/30 px-3 text-sm font-bold text-amber-200 disabled:opacity-40"
            >
              <Eye className="size-4" /> Mở thêm hỗ trợ
            </button>
            {supportLevel > 0 ? (
              <button
                type="button"
                onClick={() => setSupportLevel(0)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-700 px-3 text-sm text-zinc-400"
              >
                <EyeOff className="size-4" /> Ẩn hỗ trợ
              </button>
            ) : null}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-purple-300">
            <RefreshCw className="size-5" />
            <h2 className="font-black">4. Tự nhớ lại câu hữu ích</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Hãy che đáp án, thử nói hoặc viết lại câu phù hợp trước khi bấm xem.
          </p>
          <div className="mt-5 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-5 text-center">
            {answerVisible ? (
              <p className="text-lg font-black text-white">{targetPhrase}</p>
            ) : (
              <p className="text-sm text-zinc-500">Đáp án đang được ẩn</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setRetrievalAttempted(true);
              setAnswerVisible((visible) => !visible);
            }}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-purple-500 px-4 text-sm font-black"
          >
            {answerVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {answerVisible ? "Ẩn lại và thử lần nữa" : "Tôi đã thử — xem đáp án"}
          </button>
        </section>

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-rose-300">
            <Volume2 className="size-5" />
            <h2 className="font-black">5. Nói thành tiếng</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Nói câu trên thành tiếng theo cách tự nhiên của bạn. AtoEnglish không
            chấm phát âm và không cần quyền microphone để hoàn thành bước này.
          </p>
          <button
            type="button"
            onClick={() => setSpeakConfirmed(true)}
            aria-pressed={speakConfirmed}
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-black ${
              speakConfirmed
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-rose-500 text-white"
            }`}
          >
            <CheckCircle2 className="size-4" />
            {speakConfirmed ? "Đã xác nhận lượt nói" : "Tôi đã nói thành tiếng"}
          </button>
        </section>

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-teal-300">
            <Sparkles className="size-5" />
            <h2 className="font-black">6. Thử trong tình huống đã thay đổi</h2>
          </div>
          <p className="mt-4 font-bold text-white">
            {transfer?.situationVi ?? "Dùng câu vừa học trong một tình huống khác."}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {transfer?.promptVi ??
              "Thay đổi người nghe hoặc thông tin, rồi tự tạo lượt nói phù hợp."}
          </p>
          {transfer?.successCriteriaVi?.length ? (
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {transfer.successCriteriaVi.map((criterion) => (
                <li key={criterion} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-400" />
                  {criterion}
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            onClick={() => setTransferAttempted(true)}
            aria-pressed={transferAttempted}
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-black ${
              transferAttempted
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-teal-500 text-zinc-950"
            }`}
          >
            <CheckCircle2 className="size-4" />
            {transferAttempted
              ? "Đã xác nhận lượt transfer"
              : "Tôi đã thử trả lời tình huống mới"}
          </button>
        </section>

        <section
          className={`mt-7 rounded-3xl border p-6 text-center ${
            completed
              ? "border-emerald-400/30 bg-emerald-400/10"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 className="mx-auto size-10 text-emerald-400" />
              <h2 className="mt-4 text-2xl font-black">
                Bạn đã hoàn thành lượt luyện tập này
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                Đây là bằng chứng luyện tập ngay lúc này, chưa chứng minh ghi nhớ
                lâu dài, độ trôi chảy hay phát âm chính xác.
              </p>
              <Link
                href="/real-talk/create"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 font-bold text-zinc-950"
              >
                Tạo bài từ video khác
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-black">Chưa thể hoàn thành</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Cần nghe lần đầu, thử nhớ lại câu, nói thành tiếng và làm transfer.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

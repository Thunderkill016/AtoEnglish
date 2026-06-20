"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, Volume2, RotateCcw, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { sendConversationTurn, type ConvMessage } from "@/app/actions/ai-conversation";
import { toast } from "sonner";

const SCENARIOS = [
  { id: "free", label: "Tự do", emoji: "💬", desc: "Nói về bất kỳ chủ đề nào" },
  { id: "job", label: "Phỏng vấn", emoji: "💼", desc: "Luyện phỏng vấn xin việc", prompt: "Job interview in English. You are the interviewer asking about the candidate's experience and skills." },
  { id: "travel", label: "Du lịch", emoji: "✈️", desc: "Tình huống khi đi du lịch", prompt: "Travel scenario. You are a helpful hotel receptionist or tourist guide." },
  { id: "shopping", label: "Mua sắm", emoji: "🛍️", desc: "Mua sắm bằng tiếng Anh", prompt: "Shopping scenario. You are a friendly shop assistant helping a customer find products." },
  { id: "cafe", label: "Café", emoji: "☕", desc: "Giao tiếp tại quán cà phê", prompt: "Coffee shop scenario. You are a friendly barista taking orders and chatting." },
];

interface MessageBubble extends ConvMessage {
  id: string;
  feedback_vn?: string | null;
  corrections?: { original: string; fixed: string; note_vn: string }[];
  score?: number;
}

function FeedbackPanel({ msg }: { msg: MessageBubble }) {
  const [open, setOpen] = useState(false);
  if (!msg.corrections?.length && !msg.feedback_vn) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
      >
        <AlertCircle size={12} />
        {open ? "Ẩn phản hồi" : "Xem phản hồi AI"}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
              {msg.feedback_vn && <p className="text-xs text-amber-200">{msg.feedback_vn}</p>}
              {msg.corrections?.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-red-400 line-through shrink-0">{c.original}</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-emerald-400 font-bold shrink-0">{c.fixed}</span>
                  <span className="text-zinc-400 italic">{c.note_vn}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AIFreeTalk() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [sessionScore, setSessionScore] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const startSession = () => {
    const opening: MessageBubble = {
      id: crypto.randomUUID(),
      role: "ai",
      text: selectedScenario.id === "free"
        ? "Hello! I'm your AI conversation partner. Let's practice English together! Tell me about yourself — what's your name and what do you do?"
        : `Hello! Welcome. ${selectedScenario.id === "job" ? "Please have a seat. Can you start by telling me a bit about yourself and your background?" : selectedScenario.id === "travel" ? "Welcome! How can I help you today?" : selectedScenario.id === "shopping" ? "Hi there! Welcome to our store. Are you looking for anything in particular?" : "Hi! What can I get for you today?"}`,
    };
    setMessages([opening]);
    setStarted(true);
    setTimeout(() => playTTS(opening.text), 300);
  };

  const startRecording = () => {
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ??
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói");
      return;
    }
    const rec = new SpeechRecognitionAPI();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0][0].transcript;
      setTranscript(t);
      setIsRecording(false);
      sendTurn(t);
    };
    rec.onerror = () => { toast.error("Không nhận được giọng nói. Thử lại."); setIsRecording(false); };
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
    setTranscript("");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const sendTurn = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: MessageBubble = { id: crypto.randomUUID(), role: "user", text: userText };
    setMessages(prev => [...prev, userMsg]);

    const history: ConvMessage[] = messages.map(m => ({ role: m.role, text: m.text }));

    startTransition(async () => {
      const res = await sendConversationTurn(
        userText,
        selectedScenario.prompt,
        "A1",
        history
      );

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      setSessionScore(prev => [...prev, res.score]);

      const aiMsg: MessageBubble = {
        id: crypto.randomUUID(),
        role: "ai",
        text: res.aiReply,
      };

      // Update user message with feedback
      setMessages(prev => {
        const updated = [...prev];
        const lastUser = updated.findLastIndex(m => m.role === "user" && m.id === userMsg.id);
        if (lastUser !== -1) {
          updated[lastUser] = {
            ...updated[lastUser],
            feedback_vn: res.feedback_vn,
            corrections: res.corrections,
            score: res.score,
          };
        }
        return [...updated, aiMsg];
      });

      setTimeout(() => playTTS(res.aiReply), 200);
    });
  };

  const avgScore = sessionScore.length
    ? Math.round(sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length)
    : null;

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    setMessages([]);
    setTranscript("");
    setIsRecording(false);
    setSessionScore([]);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-teal-600 mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">AI Free Talk</h2>
          <p className="text-zinc-400 text-sm">Nói chuyện thực với AI — phản hồi tức thì bằng tiếng Việt</p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Chọn tình huống</p>
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                selectedScenario.id === s.id
                  ? "bg-violet-600/20 border-violet-500/40 text-white"
                  : "bg-white/3 border-zinc-800/60 text-zinc-400 hover:bg-white/5"
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div className="text-left">
                <p className="font-bold text-sm">{s.label}</p>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </div>
              {selectedScenario.id === s.id && <CheckCircle size={16} className="ml-auto text-violet-400" />}
            </button>
          ))}
        </div>

        <button
          onClick={startSession}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-teal-600 text-white font-black text-sm hover:from-violet-500 hover:to-teal-500 transition-all"
        >
          Bắt đầu hội thoại 🎤
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedScenario.emoji}</span>
          <div>
            <p className="font-bold text-white text-sm">{selectedScenario.label}</p>
            <p className="text-[10px] text-zinc-500">{messages.length} tin nhắn</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {avgScore !== null && (
            <div className={`text-xs font-black px-2 py-1 rounded-full ${avgScore >= 80 ? "text-emerald-400 bg-emerald-950/40" : avgScore >= 60 ? "text-amber-400 bg-amber-950/40" : "text-red-400 bg-red-950/40"}`}>
              Avg {avgScore}
            </div>
          )}
          <button onClick={handleReset} className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="min-h-[300px] max-h-[45vh] overflow-y-auto space-y-3 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.role === "ai" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-teal-600 flex items-center justify-center">
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold">AI</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-zinc-800/60 border border-zinc-700/40 text-zinc-200"
                    : "bg-gradient-to-br from-violet-600/80 to-teal-600/80 text-white"
                }`}>
                  {msg.text}
                  {msg.role === "ai" && (
                    <button
                      onClick={() => playTTS(msg.text)}
                      className="ml-2 inline-flex items-center text-zinc-500 hover:text-teal-400 transition-colors"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
                {msg.role === "user" && msg.score !== undefined && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={`text-[10px] font-bold ${msg.score >= 80 ? "text-emerald-400" : msg.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {msg.score}/100
                    </span>
                  </div>
                )}
                {msg.role === "user" && <FeedbackPanel msg={msg} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/40">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-violet-400"
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Transcript preview */}
      {transcript && (
        <div className="px-4 py-2 rounded-xl bg-white/5 border border-zinc-800 text-zinc-400 text-sm italic">
          &ldquo;{transcript}&rdquo;
        </div>
      )}

      {/* Record button */}
      <div className="flex flex-col items-center gap-2">
        <motion.button
          id="free-talk-mic"
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          disabled={isPending}
          whileTap={{ scale: 0.92 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
            isRecording
              ? "bg-red-600 shadow-red-600/40"
              : isPending
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-gradient-to-br from-violet-600 to-teal-600 hover:from-violet-500 hover:to-teal-500 shadow-violet-600/30"
          }`}
        >
          {isRecording ? (
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <MicOff size={28} className="text-white" />
            </motion.div>
          ) : (
            <Mic size={28} className="text-white" />
          )}
        </motion.button>
        <p className="text-xs text-zinc-500">
          {isRecording ? "Đang nghe... thả để gửi" : isPending ? "AI đang trả lời..." : "Nhấn giữ để nói"}
        </p>
      </div>
    </div>
  );
}

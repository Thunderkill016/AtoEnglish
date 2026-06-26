"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  VOWELS,
  CONSONANTS,
  ALL_SOUNDS,
  type IpaSound,
} from "@/lib/data/ipa-sounds";
import { SecondaryPageShell } from "@/components/design-system";

const STORAGE_KEY = "ato-ipa-mastered";

type FilterMode = "all" | "vowel" | "consonant" | "hard";

export default function PronunciationClient() {
  const [selected, setSelected] = useState<IpaSound | null>(null);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterMode>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load mastered from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setMastered(new Set(JSON.parse(saved) as string[]));
    } catch { /* ignore */ }
  }, []);

  function saveMastered(next: Set<string>) {
    setMastered(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch { /* ignore */ }
  }

  function toggleMastered(id: string) {
    const next = new Set(mastered);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    saveMastered(next);
  }

  // Web Speech API — speak example word
  const speak = useCallback((sound: IpaSound) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    const utt = new SpeechSynthesisUtterance(sound.exampleWord);
    utt.lang = "en-US";
    utt.rate = 0.8;
    utt.pitch = 1;
    // Try to pick a native English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Microsoft") || v.localService === false)
    ) ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
    if (enVoice) utt.voice = enVoice;
    utt.onend = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utt);
  }, []);

  // Record user voice
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = URL.createObjectURL(blob);
        setHasRecording(true);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setHasRecording(false);
    } catch { /* microphone denied */ }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const playRecording = useCallback(() => {
    if (!audioUrlRef.current) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(audioUrlRef.current);
    audioRef.current = audio;
    setIsPlayingBack(true);
    audio.onended = () => setIsPlayingBack(false);
    audio.onerror = () => setIsPlayingBack(false);
    audio.play();
  }, []);

  // Filtered sounds
  const filteredVowels = filter === "consonant"
    ? []
    : filter === "hard"
      ? VOWELS.filter((s) => s.difficulty === "hard")
      : VOWELS;

  const filteredConsonants = filter === "vowel"
    ? []
    : filter === "hard"
      ? CONSONANTS.filter((s) => s.difficulty === "hard")
      : CONSONANTS;

  const masteredCount = ALL_SOUNDS.filter((s) => mastered.has(s.id)).length;
  const totalCount = ALL_SOUNDS.length;

  const DIFFICULTY_COLOR = {
    easy: "#10b981",
    medium: "#f59e0b",
    hard: "#ef4444",
  };

  const DIFFICULTY_LABEL = {
    easy: "Dễ",
    medium: "Vừa",
    hard: "Khó",
  };

  function SoundCard({ sound }: { sound: IpaSound }) {
    const isMastered = mastered.has(sound.id);
    const isSelected = selected?.id === sound.id;
    return (
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setSelected(isSelected ? null : sound);
          setHasRecording(false);
          setIsRecording(false);
        }}
        style={{
          background: isSelected
            ? `${DIFFICULTY_COLOR[sound.difficulty]}20`
            : isMastered
              ? "#10b98110"
              : "#111118",
          border: `1.5px solid ${isSelected
            ? DIFFICULTY_COLOR[sound.difficulty]
            : isMastered
              ? "#10b98150"
              : "#27272a"}`,
          borderRadius: 12,
          padding: "10px 6px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          position: "relative",
        }}
      >
        {isMastered && (
          <CheckCircle2
            size={10}
            color="#10b981"
            style={{ position: "absolute", top: 4, right: 4 }}
          />
        )}
        <span
          style={{
            fontSize: 22,
            fontFamily: "monospace",
            fontWeight: 700,
            color: isSelected ? DIFFICULTY_COLOR[sound.difficulty] : "#fafafa",
            lineHeight: 1,
          }}
        >
          {sound.symbol}
        </span>
        <span style={{ fontSize: 9, color: "#52525b", fontWeight: 600 }}>
          {sound.exampleWord}
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: DIFFICULTY_COLOR[sound.difficulty],
            marginTop: 2,
          }}
        />
      </motion.button>
    );
  }

  return (
    <SecondaryPageShell
      title="44 Âm IPA Tiếng Anh"
      subtitle="Nhấn vào âm để xem hướng dẫn · Nghe audio · Luyện giọng"
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }} className="pb-16">

        {/* Progress bar */}
        <div
          style={{
            background: "#111118",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#a1a1aa", fontWeight: 600 }}>Đã thuộc</span>
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>
                {masteredCount}/{totalCount}
              </span>
            </div>
            <div style={{ height: 6, background: "#27272a", borderRadius: 99, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(masteredCount / totalCount) * 100}%` }}
                transition={{ duration: 0.6 }}
                style={{ height: "100%", background: "#10b981", borderRadius: 99 }}
              />
            </div>
          </div>
          <button
            onClick={() => saveMastered(new Set())}
            title="Reset tiến độ"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <RotateCcw size={14} color="#52525b" />
          </button>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
            marginBottom: 18,
          }}
        >
          {(
            [
              { key: "all", label: "Tất cả", count: ALL_SOUNDS.length },
              { key: "vowel", label: "Vowels", count: VOWELS.length },
              { key: "consonant", label: "Consonants", count: CONSONANTS.length },
              { key: "hard", label: "🇻🇳 Khó", count: ALL_SOUNDS.filter(s => s.difficulty === "hard").length },
            ] as { key: FilterMode; label: string; count: number }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key ? "#10b981" : "#111118",
                border: `1px solid ${filter === f.key ? "#10b981" : "#27272a"}`,
                borderRadius: 10,
                padding: "8px 4px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: filter === f.key ? "#fff" : "#a1a1aa" }}>
                {f.label}
              </span>
              <span style={{ fontSize: 10, color: filter === f.key ? "rgba(255,255,255,0.7)" : "#52525b" }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Difficulty legend */}
        <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          {(["easy", "medium", "hard"] as const).map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: DIFFICULTY_COLOR[d] }} />
              <span style={{ fontSize: 10, color: "#71717a" }}>{DIFFICULTY_LABEL[d]}</span>
            </div>
          ))}
        </div>

        {/* Vowels section */}
        {filteredVowels.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#71717a", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Nguyên âm (Vowels) — {filteredVowels.length} âm
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {filteredVowels.map((s) => (
                <SoundCard key={s.id} sound={s} />
              ))}
            </div>
          </div>
        )}

        {/* Consonants section */}
        {filteredConsonants.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#71717a", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Phụ âm (Consonants) — {filteredConsonants.length} âm
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {filteredConsonants.map((s) => (
                <SoundCard key={s.id} sound={s} />
              ))}
            </div>
          </div>
        )}

        {/* Detail panel (slide up) */}
        <AnimatePresence>
          {selected && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  zIndex: 40,
                }}
              />

              {/* Panel */}
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "#111118",
                  borderTop: `2px solid ${DIFFICULTY_COLOR[selected.difficulty]}`,
                  borderRadius: "20px 20px 0 0",
                  padding: "20px 20px 40px",
                  zIndex: 50,
                  maxHeight: "85dvh",
                  overflowY: "auto",
                  maxWidth: 520,
                  margin: "0 auto",
                }}
              >
                {/* Handle bar */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <div style={{ width: 40, height: 4, borderRadius: 99, background: "#27272a" }} />
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: "#1c1c24",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                    padding: 6,
                    cursor: "pointer",
                  }}
                >
                  <X size={14} color="#71717a" />
                </button>

                {/* Sound header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 16,
                      background: `${DIFFICULTY_COLOR[selected.difficulty]}15`,
                      border: `2px solid ${DIFFICULTY_COLOR[selected.difficulty]}50`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: DIFFICULTY_COLOR[selected.difficulty],
                      flexShrink: 0,
                    }}
                  >
                    {selected.symbol}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: DIFFICULTY_COLOR[selected.difficulty], fontWeight: 700, marginBottom: 2 }}>
                      {selected.subtype} · {DIFFICULTY_LABEL[selected.difficulty]}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fafafa", marginBottom: 2 }}>
                      {selected.exampleWord}
                    </div>
                    <div style={{ fontSize: 14, color: "#71717a", fontFamily: "monospace" }}>
                      {selected.exampleIpa}
                    </div>
                    <div style={{ fontSize: 12, color: "#52525b" }}>
                      {selected.exampleVn}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {/* Listen */}
                  <button
                    onClick={() => speak(selected)}
                    disabled={isPlaying}
                    style={{
                      flex: 1,
                      background: isPlaying ? "#27272a" : "#10b98120",
                      border: "1px solid #10b98140",
                      borderRadius: 10,
                      padding: "10px",
                      cursor: isPlaying ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      color: "#10b981",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <Volume2 size={15} />
                    {isPlaying ? "Đang phát..." : "Nghe"}
                  </button>

                  {/* Record */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    style={{
                      flex: 1,
                      background: isRecording ? "#ef444420" : "#3b82f620",
                      border: `1px solid ${isRecording ? "#ef444440" : "#3b82f640"}`,
                      borderRadius: 10,
                      padding: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      color: isRecording ? "#ef4444" : "#3b82f6",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {isRecording ? <Square size={15} /> : <Mic size={15} />}
                    {isRecording ? "Dừng" : "Ghi âm"}
                  </button>

                  {/* Playback */}
                  {hasRecording && (
                    <button
                      onClick={playRecording}
                      disabled={isPlayingBack}
                      style={{
                        flex: 1,
                        background: "#8b5cf620",
                        border: "1px solid #8b5cf640",
                        borderRadius: 10,
                        padding: "10px",
                        cursor: isPlayingBack ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        color: "#8b5cf6",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <Play size={15} />
                      {isPlayingBack ? "..." : "Nghe lại"}
                    </button>
                  )}
                </div>

                {/* Record hint */}
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: "#ef444410",
                      border: "1px solid #ef444430",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: "#ef4444" }}>
                      Đang ghi âm... Phát âm &quot;{selected.exampleWord}&quot; rồi nhấn Dừng
                    </span>
                  </motion.div>
                )}

                {/* How to pronounce */}
                <div
                  style={{
                    background: "#0d1117",
                    borderRadius: 12,
                    padding: "12px",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 11, color: "#71717a", fontWeight: 700, marginBottom: 6 }}>
                    🗣️ CÁCH PHÁT ÂM
                  </div>
                  <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6, margin: 0 }}>
                    {selected.howTo}
                  </p>
                </div>

                {/* Vietnamese tip */}
                {selected.vietnameseTip && (
                  <div
                    style={{
                      background: "#f59e0b10",
                      border: "1px solid #f59e0b30",
                      borderRadius: 12,
                      padding: "12px",
                      marginBottom: 10,
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, marginBottom: 3 }}>
                        ⚠️ LỖI HAY GẶP (người Việt)
                      </div>
                      <p style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5, margin: 0 }}>
                        {selected.vietnameseTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* More examples */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#71717a", fontWeight: 700, marginBottom: 8 }}>
                    📝 THÊM VÍ DỤ
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[selected.exampleWord, ...selected.moreExamples].map((word) => (
                      <button
                        key={word}
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          const utt = new SpeechSynthesisUtterance(word);
                          utt.lang = "en-US";
                          utt.rate = 0.85;
                          window.speechSynthesis.speak(utt);
                        }}
                        style={{
                          background: "#1c1c24",
                          border: "1px solid #27272a",
                          borderRadius: 8,
                          padding: "5px 10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: "#e4e4e7",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <Volume2 size={10} color="#52525b" />
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation: prev/next */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {(() => {
                    const all = ALL_SOUNDS;
                    const idx = all.findIndex((s) => s.id === selected.id);
                    const prev = all[idx - 1];
                    const next = all[idx + 1];
                    return (
                      <>
                        {prev && (
                          <button
                            onClick={() => { setSelected(prev); setHasRecording(false); }}
                            style={{
                              flex: 1,
                              background: "#1c1c24",
                              border: "1px solid #27272a",
                              borderRadius: 10,
                              padding: "8px 12px",
                              cursor: "pointer",
                              color: "#a1a1aa",
                              fontSize: 11,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            ← <span style={{ fontFamily: "monospace" }}>{prev.symbol}</span> {prev.exampleWord}
                          </button>
                        )}
                        {next && (
                          <button
                            onClick={() => { setSelected(next); setHasRecording(false); }}
                            style={{
                              flex: 1,
                              background: "#1c1c24",
                              border: "1px solid #27272a",
                              borderRadius: 10,
                              padding: "8px 12px",
                              cursor: "pointer",
                              color: "#a1a1aa",
                              fontSize: 11,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 6,
                            }}
                          >
                            <span style={{ fontFamily: "monospace" }}>{next.symbol}</span> {next.exampleWord} →
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Mark as mastered */}
                <button
                  onClick={() => toggleMastered(selected.id)}
                  style={{
                    width: "100%",
                    background: mastered.has(selected.id) ? "#10b98120" : "#27272a",
                    border: `1.5px solid ${mastered.has(selected.id) ? "#10b981" : "#3f3f46"}`,
                    borderRadius: 12,
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    color: mastered.has(selected.id) ? "#10b981" : "#a1a1aa",
                    fontSize: 13,
                    fontWeight: 700,
                    transition: "all 0.15s",
                  }}
                >
                  <CheckCircle2 size={16} />
                  {mastered.has(selected.id) ? "✓ Đã thuộc — bỏ đánh dấu" : "Đánh dấu đã thuộc"}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </SecondaryPageShell>
  );
}

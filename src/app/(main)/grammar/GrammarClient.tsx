"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, BookOpen, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import {
  GRAMMAR_TOPICS,
  LEVEL_COLORS,
  LEVEL_BG,
  type GrammarLevel,
  type GrammarTopic,
} from "@/lib/data/grammar-topics";

const LEVELS: GrammarLevel[] = ["A1", "A2", "B1", "B2"];

const LEVEL_LABEL: Record<GrammarLevel, string> = {
  A1: "A1 · Beginner",
  A2: "A2 · Elementary",
  B1: "B1 · Intermediate",
  B2: "B2 · Upper-Intermediate",
};

export default function GrammarClient() {
  const [activeLevel, setActiveLevel] = useState<GrammarLevel>("A1");
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const filtered = GRAMMAR_TOPICS.filter(t => t.level === activeLevel);

  return (
    <div style={{ minHeight: "100dvh", background: "#09090b", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#10b98115", border: "1px solid #10b98130",
            borderRadius: 20, padding: "4px 12px",
            fontSize: 11, fontWeight: 700, color: "#10b981",
            textTransform: "uppercase", letterSpacing: "0.08em",
            marginBottom: 10,
          }}>
            <BookOpen size={12} /> Grammar Reference
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fafafa", marginBottom: 6 }}>
            Ngữ Pháp A1 → B2
          </h1>
          <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.5 }}>
            Giải thích tiếng Việt · Ví dụ thực tế · Lỗi hay gặp · Mẹo nhớ
          </p>
        </div>

        {/* Level tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {LEVELS.map(lvl => {
            const active = lvl === activeLevel;
            return (
              <button
                key={lvl}
                onClick={() => { setActiveLevel(lvl); setOpenTopic(null); }}
                style={{
                  flex: 1, padding: "8px 4px",
                  borderRadius: 10, border: `1.5px solid ${active ? LEVEL_COLORS[lvl] : "#27272a"}`,
                  background: active ? LEVEL_BG[lvl] : "transparent",
                  color: active ? LEVEL_COLORS[lvl] : "#52525b",
                  fontSize: 12, fontWeight: 800, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Level label */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: LEVEL_COLORS[activeLevel],
          textTransform: "uppercase", letterSpacing: "0.08em",
          marginBottom: 12,
        }}>
          {LEVEL_LABEL[activeLevel]} · {filtered.length} chủ đề
        </div>

        {/* Topic list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {filtered.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isOpen={openTopic === topic.id}
                onToggle={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
                color={LEVEL_COLORS[activeLevel]}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  isOpen,
  onToggle,
  color,
}: {
  topic: GrammarTopic;
  isOpen: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <div style={{
      background: "#111118",
      border: `1px solid ${isOpen ? color + "50" : "#27272a"}`,
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22, flexShrink: 0 }}>{topic.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fafafa", marginBottom: 2 }}>
            {topic.title}
          </div>
          <div style={{ fontSize: 11, color: "#52525b", fontWeight: 600 }}>
            {topic.subtitleEn}
          </div>
        </div>
        <div style={{
          color: isOpen ? color : "#52525b",
          transition: "all 0.2s",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}>
          <ChevronDown size={16} />
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Divider */}
              <div style={{ height: 1, background: "#1c1c24" }} />

              {/* Explanation */}
              <div>
                <div style={{ fontSize: 11, color: color, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  📌 Giải thích
                </div>
                <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6, margin: 0 }}>
                  {topic.explanation}
                </p>
              </div>

              {/* Structure formula */}
              <div style={{
                background: `${color}08`, border: `1px solid ${color}25`,
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 10, color: color, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>
                  📐 Cấu trúc
                </div>
                <code style={{ fontSize: 12, color: "#e4e4e7", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
                  {topic.structure}
                </code>
              </div>

              {/* Rules */}
              <div>
                <div style={{ fontSize: 11, color: color, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  📋 Quy tắc
                </div>
                {topic.rules.map((rule, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: `${color}20`, border: `1px solid ${color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 800, color, flexShrink: 0, marginTop: 1,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Examples */}
              <div>
                <div style={{ fontSize: 11, color: color, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ✏️ Ví dụ
                </div>
                {topic.examples.map((ex, i) => (
                  <div key={i} style={{
                    background: "#0d0d14", borderRadius: 8, padding: "10px 12px",
                    marginBottom: 6, borderLeft: `3px solid ${color}`,
                  }}>
                    <div style={{ fontSize: 13, color: "#fafafa", fontWeight: 600, marginBottom: 3 }}>
                      {ex.en}
                    </div>
                    <div style={{ fontSize: 12, color: "#52525b" }}>
                      {ex.vn}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mistakes */}
              <div>
                <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ❌ Lỗi Hay Gặp
                </div>
                {topic.mistakes.map((m, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.6, marginBottom: 4 }}>
                    {m}
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div style={{
                background: "#f59e0b08", border: "1px solid #f59e0b25",
                borderRadius: 10, padding: "10px 12px",
                display: "flex", gap: 8, alignItems: "flex-start",
              }}>
                <Lightbulb size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>
                  <strong style={{ color: "#f59e0b" }}>Mẹo: </strong>{topic.tip}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

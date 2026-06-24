"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
  Target,
  BookOpen,
  Mic,
  CheckCircle2,
  Circle,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import {
  STUDY_PHASES,
  DAILY_TIPS,
  getPhaseForLevel,
  getPhaseProgress,
  type StudyPhase,
} from "@/lib/constants/study-plan";
import { UNITS } from "@/lib/constants/units";

interface Props {
  nextUnitRoute: string;
  userLevel: string;
  completedUnitIds: string[];
}

type TabKey = "milestones" | "routine" | "resources" | "tips";

const SKILL_COLORS: Record<string, string> = {
  pronunciation: "#f59e0b",
  vocabulary: "#8b5cf6",
  grammar: "#3b82f6",
  listening: "#10b981",
  speaking: "#ef4444",
  reading: "#06b6d4",
  writing: "#ec4899",
};

const RESOURCE_TYPE_ICON: Record<string, string> = {
  app: "📱",
  website: "🌐",
  book: "📚",
  youtube: "▶️",
  podcast: "🎧",
};

export default function RoadmapClient({
  nextUnitRoute,
  userLevel,
  completedUnitIds,
}: Props) {
  const currentPhase = getPhaseForLevel(userLevel);
  const [expandedPhase, setExpandedPhase] = useState<number>(currentPhase.id);
  const [activeTab, setActiveTab] = useState<Record<number, TabKey>>({});
  const todayTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length]!;

  const allUnits = UNITS.map((u) => ({ id: u.id, level: u.level }));

  function getTab(phaseId: number): TabKey {
    return activeTab[phaseId] ?? "milestones";
  }

  function setTab(phaseId: number, tab: TabKey) {
    setActiveTab((prev) => ({ ...prev, [phaseId]: tab }));
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#09090b",
        paddingBottom: 100,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "24px 16px 0",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 20 }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fafafa",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 6,
            }}
          >
            🗺️ Lộ Trình A0 → B2
          </h1>
          <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.5 }}>
            4 giai đoạn · 12–18 tháng · Thiết kế cho người Việt mục tiêu SaaS &amp; business
          </p>
        </motion.div>

        {/* Current level badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "#111118",
            border: `1px solid ${currentPhase.color}40`,
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${currentPhase.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {currentPhase.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: currentPhase.color, fontWeight: 700, marginBottom: 2 }}>
              LEVEL HIỆN TẠI: {userLevel}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa" }}>
              {currentPhase.title} — {currentPhase.months}
            </div>
            <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>
              Mục tiêu: {currentPhase.cefrFrom} → {currentPhase.cefrTo}
            </div>
          </div>
          <Link
            href={nextUnitRoute}
            style={{
              background: currentPhase.color,
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <Play size={12} />
            Học
          </Link>
        </motion.div>

        {/* Daily tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "#0d1117",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 24,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.6, margin: 0 }}>
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>Tip hôm nay: </span>
            {todayTip}
          </p>
        </motion.div>

        {/* ── Phase Cards ────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STUDY_PHASES.map((phase, idx) => {
            const isExpanded = expandedPhase === phase.id;
            const isCurrentPhase = phase.id === currentPhase.id;
            const progress = getPhaseProgress(
              phase.cefrTo,
              completedUnitIds,
              allUnits
            );
            const tab = getTab(phase.id);

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  background: "#111118",
                  border: `1px solid ${isCurrentPhase ? phase.color + "60" : "#27272a"}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: isCurrentPhase ? `0 0 0 1px ${phase.color}30` : "none",
                }}
              >
                {/* Phase header */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? 0 : phase.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "16px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Emoji badge */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${phase.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                        border: isCurrentPhase ? `1px solid ${phase.color}50` : "none",
                      }}
                    >
                      {phase.emoji}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: phase.color,
                            background: `${phase.color}15`,
                            padding: "2px 7px",
                            borderRadius: 20,
                          }}
                        >
                          Phase {phase.id} · {phase.months}
                        </span>
                        {isCurrentPhase && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#10b981",
                              background: "#10b98120",
                              padding: "2px 7px",
                              borderRadius: 20,
                            }}
                          >
                            ← Đang ở đây
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#fafafa",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {phase.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>
                        {phase.cefrFrom} → {phase.cefrTo} · {phase.vocabTarget.toLocaleString()} từ · {phase.dailyMinutes} phút/ngày
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div style={{ fontSize: 12, color: "#52525b" }}>
                        {progress.completed}/{progress.total}
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} color="#52525b" />
                      ) : (
                        <ChevronDown size={16} color="#52525b" />
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      marginTop: 12,
                      height: 4,
                      background: "#27272a",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percent}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      style={{
                        height: "100%",
                        background: phase.color,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 4, textAlign: "right" }}>
                    {progress.percent}% hoàn thành
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          borderTop: "1px solid #27272a",
                          padding: "16px",
                        }}
                      >
                        {/* Goal */}
                        <div
                          style={{
                            background: `${phase.color}10`,
                            border: `1px solid ${phase.color}30`,
                            borderRadius: 10,
                            padding: "10px 12px",
                            marginBottom: 14,
                          }}
                        >
                          <div style={{ fontSize: 11, color: phase.color, fontWeight: 700, marginBottom: 3 }}>
                            🎯 MỤC TIÊU GIAI ĐOẠN
                          </div>
                          <div style={{ fontSize: 13, color: "#e4e4e7", lineHeight: 1.5 }}>
                            {phase.goal}
                          </div>
                        </div>

                        {/* Tab nav */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 4,
                            marginBottom: 16,
                          }}
                        >
                          {(
                            [
                              { key: "milestones", label: "Milestones", icon: "🏆" },
                              { key: "routine", label: "Daily Plan", icon: "⏱️" },
                              { key: "resources", label: "Tài nguyên", icon: "📚" },
                              { key: "tips", label: "Mẹo VN", icon: "🇻🇳" },
                            ] as { key: TabKey; label: string; icon: string }[]
                          ).map((t) => (
                            <button
                              key={t.key}
                              onClick={() => setTab(phase.id, t.key)}
                              style={{
                                background: tab === t.key ? phase.color : "#1c1c24",
                                border: "none",
                                borderRadius: 8,
                                padding: "7px 4px",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <span style={{ fontSize: 14 }}>{t.icon}</span>
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  color: tab === t.key ? "#fff" : "#71717a",
                                }}
                              >
                                {t.label}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Tab content */}
                        <AnimatePresence mode="wait">
                          {/* MILESTONES TAB */}
                          {tab === "milestones" && (
                            <motion.div
                              key="milestones"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                            >
                              {phase.milestones.map((ms, i) => (
                                <div
                                  key={i}
                                  style={{
                                    background: "#0d1117",
                                    borderRadius: 10,
                                    padding: "12px",
                                    marginBottom: 8,
                                    border: "1px solid #1c1c24",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: phase.color,
                                      fontWeight: 700,
                                      marginBottom: 6,
                                    }}
                                  >
                                    Tháng {ms.month}: {ms.title}
                                  </div>
                                  {ms.canDo.map((item, j) => (
                                    <div
                                      key={j}
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        alignItems: "flex-start",
                                        marginBottom: 4,
                                      }}
                                    >
                                      <CheckCircle2
                                        size={13}
                                        color={phase.color}
                                        style={{ flexShrink: 0, marginTop: 1 }}
                                      />
                                      <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.4 }}>
                                        {item}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </motion.div>
                          )}

                          {/* ROUTINE TAB */}
                          {tab === "routine" && (
                            <motion.div
                              key="routine"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                            >
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#52525b",
                                  marginBottom: 10,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Clock size={11} />
                                Tổng: {phase.dailyMinutes} phút/ngày
                              </div>
                              {phase.dailyRoutine.map((act, i) => (
                                <div
                                  key={i}
                                  style={{
                                    background: "#0d1117",
                                    borderRadius: 10,
                                    padding: "12px",
                                    marginBottom: 8,
                                    border: "1px solid #1c1c24",
                                    display: "flex",
                                    gap: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: 10,
                                      background: `${SKILL_COLORS[act.skill] ?? "#52525b"}20`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 16,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {act.icon}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: "#e4e4e7" }}>
                                        {act.title}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: SKILL_COLORS[act.skill] ?? "#52525b",
                                          fontWeight: 700,
                                          background: `${SKILL_COLORS[act.skill] ?? "#52525b"}15`,
                                          padding: "2px 6px",
                                          borderRadius: 6,
                                        }}
                                      >
                                        {act.duration}&apos;
                                      </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "#71717a", lineHeight: 1.5, margin: "4px 0 4px" }}>
                                      {act.description}
                                    </p>
                                    {act.resource && (
                                      <div style={{ fontSize: 10, color: "#52525b" }}>
                                        📍 {act.resource}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}

                          {/* RESOURCES TAB */}
                          {tab === "resources" && (
                            <motion.div
                              key="resources"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                            >
                              {phase.resources.map((res, i) => (
                                <div
                                  key={i}
                                  style={{
                                    background: "#0d1117",
                                    borderRadius: 10,
                                    padding: "12px",
                                    marginBottom: 8,
                                    border: "1px solid #1c1c24",
                                    display: "flex",
                                    gap: 10,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <span style={{ fontSize: 18, flexShrink: 0 }}>
                                    {RESOURCE_TYPE_ICON[res.type]}
                                  </span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: "#e4e4e7" }}>
                                        {res.name}
                                      </span>
                                      {res.free && (
                                        <span
                                          style={{
                                            fontSize: 9,
                                            color: "#10b981",
                                            background: "#10b98115",
                                            padding: "1px 5px",
                                            borderRadius: 4,
                                            fontWeight: 700,
                                          }}
                                        >
                                          FREE
                                        </span>
                                      )}
                                      {res.url && (
                                        <a
                                          href={res.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ color: "#52525b", lineHeight: 0 }}
                                        >
                                          <ExternalLink size={11} />
                                        </a>
                                      )}
                                    </div>
                                    <p style={{ fontSize: 12, color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                                      {res.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}

                          {/* VIETNAMESE TIPS TAB */}
                          {tab === "tips" && (
                            <motion.div
                              key="tips"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                            >
                              {phase.vietnameseTips.map((tip, i) => (
                                <div
                                  key={i}
                                  style={{
                                    background: "#0d1117",
                                    borderRadius: 10,
                                    padding: "12px",
                                    marginBottom: 8,
                                    border: "1px solid #1c1c24",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 8,
                                      marginBottom: 8,
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <AlertTriangle size={13} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                      <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, marginBottom: 2 }}>
                                        Lỗi hay gặp
                                      </div>
                                      <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.4 }}>
                                        {tip.problem}
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                      <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 2 }}>
                                        Giải pháp
                                      </div>
                                      <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.4 }}>
                                        {tip.solution}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Weekly review */}
                              <div
                                style={{
                                  background: `${phase.color}10`,
                                  border: `1px solid ${phase.color}30`,
                                  borderRadius: 10,
                                  padding: "12px",
                                  marginTop: 4,
                                }}
                              >
                                <div style={{ fontSize: 11, color: phase.color, fontWeight: 700, marginBottom: 8 }}>
                                  📋 Review Cuối Tuần
                                </div>
                                {phase.weeklyReview.map((item, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      gap: 8,
                                      marginBottom: 6,
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <Circle size={10} color={phase.color} style={{ flexShrink: 0, marginTop: 3 }} />
                                    <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.4 }}>
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Checkpoint CTA */}
                        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
                            🏁 Kiểm tra tổng hợp giai đoạn
                          </div>
                          {phase.unitLevels.map((lvl) => {
                            const lvlSlug = lvl.toLowerCase();
                            const lvlUnits = allUnits.filter(u => u.level === lvl);
                            const lvlCompleted = lvlUnits.filter(u => completedUnitIds.includes(u.id)).length;
                            const lvlTotal = lvlUnits.length;
                            const lvlUnlocked = lvlCompleted === lvlTotal && lvlTotal > 0;
                            return (
                              <Link
                                key={lvl}
                                href={`/checkpoint/${lvlSlug}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  background: lvlUnlocked ? `${phase.color}15` : "#0d1117",
                                  border: `1px solid ${lvlUnlocked ? phase.color + "50" : "#27272a"}`,
                                  borderRadius: 10,
                                  padding: "10px 14px",
                                  textDecoration: "none",
                                  transition: "all 0.15s",
                                }}
                              >
                                <Trophy size={15} color={lvlUnlocked ? phase.color : "#52525b"} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: lvlUnlocked ? "#fafafa" : "#71717a" }}>
                                    Checkpoint {lvl}
                                    {!lvlUnlocked && (
                                      <span style={{ fontSize: 10, color: "#52525b", marginLeft: 6 }}>
                                        ({lvlCompleted}/{lvlTotal} bài)
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 1 }}>
                                    {lvlUnlocked ? "✓ Mở khoá — Bắt đầu kiểm tra" : "Hoàn thành tất cả bài để mở khoá"}
                                  </div>
                                </div>
                                <span style={{ fontSize: 10, color: lvlUnlocked ? phase.color : "#3f3f46", fontWeight: 700 }}>
                                  {lvlUnlocked ? "→" : "🔒"}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: 20,
            background: "#0d1117",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 6 }}>💪</div>
          <div style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>
            Mày đã tự học web dev từ 0 để build AtoEnglish.{" "}
            <span style={{ color: "#fafafa" }}>Cùng grit đó, áp đúng phương pháp</span>{" "}
            → 12 tháng nữa mày đủ English để đưa sản phẩm ra thị trường Mỹ.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

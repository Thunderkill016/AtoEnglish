"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Phase config (từ english-roadmap.jsx) ────────────────────────────────────

interface PhaseConfig {
  id: number;
  label: string;
  title: string;
  months: string;
  cefrLabel: string;
  unitLevels: string[];
  color: string;
  goal: string;
  tip: string;
}

const PHASES: PhaseConfig[] = [
  {
    id: 1,
    label: "Phase 1",
    title: "Nền Tảng",
    months: "Tháng 1–2",
    cefrLabel: "A0/A1",
    unitLevels: ["A0", "A1"],
    color: "#3b82f6",
    goal: "Nắm phát âm, 500 từ vựng cơ bản, câu đơn giản",
    tip: "🧠 Shadowing với BBC Learning English 10 phút/ngày + Anki deck 'Frequency 5000'",
  },
  {
    id: 2,
    label: "Phase 2",
    title: "Sơ Cấp",
    months: "Tháng 3–4",
    cefrLabel: "A2",
    unitLevels: ["A2"],
    color: "#8b5cf6",
    goal: "1500 từ, đọc hiểu đoạn ngắn, viết câu ghép",
    tip: "📖 Viết nhật ký tiếng Anh 3–5 câu/ngày + VOA Learning English",
  },
  {
    id: 3,
    label: "Phase 3",
    title: "Trung Cấp",
    months: "Tháng 5–7",
    cefrLabel: "B1",
    unitLevels: ["B1"],
    color: "#f59e0b",
    goal: "3000 từ, đọc tech docs, viết đoạn văn rõ ý",
    tip: "👂 TED Talks không sub + viết GitHub commit messages bằng tiếng Anh",
  },
  {
    id: 4,
    label: "Phase 4",
    title: "Tech English",
    months: "Tháng 8–12",
    cefrLabel: "B1+",
    unitLevels: ["B2"],
    color: "#22c55e",
    goal: "Dùng tiếng Anh tự nhiên trong công việc dev",
    tip: "🎙️ Mock interview AI + tham gia Discord developer communities",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface UnitStatus {
  id: string;
  title: string;
  description: string;
  level: string;
  route: string;
  xp: number;
  estimatedTime: number;
  completed: boolean;
  progress: number;
  vocabCount?: number;
}

interface LearnClientProps {
  userLevel: string;
  completedUnitIds: string[];
  activeUnitId: string;
  unitStatuses: UnitStatus[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LearnClient({
  userLevel,
  completedUnitIds,
  activeUnitId,
  unitStatuses,
}: LearnClientProps) {
  const initialPhaseIdx = Math.max(
    PHASES.findIndex((p) => p.unitLevels.includes(userLevel)),
    0
  );
  const [activePhase, setActivePhase] = useState(initialPhaseIdx);

  const phase = PHASES[activePhase];
  const phaseUnits = unitStatuses.filter((u) =>
    phase.unitLevels.includes(u.level)
  );
  const completedInPhase = phaseUnits.filter((u) => u.completed).length;
  const totalCompleted = unitStatuses.filter((u) => u.completed).length;
  const phaseProgressPct =
    phaseUnits.length > 0
      ? Math.round((completedInPhase / phaseUnits.length) * 100)
      : 0;

  return (
    <div
      style={{
        background: "#0d1117",
        color: "#e2e8f0",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "0 0 60px 0",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)",
          borderBottom: "1px solid #21262d",
          padding: "32px 20px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#22c55e",
            fontWeight: 700,
            letterSpacing: "0.1em",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Bài Học
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            color: "#f0f6fc",
            lineHeight: 1.2,
          }}
        >
          English Từ Con Số 0
        </h1>
        <p
          style={{
            margin: "10px 0 0",
            color: "#8b949e",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Lộ trình 12 tháng · Tự học · Hướng tới dùng English cho dev work
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 20,
          }}
        >
          {[
            { val: String(totalCompleted), unit: "hoàn thành" },
            { val: String(unitStatuses.length), unit: "bài học" },
            { val: userLevel || "A0", unit: "cấp độ" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#8b949e",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Phase tabs ── */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "16px 16px 0",
          gap: 8,
          borderBottom: "1px solid #21262d",
          background: "#0d1117",
          scrollbarWidth: "none",
        }}
      >
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            id={`learn-phase-${p.id}`}
            onClick={() => setActivePhase(i)}
            style={{
              flex: "0 0 auto",
              padding: "8px 16px 12px",
              borderRadius: "8px 8px 0 0",
              border: "none",
              cursor: "pointer",
              background: activePhase === i ? "#161b22" : "transparent",
              borderBottom:
                activePhase === i
                  ? `2px solid ${p.color}`
                  : "2px solid transparent",
              color: activePhase === i ? "#f0f6fc" : "#8b949e",
              fontSize: 13,
              fontWeight: activePhase === i ? 700 : 400,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: p.color, marginRight: 4 }}>●</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Phase header ── */}
      <div
        style={{
          padding: "20px 16px 0",
          background: "#161b22",
          borderBottom: "1px solid #21262d",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              background: phase.color + "22",
              color: phase.color,
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 4,
              letterSpacing: "0.08em",
            }}
          >
            CEFR {phase.cefrLabel}
          </span>
          <span style={{ color: "#8b949e", fontSize: 13 }}>{phase.months}</span>
          <span style={{ color: "#8b949e", fontSize: 13, marginLeft: "auto" }}>
            {completedInPhase}/{phaseUnits.length} bài
          </span>
        </div>

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: 20,
            fontWeight: 800,
            color: "#f0f6fc",
          }}
        >
          {phase.title}
        </h2>
        <p style={{ margin: "0 0 12px", color: "#8b949e", fontSize: 14 }}>
          🎯 {phase.goal}
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              height: 4,
              background: "#21262d",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: phase.color,
                width: `${phaseProgressPct}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Tip box */}
        <div
          style={{
            background: phase.color + "11",
            border: `1px solid ${phase.color}44`,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
            fontSize: 13,
            color: "#c9d1d9",
            lineHeight: 1.5,
          }}
        >
          {phase.tip}
        </div>
      </div>

      {/* ── Unit list ── */}
      <div style={{ padding: "16px 16px 0" }}>
        {phaseUnits.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#8b949e",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 14 }}>
              Chưa có bài học nào cho phase này.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {phaseUnits.map((unit, idx) => {
              const isCompleted = unit.completed;
              const isActive = unit.id === activeUnitId && !isCompleted;
              const prevUnit = phaseUnits[idx - 1];
              const isUnlocked =
                idx === 0 ||
                (prevUnit !== undefined &&
                  completedUnitIds.includes(prevUnit.id));

              return (
                <div
                  key={unit.id}
                  style={{
                    background: "#161b22",
                    borderRadius: 10,
                    border: `1px solid ${
                      isActive ? phase.color + "66" : "#21262d"
                    }`,
                    padding: "14px 16px",
                    opacity: isUnlocked ? 1 : 0.55,
                    transition: "border 0.2s",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                  >
                    {/* Status node */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: isCompleted
                          ? "#22c55e22"
                          : isActive
                            ? phase.color + "22"
                            : "#21262d",
                        border: `2px solid ${
                          isCompleted
                            ? "#22c55e"
                            : isActive
                              ? phase.color
                              : "#30363d"
                        }`,
                        fontSize: 12,
                        fontWeight: 700,
                        color: isCompleted
                          ? "#22c55e"
                          : isActive
                            ? phase.color
                            : "#8b949e",
                      }}
                    >
                      {isCompleted ? "✓" : !isUnlocked ? "🔒" : String(idx + 1)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Meta badges */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            background: phase.color + "22",
                            color: phase.color,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 3,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {unit.level}
                        </span>
                        <span style={{ fontSize: 11, color: "#8b949e" }}>
                          {unit.estimatedTime} phút
                        </span>
                        {unit.vocabCount !== undefined &&
                          unit.vocabCount > 0 && (
                            <span style={{ fontSize: 11, color: "#8b949e" }}>
                              {unit.vocabCount} từ
                            </span>
                          )}
                        {unit.xp > 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#f59e0b",
                              fontWeight: 600,
                            }}
                          >
                            +{unit.xp} XP
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#f0f6fc",
                          marginBottom: 4,
                        }}
                      >
                        {unit.title}
                      </div>

                      {/* Description */}
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8b949e",
                          lineHeight: 1.4,
                          marginBottom: 12,
                        }}
                      >
                        {unit.description}
                      </div>

                      {/* In-progress bar */}
                      {isUnlocked && !isCompleted && unit.progress > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              height: 3,
                              background: "#21262d",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                background: phase.color,
                                width: `${unit.progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      {isCompleted ? (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Link
                            href={unit.route}
                            onClick={() =>
                              localStorage.removeItem(
                                `lesson-progress-${unit.id}`
                              )
                            }
                          >
                            <button
                              style={{
                                padding: "6px 12px",
                                background: "transparent",
                                border: "1px solid #30363d",
                                borderRadius: 6,
                                color: "#8b949e",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              ↺ Học lại
                            </button>
                          </Link>
                          <Link href={`/quiz?unit=${unit.id}`}>
                            <button
                              style={{
                                padding: "6px 12px",
                                background: "#8b5cf622",
                                border: "1px solid #8b5cf644",
                                borderRadius: 6,
                                color: "#a78bfa",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Quiz
                            </button>
                          </Link>
                        </div>
                      ) : isActive ? (
                        <Link href={unit.route}>
                          <button
                            style={{
                              padding: "8px 16px",
                              background: phase.color,
                              border: "none",
                              borderRadius: 6,
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ▶ Học tiếp
                          </button>
                        </Link>
                      ) : isUnlocked ? (
                        <Link href={unit.route}>
                          <button
                            style={{
                              padding: "8px 16px",
                              background: "transparent",
                              border: `1px solid ${phase.color}66`,
                              borderRadius: 6,
                              color: phase.color,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ▶ Bắt đầu
                          </button>
                        </Link>
                      ) : (
                        <button
                          disabled
                          style={{
                            padding: "6px 12px",
                            background: "transparent",
                            border: "1px solid #21262d",
                            borderRadius: 6,
                            color: "#484f58",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "not-allowed",
                          }}
                        >
                          🔒 Chưa mở khóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer consistency note */}
        <div
          style={{
            marginTop: 24,
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#f59e0b",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            ⚠️ QUAN TRỌNG HƠN NHIỀU THỨ KHÁC
          </div>
          <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.6 }}>
            Đều đặn 30 phút mỗi ngày &gt; học 3 tiếng 1 lần mỗi tuần. Không
            có trick nào bypass được consistency.
          </div>
        </div>
      </div>
    </div>
  );
}

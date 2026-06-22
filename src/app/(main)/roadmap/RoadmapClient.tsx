"use client";

import { useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────

interface Skill {
  icon: string;
  name: string;
  tasks: string[];
}

interface Phase {
  id: number;
  label: string;
  title: string;
  months: string;
  level: string;
  color: string;
  goal: string;
  skills: Skill[];
  checkpoint: string;
}

const phases: Phase[] = [
  {
    id: 1,
    label: "Phase 1",
    title: "Nền Tảng",
    months: "Tháng 1–2",
    level: "A1",
    color: "#3b82f6",
    goal: "Nắm phát âm, 500 từ vựng cơ bản, câu đơn giản",
    skills: [
      {
        icon: "👂",
        name: "Listening",
        tasks: [
          "BBC Learning English – 6 Minute English (episodes beginner)",
          "YouTube: Speak English With Vanessa (Playlist S1)",
        ],
      },
      {
        icon: "📖",
        name: "Grammar",
        tasks: [
          "Essential Grammar in Use (Raymond Murphy) – Units 1–25",
          "EngVid.com – beginner grammar videos",
        ],
      },
      {
        icon: "📝",
        name: "Vocabulary",
        tasks: [
          "Anki – dùng deck 'English Vocabulary Frequency 5000'",
          "Duolingo – dùng như daily warm-up (10 phút/ngày)",
        ],
      },
      {
        icon: "🗣️",
        name: "Speaking",
        tasks: [
          "Shadowing: nghe câu → dừng → lặp lại to → ghi âm → nghe lại",
          "Chưa cần nói với người thật",
        ],
      },
    ],
    checkpoint: "Pass EF SET Quick Check – target A1 (efset.org, miễn phí)",
  },
  {
    id: 2,
    label: "Phase 2",
    title: "Sơ Cấp",
    months: "Tháng 3–4",
    level: "A2",
    color: "#8b5cf6",
    goal: "1500 từ, đọc hiểu đoạn ngắn, viết câu ghép",
    skills: [
      {
        icon: "👂",
        name: "Listening",
        tasks: [
          "VOA Learning English – level Special English",
          "TED-Ed (bật phụ đề English, không dùng tiếng Việt)",
        ],
      },
      {
        icon: "📖",
        name: "Grammar",
        tasks: [
          "Essential Grammar in Use – Units 26–60",
          "Focus vào tenses (Simple/Continuous/Perfect) + prepositions",
        ],
      },
      {
        icon: "📝",
        name: "Vocabulary",
        tasks: [
          "Tiếp tục Anki, target 10–15 từ mới/ngày",
          "Đọc Simple English Wikipedia – chủ đề mày thích",
        ],
      },
      {
        icon: "✍️",
        name: "Writing",
        tasks: [
          "Viết nhật ký tiếng Anh 3–5 câu/ngày (không cần hay, cần đều)",
          "Dùng LanguageTool.org để check lỗi grammar",
        ],
      },
    ],
    checkpoint: "Đọc 1 bài BBC News Easy cho trẻ em mà hiểu 70%+",
  },
  {
    id: 3,
    label: "Phase 3",
    title: "Trung Cấp",
    months: "Tháng 5–7",
    level: "B1",
    color: "#f59e0b",
    goal: "3000 từ, đọc tech docs, viết đoạn văn rõ ý",
    skills: [
      {
        icon: "👂",
        name: "Listening",
        tasks: [
          "Podcasts: 'English Learning for Curious Minds' (level intermediate)",
          "YouTube: TED Talks – no subtitles lần đầu → check lần 2",
        ],
      },
      {
        icon: "📖",
        name: "Reading",
        tasks: [
          "MDN Web Docs / dev.to – đọc ít nhất 1 bài/ngày",
          "Medium technical articles liên quan đến JS/Web dev",
        ],
      },
      {
        icon: "✍️",
        name: "Writing",
        tasks: [
          "Viết GitHub commit messages và README bằng tiếng Anh",
          "Tăng lên 1 đoạn văn/ngày (~80–100 chữ)",
        ],
      },
      {
        icon: "🗣️",
        name: "Speaking",
        tasks: [
          "HelloTalk hoặc Tandem – tìm language exchange partner",
          "Shadowing với TED Talks 5–10 phút/ngày",
        ],
      },
    ],
    checkpoint:
      "Tự viết README tiếng Anh cho 1 project portfolio không dùng Google Translate",
  },
  {
    id: 4,
    label: "Phase 4",
    title: "Tech English",
    months: "Tháng 8–12",
    level: "B1+",
    color: "#22c55e",
    goal: "Dùng tiếng Anh tự nhiên trong công việc dev",
    skills: [
      {
        icon: "👂",
        name: "Listening",
        tasks: [
          "Podcast: Syntax.fm, JS Party, Darknet Diaries",
          "Xem coding tutorials YouTube không dùng sub tiếng Việt",
        ],
      },
      {
        icon: "📖",
        name: "Reading",
        tasks: [
          "Stack Overflow, GitHub Issues/Discussions",
          "Tech blogs: CSS Tricks, Smashing Magazine, web.dev",
        ],
      },
      {
        icon: "✍️",
        name: "Writing",
        tasks: [
          "Viết cover letter tiếng Anh cho internship application",
          "Comment code bằng tiếng Anh, viết commit message rõ ràng",
        ],
      },
      {
        icon: "🗣️",
        name: "Speaking",
        tasks: [
          "Mock interview tiếng Anh (dùng AI để practice Q&A)",
          "Join Discord developer communities – chat bằng text trước",
        ],
      },
    ],
    checkpoint:
      "Thử làm 1 mock interview tiếng Anh về web dev với AI hoặc người quen",
  },
];

const dailyPlan = [
  {
    time: "10 phút",
    emoji: "🧠",
    activity: "Vocab review",
    detail: "Anki hoặc Duolingo – đừng skip",
  },
  {
    time: "10 phút",
    emoji: "📖",
    activity: "Grammar",
    detail: "1 unit trong sách hoặc 1 video EngVid",
  },
  {
    time: "15 phút",
    emoji: "👂",
    activity: "Listening/Reading",
    detail: "Podcast, YouTube, hay bài đọc – passive input",
  },
  {
    time: "10 phút",
    emoji: "✍️",
    activity: "Output",
    detail: "Viết vài câu nhật ký, hay lặp lại (shadowing)",
  },
];

interface ResourceItem {
  name: string;
  url: string;
  note: string;
}

interface ResourceGroup {
  tag: string;
  items: ResourceItem[];
}

const resources: ResourceGroup[] = [
  {
    tag: "FREE",
    items: [
      {
        name: "Duolingo",
        url: "duolingo.com",
        note: "Daily habit, warm-up thôi – đừng dựa hoàn toàn",
      },
      {
        name: "BBC Learning English",
        url: "bbc.co.uk/learningenglish",
        note: "Structured nhất cho beginner, có audio",
      },
      {
        name: "EngVid",
        url: "engvid.com",
        note: "Video grammar bởi native teachers, free",
      },
      {
        name: "Anki",
        url: "apps.ankiweb.net",
        note: "SRS flashcards – cách hiệu quả nhất để nhớ từ",
      },
      {
        name: "EF SET",
        url: "efset.org",
        note: "Test level free theo chuẩn CEFR (A1–C2)",
      },
      {
        name: "LanguageTool",
        url: "languagetool.org",
        note: "Grammar checker tốt hơn Grammarly free tier",
      },
    ],
  },
  {
    tag: "WORTH IT",
    items: [
      {
        name: "Essential Grammar in Use",
        url: "cambridge.org",
        note: "Sách của Raymond Murphy – chuẩn nhất cho A1→A2",
      },
      {
        name: "English Grammar in Use",
        url: "cambridge.org",
        note: "Cùng tác giả – dùng tiếp khi lên B1",
      },
    ],
  },
  {
    tag: "YOUTUBE",
    items: [
      {
        name: "Speak English With Vanessa",
        url: "youtube.com",
        note: "Beginner → Intermediate, rõ ràng, dễ nghe",
      },
      {
        name: "EnglishClass101",
        url: "youtube.com",
        note: "Có nhiều series theo topic, free trên YT",
      },
      {
        name: "TED-Ed",
        url: "youtube.com",
        note: "Phase 3+ – học nghe natural speech",
      },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function RoadmapClient() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedSkill, setExpandedSkill] = useState<number | null>(null);
  const phase = phases[activePhase];

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
      {/* Header */}
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
          Self-Study Plan
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

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 20,
          }}
        >
          {[
            { val: "12", unit: "tháng" },
            { val: "45", unit: "phút/ngày" },
            { val: "B1+", unit: "target" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>
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

      {/* Phase tabs */}
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
        {phases.map((p, i) => (
          <button
            key={p.id}
            id={`roadmap-phase-${p.id}`}
            onClick={() => {
              setActivePhase(i);
              setExpandedSkill(null);
            }}
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

      {/* Phase content */}
      <div
        style={{
          padding: "20px 16px 0",
          background: "#161b22",
          borderBottom: "1px solid #21262d",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}
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
            CEFR {phase.level}
          </span>
          <span style={{ color: "#8b949e", fontSize: 13 }}>{phase.months}</span>
        </div>
        <h2
          style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#f0f6fc" }}
        >
          {phase.title}
        </h2>
        <p style={{ margin: "0 0 16px", color: "#8b949e", fontSize: 14 }}>
          🎯 {phase.goal}
        </p>

        {/* Skills accordion */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20 }}
        >
          {phase.skills.map((skill, si) => (
            <div
              key={si}
              style={{
                background: "#0d1117",
                borderRadius: 10,
                border:
                  "1px solid " +
                  (expandedSkill === si ? phase.color + "66" : "#21262d"),
                overflow: "hidden",
                transition: "border 0.2s",
              }}
            >
              <button
                id={`roadmap-skill-${activePhase}-${si}`}
                onClick={() =>
                  setExpandedSkill(expandedSkill === si ? null : si)
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#e2e8f0",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {skill.icon} {skill.name}
                </span>
                <span style={{ color: "#8b949e", fontSize: 16 }}>
                  {expandedSkill === si ? "−" : "+"}
                </span>
              </button>
              {expandedSkill === si && (
                <div style={{ padding: "0 16px 14px" }}>
                  {skill.tasks.map((t, ti) => (
                    <div
                      key={ti}
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: phase.color,
                          fontSize: 14,
                          marginTop: 1,
                          flexShrink: 0,
                        }}
                      >
                        →
                      </span>
                      <span
                        style={{
                          color: "#c9d1d9",
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Checkpoint */}
        <div
          style={{
            background: phase.color + "11",
            border: "1px solid " + phase.color + "44",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: phase.color,
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            ✓ CHECKPOINT
          </div>
          <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5 }}>
            {phase.checkpoint}
          </div>
        </div>
      </div>

      {/* Daily routine */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 15,
            fontWeight: 700,
            color: "#8b949e",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          ⏰ Lịch Học Mỗi Ngày
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}
        >
          {dailyPlan.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc" }}
                  >
                    {item.activity}
                  </span>
                  <span
                    style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}
                  >
                    {item.time}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", marginTop: 2 }}>
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 20,
          }}
        >
          <div
            style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 6 }}
          >
            ⚠️ QUAN TRỌNG HƠN NHIỀU THỨ KHÁC
          </div>
          <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.6 }}>
            Đều đặn 30 phút mỗi ngày &gt; học 3 tiếng 1 lần mỗi tuần. Không có
            trick nào bypass được consistency.
          </div>
        </div>

        {/* Resources */}
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 15,
            fontWeight: 700,
            color: "#8b949e",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          🔗 Resources
        </h3>

        {resources.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color:
                  group.tag === "FREE"
                    ? "#22c55e"
                    : group.tag === "WORTH IT"
                      ? "#f59e0b"
                      : "#3b82f6",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              {group.tag === "FREE"
                ? "✦ MIỄN PHÍ"
                : group.tag === "WORTH IT"
                  ? "✦ ĐÁNG MUA"
                  : "✦ YOUTUBE"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((r, ri) => (
                <div
                  key={ri}
                  style={{
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc" }}
                    >
                      {r.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#8b949e" }}>
                      {r.url}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.4 }}
                  >
                    {r.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Milestones */}
        <h3
          style={{
            margin: "16px 0 12px",
            fontSize: 15,
            fontWeight: 700,
            color: "#8b949e",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          🏁 Milestones
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            {
              m: "Tháng 1",
              goal: "Hoàn thành Duolingo basics, làm quen Anki",
              color: "#3b82f6",
            },
            { m: "Tháng 2", goal: "Pass EF SET A1 (efset.org)", color: "#3b82f6" },
            {
              m: "Tháng 4",
              goal: "Đọc Simple English Wikipedia không cần dict",
              color: "#8b5cf6",
            },
            {
              m: "Tháng 6",
              goal: "Viết nhật ký tiếng Anh 50+ từ/ngày thoải mái",
              color: "#8b5cf6",
            },
            {
              m: "Tháng 7",
              goal: "Tự viết README project bằng tiếng Anh",
              color: "#f59e0b",
            },
            {
              m: "Tháng 9",
              goal: "Đọc MDN/dev.to hiểu 80% mà không dịch",
              color: "#f59e0b",
            },
            {
              m: "Tháng 12",
              goal: "Mock interview tiếng Anh về web dev được",
              color: "#22c55e",
            },
          ].map((ms, i, arr) => (
            <div
              key={i}
              style={{ display: "flex", gap: 12, alignItems: "stretch" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 32,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: ms.color,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: "#21262d",
                      margin: "2px 0",
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: 14 }}>
                <div
                  style={{ fontSize: 11, color: ms.color, fontWeight: 700 }}
                >
                  {ms.m}
                </div>
                <div
                  style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.4 }}
                >
                  {ms.goal}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 10,
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 6 }}>💡</div>
          <div style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.6 }}>
            Tiếng Anh với dev không cần perfect. Cần đủ để đọc docs, viết code
            comments, hiểu Stack Overflow, và communicate được. B1 là đủ để
            internship.
          </div>
        </div>
      </div>
    </div>
  );
}

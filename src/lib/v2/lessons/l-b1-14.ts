import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 gate — review spiral + freer apply (end of core path / “dùng được”).
 * Core: combine B1 spines only — story · news/opinion · will/might · must/should
 * · if/when · process · describe · prefer/soft disagree · get things done · PPC
 * · problem–solution · wellness · workplace update. No new grammar forms.
 * Spiral: b1-01…b1-13 light samples. Freer task = independent-user monologue.
 * L1 notes ≥50% (B1 schema); aim 100% for VN adults.
 */
export const lessonB114: LessonSpec = {
  id: "l-b1-14",
  phase: "P3",
  cefr: "B1",
  title_vi: "Cổng B1 — dùng được",
  estimatedMin: 50,
  canDo: [
    "Ghép ≥4 kỹ năng B1 trong 1 đoạn nói 45–60s (story, opinion, rule/if, workplace…)",
    "Dùng đúng form đã học b1-01…13 — không form mới; tự sửa lỗi hay gặp VN",
    "Tự tin “dùng được” (independent user): update · soft disagree · problem–solution · plan",
  ],
  situation:
    "Phỏng vấn nội bộ / coffee với mentor nước ngoài sau lộ trình B1. Họ hỏi: chuyện tuần trước, tin/ý kiến, quy định hoặc if-plan, kinh nghiệm dài (PPC), một vấn đề + giải pháp, và update công sở. Bạn ghép kỹ năng b1-01…13 thành monologue/chat tự nhiên — không học form mới, chỉ ôn và “dùng được”.",
  culturalNote_vi:
    "CEFR B1 Independent User ≈ “dùng được”: kể chuyện có because, tóm tin + I think, will/might, must/should, if/when + will, quy trình First…Finally, mô tả người/nơi, prefer + soft disagree, get/have something done, have been + V-ing for/since, The problem is… / One solution is…, should rest / How about…, Just to update you… / Looking forward to + V-ing. Bản ngữ nhảy topic — luyện chuyển: Last week… / I think… / If… will… / I've been… / The problem is… / Just to update you…. Lỗi hay lặp: I go yesterday; I am agree; Looking forward to hear; You should to rest; since two years; I am working here for 3 years (cần PPC); The problem is is….",
  jobAngle:
    "Gate interview/mentor — story + opinion + rule/if + PPC + problem–solution + workplace update",
  lexis: [
    {
      id: "v1",
      word: "independent",
      phonetic: "/ˌɪndɪˈpendənt/",
      meaning_vi: "độc lập (dùng được)",
      example_en: "At B1 you are an independent user of English.",
      l1_note_vi:
        "independent user (CEFR). Stress -PEN-. ≠ dependent. Không: independant (sai chính tả).",
    },
    {
      id: "v2",
      word: "confident",
      phonetic: "/ˈkɒnfɪdənt/",
      meaning_vi: "tự tin",
      example_en: "I feel more confident in meetings now.",
      l1_note_vi:
        "feel confident / confident about…. Stress CON-fi-dent. Không: confidents.",
    },
    {
      id: "v3",
      word: "apply",
      phonetic: "/əˈplaɪ/",
      meaning_vi: "áp dụng",
      example_en: "I can apply B1 language at work.",
      l1_note_vi:
        "apply something / apply for a job. Stress a-PPLY. Không: apply to do bare always.",
    },
    {
      id: "v4",
      word: "outcome",
      phonetic: "/ˈaʊtkʌm/",
      meaning_vi: "kết quả / đầu ra",
      example_en: "The outcome of this path is using English independently.",
      l1_note_vi:
        "outcome (n). Stress OUT-. ≠ income. the outcome of….",
    },
    {
      id: "v5",
      word: "review",
      phonetic: "/rɪˈvjuː/",
      meaning_vi: "ôn tập / xem lại",
      example_en: "Let's review the main B1 structures.",
      l1_note_vi:
        "review (v/n). Stress re-VIEW. Không: review about (thừa about).",
    },
    {
      id: "v6",
      word: "combine",
      phonetic: "/kəmˈbaɪn/",
      meaning_vi: "kết hợp",
      example_en: "Combine story, opinion, and workplace update in one talk.",
      l1_note_vi:
        "combine A and B / combine A with B. Stress com-BINE.",
    },
    {
      id: "v7",
      word: "update",
      phonetic: "/ˈʌpdeɪt/",
      meaning_vi: "cập nhật (n/v)",
      example_en: "Just to update you, the draft is ready.",
      l1_note_vi:
        "Just to update you… (b1-13). UP-date (n) / up-DATE (v). Không: I update you that…",
    },
    {
      id: "v8",
      word: "solution",
      phonetic: "/səˈluːʃən/",
      meaning_vi: "giải pháp",
      example_en: "One solution is to follow up by email.",
      l1_note_vi:
        "One solution is… (b1-11). Stress so-LU-tion. ≠ problem only.",
    },
    {
      id: "v9",
      word: "deadline",
      phonetic: "/ˈdedlaɪn/",
      meaning_vi: "hạn chót",
      example_en: "If we start now, we will meet the deadline.",
      l1_note_vi:
        "meet a deadline. Stress DEAD-line. If + present, will… (b1-05).",
    },
    {
      id: "v10",
      word: "progress",
      phonetic: "/ˈprəʊɡres/",
      meaning_vi: "tiến bộ / tiến độ",
      example_en: "I've been making progress for six months.",
      l1_note_vi:
        "make progress (không a progress). PPC: have been + V-ing (b1-10).",
    },
    {
      id: "v11",
      word: "prefer",
      phonetic: "/prɪˈfɜː/",
      meaning_vi: "thích hơn",
      example_en: "I prefer email to long meetings.",
      l1_note_vi:
        "prefer A to B · prefer + V-ing (b1-08). Stress pre-FER. Không: prefer than.",
    },
    {
      id: "v12",
      word: "achieve",
      phonetic: "/əˈtʃiːv/",
      meaning_vi: "đạt được",
      example_en: "You achieved the B1 gate — you can use English independently.",
      l1_note_vi:
        "achieve a goal. Stress a-CHIEVE. Âm /tʃ/ — không /ʃ/.",
    },
  ],
  grammar: {
    title: "Ôn ngữ pháp B1 — ghép nhiều cấu trúc",
    rule: "story · opinion · will/might · must/if · process · PPC · problem · update",
    examples: [
      {
        en: "Last week I finished late because the client changed the brief.",
        vi: "past + because (b1-01)",
      },
      {
        en: "Sales grew last quarter. I think remote work will continue.",
        vi: "news past+present + opinion / will (b1-02/03)",
      },
      {
        en: "You must wear a badge. If we start now, we will finish on time.",
        vi: "must · if + will (b1-04/05)",
      },
      {
        en: "I've been working here for three years. The problem is the delay.",
        vi: "PPC for · problem frame (b1-10/11)",
      },
      {
        en: "Just to update you, we're on track. I see your point, but…",
        vi: "workplace update + soft disagree (b1-13)",
      },
    ],
    vnNote:
      "Cổng: không form mới. Ghép past+because · I think · will/might · must/if+will · process · PPC for/since · problem–solution · Just to update you… / Looking forward to + V-ing. Sai: to hear; I am agree; should to; since two years.",
    ccq: {
      question: "Câu nào ghép đúng NHIỀU cấu trúc B1?",
      options: [
        "Last week I finished late because the brief changed. I've been here for three years. Just to update you, we're on track.",
        "I go yesterday and I am agree. Looking forward to hear. You should to rest.",
        "I am working here for three years and The problem is is delay.",
        "Prefer than email I and Just update for you we on track.",
      ],
      answer:
        "Last week I finished late because the brief changed. I've been here for three years. Just to update you, we're on track.",
      explanation_vi:
        "past+because · PP/PPC + for · workplace update — form đúng.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Story + because (b1-01)",
      options: [
        "I finished late because the client changed the brief.",
        "I finish late because the client change the brief yesterday.",
        "I am finish late because client changing.",
        "I finished late because of the client he change.",
      ],
      answer: "I finished late because the client changed the brief.",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Opinion (b1-02/08)",
      options: [
        "I think remote work will continue.",
        "I am think remote work will continue.",
        "I am agree remote work will continue.",
        "In my opinion that remote work continue always bare.",
      ],
      answer: "I think remote work will continue.",
    },
    {
      id: "c3",
      type: "mcq",
      prompt_vi: "Obligation (b1-04)",
      options: [
        "You must wear a badge in the office.",
        "You must to wear a badge in the office.",
        "You musts wear a badge in the office.",
        "You must wearing a badge in the office.",
      ],
      answer: "You must wear a badge in the office.",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "First conditional (b1-05)",
      options: [
        "If we start now, we will finish on time.",
        "If we will start now, we finish on time.",
        "If we starting now, we will finish on time.",
        "If we start now, we finishing on time.",
      ],
      answer: "If we start now, we will finish on time.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa: I've been working here since three years.",
      stem: "I've been working here since three years.",
      answer: "I've been working here for three years.",
      explanation_vi: "for + duration; since + point (b1-10).",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Problem–solution (b1-11)",
      options: [
        "The problem is the delay. One solution is to follow up today.",
        "The problem is is the delay. One solution is follow up.",
        "Problem the delay. Solution we coulds call.",
        "The problems are is delay only bare.",
      ],
      answer: "The problem is the delay. One solution is to follow up today.",
    },
    {
      id: "c7",
      type: "scramble",
      prompt_vi: "Sắp xếp: Just / to / update / you / the / draft / is / ready",
      words: [
        "Just",
        "to",
        "update",
        "you",
        "the",
        "draft",
        "is",
        "ready",
      ],
      answer: "Just to update you the draft is ready",
    },
    {
      id: "c8",
      type: "mcq",
      prompt_vi: "Looking forward to (b1-13)",
      options: [
        "Looking forward to your reply.",
        "Looking forward to hear from you.",
        "Looking forward for your reply.",
        "Looking forward to hearing you soon wrong bare only.",
      ],
      answer: "Looking forward to your reply.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Mentor coffee — tổng hợp B1",
        context_vi:
          "Lan gặp mentor Sam: story tuần trước → opinion → PPC → problem–solution → workplace update → chốt cổng B1.",
        lines: [
          {
            id: "1",
            speaker: "Sam",
            text: "Hi Lan! Tell me about last week at work.",
            translation_vi: "Chào Lan! Kể tuần trước ở công ty đi.",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "Last week I finished late because the client changed the brief.",
            translation_vi: "Tuần trước mình xong muộn vì client đổi brief.",
          },
          {
            id: "3",
            speaker: "Sam",
            text: "I see. What do you think about remote work this year?",
            translation_vi: "Hiểu. Bạn nghĩ sao về remote work năm nay?",
          },
          {
            id: "4",
            speaker: "Lan",
            text: "I think it will continue. It might grow in our team.",
            translation_vi: "Mình nghĩ sẽ tiếp tục. Team mình có thể tăng remote.",
          },
          {
            id: "5",
            speaker: "Sam",
            text: "How long have you been working here?",
            translation_vi: "Bạn làm ở đây bao lâu rồi?",
          },
          {
            id: "6",
            speaker: "Lan",
            text: "I've been working here for three years. If we start early, we will meet the deadline.",
            translation_vi:
              "Mình làm được ba năm. Nếu bắt đầu sớm, chúng ta sẽ kịp deadline.",
          },
          {
            id: "7",
            speaker: "Sam",
            text: "Any problem this sprint?",
            translation_vi: "Sprint này có vấn đề gì không?",
          },
          {
            id: "8",
            speaker: "Lan",
            text: "The problem is the delay. One solution is to follow up with QA today.",
            translation_vi:
              "Vấn đề là delay. Một giải pháp là follow up QA hôm nay.",
          },
          {
            id: "9",
            speaker: "Sam",
            text: "Good. Give me a quick status update.",
            translation_vi: "Tốt. Cập nhật tiến độ nhanh đi.",
          },
          {
            id: "10",
            speaker: "Lan",
            text: "Just to update you, we're on track. Looking forward to your feedback.",
            translation_vi:
              "Cập nhật nhanh: chúng ta đúng tiến độ. Mong nhận feedback của bạn.",
          },
          {
            id: "11",
            speaker: "Sam",
            text: "You achieved the B1 gate — you can use English independently!",
            translation_vi:
              "Bạn đã qua cổng B1 — dùng được tiếng Anh độc lập rồi!",
          },
          {
            id: "12",
            speaker: "Lan",
            text: "Thanks! I feel more confident. I prefer short updates to long emails.",
            translation_vi:
              "Cảm ơn! Mình tự tin hơn. Mình thích update ngắn hơn email dài.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Standup gate — process + soft disagree + wellness",
        context_vi:
          "Họp ngắn: quy trình, soft disagree timeline, should rest (spiral b1-06/08/12/13).",
        lines: [
          {
            id: "1",
            speaker: "Hoa",
            text: "First, open the ticket. Then assign an owner. Finally, send the summary.",
            translation_vi:
              "Trước hết mở ticket. Rồi gán owner. Cuối cùng gửi summary.",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "I see your point, but Friday feels tight for QA.",
            translation_vi: "Tôi hiểu, nhưng thứ Sáu hơi gấp cho QA.",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "I'm afraid I disagree with moving the deadline again.",
            translation_vi: "Tôi e là không đồng ý dời deadline lần nữa.",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "OK. Could you please follow up after lunch?",
            translation_vi: "OK. Bạn follow up sau giờ ăn được không?",
          },
          {
            id: "5",
            speaker: "Minh",
            text: "Sure. You should rest for ten minutes — you look tired.",
            translation_vi: "Được. Bạn nên nghỉ mười phút — trông mệt.",
          },
          {
            id: "6",
            speaker: "Lan",
            text: "How about coffee after we finish the action items?",
            translation_vi: "Xong action item rồi đi cà phê thì sao?",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I finished late because the client changed the brief",
        options: [
          "I finished late because the client changed the brief",
          "I finish late because the client change the brief",
          "I am finished late because client changing",
          "I finished late because of he changed the brief",
        ],
        answer: "I finished late because the client changed the brief",
      },
      {
        id: "lac2",
        audio_text: "If we start now we will finish on time",
        options: [
          "If we start now we will finish on time",
          "If we will start now we finish on time",
          "If we starting now we will finish on time",
          "If we start now we finishing on time",
        ],
        answer: "If we start now we will finish on time",
      },
      {
        id: "lac3",
        audio_text: "I've been working here for three years",
        options: [
          "I've been working here for three years",
          "I've been working here since three years",
          "I am working here for three years always now",
          "I have been work here for three years",
        ],
        answer: "I've been working here for three years",
      },
      {
        id: "lac4",
        audio_text: "The problem is the delay One solution is to follow up",
        options: [
          "The problem is the delay One solution is to follow up",
          "The problem is is the delay One solution is follow",
          "Problem the delay Solution we coulds call",
          "The problems are is delay only bare",
        ],
        answer: "The problem is the delay One solution is to follow up",
      },
      {
        id: "lac5",
        audio_text: "Just to update you we are still on track",
        options: [
          "Just to update you we are still on track",
          "Just update for you we are still on track",
          "I update you we are still in track",
          "Just to updating you we still track on",
        ],
        answer: "Just to update you we are still on track",
      },
      {
        id: "lac6",
        audio_text: "Looking forward to your reply",
        options: [
          "Looking forward to your reply",
          "Looking forward to hear your reply",
          "Looking forward for your reply",
          "Looking forward to hearing reply only bare",
        ],
        answer: "Looking forward to your reply",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Last week I finished late because the brief changed.",
        vi: "Tuần trước mình xong muộn vì brief đổi.",
      },
      {
        en: "I think remote work will continue.",
        vi: "Mình nghĩ remote work sẽ tiếp tục.",
      },
      {
        en: "You must wear a badge. You should rest more.",
        vi: "Bạn phải đeo thẻ. Bạn nên nghỉ nhiều hơn.",
      },
      {
        en: "If we start now, we will meet the deadline.",
        vi: "Nếu bắt đầu ngay, chúng ta sẽ kịp deadline.",
      },
      {
        en: "I've been working here for three years.",
        vi: "Mình làm ở đây được ba năm.",
      },
      {
        en: "The problem is the delay. One solution is to follow up.",
        vi: "Vấn đề là delay. Một giải pháp là follow up.",
      },
      {
        en: "Just to update you, we're on track.",
        vi: "Cập nhật nhanh: chúng ta đúng tiến độ.",
      },
      {
        en: "I feel more confident. I can use English independently.",
        vi: "Mình tự tin hơn. Mình dùng được tiếng Anh độc lập.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "FREER B1 (cổng — dùng được): Monologue / mentor chat 45–60 giây. Ghép ≥4 chủ đề từ b1-01…13: (1) story past+because · (2) news/opinion I think… HOẶC will/might · (3) must/should HOẶC if/when+will HOẶC process First…Finally · (4) PPC for/since HOẶC problem–solution · (5 tùy) workplace update / soft disagree / Looking forward to… / How about…. Kết: I feel more confident / I can use English independently.",
    successCriteria_vi: [
      "≥1 past + because (hoặc story chain b1-01)",
      "≥1 opinion / will-might / must-should / if+will",
      "≥1 PPC for/since HOẶC problem–solution HOẶC workplace update",
      "Không lỗi nặng: I am agree / Looking forward to hear / You should to / since two years / I go yesterday",
    ],
    scaffold_en: [
      "Last week I… because…",
      "I think… / It might… / Sales will…",
      "You must… / If we…, we will…",
      "First… Then… Finally…",
      "I've been … for / since…",
      "The problem is… One solution is… / We could…",
      "Just to update you… / I see your point, but…",
      "Looking forward to… / How about…? / I feel more confident.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Câu ôn B1 đúng nhất (ghép form):",
        options: [
          "Last week I finished late because the brief changed. I've been here for three years. Just to update you, we're on track.",
          "I go yesterday and I am agree. Looking forward to hear. You should to rest.",
          "I am working here for three years and The problem is is delay.",
          "Prefer than email and Just update for you we on track.",
        ],
        answer:
          "Last week I finished late because the brief changed. I've been here for three years. Just to update you, we're on track.",
        explanation_vi: "past+because · for + duration · workplace update.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "If we start now, we ___ finish on time.",
        options: ["will", "would to", "are", "finishing"],
        answer: "will",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I've been working here since three years. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: for three years (duration).",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Soft disagreement + update:",
        options: [
          "I see your point, but the deadline is fixed. Just to update you, we're on track.",
          "You are wrong. I update you we on track.",
          "I am not agree. Looking forward to hear.",
          "Disagree I with you. As now we track.",
        ],
        answer:
          "I see your point, but the deadline is fixed. Just to update you, we're on track.",
      },
      {
        id: "q5",
        type: "mcq",
        question: "Looking forward to is usually followed by",
        options: [
          "V-ing or a noun phrase",
          "only bare hear always",
          "only past simple always",
          "only must + bare always",
        ],
        answer: "V-ing or a noun phrase",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Problem–solution frame:",
        options: [
          "The problem is the delay. One solution is to follow up today.",
          "The problem is is the delay.",
          "Problem the delay only.",
          "We coulds fix it always bare wrong.",
        ],
        answer: "The problem is the delay. One solution is to follow up today.",
      },
      {
        id: "q7",
        type: "true-false",
        question: "Looking forward to hear from you. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-01) Correct story line",
        options: [
          "I finished late because the client changed the brief.",
          "I finish late because the client change the brief yesterday.",
          "I am finish late because client changing.",
          "I finished late because of he changed.",
        ],
        answer: "I finished late because the client changed the brief.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-05) First conditional",
        options: [
          "If we start now, we will finish on time.",
          "If we will start now, we finish on time.",
          "If we starting now, we will finish on time.",
          "If we start now, we finishing on time.",
        ],
        answer: "If we start now, we will finish on time.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-10) PPC + for/since",
        options: [
          "I've been working here for three years.",
          "I've been working here since three years.",
          "I am working here for three years always now.",
          "I have been work here for three years.",
        ],
        answer: "I've been working here for three years.",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-11/13) Problem + workplace",
        options: [
          "The problem is the delay. Just to update you, we're on track.",
          "The problem is is delay. Just update for you.",
          "Problem delay. I update you we on track.",
          "Looking forward to hear. I am agree.",
        ],
        answer:
          "The problem is the delay. Just to update you, we're on track.",
      },
      {
        id: "s5",
        type: "mcq",
        question: "(Ôn b1-12) Advice + plan",
        options: [
          "You should rest for ten minutes. How about coffee later?",
          "You should to rest for ten minutes.",
          "You ought rest for ten minutes.",
          "You should resting for ten minutes.",
        ],
        answer: "You should rest for ten minutes. How about coffee later?",
      },
      {
        id: "s6",
        type: "mcq",
        question: "(Ôn b1-08) Prefer / soft disagree",
        options: [
          "I prefer email to long meetings. I see your point, but…",
          "I prefer than email. I am not agree.",
          "I prefer email more better. You are wrong.",
          "Prefer I email. Disagree I with you only.",
        ],
        answer: "I prefer email to long meetings. I see your point, but…",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "independent · update · solution",
    description_vi:
      "independent /ˌɪndɪˈpendənt/ nhấn -PEN-. update /ˈʌpdeɪt/ (n) · /ʌpˈdeɪt/ (v). solution /səˈluːʃən/ so-LU-tion. Nối: just_to_update_you · looking_forward_to · for_three_years · the_problem_is · if_we_start_now.",
    examples: [
      { word: "independent", tip_vi: "in-de-PEN-dent — nhấn 3" },
      { word: "update", tip_vi: "UP-date (n) / up-DATE (v)" },
      { word: "solution", tip_vi: "so-LU-tion — /luː/" },
      { word: "confident", tip_vi: "CON-fi-dent — không confidents" },
    ],
  },
};

import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — workplace communication.
 * Core: meeting frames · status updates · email phrases · polite disagreement.
 * Job-first. Spiral: b1-12 health/social (should/ought to · How about… · symptoms).
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB113: LessonSpec = {
  id: "l-b1-13",
  phase: "P3",
  cefr: "B1",
  title_vi: "Giao tiếp công sở",
  estimatedMin: 40,
  canDo: [
    "Cập nhật tiến độ: Just to update you… / As of now… / We're on track",
    "Họp: agenda · Shall we move on? · action item · follow up",
    "Email + soft disagree: Looking forward to… / Please find attached… / I see your point, but…",
  ],
  situation:
    "Họp team + email follow-up: cập nhật deadline, agenda, polite disagree một ý, chốt action item. Nói 45–60 giây: 1–2 câu update (Just to update you… / As of now…), 1 câu meeting hoặc email phrase, 1 soft disagree hoặc follow-up, 1 ôn b1-12 (should/ought to / How about…) nếu hợp ngữ cảnh.",
  culturalNote_vi:
    "VN hay báo cáo ngắn 'xong rồi / đang làm'; tiếng Anh công sở cần frame rõ: Just to update you… / As of now… / We're on track. Soft disagree: I see your point, but… / I'm afraid I disagree… — lịch sự hơn 'You're wrong'. Email: Looking forward to + V-ing/noun; Please find attached… (không Please find attach). Meeting: agenda, Shall we move on?, action item, follow up. Không: According to me / I am agree / Looking forward to hear.",
  jobAngle:
    "Meeting + email: agenda, update, soft disagree, action item, Looking forward to…, follow up — ôn should/How about (b1-12)",
  lexis: [
    {
      id: "v1",
      word: "Just to update you…",
      phonetic: "/dʒʌst tuː ˈʌpdeɪt juː/",
      meaning_vi: "Cập nhật nhanh cho bạn…",
      example_en: "Just to update you, the draft is ready.",
      l1_note_vi:
        "Mở đầu status update. Không: Update for you that… / I update you.",
    },
    {
      id: "v2",
      word: "As of now…",
      phonetic: "/æz əv naʊ/",
      meaning_vi: "Tính đến hiện tại…",
      example_en: "As of now, we are still on track.",
      l1_note_vi:
        "As of now + clause. ≈ currently. Không: As now / Until now always = as of now.",
    },
    {
      id: "v3",
      word: "on track",
      phonetic: "/ɒn træk/",
      meaning_vi: "đúng tiến độ",
      example_en: "We're on track for Friday.",
      l1_note_vi:
        "be on track (for…). behind schedule = trễ. Không: on the track only.",
    },
    {
      id: "v4",
      word: "agenda",
      phonetic: "/əˈdʒendə/",
      meaning_vi: "chương trình họp",
      example_en: "Let's check the agenda first.",
      l1_note_vi:
        "the agenda / on the agenda. ≠ calendar alone. agenda item = mục họp.",
    },
    {
      id: "v5",
      word: "Shall we move on?",
      phonetic: "/ʃæl wiː muːv ɒn/",
      meaning_vi: "Chúng ta chuyển mục tiếp theo nhé?",
      example_en: "Any questions? Shall we move on?",
      l1_note_vi:
        "Shall we + bare V. meeting facilitator. ≠ Must we move always.",
    },
    {
      id: "v6",
      word: "action item",
      phonetic: "/ˈækʃən ˈaɪtəm/",
      meaning_vi: "việc cần làm (sau họp)",
      example_en: "Your action item is to send the summary.",
      l1_note_vi:
        "action item(s). take / assign an action item. ≠ just task vague only.",
    },
    {
      id: "v7",
      word: "follow up",
      phonetic: "/ˈfɒləʊ ʌp/",
      meaning_vi: "theo dõi / follow-up",
      example_en: "I will follow up by email today.",
      l1_note_vi:
        "follow up (v) · follow-up (n/adj). follow up on something. Không: follow up to him only.",
    },
    {
      id: "v8",
      word: "Looking forward to…",
      phonetic: "/ˈlʊkɪŋ ˈfɔːwəd tuː/",
      meaning_vi: "Mong chờ… (email)",
      example_en: "Looking forward to your reply.",
      l1_note_vi:
        "Looking forward to + V-ing / noun. Không: Looking forward to hear / to see you soon wrong form: seeing.",
    },
    {
      id: "v9",
      word: "Please find attached…",
      phonetic: "/pliːz faɪnd əˈtætʃt/",
      meaning_vi: "Đính kèm… (email)",
      example_en: "Please find attached the weekly report.",
      l1_note_vi:
        "Please find attached + noun. formal email. Không: Please find attach / attached is…",
    },
    {
      id: "v10",
      word: "I see your point, but…",
      phonetic: "/aɪ siː jɔː pɔɪnt bʌt/",
      meaning_vi: "Tôi hiểu ý bạn, nhưng…",
      example_en: "I see your point, but the deadline is fixed.",
      l1_note_vi:
        "Soft disagree. polite. Không: You're wrong / I not agree bare.",
    },
    {
      id: "v11",
      word: "I'm afraid I disagree…",
      phonetic: "/aɪm əˈfreɪd aɪ ˌdɪsəˈɡriː/",
      meaning_vi: "Tôi e là tôi không đồng ý…",
      example_en: "I'm afraid I disagree with that timeline.",
      l1_note_vi:
        "I'm afraid + clause = softener (không = sợ). disagree with. Không: I am not agree.",
    },
    {
      id: "v12",
      word: "Could you please…",
      phonetic: "/kʊd juː pliːz/",
      meaning_vi: "Bạn có thể… không? (lịch sự)",
      example_en: "Could you please send the agenda by noon?",
      l1_note_vi:
        "Could you please + bare V. lịch sự hơn Can you. Không: Could you please to send.",
    },
  ],
  grammar: {
    title: "Workplace updates & soft disagree",
    rule: "Just to update you… · As of now… · Looking forward to + V-ing · I see your point, but…",
    examples: [
      {
        en: "Just to update you, the report is ready.",
        vi: "Cập nhật nhanh: báo cáo đã xong.",
      },
      {
        en: "As of now, we are still on track.",
        vi: "Tính đến hiện tại, chúng ta vẫn đúng tiến độ.",
      },
      {
        en: "I see your point, but we need more time.",
        vi: "Tôi hiểu ý bạn, nhưng chúng ta cần thêm thời gian.",
      },
    ],
    vnNote:
      "Update: Just to update you… / As of now… / We're on track. Meeting: agenda, Shall we move on?, action item, follow up. Email: Looking forward to + V-ing/noun; Please find attached…. Soft disagree: I see your point, but… / I'm afraid I disagree…. Sai hay gặp: Looking forward to hear / I am agree / Please find attach / Could you please to send.",
    ccq: {
      question: "Câu nào đúng sau Looking forward to?",
      options: [
        "Looking forward to your reply.",
        "Looking forward to hear from you.",
        "Looking forward for your reply.",
        "Looking forward to hearing you soon wrong bare.",
      ],
      answer: "Looking forward to your reply.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "___ to update you, the draft is ready.",
      options: ["Just", "Only just we", "As just", "For just"],
      answer: "Just",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "As of now, we are still ___.",
      options: ["on track", "on the only track always", "in track", "track on"],
      answer: "on track",
    },
    {
      id: "c3",
      type: "mcq",
      prompt_vi: "Looking forward ___ your reply.",
      options: ["to", "for", "of", "at"],
      answer: "to",
    },
    {
      id: "c4",
      type: "scramble",
      prompt_vi: "Sắp xếp: I / see / your / point / but / the / deadline / is / fixed",
      words: [
        "I",
        "see",
        "your",
        "point",
        "but",
        "the",
        "deadline",
        "is",
        "fixed",
      ],
      answer: "I see your point but the deadline is fixed",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa: Looking forward to hear from you.",
      stem: "Looking forward to hear from you.",
      answer: "Looking forward to hearing from you.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Could you please ___ the agenda by noon?",
      options: ["send", "to send", "sending", "sends"],
      answer: "send",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Team meeting — agenda & update",
        context_vi:
          "Họp standup/weekly: agenda, status update, soft disagree timeline, action item.",
        lines: [
          {
            id: "1",
            speaker: "Hoa",
            text: "Let's check the agenda. First, status updates.",
            translation_vi: "Xem agenda đã. Trước hết, cập nhật tiến độ.",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "Just to update you, the draft is ready.",
            translation_vi: "Cập nhật nhanh: bản nháp đã xong.",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "As of now, we are still on track for Friday.",
            translation_vi: "Tính đến hiện tại, vẫn đúng tiến độ thứ Sáu.",
          },
          {
            id: "4",
            speaker: "Tuan",
            text: "I see your point, but Friday feels tight for QA.",
            translation_vi: "Tôi hiểu, nhưng thứ Sáu hơi gấp cho QA.",
          },
          {
            id: "5",
            speaker: "Hoa",
            text: "I'm afraid I disagree with moving the deadline.",
            translation_vi: "Tôi e là không đồng ý dời deadline.",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "OK. Your action item is to follow up with QA today.",
            translation_vi: "OK. Action item của bạn: follow up QA hôm nay.",
          },
          {
            id: "7",
            speaker: "Hoa",
            text: "Any questions? Shall we move on?",
            translation_vi: "Ai hỏi gì không? Chuyển mục tiếp theo nhé?",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Email + wellness spiral",
        context_vi:
          "Email follow-up + chat: Looking forward to / Please find attached; ôn b1-12 should/How about sau họp dài.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "Please find attached the weekly report.",
            translation_vi: "Đính kèm báo cáo tuần.",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "Thanks. Could you please send the agenda for tomorrow too?",
            translation_vi: "Cảm ơn. Bạn gửi luôn agenda ngày mai được không?",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "Sure. Looking forward to your comments by three.",
            translation_vi: "Được. Mong nhận comment của bạn trước ba giờ.",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "I will follow up after lunch. The meeting was long.",
            translation_vi: "Tôi follow up sau giờ ăn. Họp hơi dài.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "You should rest for ten minutes. You look tired.",
            translation_vi: "Bạn nên nghỉ mười phút. Trông mệt.",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "How about coffee after we finish the follow-up?",
            translation_vi: "Xong follow-up rồi đi cà phê thì sao?",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "Just to update you, the draft is ready",
        options: [
          "Just to update you, the draft is ready",
          "Just update for you, the draft is ready",
          "I update you, the draft is ready",
          "Just to updating you, the draft is ready",
        ],
        answer: "Just to update you, the draft is ready",
      },
      {
        id: "lac2",
        audio_text: "As of now, we are still on track",
        options: [
          "As of now, we are still on track",
          "As now, we are still on track",
          "As of now, we are still in track",
          "Of now as, we still track on",
        ],
        answer: "As of now, we are still on track",
      },
      {
        id: "lac3",
        audio_text: "Looking forward to your reply",
        options: [
          "Looking forward to your reply",
          "Looking forward to hear your reply",
          "Looking forward for your reply",
          "Looking forward to hearing reply only bare",
        ],
        answer: "Looking forward to your reply",
      },
      {
        id: "lac4",
        audio_text: "I see your point, but the deadline is fixed",
        options: [
          "I see your point, but the deadline is fixed",
          "I see your point, and you are wrong always",
          "I am not agree, but the deadline is fixed",
          "I see point your, but deadline fixed only",
        ],
        answer: "I see your point, but the deadline is fixed",
      },
      {
        id: "lac5",
        audio_text: "You should rest for ten minutes",
        options: [
          "You should rest for ten minutes",
          "You should to rest for ten minutes",
          "You ought rest for ten minutes",
          "You should resting for ten minutes",
        ],
        answer: "You should rest for ten minutes",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Just to update you, the draft is ready.",
        vi: "Cập nhật nhanh: bản nháp đã xong.",
      },
      {
        en: "As of now, we are still on track.",
        vi: "Tính đến hiện tại, chúng ta vẫn đúng tiến độ.",
      },
      {
        en: "Let's check the agenda first.",
        vi: "Xem agenda trước đã.",
      },
      {
        en: "Shall we move on?",
        vi: "Chúng ta chuyển mục tiếp theo nhé?",
      },
      {
        en: "I see your point, but Friday feels tight.",
        vi: "Tôi hiểu ý bạn, nhưng thứ Sáu hơi gấp.",
      },
      {
        en: "I'm afraid I disagree with that timeline.",
        vi: "Tôi e là không đồng ý timeline đó.",
      },
      {
        en: "Looking forward to your reply.",
        vi: "Mong nhận phản hồi của bạn.",
      },
      {
        en: "Please find attached the weekly report.",
        vi: "Đính kèm báo cáo tuần.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s giao tiếp công sở: (1) 1–2 câu update (Just to update you… / As of now… / on track); (2) 1 câu meeting hoặc email (agenda / Shall we move on? / Looking forward to… / Please find attached… / Could you please…); (3) 1 soft disagree hoặc action item/follow up; (4) tùy chọn ôn b1-12: should/ought to hoặc How about…",
    successCriteria_vi: [
      "Có ≥1 update frame (Just to update you… / As of now… / on track)",
      "Có ≥1 meeting hoặc email phrase",
      "Có soft disagree hoặc action item / follow up",
      "Không Looking forward to hear / I am agree / Please find attach / Could you please to…",
    ],
    scaffold_en: [
      "Just to update you… / As of now…",
      "We're on track… / Let's check the agenda…",
      "I see your point, but… / I'm afraid I disagree…",
      "Looking forward to… / Please find attached…",
      "You should… / How about… (ôn b1-12)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct workplace update opener",
        options: [
          "Just to update you, the draft is ready.",
          "I update you, the draft is ready.",
          "Just update for you the draft ready.",
          "Updating you just the draft is ready.",
        ],
        answer: "Just to update you, the draft is ready.",
      },
      {
        id: "q2",
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
        id: "q3",
        type: "mcq",
        question: "Soft disagreement example",
        options: [
          "I see your point, but the deadline is fixed.",
          "You are wrong and stupid.",
          "I am not agree bare always.",
          "Disagree I with you only.",
        ],
        answer: "I see your point, but the deadline is fixed.",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Looking forward to hear from you. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "on track means roughly",
        options: [
          "on schedule / progressing as planned",
          "only finished forever",
          "only a train station noun",
          "only past continuous always",
        ],
        answer: "on schedule / progressing as planned",
      },
      {
        id: "q6",
        type: "true-false",
        question: "Please find attach the report. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-12) Correct advice line",
        options: [
          "You should rest for ten minutes.",
          "You should to rest for ten minutes.",
          "You ought rest for ten minutes.",
          "You should resting for ten minutes.",
        ],
        answer: "You should rest for ten minutes.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-12) How about is often followed by",
        options: [
          "V-ing or a noun phrase",
          "only bare must",
          "only past simple always",
          "only passive get things done",
        ],
        answer: "V-ing or a noun phrase",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-12) Correct symptom line",
        options: [
          "I have a headache.",
          "I have headache.",
          "I has a headache.",
          "I am have a headache.",
        ],
        answer: "I have a headache.",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-12) You should to rest after the meeting. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "agenda · update · attached",
    description_vi:
      "agenda /əˈdʒendə/ nhấn 2. update /ˈʌpdeɪt/ (n) · /ʌpˈdeɪt/ (v) — meeting hay dùng stress 1 cho noun. attached /əˈtætʃt/ cuối /tʃt/ rõ. Nối: just_to_update_you · as_of_now · looking_forward_to · on_track.",
    examples: [
      { word: "agenda", tip_vi: "a-GEN-da — nhấn 2" },
      { word: "update", tip_vi: "UP-date (n) / up-DATE (v)" },
      { word: "attached", tip_vi: "a-TACHED — /tʃt/ cuối" },
      { word: "forward", tip_vi: "FOR-ward — không /fɔːwɜːd/ dài" },
    ],
  },
};

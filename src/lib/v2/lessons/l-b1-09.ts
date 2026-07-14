import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — get things done + polite requests.
 * Core: get/have something done (light) · Could you…? · Would you mind + V-ing…?
 * Work/life: print/fix/deliver + repair/book. Spiral: b1-08 likes/opinions.
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB109: LessonSpec = {
  id: "l-b1-09",
  phase: "P3",
  cefr: "B1",
  title_vi: "Nhờ làm hộ (get things done)",
  estimatedMin: 40,
  canDo: [
    "Nhờ người khác: Could you…? / Would you mind + V-ing…?",
    "Nói việc nhờ làm: get/have something done (light)",
    "Work/life: print, fix, book, deliver — lịch sự, rõ deadline",
  ],
  situation:
    "Office + life: bạn cần in slide, sửa laptop, book phòng họp. Nói 45–60 giây: 1 request (Could you… / Would you mind…), 1 get/have something done, 1 deadline hoặc prefer (ôn b1-08).",
  culturalNote_vi:
    "Get/have something done = nhờ/thuê người khác làm (I got my laptop fixed). Không: I got fix my laptop. Request lịch sự: Could you…? / Would you mind + V-ing…? (không bare verb sau mind). Tránh: Can you to help / Would you mind to open.",
  jobAngle:
    "Print slides, fix laptop, book room, deliver package — Could you, Would you mind, get/have done",
  lexis: [
    {
      id: "v1",
      word: "get something done",
      phonetic: "/ɡet ˈsʌmθɪŋ dʌn/",
      meaning_vi: "nhờ/thuê làm xong việc gì",
      example_en: "I need to get this report printed today.",
      l1_note_vi:
        "get + object + past participle. Không: get fix / get to print by me alone sense.",
    },
    {
      id: "v2",
      word: "have something done",
      phonetic: "/hæv ˈsʌmθɪŋ dʌn/",
      meaning_vi: "nhờ người khác làm (hơi formal)",
      example_en: "We had the office cleaned last week.",
      l1_note_vi:
        "have + object + V3. Gần nghĩa get something done; have formal hơn.",
    },
    {
      id: "v3",
      word: "Could you…?",
      phonetic: "/kʊd juː/",
      meaning_vi: "Bạn có thể…? (lịch sự)",
      example_en: "Could you print these slides for me?",
      l1_note_vi:
        "Could you + bare verb. Lịch sự hơn Can you. Không: Could you to print.",
    },
    {
      id: "v4",
      word: "Would you mind…?",
      phonetic: "/wʊd juː maɪnd/",
      meaning_vi: "Bạn có phiền… không?",
      example_en: "Would you mind sending the file again?",
      l1_note_vi:
        "Would you mind + V-ing. Không: mind to send / mind send.",
    },
    {
      id: "v5",
      word: "fix",
      phonetic: "/fɪks/",
      meaning_vi: "sửa",
      example_en: "I got my laptop fixed this morning.",
      l1_note_vi:
        "fix (v/n). get X fixed = nhờ sửa X.",
    },
    {
      id: "v6",
      word: "print",
      phonetic: "/prɪnt/",
      meaning_vi: "in (tài liệu)",
      example_en: "Could you print the agenda for the meeting?",
      l1_note_vi:
        "print + object. get something printed.",
    },
    {
      id: "v7",
      word: "book",
      phonetic: "/bʊk/",
      meaning_vi: "đặt (phòng/lịch)",
      example_en: "I need to get a meeting room booked for 3 p.m.",
      l1_note_vi:
        "book a room / a table. ≠ book (sách) trong ngữ cảnh này.",
    },
    {
      id: "v8",
      word: "deliver",
      phonetic: "/dɪˈlɪvə/",
      meaning_vi: "giao / chuyển",
      example_en: "We had the package delivered to the office.",
      l1_note_vi:
        "deliver to + place. get something delivered.",
    },
    {
      id: "v9",
      word: "favor",
      phonetic: "/ˈfeɪvə/",
      meaning_vi: "việc nhờ vả / ân huệ",
      example_en: "Could you do me a favor and check this draft?",
      l1_note_vi:
        "do someone a favor. BrE: favour. Không: make a favor.",
    },
    {
      id: "v10",
      word: "as soon as possible",
      phonetic: "/əz suːn əz ˈpɒsəbl/",
      meaning_vi: "càng sớm càng tốt",
      example_en: "Could you send it as soon as possible?",
      l1_note_vi:
        "ASAP (informal email). Full phrase lịch sự hơn trong nói.",
    },
    {
      id: "v11",
      word: "arrange",
      phonetic: "/əˈreɪndʒ/",
      meaning_vi: "sắp xếp",
      example_en: "I'll arrange to have the slides printed.",
      l1_note_vi:
        "arrange + to V / arrange for someone to V.",
    },
    {
      id: "v12",
      word: "by Friday",
      phonetic: "/baɪ ˈfraɪdeɪ/",
      meaning_vi: "trước/vào thứ Sáu (deadline)",
      example_en: "Can we get this done by Friday?",
      l1_note_vi:
        "by + day = không muộn hơn. until ≠ by trong deadline.",
    },
  ],
  grammar: {
    title: "Get things done & polite requests",
    rule: "get/have + obj + V3 · Could you + V? · Would you mind + V-ing?",
    examples: [
      {
        en: "I got my laptop fixed. We had the room cleaned.",
        vi: "Tôi đã nhờ sửa laptop. Chúng tôi nhờ dọn phòng.",
      },
      {
        en: "Could you print these slides for me?",
        vi: "Bạn có thể in giúp các slide này không?",
      },
      {
        en: "Would you mind sending the file again?",
        vi: "Bạn có phiền gửi lại file không?",
      },
    ],
    vnNote:
      "Nhờ làm: get/have + object + past participle (I got it fixed). Request: Could you + bare V? · Would you mind + V-ing? Sai hay gặp: get fix my laptop / Could you to help / Would you mind to open / make a favor.",
    ccq: {
      question: "Câu nào đúng khi nhờ in tài liệu?",
      options: [
        "Could you print this for me?",
        "Could you to print this for me?",
        "Would you mind print this for me?",
        "I get print this for me",
      ],
      answer: "Could you print this for me?",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Nhờ sửa: I got my laptop ___.",
      options: ["fixed", "fix", "fixing", "to fix"],
      answer: "fixed",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Would you mind ___ the window?",
      options: ["opening", "open", "to open", "opened"],
      answer: "opening",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: Could / you / print / these / slides",
      words: ["Could", "you", "print", "these", "slides"],
      answer: "Could you print these slides",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: I got fix my phone yesterday.",
      stem: "I got fix my phone yesterday.",
      answer: "I got my phone fixed yesterday.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "Request lịch sự hơn Can you:",
      options: [
        "Could you…?",
        "You must now",
        "Fix it quick me",
        "I order you print",
      ],
      answer: "Could you…?",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "have the package delivered means:",
      options: [
        "nhờ/thuê giao gói hàng",
        "tự giao bằng tay luôn",
        "chỉ đọc email",
        "hủy đơn hàng",
      ],
      answer: "nhờ/thuê giao gói hàng",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Colleague — print & send",
        context_vi: "Office: nhờ in slide + gửi file; Could you + get printed.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "Could you print these slides for me? I need them by 2 p.m.",
            translation_vi:
              "Bạn in giúp các slide này được không? Tôi cần trước 2 giờ.",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "Sure. I'll get them printed now.",
            translation_vi: "Được. Tôi sẽ nhờ/in xong ngay.",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "Would you mind sending the PDF to the client as well?",
            translation_vi: "Bạn có phiền gửi PDF cho client luôn không?",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "No problem. I'll send it as soon as possible.",
            translation_vi: "Không sao. Tôi sẽ gửi càng sớm càng tốt.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "Thanks. Can we get the handouts done by Friday?",
            translation_vi: "Cảm ơn. Handout xong trước thứ Sáu được không?",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "Yes. I'll arrange to have them printed tomorrow.",
            translation_vi: "Được. Tôi sắp xếp in vào ngày mai.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Life — fix laptop & book room",
        context_vi: "Sửa máy + đặt phòng họp; get fixed + Would you mind.",
        lines: [
          {
            id: "1",
            speaker: "Hoa",
            text: "My laptop is slow. I need to get it fixed this week.",
            translation_vi: "Laptop chậm. Tuần này tôi cần nhờ sửa.",
          },
          {
            id: "2",
            speaker: "Tuan",
            text: "Could you book a meeting room for us at 3 p.m.?",
            translation_vi: "Bạn đặt phòng họp lúc 3 giờ giúp được không?",
          },
          {
            id: "3",
            speaker: "Hoa",
            text: "I'll get a room booked. Would you mind checking the projector?",
            translation_vi:
              "Tôi sẽ đặt phòng. Bạn kiểm tra máy chiếu giúp được không?",
          },
          {
            id: "4",
            speaker: "Tuan",
            text: "Of course. We had the office cleaned yesterday, so the room should be fine.",
            translation_vi:
              "Tất nhiên. Hôm qua đã nhờ dọn office, phòng sẽ ổn.",
          },
          {
            id: "5",
            speaker: "Hoa",
            text: "Great. I prefer a quiet room. Could you do me a favor and add that note?",
            translation_vi:
              "Hay. Tôi thích phòng yên. Bạn ghi chú giúp được không?",
          },
          {
            id: "6",
            speaker: "Tuan",
            text: "Done. I think the small room near the metro entrance is best.",
            translation_vi:
              "Xong. Tôi nghĩ phòng nhỏ gần lối metro là ổn nhất.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "Could you print these slides for me",
        options: [
          "Could you print these slides for me",
          "Could you to print these slides for me",
          "Would you mind print these slides",
          "I get print these slides for me",
        ],
        answer: "Could you print these slides for me",
      },
      {
        id: "lac2",
        audio_text: "I got my laptop fixed this morning",
        options: [
          "I got my laptop fixed this morning",
          "I got fix my laptop this morning",
          "I get my laptop fix this morning",
          "I had fix my laptop this morning",
        ],
        answer: "I got my laptop fixed this morning",
      },
      {
        id: "lac3",
        audio_text: "Would you mind sending the file again",
        options: [
          "Would you mind sending the file again",
          "Would you mind to send the file again",
          "Would you mind send the file again",
          "Could you mind sending the file",
        ],
        answer: "Would you mind sending the file again",
      },
      {
        id: "lac4",
        audio_text: "We had the package delivered to the office",
        options: [
          "We had the package delivered to the office",
          "We had deliver the package to the office",
          "We got deliver package the office",
          "We have the package deliver office",
        ],
        answer: "We had the package delivered to the office",
      },
      {
        id: "lac5",
        audio_text: "Can we get this done by Friday",
        options: [
          "Can we get this done by Friday",
          "Can we get this do by Friday",
          "Can we get done this by Friday",
          "Can we have do this by Friday",
        ],
        answer: "Can we get this done by Friday",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Could you print these slides for me?",
        vi: "Bạn in giúp các slide này được không?",
      },
      {
        en: "Would you mind sending the file again?",
        vi: "Bạn có phiền gửi lại file không?",
      },
      {
        en: "I got my laptop fixed this morning.",
        vi: "Sáng nay tôi đã nhờ sửa laptop.",
      },
      {
        en: "We had the package delivered to the office.",
        vi: "Chúng tôi đã nhờ giao gói hàng tới office.",
      },
      {
        en: "I'll get a meeting room booked for 3 p.m.",
        vi: "Tôi sẽ đặt phòng họp lúc 3 giờ.",
      },
      {
        en: "Can we get this done by Friday?",
        vi: "Việc này xong trước thứ Sáu được không?",
      },
      {
        en: "Could you do me a favor and check this draft?",
        vi: "Bạn kiểm tra giúp bản nháp này được không?",
      },
      {
        en: "I'll arrange to have the slides printed.",
        vi: "Tôi sẽ sắp xếp để in các slide.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s work/life: (1) 1 request (Could you… hoặc Would you mind + V-ing); (2) 1 get/have something done; (3) deadline (by…) hoặc ôn b1-08 (prefer / I think) 1 lần.",
    successCriteria_vi: [
      "Có Could you… hoặc Would you mind + V-ing",
      "Có get/have + object + past participle",
      "Có deadline by… hoặc prefer/I think (ôn)",
      "Nói rõ 1 việc work hoặc life (print / fix / book / deliver)",
    ],
    scaffold_en: [
      "Could you… for me?",
      "Would you mind + V-ing…?",
      "I got / I'll get + object + V3…",
      "Can we get this done by…? / I prefer… / I think…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct request line",
        options: [
          "Could you print this for me?",
          "Could you to print this for me?",
          "Would you mind print this for me?",
          "I get print this for me",
        ],
        answer: "Could you print this for me?",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Would you mind is followed by",
        options: [
          "V-ing",
          "bare must only",
          "than + adjective only",
          "located + place only",
        ],
        answer: "V-ing",
      },
      {
        id: "q3",
        type: "mcq",
        question: "I got my laptop fixed means",
        options: [
          "someone fixed my laptop (I arranged it)",
          "I fixed someone else's laptop only",
          "I never used a laptop",
          "only future plan without help",
        ],
        answer: "someone fixed my laptop (I arranged it)",
      },
      {
        id: "q4",
        type: "true-false",
        question: "I got fix my phone yesterday. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "get something done means",
        options: [
          "nhờ/thuê làm xong việc gì",
          "chỉ tự làm một mình luôn",
          "hủy việc",
          "chỉ past continuous",
        ],
        answer: "nhờ/thuê làm xong việc gì",
      },
      {
        id: "q6",
        type: "true-false",
        question: "Would you mind to open the window? (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-08) Correct preference line",
        options: [
          "I prefer Slack to email",
          "I more prefer Slack than email",
          "I prefer than Slack email",
          "I am prefer Slack to email",
        ],
        answer: "I prefer Slack to email",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-08) Soft disagreement phrase",
        options: [
          "I see your point, but…",
          "You are totally wrong now",
          "I am agree no way",
          "According to me you bad",
        ],
        answer: "I see your point, but…",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-08) enjoy is followed by",
        options: [
          "V-ing / noun",
          "bare must only",
          "than + adjective only",
          "located + place only",
        ],
        answer: "V-ing / noun",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-08) I am agree with you. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "could /kʊd/ · fixed /fɪkst/",
    description_vi:
      "Could /kʊd/ (không /kuːld/). mind /maɪnd/. fixed /fɪkst/ — /t/ cuối. would /wʊd/. Nối: Could_you · mind_sending · get_it_fixed · by_Friday.",
    examples: [
      { word: "could", tip_vi: "/kʊd/ ngắn" },
      { word: "mind", tip_vi: "/maɪnd/" },
      { word: "fixed", tip_vi: "/fɪkst/ cuối /t/" },
      { word: "delivered", tip_vi: "di-LIV-erd" },
    ],
  },
};

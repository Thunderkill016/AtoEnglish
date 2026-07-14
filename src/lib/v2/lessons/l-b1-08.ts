import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — likes/dislikes + opinion phrases + soft disagreement.
 * Core: like/enjoy + V-ing · prefer A to B · I think / in my opinion · I see your point, but…
 * Work/life: tool/schedule preferences, team debate soft. Spiral: b1-07 people/places.
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB108: LessonSpec = {
  id: "l-b1-08",
  phase: "P3",
  cefr: "B1",
  title_vi: "Sở thích & ý kiến",
  estimatedMin: 40,
  canDo: [
    "Nói sở thích: like/enjoy + V-ing · prefer A to B",
    "Đưa ý kiến: I think / in my opinion + because…",
    "Soft disagreement: I see your point, but… / I'm not so sure…",
  ],
  situation:
    "Team standup + tool choice: đồng nghiệp hỏi 'What do you prefer?' / 'What do you think?' Bạn trả lời 45–60 giây: prefer A to B · I think… because… · soft disagree once · ≥1 like/enjoy + V-ing.",
  culturalNote_vi:
    "Like/enjoy + V-ing (không bare verb). Prefer A to B (không prefer than). Opinion: I think / In my opinion + full sentence. Soft disagree: I see your point, but… / I'm not so sure… — lịch sự hơn 'You're wrong'. Tránh: I more prefer / According to me / I am agree.",
  jobAngle:
    "Tool choice, remote vs office, standup debate — prefer, I think, soft disagree, enjoy",
  lexis: [
    {
      id: "v1",
      word: "prefer",
      phonetic: "/prɪˈfɜː/",
      meaning_vi: "thích hơn / ưu tiên",
      example_en: "I prefer remote work to the office.",
      l1_note_vi:
        "prefer A to B. Không: prefer than / more prefer.",
    },
    {
      id: "v2",
      word: "enjoy",
      phonetic: "/ɪnˈdʒɔɪ/",
      meaning_vi: "thích / tận hưởng",
      example_en: "I enjoy working in small teams.",
      l1_note_vi:
        "enjoy + V-ing / noun. Không: enjoy to work.",
    },
    {
      id: "v3",
      word: "like",
      phonetic: "/laɪk/",
      meaning_vi: "thích",
      example_en: "I like reading product specs.",
      l1_note_vi:
        "like + V-ing (hobby). He/She likes (có -s).",
    },
    {
      id: "v4",
      word: "dislike",
      phonetic: "/dɪsˈlaɪk/",
      meaning_vi: "không thích",
      example_en: "I dislike long meetings without an agenda.",
      l1_note_vi:
        "dislike + N/V-ing. Lịch sự hơn hate trong công sở.",
    },
    {
      id: "v5",
      word: "I think",
      phonetic: "/aɪ θɪŋk/",
      meaning_vi: "tôi nghĩ",
      example_en: "I think Slack is faster for quick questions.",
      l1_note_vi:
        "I think + clause. Không: I thinking / I am think.",
    },
    {
      id: "v6",
      word: "in my opinion",
      phonetic: "/ɪn maɪ əˈpɪnjən/",
      meaning_vi: "theo ý tôi",
      example_en: "In my opinion, morning standups work best.",
      l1_note_vi:
        "In my opinion, + full sentence. Không: According to me.",
    },
    {
      id: "v7",
      word: "I see your point",
      phonetic: "/aɪ siː jɔː pɔɪnt/",
      meaning_vi: "tôi hiểu ý bạn",
      example_en: "I see your point, but cost matters too.",
      l1_note_vi:
        "Soft disagree mở đầu. Thường + but / however.",
    },
    {
      id: "v8",
      word: "I'm not so sure",
      phonetic: "/aɪm nɒt səʊ ʃʊə/",
      meaning_vi: "tôi chưa chắc lắm",
      example_en: "I'm not so sure that plan is realistic.",
      l1_note_vi:
        "Soft hedge. ≠ I don't agree (mạnh hơn).",
    },
    {
      id: "v9",
      word: "rather",
      phonetic: "/ˈrɑːðə/",
      meaning_vi: "hơn / thà",
      example_en: "I'd rather finish early than stay late.",
      l1_note_vi:
        "I'd rather + V (bare). rather than + V.",
    },
    {
      id: "v10",
      word: "hobby",
      phonetic: "/ˈhɒbi/",
      meaning_vi: "sở thích / thú vui",
      example_en: "My main hobby is cooking Vietnamese food.",
      l1_note_vi:
        "hobby (n). hobbies (pl). free-time activity.",
    },
    {
      id: "v11",
      word: "agree",
      phonetic: "/əˈɡriː/",
      meaning_vi: "đồng ý",
      example_en: "I agree with the tool choice.",
      l1_note_vi:
        "agree with + person/idea. Không: I am agree.",
    },
    {
      id: "v12",
      word: "because",
      phonetic: "/bɪˈkɒz/",
      meaning_vi: "vì",
      example_en: "I prefer Plan B because it is clearer.",
      l1_note_vi:
        "because + clause. because of + N.",
    },
  ],
  grammar: {
    title: "Likes, opinions & soft disagreement",
    rule: "like/enjoy + V-ing · prefer A to B · I think… · soft but…",
    examples: [
      {
        en: "I enjoy working remotely. I prefer Slack to email.",
        vi: "Tôi thích làm remote. Tôi ưu tiên Slack hơn email.",
      },
      {
        en: "I think morning standups work best because they are short.",
        vi: "Tôi nghĩ standup sáng ổn nhất vì ngắn.",
      },
      {
        en: "I see your point, but cost matters too.",
        vi: "Tôi hiểu ý bạn, nhưng chi phí cũng quan trọng.",
      },
    ],
    vnNote:
      "Sở thích: like/enjoy + V-ing · prefer A to B · I'd rather + V. Ý kiến: I think / In my opinion + clause + because. Soft disagree: I see your point, but… / I'm not so sure…. Sai hay gặp: I more prefer / enjoy to work / According to me / I am agree.",
    ccq: {
      question: "Câu nào đúng khi so sánh sở thích?",
      options: [
        "I prefer Slack to email",
        "I more prefer Slack than email",
        "I prefer than Slack email",
        "I am prefer Slack to email",
      ],
      answer: "I prefer Slack to email",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Sở thích: I ___ working in small teams.",
      options: ["enjoy", "enjoy to", "am enjoy", "enjoys"],
      answer: "enjoy",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Ưu tiên: I prefer coffee ___ tea.",
      options: ["to", "than", "from", "of"],
      answer: "to",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: I / think / this / plan / is / clearer",
      words: ["I", "think", "this", "plan", "is", "clearer"],
      answer: "I think this plan is clearer",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: I more prefer remote work.",
      stem: "I more prefer remote work.",
      answer: "I prefer remote work.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "Soft disagreement mở đầu lịch sự:",
      options: [
        "I see your point, but…",
        "You are totally wrong",
        "I am agree no",
        "According to me you bad",
      ],
      answer: "I see your point, but…",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "In my opinion is followed by:",
      options: [
        "a full sentence",
        "only one adjective",
        "bare verb only",
        "than + noun only",
      ],
      answer: "a full sentence",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Colleague — tool preference",
        context_vi: "Team chọn tool chat: prefer + because + like/enjoy.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "What do you prefer for daily updates — Slack or email?",
            translation_vi: "Bạn ưu tiên cập nhật hàng ngày bằng Slack hay email?",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "I prefer Slack to email because it is faster.",
            translation_vi: "Tôi ưu tiên Slack hơn email vì nhanh hơn.",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "Do you enjoy writing long reports?",
            translation_vi: "Bạn có thích viết báo cáo dài không?",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "Not really. I like short notes. I dislike long meetings without an agenda.",
            translation_vi:
              "Không hẳn. Tôi thích ghi chú ngắn. Không thích họp dài không agenda.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "What do you think about morning standups?",
            translation_vi: "Bạn nghĩ sao về standup buổi sáng?",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "In my opinion, morning standups work best because they are short.",
            translation_vi:
              "Theo ý tôi, standup sáng ổn nhất vì ngắn gọn.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Meeting — soft disagreement",
        context_vi: "Tranh luận nhẹ remote vs office; soft disagree + reason.",
        lines: [
          {
            id: "1",
            speaker: "Hoa",
            text: "I think everyone should come to the office every day.",
            translation_vi: "Tôi nghĩ mọi người nên vào văn phòng mỗi ngày.",
          },
          {
            id: "2",
            speaker: "Tuan",
            text: "I see your point, but I prefer remote work two days a week.",
            translation_vi:
              "Tôi hiểu ý bạn, nhưng tôi ưu tiên remote hai ngày/tuần.",
          },
          {
            id: "3",
            speaker: "Hoa",
            text: "Why do you prefer that?",
            translation_vi: "Vì sao bạn ưu tiên vậy?",
          },
          {
            id: "4",
            speaker: "Tuan",
            text: "Because I enjoy focusing at home. I'd rather finish early than stay late.",
            translation_vi:
              "Vì tôi thích tập trung ở nhà. Thà xong sớm còn hơn ở muộn.",
          },
          {
            id: "5",
            speaker: "Hoa",
            text: "I'm not so sure that works for new hires.",
            translation_vi: "Tôi chưa chắc cách đó ổn với người mới.",
          },
          {
            id: "6",
            speaker: "Tuan",
            text: "I agree with that. New hires need more office days at first.",
            translation_vi:
              "Tôi đồng ý. Người mới cần nhiều ngày office hơn lúc đầu.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I prefer Slack to email",
        options: [
          "I prefer Slack to email",
          "I more prefer Slack than email",
          "I prefer than Slack email",
          "I am prefer Slack to email",
        ],
        answer: "I prefer Slack to email",
      },
      {
        id: "lac2",
        audio_text: "I enjoy working in small teams",
        options: [
          "I enjoy working in small teams",
          "I enjoy to work in small teams",
          "I am enjoy working in small teams",
          "I enjoys working in small teams",
        ],
        answer: "I enjoy working in small teams",
      },
      {
        id: "lac3",
        audio_text: "I think morning standups work best",
        options: [
          "I think morning standups work best",
          "I thinking morning standups work best",
          "I am think morning standups work best",
          "According to me morning standups",
        ],
        answer: "I think morning standups work best",
      },
      {
        id: "lac4",
        audio_text: "I see your point, but cost matters too",
        options: [
          "I see your point, but cost matters too",
          "I see your point but you wrong",
          "I am agree your point but cost",
          "I see you point, cost matter",
        ],
        answer: "I see your point, but cost matters too",
      },
      {
        id: "lac5",
        audio_text: "In my opinion, this plan is clearer",
        options: [
          "In my opinion, this plan is clearer",
          "According to me, this plan is clearer",
          "In my opinion this plan clearer only",
          "Me opinion this plan is clearer",
        ],
        answer: "In my opinion, this plan is clearer",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "I prefer Slack to email.",
        vi: "Tôi ưu tiên Slack hơn email.",
      },
      {
        en: "I enjoy working in small teams.",
        vi: "Tôi thích làm việc trong team nhỏ.",
      },
      {
        en: "I like short notes, not long reports.",
        vi: "Tôi thích ghi chú ngắn, không báo cáo dài.",
      },
      {
        en: "I dislike meetings without an agenda.",
        vi: "Tôi không thích họp không có agenda.",
      },
      {
        en: "I think morning standups work best.",
        vi: "Tôi nghĩ standup sáng ổn nhất.",
      },
      {
        en: "In my opinion, this plan is clearer.",
        vi: "Theo ý tôi, kế hoạch này rõ hơn.",
      },
      {
        en: "I see your point, but cost matters too.",
        vi: "Tôi hiểu ý bạn, nhưng chi phí cũng quan trọng.",
      },
      {
        en: "I'm not so sure that plan is realistic.",
        vi: "Tôi chưa chắc kế hoạch đó thực tế.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s work/life: (1) 1 sở thích (like/enjoy + V-ing hoặc prefer A to B); (2) 1 ý kiến (I think / in my opinion + because); (3) soft disagree 1 lần (I see your point, but… hoặc I'm not so sure…).",
    successCriteria_vi: [
      "Có like/enjoy + V-ing hoặc prefer A to B",
      "Có I think hoặc In my opinion + because",
      "Có soft disagreement ≥1 lần",
      "Nói rõ 1 topic work (tool / schedule / remote)",
    ],
    scaffold_en: [
      "I prefer A to B because…",
      "I enjoy / like + V-ing…",
      "I think… / In my opinion… because…",
      "I see your point, but… / I'm not so sure…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct preference line",
        options: [
          "I prefer remote work to the office",
          "I more prefer remote work than office",
          "I prefer than remote the office",
          "I am prefer remote work",
        ],
        answer: "I prefer remote work to the office",
      },
      {
        id: "q2",
        type: "mcq",
        question: "enjoy is followed by",
        options: [
          "V-ing / noun",
          "bare must only",
          "than + adjective only",
          "located + place only",
        ],
        answer: "V-ing / noun",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Soft disagreement phrase",
        options: [
          "I see your point, but…",
          "You are totally wrong now",
          "I am agree no way",
          "According to me you bad",
        ],
        answer: "I see your point, but…",
      },
      {
        id: "q4",
        type: "true-false",
        question: "I more prefer Slack than email. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "In my opinion means",
        options: [
          "theo ý tôi",
          "chỉ theo báo cáo news",
          "chỉ past tense",
          "chỉ location",
        ],
        answer: "theo ý tôi",
      },
      {
        id: "q6",
        type: "true-false",
        question: "I am agree with you. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-07) Correct appearance line",
        options: [
          "She looks well-dressed today",
          "She look well-dressed today",
          "She is look well-dressed today",
          "She looks like well-dressed today",
        ],
        answer: "She looks well-dressed today",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-07) look like means",
        options: [
          "trông giống / trông như",
          "chỉ chiều cao",
          "nằm ở đâu",
          "luôn là quá khứ",
        ],
        answer: "trông giống / trông như",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-07) Correct place line",
        options: [
          "The office is located near the metro",
          "The office locate near the metro",
          "The office is locate near the metro",
          "The office looks near the metro only",
        ],
        answer: "The office is located near the metro",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-07) She look tall and friendly. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "prefer /prɪˈfɜː/ · opinion /əˈpɪnjən/",
    description_vi:
      "prefer stress pre-FER. opinion o-PIN-ion. enjoy /ɪnˈdʒɔɪ/ — /dʒ/. rather /ˈrɑːðə/ (Br) or /ˈræðər/ (Am). Nối: prefer_to · see_your_point · not_so_sure.",
    examples: [
      { word: "prefer", tip_vi: "pre-FER stress 2" },
      { word: "opinion", tip_vi: "o-PIN-ion" },
      { word: "enjoy", tip_vi: "/ɪnˈdʒɔɪ/" },
      { word: "rather", tip_vi: "I'd rather + V" },
    ],
  },
};

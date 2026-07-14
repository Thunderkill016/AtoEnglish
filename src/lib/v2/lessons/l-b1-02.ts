import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — short news: main idea (read/listen).
 * Core: past simple (what happened) + present (current situation) + light opinion
 * (I think… / In my opinion…). Lexis for headlines, summary, report.
 * Spiral: a2-08 gate sample (past / plan / experience / work / help).
 * L1 notes ≥50% (B1 schema gate); aim high for VN adults.
 */
export const lessonB102: LessonSpec = {
  id: "l-b1-02",
  phase: "P3",
  cefr: "B1",
  title_vi: "Tin tức & ý chính",
  estimatedMin: 40,
  canDo: [
    "Hiểu ý chính tin ngắn (headline + 2–3 câu) khi đọc/nghe",
    "Tóm tắt: what happened (past) + now (present) trong 2–4 câu",
    "Đưa ý kiến nhẹ: I think… / In my opinion… + because…",
  ],
  situation:
    "Trước stand-up, đồng nghiệp nước ngoài hỏi: 'Did you see the news about the new office policy?' Bạn chỉ có 30–45 giây: tóm tắt ý chính (không đọc lại cả bài), nói chuyện gì đã xảy ra, hiện giờ thế nào, và ý kiến ngắn của bạn.",
  culturalNote_vi:
    "Ở môi trường quốc tế, 'Did you see the news…?' thường cần main idea trước chi tiết. Mẫu an toàn: According to the news… / The main point is… / They announced… Then: Now the company… Finally light opinion: I think it's fair because…. Tránh dịch word-by-word cả headline; đừng trộn thì lung tung (Yesterday they announce…).",
  jobAngle: "Office small talk — summarize short company/news item + light opinion",
  lexis: [
    {
      id: "v1",
      word: "headline",
      phonetic: "/ˈhedlaɪn/",
      meaning_vi: "tiêu đề tin",
      example_en: "The headline says the company will hire more staff.",
      l1_note_vi:
        "headline = tiêu đề. the headlines = tin chính. Không: head line (hai từ).",
    },
    {
      id: "v2",
      word: "main idea",
      phonetic: "/meɪn aɪˈdɪə/",
      meaning_vi: "ý chính",
      example_en: "What's the main idea of this short news?",
      l1_note_vi:
        "main idea / main point = ý chính (không phải mọi chi tiết). the main idea is that…",
    },
    {
      id: "v3",
      word: "according to",
      phonetic: "/əˈkɔːdɪŋ tuː/",
      meaning_vi: "theo (nguồn)",
      example_en: "According to the report, sales rose last month.",
      l1_note_vi:
        "According to + noun (the news / the report). Không: According to me (dùng In my opinion).",
    },
    {
      id: "v4",
      word: "announce",
      phonetic: "/əˈnaʊns/",
      meaning_vi: "thông báo",
      example_en: "They announced a new hybrid work policy yesterday.",
      l1_note_vi:
        "announce + noun / that-clause. Past: announced. Không: announce about (thừa about).",
    },
    {
      id: "v5",
      word: "report",
      phonetic: "/rɪˈpɔːt/",
      meaning_vi: "báo cáo / tin",
      example_en: "The report shows better results this quarter.",
      l1_note_vi:
        "a report (n); report (v) = báo cáo. news report = bản tin.",
    },
    {
      id: "v6",
      word: "recently",
      phonetic: "/ˈriːsntli/",
      meaning_vi: "gần đây",
      example_en: "Recently, the company opened a new office.",
      l1_note_vi:
        "recently hay đi với present perfect hoặc past simple tùy ngữ cảnh. Stress RE-cent-ly.",
    },
    {
      id: "v7",
      word: "increase",
      phonetic: "/ˈɪnkriːs/ (n) /ɪnˈkriːs/ (v)",
      meaning_vi: "tăng / sự tăng",
      example_en: "Sales increased last year. There is an increase now.",
      l1_note_vi:
        "increase (v) stress in-CREASE; (n) IN-crease. rise ≈ increase (số liệu).",
    },
    {
      id: "v8",
      word: "I think",
      phonetic: "/aɪ θɪŋk/",
      meaning_vi: "tôi nghĩ",
      example_en: "I think the new policy is fair.",
      l1_note_vi:
        "I think + clause. Soften: I think maybe… Không: I thinking…",
    },
    {
      id: "v9",
      word: "In my opinion",
      phonetic: "/ɪn maɪ əˈpɪnjən/",
      meaning_vi: "theo ý tôi",
      example_en: "In my opinion, remote work helps focus.",
      l1_note_vi:
        "In my opinion, + full sentence. Formal hơn I think một chút. Không: According to me.",
    },
    {
      id: "v10",
      word: "summary",
      phonetic: "/ˈsʌməri/",
      meaning_vi: "tóm tắt",
      example_en: "Can you give a short summary of the news?",
      l1_note_vi:
        "give a summary / summarize (v). a short summary = tóm tắt ngắn.",
    },
    {
      id: "v11",
      word: "key point",
      phonetic: "/kiː pɔɪnt/",
      meaning_vi: "điểm then chốt",
      example_en: "The key point is that costs went down.",
      l1_note_vi:
        "key point(s) = điểm chính. the key point is that…",
    },
    {
      id: "v12",
      word: "currently",
      phonetic: "/ˈkʌrəntli/",
      meaning_vi: "hiện tại",
      example_en: "Currently, staff can work from home two days a week.",
      l1_note_vi:
        "currently = now (formal hơn). Present simple/continuous cho tình trạng hiện tại.",
    },
  ],
  grammar: {
    title: "Past event + present now + light opinion",
    rule: "Past (what happened) · present (now) · I think / In my opinion…",
    examples: [
      {
        en: "Yesterday they announced a new policy.",
        vi: "Hôm qua họ thông báo chính sách mới.",
      },
      {
        en: "Currently, staff work from home two days a week.",
        vi: "Hiện tại nhân viên làm remote hai ngày/tuần.",
      },
      {
        en: "I think it's a good idea because it saves time.",
        vi: "Tôi nghĩ đó là ý hay vì tiết kiệm thời gian.",
      },
    ],
    vnNote:
      "Tin ngắn B1: (1) quá khứ — chuyện gì đã xảy ra (announced, rose, opened); (2) hiện tại — tình hình now/currently; (3) ý kiến nhẹ + because. Đừng nhảy thì lung tung: Yesterday they announce… / Now they opened yesterday…",
    ccq: {
      question: "Câu nào tự nhiên khi tóm tắt tin?",
      options: [
        "Yesterday they announce a new rule",
        "Yesterday they announced a new rule",
        "Yesterday they announcing a new rule",
        "Yesterday they announces a new rule",
      ],
      answer: "Yesterday they announced a new rule",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Theo nguồn tin:",
      options: ["According to", "According me", "In according", "About to"],
      answer: "According to",
    },
    {
      id: "c2",
      type: "scramble",
      prompt_vi: "Sắp xếp: announced / They / a / new / policy",
      words: ["They", "announced", "a", "new", "policy"],
      answer: "They announced a new policy",
    },
    {
      id: "c3",
      type: "mcq",
      prompt_vi: "Ý kiến nhẹ: ___ the change is fair.",
      options: ["I think", "I thinking", "According to me", "I am think"],
      answer: "I think",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: Yesterday they announce higher prices.",
      stem: "Yesterday they announce higher prices.",
      answer: "Yesterday they announced higher prices.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "Tình trạng hiện tại:",
      options: ["Currently,", "Yesterday,", "Last year,", "Once,"],
      answer: "Currently,",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "main idea ≈",
      options: ["ý chính", "tiêu đề phụ", "ý kiến sai", "chi tiết nhỏ"],
      answer: "ý chính",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Small talk tin công ty",
        context_vi: "Hai đồng nghiệp nói về tin hybrid work trước meeting.",
        lines: [
          {
            id: "1",
            speaker: "Alex",
            text: "Did you see the news about our hybrid policy?",
            translation_vi: "Bạn thấy tin về chính sách hybrid chưa?",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "Yes. According to the email, they announced it yesterday.",
            translation_vi: "Rồi. Theo email, họ thông báo hôm qua.",
          },
          {
            id: "3",
            speaker: "Alex",
            text: "What's the main idea?",
            translation_vi: "Ý chính là gì?",
          },
          {
            id: "4",
            speaker: "Lan",
            text: "The key point is we can work from home two days a week.",
            translation_vi: "Điểm then chốt là chúng ta remote hai ngày mỗi tuần.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "Currently, the office is still open Monday to Friday.",
            translation_vi: "Hiện tại văn phòng vẫn mở thứ Hai đến thứ Sáu.",
          },
          {
            id: "6",
            speaker: "Alex",
            text: "What do you think?",
            translation_vi: "Bạn nghĩ sao?",
          },
          {
            id: "7",
            speaker: "Lan",
            text: "I think it's fair because it saves commute time.",
            translation_vi: "Tôi nghĩ công bằng vì tiết kiệm thời gian đi lại.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Tóm tắt tin sales",
        context_vi: "Manager hỏi tóm tắt tin nội bộ về sales.",
        lines: [
          {
            id: "1",
            speaker: "Manager",
            text: "Can you give a short summary of the sales news?",
            translation_vi: "Bạn tóm tắt ngắn tin sales được không?",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "Sure. The headline says sales increased last quarter.",
            translation_vi: "Được. Tiêu đề nói sales tăng quý trước.",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "Recently they opened two new stores in the south.",
            translation_vi: "Gần đây họ mở hai cửa hàng mới ở miền Nam.",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "Now the team is hiring more staff for support.",
            translation_vi: "Hiện team đang tuyển thêm người hỗ trợ.",
          },
          {
            id: "5",
            speaker: "Manager",
            text: "And your opinion?",
            translation_vi: "Còn ý kiến của bạn?",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "In my opinion, the growth is positive because demand is up.",
            translation_vi: "Theo tôi, tăng trưởng tích cực vì nhu cầu tăng.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "According to the report, sales rose last month",
        options: [
          "According to the report, sales rose last month",
          "According the report, sales rose last month",
          "According to me, sales rose last month",
          "According to the report, sales rise last month",
        ],
        answer: "According to the report, sales rose last month",
      },
      {
        id: "lac2",
        audio_text: "The main idea is the company will hire more staff",
        options: [
          "The main idea is the company will hire more staff",
          "The main idea is the company hired less staff",
          "The main idea is the company closed the office",
          "The main idea is staff will leave next week",
        ],
        answer: "The main idea is the company will hire more staff",
      },
      {
        id: "lac3",
        audio_text: "They announced a new hybrid work policy yesterday",
        options: [
          "They announced a new hybrid work policy yesterday",
          "They announce a new hybrid work policy yesterday",
          "They announced a new holiday yesterday",
          "They announced a new hybrid work policy tomorrow",
        ],
        answer: "They announced a new hybrid work policy yesterday",
      },
      {
        id: "lac4",
        audio_text: "I think it's a good idea because it saves time",
        options: [
          "I think it's a good idea because it saves time",
          "I thinking it's a good idea because it saves time",
          "I think it's a bad idea because it wastes time",
          "I think it's a good idea because it costs more",
        ],
        answer: "I think it's a good idea because it saves time",
      },
      {
        id: "lac5",
        audio_text: "Currently, staff can work from home two days a week",
        options: [
          "Currently, staff can work from home two days a week",
          "Currently, staff must work from home every day",
          "Yesterday, staff can work from home two days a week",
          "Currently, staff cannot work from home",
        ],
        answer: "Currently, staff can work from home two days a week",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Did you see the news about…?",
        vi: "Bạn thấy tin về… chưa?",
      },
      {
        en: "According to the report…",
        vi: "Theo báo cáo…",
      },
      {
        en: "The main idea is that…",
        vi: "Ý chính là…",
      },
      {
        en: "They announced it yesterday.",
        vi: "Họ thông báo hôm qua.",
      },
      {
        en: "Currently, the situation is better.",
        vi: "Hiện tình hình tốt hơn.",
      },
      {
        en: "I think it's fair because…",
        vi: "Tôi nghĩ công bằng vì…",
      },
      {
        en: "In my opinion, this is positive.",
        vi: "Theo tôi, điều này tích cực.",
      },
      {
        en: "The key point is costs went down.",
        vi: "Điểm then chốt là chi phí giảm.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Chọn 1 tin ngắn (công ty / kinh tế / công nghệ đơn giản). Nói 45–60 giây: headline/main idea → what happened (past) → now/currently → I think / In my opinion… because…",
    successCriteria_vi: [
      "Nêu được ý chính (main idea / key point), không chỉ lặp headline mơ hồ",
      "Có ≥1 sự kiện past (announced / rose / opened…)",
      "Có ≥1 câu present/currently về tình hình hiện tại",
      "Có ý kiến nhẹ + because",
    ],
    scaffold_en: [
      "Did you see the news about…?",
      "According to…, the main idea is…",
      "They announced / Recently…",
      "Currently…",
      "I think… / In my opinion… because…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "___ to the news, prices rose.",
        options: ["According", "Accordingly", "Account", "Across"],
        answer: "According",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Past of announce",
        options: ["announced", "announceed", "announcing", "announces"],
        answer: "announced",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Light opinion phrase",
        options: ["I think", "I thinking", "According to me", "Me opinion"],
        answer: "I think",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Main idea = mọi chi tiết nhỏ trong tin.",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "Currently ≈",
        options: ["hiện tại", "hôm qua", "năm ngoái", "không bao giờ"],
        answer: "hiện tại",
      },
      {
        id: "q6",
        type: "mcq",
        question: "In my opinion is followed by…",
        options: [
          "a full sentence",
          "only one word",
          "a question mark only",
          "nothing",
        ],
        answer: "a full sentence",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-08 gate) Past: Yesterday I ___ to a meeting.",
        options: ["went", "go", "going", "goes"],
        answer: "went",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-08) Future plan: I'm ___ to finish the report today.",
        options: ["going", "go", "went", "gone"],
        answer: "going",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a2-08) Experience: Have you ___ worked abroad?",
        options: ["ever", "never is", "yet not", "since"],
        answer: "ever",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn a2-08) Help: There's a problem. Can you ___ me?",
        options: ["help", "helps", "helping", "helped me to"],
        answer: "help",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "th /θ/ in think",
    description_vi:
      "think /θɪŋk/ — lưỡi chạm răng, không /t/ hay /s/. Stress: HEAD-line, MAIN idea, ac-COR-ding.",
    examples: [
      { word: "think", tip_vi: "/θ/ không thành /tink/" },
      { word: "headline", tip_vi: "stress HEAD" },
      { word: "according", tip_vi: "stress COR" },
      { word: "opinion", tip_vi: "o-PIN-ion" },
    ],
  },
};

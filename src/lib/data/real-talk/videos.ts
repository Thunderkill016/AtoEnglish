/**
 * Real Talk — Sample video data.
 *
 * Curated real YouTube conversations with full transcripts, Vietnamese translations,
 * and AI-generated lesson content following the Pre-While-Post framework.
 */

import type { RealTalkVideo, RealTalkLesson } from "@/types/real-talk";

// ─── Video 1: Easy English — What Do You Do For Fun? ───────────────────────────

export const sampleVideo: RealTalkVideo = {
  id: "what-do-you-do-for-fun",
  youtubeId: "Z5MU-5_pBfY",
  title: "What Do You Do For Fun? — Real Street Conversations",
  titleVi: "Bạn làm gì để vui? — Trò chuyện thực tế ngoài đường",
  channelName: "Easy English",
  channelUrl: "https://www.youtube.com/@EasyEnglish",
  thumbnailUrl: "https://i.ytimg.com/vi/Z5MU-5_pBfY/hqdefault.jpg",
  durationSeconds: 372,
  segment: { startSeconds: 0, endSeconds: 180 },
  level: "A1",
  topics: ["hobbies", "free_time", "daily_life", "introductions"],
  speakerCount: 3,
  speakers: [
    { label: "Interviewer", color: "#60a5fa" },
    { label: "Person 1", color: "#34d399" },
    { label: "Person 2", color: "#f59e0b" },
  ],
};

export const sampleLesson: RealTalkLesson = {
  videoId: "what-do-you-do-for-fun",
  title: "What Do You Do For Fun?",
  titleVi: "Bạn Làm Gì Để Giải Trí?",
  level: "A1",
  estimatedMinutes: 15,
  canDoStatement:
    "I can understand and talk about hobbies and free time activities",
  canDoStatementVi: "Tôi có thể hiểu và nói về sở thích và hoạt động giải trí",

  transcript: [
    {
      index: 0,
      speaker: "Interviewer",
      startTime: 5,
      endTime: 8,
      textEn: "Hey! So, what do you do for fun?",
      textVi: "Chào! Vậy, bạn làm gì để vui?",
    },
    {
      index: 1,
      speaker: "Person 1",
      startTime: 8.5,
      endTime: 14,
      textEn: "Um, I like to go hiking, you know, especially on weekends.",
      textVi: "Ờm, tôi thích đi leo núi, bạn biết đấy, đặc biệt vào cuối tuần.",
    },
    {
      index: 2,
      speaker: "Interviewer",
      startTime: 14.5,
      endTime: 16,
      textEn: "Oh nice! Where do you usually go?",
      textVi: "Ồ hay đấy! Bạn thường đi đâu?",
    },
    {
      index: 3,
      speaker: "Person 1",
      startTime: 16.5,
      endTime: 23,
      textEn:
        "There's this trail near my house, it's about thirty minutes away. It's really beautiful, actually.",
      textVi:
        "Có một con đường mòn gần nhà tôi, cách khoảng ba mươi phút. Thực ra rất đẹp.",
    },
    {
      index: 4,
      speaker: "Interviewer",
      startTime: 23.5,
      endTime: 25.5,
      textEn: "That sounds great. Do you go alone?",
      textVi: "Nghe tuyệt đấy. Bạn đi một mình à?",
    },
    {
      index: 5,
      speaker: "Person 1",
      startTime: 26,
      endTime: 32,
      textEn:
        "Sometimes, yeah. But usually I go with my friends. We like to grab a coffee afterwards.",
      textVi:
        "Đôi khi, ừ. Nhưng thường tôi đi với bạn bè. Chúng tôi thích đi uống cà phê sau đó.",
    },
    {
      index: 6,
      speaker: "Interviewer",
      startTime: 32.5,
      endTime: 35,
      textEn: "Cool. And what about you? What do you do for fun?",
      textVi: "Hay đấy. Còn bạn thì sao? Bạn làm gì để vui?",
    },
    {
      index: 7,
      speaker: "Person 2",
      startTime: 35.5,
      endTime: 42,
      textEn:
        "I'm really into cooking, actually. I love trying new recipes, especially Italian food.",
      textVi:
        "Thực ra tôi rất mê nấu ăn. Tôi thích thử các công thức mới, đặc biệt là đồ ăn Ý.",
    },
    {
      index: 8,
      speaker: "Interviewer",
      startTime: 42.5,
      endTime: 44.5,
      textEn: "Oh, that's awesome! Are you a good cook?",
      textVi: "Ồ, tuyệt vời! Bạn nấu ăn giỏi không?",
    },
    {
      index: 9,
      speaker: "Person 2",
      startTime: 45,
      endTime: 52,
      textEn:
        "I'd like to think so! My friends say my pasta is pretty good. I mean, I'm still learning though.",
      textVi:
        "Tôi muốn nghĩ vậy! Bạn bè nói pasta của tôi khá ngon. Ý tôi là, dù gì tôi vẫn đang học.",
    },
    {
      index: 10,
      speaker: "Interviewer",
      startTime: 52.5,
      endTime: 55.5,
      textEn: "Do you watch cooking shows or YouTube videos?",
      textVi: "Bạn có xem chương trình nấu ăn hoặc video YouTube không?",
    },
    {
      index: 11,
      speaker: "Person 2",
      startTime: 56,
      endTime: 63,
      textEn:
        "Yeah, all the time! There's this one channel I really like. They make everything look so easy.",
      textVi:
        "Có chứ, suốt! Có một kênh tôi rất thích. Họ làm mọi thứ trông thật dễ dàng.",
    },
    {
      index: 12,
      speaker: "Interviewer",
      startTime: 63.5,
      endTime: 67,
      textEn:
        "I know what you mean. Do you do anything else in your free time?",
      textVi: "Tôi hiểu ý bạn. Bạn còn làm gì khác trong thời gian rảnh không?",
    },
    {
      index: 13,
      speaker: "Person 2",
      startTime: 67.5,
      endTime: 75,
      textEn:
        "I also like to read. Mostly novels. And sometimes I go to the gym, you know, to stay healthy.",
      textVi:
        "Tôi cũng thích đọc sách. Chủ yếu tiểu thuyết. Và đôi khi tôi đi tập gym, bạn biết đấy, để giữ sức khỏe.",
    },
    {
      index: 14,
      speaker: "Interviewer",
      startTime: 75.5,
      endTime: 78,
      textEn: "That's a good balance! Thanks for sharing.",
      textVi: "Đó là sự cân bằng tốt! Cảm ơn đã chia sẻ.",
    },
    {
      index: 15,
      speaker: "Person 1",
      startTime: 78.5,
      endTime: 80,
      textEn: "Yeah, no problem! Have a good one.",
      textVi: "Ừ, không có gì! Chúc một ngày tốt lành.",
    },
  ],

  preWatch: {
    contextVi:
      "Trong video này, một phóng viên phỏng vấn người đi đường về sở thích và hoạt động giải trí của họ. Đây là cuộc trò chuyện THẬT, không phải kịch bản — nên bạn sẽ nghe được cách người bản xứ nói chuyện tự nhiên hàng ngày.",
    vocabulary: [
      {
        word: "for fun",
        phonetic: "/fɔːr fʌn/",
        definition: "for enjoyment or pleasure",
        meaningVi: "để vui / để giải trí",
        contextSentence: "What do you do for fun?",
        timestamp: 6,
        pronunciationNote:
          "Chú ý: 'for' phát âm nhẹ = /fər/, nối với 'fun' = /fər.fʌn/",
        l1InterferenceVn: "Người Việt thường nói 'fo fun' — thiếu âm /r/ nhẹ",
      },
      {
        word: "hiking",
        phonetic: "/ˈhaɪ.kɪŋ/",
        definition: "walking in nature for exercise",
        meaningVi: "đi bộ đường dài / leo núi",
        contextSentence: "I like to go hiking, especially on weekends.",
        timestamp: 10,
        pronunciationNote:
          "HAI-king — nhấn âm đầu. Âm /ŋ/ cuối = ngậm miệng, không phải /n/",
      },
      {
        word: "trail",
        phonetic: "/treɪl/",
        definition: "a path through nature",
        meaningVi: "đường mòn (trong thiên nhiên)",
        contextSentence: "There's this trail near my house.",
        timestamp: 17,
        l1InterferenceVn:
          "Người Việt hay đọc 'trây-ồ' — cần giữ 1 âm tiết: /treɪl/",
      },
      {
        word: "grab a coffee",
        phonetic: "/ɡræb ə ˈkɒf.i/",
        definition: "to get a coffee (informal)",
        meaningVi: "đi uống / lấy cà phê (thân mật)",
        contextSentence: "We like to grab a coffee afterwards.",
        timestamp: 30,
        pronunciationNote:
          "'grab a' nối liền = /ɡræbə/. Đây là cách nói thân mật thay vì 'buy a coffee'",
      },
      {
        word: "really into",
        phonetic: "/ˈrɪə.li ˈɪn.tuː/",
        definition: "very interested in, passionate about",
        meaningVi: "rất thích / rất mê",
        contextSentence: "I'm really into cooking, actually.",
        timestamp: 37,
        pronunciationNote:
          "'really' = REE-lee, 2 âm tiết. Không phải 'ri-a-ly'",
        l1InterferenceVn:
          "Cấu trúc 'be into + noun/gerund' = cách nói tự nhiên cho 'thích' — thay vì chỉ dùng 'like'",
      },
      {
        word: "recipe",
        phonetic: "/ˈres.ɪ.piː/",
        definition: "instructions for cooking a dish",
        meaningVi: "công thức nấu ăn",
        contextSentence: "I love trying new recipes.",
        timestamp: 39,
        pronunciationNote:
          "RES-uh-pee — 3 âm tiết! Không phải 're-CIPE' (2 âm tiết)",
      },
      {
        word: "free time",
        phonetic: "/friː taɪm/",
        definition: "time when you are not working",
        meaningVi: "thời gian rảnh",
        contextSentence: "Do you do anything else in your free time?",
        timestamp: 65,
      },
      {
        word: "stay healthy",
        phonetic: "/steɪ ˈhel.θi/",
        definition: "to remain in good health",
        meaningVi: "giữ sức khỏe",
        contextSentence: "I go to the gym to stay healthy.",
        timestamp: 73,
        pronunciationNote:
          "'healthy' = HEL-thee. Âm /θ/ (th) = đặt lưỡi giữa 2 hàm răng",
        l1InterferenceVn:
          "Người Việt hay đọc 'heo-thy' hoặc 'hen-ty' — cần tập riêng âm /θ/",
      },
    ],
    prediction: {
      questionVi: "Video này nói về chủ đề gì? Hãy đoán trước khi xem!",
      options: [
        "Sở thích và hoạt động giải trí",
        "Công việc và sự nghiệp",
        "Du lịch và khám phá",
        "Gia đình và bạn bè",
      ],
      correctIndex: 0,
    },
    soundAlerts: [
      {
        sound: "/ŋ/ (ng ending)",
        explanationVi:
          "Âm /ŋ/ cuối từ — xuất hiện nhiều trong video này. Đây là âm mũi, đóng miệng phía sau.",
        exampleWords: ["hiking", "cooking", "learning", "reading"],
        commonMistakeVi:
          "Người Việt hay đọc 'hikin' (thiếu âm ng) hoặc 'hiking-gờ' (thêm âm cuối)",
      },
      {
        sound: "/θ/ (th sound)",
        explanationVi:
          "Âm /θ/ — đặt đầu lưỡi nhẹ giữa 2 hàm răng rồi thổi hơi ra.",
        exampleWords: ["think", "healthy", "thanks", "thirty"],
        commonMistakeVi:
          "Người Việt thường đọc thành /t/ hoặc /s/ — ví dụ 'tink' thay vì 'think'",
      },
    ],
  },

  whileWatch: {
    gistQuestion: {
      questionVi: "Sau khi xem video (không phụ đề), bạn nghĩ video nói về gì?",
      options: [
        "Hai người nói về sở thích của họ",
        "Hai người đang lên kế hoạch đi du lịch",
        "Hai người đang thảo luận về công việc",
        "Hai người đang nói về gia đình",
      ],
      correctIndex: 0,
    },
    focusPoints: [
      {
        type: "discourse_marker",
        pattern: "you know",
        explanationVi:
          "'You know' là một discourse marker (từ đệm) rất phổ biến. Dùng để kiểm tra người nghe có đang theo dõi hoặc tạo sự thân mật.",
        segmentIndices: [1, 13],
      },
      {
        type: "discourse_marker",
        pattern: "actually",
        explanationVi:
          "'Actually' dùng để bổ sung thông tin bất ngờ hoặc sửa lại điều vừa nói.",
        segmentIndices: [3, 7],
      },
    ],
    keyMoments: [
      {
        timestamp: 8.5,
        descriptionVi: "Person 1 nói về sở thích leo núi",
        listenForVi: "Nghe cách nói 'I like to go hiking'",
      },
    ],
  },

  postWatch: {
    comprehensionQuiz: [
      {
        id: "q1",
        questionVi: "Person 1 thích làm gì vào cuối tuần?",
        options: ["Đi leo núi (hiking)", "Nấu ăn", "Đọc sách", "Đi tập gym"],
        correctIndex: 0,
        explanationVi:
          'Person 1 nói: "I like to go hiking, especially on weekends."',
      },
      {
        id: "q2",
        questionVi: "Person 2 đặc biệt thích nấu loại đồ ăn nào?",
        options: [
          "Đồ ăn Nhật",
          "Đồ ăn Ý (Italian)",
          "Đồ ăn Trung Quốc",
          "Đồ ăn Mexico",
        ],
        correctIndex: 1,
        explanationVi:
          'Person 2 nói: "I love trying new recipes, especially Italian food."',
      },
    ],
    fillInTheBlank: [
      {
        id: "fib1",
        sentence: "What do you do ___ fun?",
        hintVi: "để (mục đích)",
        answer: "for",
      },
      {
        id: "fib2",
        sentence: "I'm really ___ cooking.",
        hintVi: "rất thích / mê",
        answer: "into",
      },
    ],
    speakingDrills: [
      {
        id: "sd1",
        phrase: "What do you do for fun?",
        meaningVi: "Bạn làm gì để vui / giải trí?",
        timestamp: 6,
        tipVi: "Nối 'do you' = /dʒuː/. Nhấn 'fun' mạnh nhất.",
      },
    ],
    culturalNotes: [
      {
        titleVi: "💬 'You know' — Từ đệm phổ biến nhất",
        contentVi:
          "Trong tiếng Anh hội thoại, 'you know' được dùng rất nhiều như một từ đệm (filler).",
      },
    ],
  },
};

// ─── Video 2: What's In The Box Challenge (YouTube ID: 9ot4CFf0ix8) ────────────

export const whatsInTheBoxVideo: RealTalkVideo = {
  id: "whats-in-the-box-challenge",
  youtubeId: "9ot4CFf0ix8",
  title: "What's In The Box Challenge — Fun Real Conversation",
  titleVi: "Thử Thách Đoán Đồ Vật Trong Hộp Kín",
  channelName: "YouTube Challenges",
  channelUrl: "https://www.youtube.com/watch?v=9ot4CFf0ix8",
  thumbnailUrl: "https://i.ytimg.com/vi/9ot4CFf0ix8/hqdefault.jpg",
  durationSeconds: 151,
  segment: { startSeconds: 0, endSeconds: 151 },
  level: "A1",
  topics: ["free_time", "daily_life", "hobbies"],
  speakerCount: 2,
  speakers: [
    { label: "Host", color: "#60a5fa" },
    { label: "Jamal", color: "#34d399" },
  ],
};

export const whatsInTheBoxLesson: RealTalkLesson = {
  videoId: "whats-in-the-box-challenge",
  title: "What's In The Box Challenge",
  titleVi: "Thử Thách Đoán Đồ Vật Trong Hộp Kín",
  level: "A1",
  estimatedMinutes: 15,
  canDoStatement:
    "I can understand reactions, informal expressions, and ask questions in fun challenges.",
  canDoStatementVi:
    "Tôi có thể hiểu phản ứng, từ cảm thán và cách hỏi đáp trong các trò chơi thực tế.",
  transcript: [
    {
      index: 0,
      speaker: "Host",
      startTime: 0,
      endTime: 2,
      textEn: "Are you guys ready for what's in the box?",
      textVi: "Các bạn đã sẵn sàng cho những gì có trong hộp chưa?",
    },
    {
      index: 1,
      speaker: "Host",
      startTime: 2,
      endTime: 11,
      textEn:
        "Jamal is going up first. This is the What's In The Box Challenge. Let's get into it. Jamal, put the blindfold on.",
      textVi:
        "Jamal sẽ lên trước. Đây là Thử thách Đoán đồ vật trong hộp. Bắt đầu nào. Jamal, đeo băng che mắt vào đi.",
    },
    {
      index: 2,
      speaker: "Jamal",
      startTime: 11,
      endTime: 12,
      textEn: "It's on.",
      textVi: "Tôi đeo rồi.",
    },
    {
      index: 3,
      speaker: "Host",
      startTime: 12,
      endTime: 19,
      textEn:
        "Okay, now let's bring in... Hey, buddy. Listen, put on a blindfold.",
      textVi:
        "Được rồi, giờ hãy mang... Này anh bạn. Nghe này, đeo băng che mắt vào.",
    },
    {
      index: 4,
      speaker: "Jamal",
      startTime: 19,
      endTime: 20,
      textEn: "It is on.",
      textVi: "Đeo rồi mà.",
    },
    {
      index: 5,
      speaker: "Host",
      startTime: 20,
      endTime: 24,
      textEn: "Okay, bring in the first one.",
      textVi: "Được rồi, mang đồ vật đầu tiên ra đi.",
    },
    {
      index: 6,
      speaker: "Jamal",
      startTime: 24,
      endTime: 28,
      textEn:
        "Well, I got to do it first. This is your stream. They want to see you do it.",
      textVi:
        "Chà, tôi phải làm trước sao. Đây là buổi livestream của ông mà. Họ muốn thấy ông làm đó.",
    },
    {
      index: 7,
      speaker: "Host",
      startTime: 28,
      endTime: 32,
      textEn: "No, just, bro. Just relax, bro. Chill. Take a chill pill, bro.",
      textVi:
        "Không, anh bạn. Thư giãn đi. Bình tĩnh. Bớt căng thẳng đi ông bạn.",
    },
    {
      index: 8,
      speaker: "Jamal",
      startTime: 32,
      endTime: 48,
      textEn: "Oh my god. Oh. Oh my. We don't need this for these. Oh my gosh.",
      textVi:
        "Ôi trời ơi. Ôi chao. Chúng ta đâu cần cái này cho mấy thứ này chứ. Ôi trời ơi.",
    },
    {
      index: 9,
      speaker: "Jamal",
      startTime: 49,
      endTime: 58,
      textEn:
        "Oh my god. Oh my god. No. Oh my god. Yo, shut up! Shut up! Shut up! Shut up! Let me do it. Okay.",
      textVi:
        "Ôi trời ơi. Không đời nào. Ôi trời. Này, trật tự đi! Trật tự nào! Để tôi làm. Được rồi.",
    },
    {
      index: 10,
      speaker: "Jamal",
      startTime: 59,
      endTime: 73,
      textEn:
        "Bro, why is it making that noise? Why is it making that noise? Y'all hear the noise it's making?",
      textVi:
        "Ông bạn ơi, sao nó lại phát ra tiếng kêu đó? Sao nó lại kêu thế? Mọi người có nghe thấy tiếng kêu nó phát ra không?",
    },
    {
      index: 11,
      speaker: "Host",
      startTime: 74,
      endTime: 84,
      textEn:
        "Bro, you got to touch it, bro. Stop trolling. You have to touch it, bro. Just touch it.",
      textVi:
        "Ông bạn ơi, ông phải sờ vào nó chứ. Đừng trêu nữa. Ông phải chạm vào nó. Sờ vào đi.",
    },
    {
      index: 12,
      speaker: "Jamal",
      startTime: 85,
      endTime: 91,
      textEn: "Shut up. Touch it. I'm trying to focus. Okay. Okay.",
      textVi:
        "Im đi. Chạm vào đây. Tôi đang cố tập trung đấy. Được rồi. Được rồi.",
    },
    {
      index: 13,
      speaker: "Jamal",
      startTime: 92,
      endTime: 100,
      textEn:
        "What is that? Yo, that's the most weirdest looking snake I've ever seen. Bro, it's a snake. No, it's not.",
      textVi:
        "Cái gì thế này? Yo, đó là con rắn nhìn kỳ dị nhất tôi từng thấy. Ông bạn ơi, nó là con rắn đấy. Không, không phải đâu.",
    },
    {
      index: 14,
      speaker: "Host",
      startTime: 100,
      endTime: 110,
      textEn:
        "Okay, guess what it is. Guess what it is. If you get it, guess what it is. You have to get it right.",
      textVi:
        "Được rồi, đoán xem nó là gì. Đoán xem nào. Nếu đoán được... Ông phải đoán đúng đấy.",
    },
    {
      index: 15,
      speaker: "Jamal",
      startTime: 108,
      endTime: 110,
      textEn: "An alligator?",
      textVi: "Một con cá sấu à?",
    },
    {
      index: 16,
      speaker: "Host",
      startTime: 111,
      endTime: 130,
      textEn:
        "Okay, Chat. Do I give him a hint? Do I give him a hint? Okay, I'm going to give you a hint. Okay. This is the best day ever. This is the best day ever.",
      textVi:
        "Được rồi, khán giả trên Chat. Tôi có nên cho ông ấy gợi ý không? Tôi sẽ cho ông một gợi ý. Được rồi. Đây là ngày tuyệt vời nhất từ trước đến nay.",
    },
    {
      index: 17,
      speaker: "Jamal",
      startTime: 131,
      endTime: 134,
      textEn: "Is it a sponge?",
      textVi: "Nó là miếng bọt biển à?",
    },
    {
      index: 18,
      speaker: "Host",
      startTime: 135,
      endTime: 143,
      textEn:
        "Okay. You're on the right track. You're on the right track. Come on, bro. You're on the right track.",
      textVi:
        "Được rồi. Ông đi đúng hướng rồi đấy. Đúng hướng rồi. Cố lên ông bạn. Ông đang đi đúng hướng rồi đấy.",
    },
    {
      index: 19,
      speaker: "Host",
      startTime: 144,
      endTime: 151,
      textEn: "Stop freaking out. Reach lower. Reach lower. Come on.",
      textVi:
        "Đừng hoảng loạn nữa. Thò tay thấp xuống nữa đi. Thò thấp xuống. Cố lên.",
    },
  ],
  preWatch: {
    contextVi:
      "Trong video này, hai người bạn cùng tham gia trò chơi 'What's In The Box Challenge' trên buổi phát trực tiếp. Người chơi phải bịt mắt và thò tay vào hộp kín để đoán xem đồ vật bí ẩn bên trong là gì.",
    vocabulary: [
      {
        word: "blindfold",
        phonetic: "/ˈblaɪnd.foʊld/",
        definition: "a piece of cloth tied over eyes to prevent seeing",
        meaningVi: "băng che mắt",
        contextSentence: "Jamal, put the blindfold on.",
        timestamp: 7,
        pronunciationNote: "Chú ý âm /d/ ở giữa và cụm /ld/ ở cuối từ.",
        l1InterferenceVn: "Người Việt hay bỏ quên âm đuôi /d/.",
      },
      {
        word: "take a chill pill",
        phonetic: "/teɪk ə tʃɪl pɪl/",
        definition: "calm down, relax",
        meaningVi: "bình tĩnh lại, thư giãn đi",
        contextSentence: "Just relax, bro. Take a chill pill, bro.",
        timestamp: 31,
        pronunciationNote: "Nối âm liền mạch giữa 'take' và 'a' thành /teɪkə/.",
        l1InterferenceVn: "Đừng đọc rời rạc từng từ riêng lẻ.",
      },
      {
        word: "hint",
        phonetic: "/hɪnt/",
        definition: "a helpful piece of information or clue",
        meaningVi: "manh mối, gợi ý",
        contextSentence: "Do I give him a hint?",
        timestamp: 111,
        pronunciationNote: "Bật rõ âm đuôi /t/.",
        l1InterferenceVn: "Hay bị đọc thành 'hin' mà thiếu âm /t/.",
      },
      {
        word: "on the right track",
        phonetic: "/ɒn ðə raɪt træk/",
        definition: "doing or thinking in a way that will lead to success",
        meaningVi: "đi đúng hướng, đoán gần đúng rồi",
        contextSentence: "You're on the right track.",
        timestamp: 135,
        pronunciationNote: "Âm /tr/ trong 'track' phát âm giống /ch/ nhẹ.",
        l1InterferenceVn:
          "Người Việt hay đọc 'track' thành 'trắc' kiểu tiếng Việt.",
      },
    ],
    prediction: {
      questionVi:
        "Bạn nghĩ người chơi sẽ cảm thấy thế nào khi thò tay vào hộp?",
      options: [
        "Tự tin và bình tĩnh",
        "Hồi hộp, lo sợ và giật mình",
        "Tức giận và khó chịu",
        "Hoàn toàn không quan tâm",
      ],
      correctIndex: 1,
    },
    soundAlerts: [
      {
        sound: "/k/ âm cuối",
        explanationVi:
          "Âm /k/ xuất hiện ở cuối các từ như 'track', 'relax', 'make'.",
        exampleWords: ["track", "relax", "make"],
        commonMistakeVi: "Người Việt hay nuốt mất âm bật /k/ ở cuối từ.",
      },
    ],
  },
  whileWatch: {
    gistQuestion: {
      questionVi: "Mục tiêu chính của trò chơi trong video là gì?",
      options: [
        "Mở hộp ra thật nhanh",
        "Bịt mắt và dùng tay đoán đồ vật trong hộp",
        "Trang trí chiếc hộp bí mật",
        "Bắt các con vật nguy hiểm",
      ],
      correctIndex: 1,
    },
    focusPoints: [
      {
        type: "discourse_marker",
        pattern: "Take a chill pill",
        explanationVi:
          "Thành ngữ lóng cực kỳ phổ biến giữa bạn bè khi muốn khuyên ai đó 'hãy bình tĩnh lại'.",
        segmentIndices: [7],
      },
      {
        type: "idiom",
        pattern: "on the right track",
        explanationVi:
          "Cụm từ dùng khi ai đó đang đoán gần đúng hoặc suy luận đúng hướng.",
        segmentIndices: [18],
      },
    ],
    keyMoments: [
      {
        timestamp: 31,
        descriptionVi: "Host khuyên Jamal bình tĩnh khi anh ấy căng thẳng.",
        listenForVi: "Lắng nghe cụm từ 'Take a chill pill, bro'.",
      },
      {
        timestamp: 135,
        descriptionVi: "Host cổ vũ Jamal khi anh ấy đoán gần đúng.",
        listenForVi: "Lắng nghe cụm 'You're on the right track'.",
      },
    ],
  },
  postWatch: {
    comprehensionQuiz: [
      {
        id: "q1",
        questionVi:
          "Host yêu cầu Jamal làm gì đầu tiên trước khi bắt đầu trò chơi?",
        options: [
          "Thò tay vào hộp ngay",
          "Đeo băng che mắt (blindfold)",
          "Đoán tên đồ vật",
          "Rời khỏi phòng",
        ],
        correctIndex: 1,
        explanationVi: "Host nói 'Jamal, put the blindfold on' ở giây thứ 7.",
      },
      {
        id: "q2",
        questionVi:
          "Gợi ý 'This is the best day ever' của Host giúp Jamal liên tưởng đến nhân vật/đồ vật nào?",
        options: [
          "Con cá sấu",
          "Con rắn",
          "Miếng bọt biển (SpongeBob)",
          "Chiếc hộp",
        ],
        correctIndex: 2,
        explanationVi:
          "'This is the best day ever' là câu nói kinh điển của SpongeBob (miếng bọt biển).",
      },
    ],
    fillInTheBlank: [
      {
        id: "fib1",
        sentence: "Just relax, bro. Take a ___ pill, bro.",
        hintVi: "bình tĩnh lại (từ lóng)",
        answer: "chill",
        alternatives: ["chill"],
      },
      {
        id: "fib2",
        sentence: "Do I give him a ___?",
        hintVi: "gợi ý, manh mối",
        answer: "hint",
        alternatives: ["hint"],
      },
    ],
    speakingDrills: [
      {
        id: "sd1",
        phrase: "Take a chill pill, bro.",
        meaningVi: "Bình tĩnh lại đi ông bạn.",
        timestamp: 31,
        tipVi: "Nối âm 'take a' thành /teɪkə/ và nhấn mạnh vào từ 'chill'.",
      },
      {
        id: "sd2",
        phrase: "You're on the right track.",
        meaningVi: "Bạn đang đi đúng hướng rồi đấy.",
        timestamp: 135,
        tipVi: "Nhấn mạnh từ 'right' và 'track'.",
      },
    ],
    culturalNotes: [
      {
        titleVi: "Trào lưu 'What's In The Box Challenge'",
        contentVi:
          "Đây là một trò chơi thử thách cực kỳ phổ biến trên YouTube và livestream ở phương Tây. Sự hấp dẫn nằm ở phản ứng sợ hãi, giật mình buồn cười của người chơi khi sờ vào những thứ không thấy được.",
      },
    ],
  },
};

// ─── Video Catalog ─────────────────────────────────────────────────────────────

/** All curated Real Talk videos. */
export const realTalkVideos: RealTalkVideo[] = [
  sampleVideo,
  whatsInTheBoxVideo,
];

/** All Real Talk lessons, keyed by videoId */
export const realTalkLessons: Record<string, RealTalkLesson> = {
  [sampleLesson.videoId]: sampleLesson,
  [whatsInTheBoxLesson.videoId]: whatsInTheBoxLesson,
};

/**
 * Helper to look up a video by its slug ID.
 */
export function getRealTalkVideo(id: string): RealTalkVideo | undefined {
  return realTalkVideos.find((v) => v.id === id);
}

/**
 * Helper to look up a lesson by video slug ID.
 */
export function getRealTalkLesson(videoId: string): RealTalkLesson | undefined {
  return realTalkLessons[videoId];
}

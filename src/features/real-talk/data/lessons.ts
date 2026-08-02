import type { RealTalkLesson } from "@/features/real-talk/domain/real-talk";

export const USO_EVENT_PILOT: RealTalkLesson = {
  id: "uso-iwakuni-event",
  titleVi: "Nghe người thật giới thiệu sự kiện và xác nhận thông tin",
  titleEn: "The Iwakuni Incredible Race",
  level: "A2",
  estimatedMinutes: 14,
  canDoVi:
    "Nghe tên và thời gian của một sự kiện, rồi xác nhận lại thông tin trong tình huống mới.",
  status: "internal_pilot",
  source: {
    provider: "wikimedia_commons",
    title: "Radio Around the Region: Interview with USO Volunteer",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm",
    mediaUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Radio_Around_the_Region-_Interview_with_USO_Volunteer_%281000496%29.webm",
    author: "U.S. Marine Corps video by Lance Cpl. Saul Hernandez",
    publishedAt: "2026-03-23",
    license: {
      name: "Public domain — work of the U.S. federal government",
      url: "https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm#Licensing",
      attribution:
        "U.S. Marine Corps video by Lance Cpl. Saul Hernandez, via DVIDS and Wikimedia Commons.",
      publicCatalogAllowed: true,
    },
    transcript: {
      sourceUrl:
        "https://commons.wikimedia.org/wiki/TimedText:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm.en.srt",
      kind: "machine_caption",
      reviewed: false,
    },
  },
  environment: {
    id: "receive-event-information",
    titleVi: "Nhận và xác nhận thông tin sự kiện",
    settingVi:
      "Một khách mời đang giới thiệu sự kiện sắp tới trong cuộc phỏng vấn radio thật.",
    learnerRoleVi:
      "Bạn là người nghe cần hiểu tên, ngày và giờ, sau đó phản hồi để tránh hiểu nhầm.",
    communicationGoalVi:
      "Theo dõi một thông báo ngắn, lấy thông tin quan trọng và xác nhận lại điều đã nghe.",
  },
  clip: {
    startSeconds: 21.317,
    endSeconds: 34.654,
  },
  transcript: [
    {
      id: "event-left",
      speaker: "Kimika",
      startSeconds: 21.317,
      endSeconds: 23.539,
      sourceText: "one big one left for the end of April,",
      displayText: "We just have one big one left for the end of April.",
      translationVi: "Chúng tôi chỉ còn một sự kiện lớn vào cuối tháng Tư.",
      reviewStatus: "editor_normalized",
    },
    {
      id: "event-name",
      speaker: "Kimika and Tahir",
      startSeconds: 23.539,
      endSeconds: 27.317,
      sourceText:
        "and it's going to be the Iwauni Incredible Race. Iwauni Incredible Race.",
      displayText:
        "And it's going to be the Iwakuni Incredible Race. Iwakuni Incredible Race?",
      translationVi:
        "Và đó sẽ là sự kiện Iwakuni Incredible Race. Iwakuni Incredible Race à?",
      reviewStatus: "editor_normalized",
    },
    {
      id: "event-date",
      speaker: "Kimika",
      startSeconds: 27.317,
      endSeconds: 32.294,
      sourceText:
        "Yes, so we're gonna have that Saturday, April 25th, from 8 to 1",
      displayText:
        "Yes, so we're gonna have that Saturday, April 25th, from 8 to 1.",
      translationVi:
        "Đúng vậy, sự kiện sẽ diễn ra vào thứ Bảy, ngày 25 tháng Tư, từ 8 giờ đến 1 giờ.",
      reviewStatus: "editor_normalized",
    },
    {
      id: "event-confirm",
      speaker: "Tahir",
      startSeconds: 32.294,
      endSeconds: 34.654,
      sourceText: "p.m. OK, OK.",
      displayText: "p.m. Okay, okay.",
      translationVi: "chiều. Được rồi, được rồi.",
      reviewStatus: "editor_normalized",
    },
  ],
  communicationEvents: [
    {
      id: "announce-upcoming-event",
      kind: "announce",
      labelVi: "Báo còn một sự kiện lớn",
      functionVi: "Đưa người nghe vào chủ đề và báo rằng có một việc sắp diễn ra.",
      segmentIds: ["event-left"],
    },
    {
      id: "name-the-event",
      kind: "name_information",
      labelVi: "Nêu rồi xác nhận tên sự kiện",
      functionVi: "Cung cấp tên riêng và lặp lại để hai bên cùng hiểu đúng.",
      segmentIds: ["event-name"],
    },
    {
      id: "give-event-time",
      kind: "give_time",
      labelVi: "Cho ngày và khoảng thời gian",
      functionVi: "Cung cấp thông tin hành động mà người nghe cần ghi nhớ.",
      segmentIds: ["event-date", "event-confirm"],
    },
    {
      id: "acknowledge-information",
      kind: "confirm_or_acknowledge",
      labelVi: "Báo đã nghe và hiểu",
      functionVi: "Kết thúc lượt trao đổi bằng phản hồi xác nhận ngắn.",
      segmentIds: ["event-confirm"],
    },
  ],
  gistQuestion: {
    questionVi: "Hai người đang làm gì trong đoạn này?",
    options: [
      "Giới thiệu tên và thời gian của một sự kiện sắp tới",
      "Phỏng vấn xin việc",
      "Dự báo thời tiết cuối tuần",
      "Tranh luận về một bài hát",
    ],
    correctIndex: 0,
    evidenceSegmentIds: ["event-left", "event-name", "event-date"],
  },
  chunks: [
    {
      id: "one-left",
      phrase: "one big one left",
      meaningVi: "còn lại một việc hoặc sự kiện lớn",
      useWhenVi: "Nói rằng chỉ còn một việc quan trọng chưa diễn ra.",
      sourceSegmentId: "event-left",
      recallCueVi: "còn lại một sự kiện lớn",
    },
    {
      id: "going-to-be",
      phrase: "It's going to be ...",
      meaningVi: "Đó sẽ là...",
      useWhenVi: "Giới thiệu tên hoặc hình thức của một việc sắp tới.",
      sourceSegmentId: "event-name",
      recallCueVi: "Đó sẽ là...",
    },
    {
      id: "gonna-have",
      phrase: "We're gonna have that ...",
      meaningVi: "Chúng tôi sẽ tổ chức việc đó...",
      useWhenVi: "Nói tự nhiên về ngày hoặc giờ một sự kiện sẽ diễn ra.",
      sourceSegmentId: "event-date",
      recallCueVi: "Chúng tôi sẽ tổ chức việc đó...",
    },
    {
      id: "acknowledge",
      phrase: "Okay, okay.",
      meaningVi: "Được rồi, tôi hiểu.",
      useWhenVi: "Báo cho người kia biết rằng bạn đã nhận được thông tin.",
      sourceSegmentId: "event-confirm",
      recallCueVi: "Được rồi, tôi hiểu.",
    },
  ],
  cloze: {
    prompt: "It's going to be the ___ Incredible Race.",
    answer: "Iwakuni",
    hintVi: "Tên địa điểm xuất hiện trong tên sự kiện.",
    evidenceSegmentId: "event-name",
  },
  recall: {
    cueVi: "Hãy tự viết lại: “Đó sẽ là sự kiện Iwakuni Incredible Race.”",
    acceptedAnswers: [
      "It's going to be the Iwakuni Incredible Race.",
      "It is going to be the Iwakuni Incredible Race.",
    ],
    evidenceSegmentId: "event-name",
  },
  transfer: {
    situationVi:
      "Bối cảnh mới: một đồng nghiệp nói cuộc họp diễn ra vào thứ Bảy, từ 9 giờ đến 11 giờ. Bạn cần xác nhận lại để chắc rằng mình nghe đúng.",
    promptVi:
      "Viết một phản hồi tiếng Anh ngắn có cả thông tin thời gian và tín hiệu xác nhận hoặc hỏi lại.",
    changedContext: true,
    minimumWords: 6,
    intents: [
      {
        id: "preserve-time-information",
        labelVi: "Nhắc lại đúng thời gian",
        acceptedSignals: [
          "Saturday from 9 to 11",
          "Saturday, 9 to 11",
          "9 to 11 on Saturday",
        ],
      },
      {
        id: "confirm-or-repair",
        labelVi: "Xác nhận hoặc hỏi lại",
        acceptedSignals: [
          "right",
          "did you say",
          "let me confirm",
          "okay, got it",
          "okay got it",
        ],
      },
    ],
    exampleAnswer: "Saturday from 9 to 11, right?",
  },
};

export const REAL_TALK_LESSONS = [USO_EVENT_PILOT] as const;

export function getRealTalkLesson(lessonId: string) {
  return REAL_TALK_LESSONS.find((lesson) => lesson.id === lessonId) ?? null;
}

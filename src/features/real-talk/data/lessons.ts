import type { RealTalkLesson } from "@/features/real-talk/domain/real-talk";

export const USO_EVENT_PILOT: RealTalkLesson = {
  id: "uso-iwakuni-event",
  titleVi: "Nghe thông tin một sự kiện thật trên radio",
  titleEn: "The Iwakuni Incredible Race",
  level: "A2",
  estimatedMinutes: 12,
  canDoVi:
    "Nghe và lấy được tên cùng thời gian của một sự kiện trong cuộc phỏng vấn radio thật.",
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
      speaker: "Kimika",
      startSeconds: 23.539,
      endSeconds: 27.317,
      sourceText: "and it's going to be the Iwauni Incredible Race. Iwauni Incredible Race.",
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
        "Yes, so we're gonna have that Saturday, April 25th, from 8 to 1 p.m.",
      translationVi:
        "Đúng vậy, sự kiện sẽ diễn ra vào thứ Bảy, ngày 25 tháng Tư, từ 8 giờ sáng đến 1 giờ chiều.",
      reviewStatus: "editor_normalized",
    },
    {
      id: "event-confirm",
      speaker: "Tahir",
      startSeconds: 32.294,
      endSeconds: 34.654,
      sourceText: "p.m. OK, OK.",
      displayText: "Okay, okay.",
      translationVi: "Được rồi, tôi hiểu.",
      reviewStatus: "editor_normalized",
    },
  ],
  gistQuestion: {
    questionVi: "Đoạn phỏng vấn đang thông báo điều gì?",
    options: [
      "Một sự kiện mang tên Iwakuni Incredible Race",
      "Một cuộc phỏng vấn xin việc",
      "Dự báo thời tiết cuối tuần",
      "Một bài hát mới trên radio",
    ],
    correctIndex: 0,
    evidenceSegmentIds: ["event-left", "event-name"],
  },
  chunks: [
    {
      id: "one-left",
      phrase: "one big one left",
      meaningVi: "còn lại một sự kiện lớn",
      useWhenVi: "Nói rằng chỉ còn một việc hoặc sự kiện quan trọng.",
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
      useWhenVi: "Nói tự nhiên về thời điểm một sự kiện sẽ diễn ra.",
      sourceSegmentId: "event-date",
      recallCueVi: "Chúng tôi sẽ tổ chức việc đó...",
    },
    {
      id: "time-range",
      phrase: "from 8 to 1 p.m.",
      meaningVi: "từ 8 giờ sáng đến 1 giờ chiều",
      useWhenVi: "Nêu khoảng thời gian bắt đầu và kết thúc.",
      sourceSegmentId: "event-date",
      recallCueVi: "từ 8 giờ sáng đến 1 giờ chiều",
    },
  ],
  cloze: {
    prompt: "It's going to be the ___ Incredible Race.",
    answer: "Iwakuni",
    hintVi: "Tên địa điểm xuất hiện trong tên sự kiện.",
    evidenceSegmentId: "event-name",
  },
  recall: {
    cueVi: "Hãy viết lại: “Đó sẽ là sự kiện Iwakuni Incredible Race.”",
    acceptedAnswers: [
      "It's going to be the Iwakuni Incredible Race.",
      "It is going to be the Iwakuni Incredible Race.",
    ],
    evidenceSegmentId: "event-name",
  },
};

export const REAL_TALK_LESSONS = [USO_EVENT_PILOT] as const;

export function getRealTalkLesson(lessonId: string) {
  return REAL_TALK_LESSONS.find((lesson) => lesson.id === lessonId) ?? null;
}

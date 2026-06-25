export type DailyMission = {
  id: string;
  kind: "primary" | "task" | "bonus";
  label: string;
  detail?: string;
  xp: number;
  href: string;
  completed: boolean;
};

export type DailyMissionInput = {
  currentUnit: {
    title: string;
    progress: number;
    route: string;
    xp: number;
  };
  dueCardsCount: number;
  lessonCompletedToday: boolean;
  srsReviewedToday: boolean;
  quizDoneToday: boolean;
  speakingDoneToday: boolean;
  challengeDoneToday?: boolean;
};

export function buildDailyMissions(input: DailyMissionInput): DailyMission[] {
  const srsDone = input.dueCardsCount === 0 || input.srsReviewedToday;

  return [
    {
      id: "lesson",
      kind: "primary",
      label: input.currentUnit.title,
      detail: `${input.currentUnit.progress}% tiến độ`,
      xp: input.currentUnit.xp,
      href: input.currentUnit.route,
      completed: input.lessonCompletedToday,
    },
    {
      id: "srs",
      kind: "task",
      label:
        input.dueCardsCount > 0
          ? `Ôn tập ${input.dueCardsCount} thẻ SRS`
          : "Ôn tập SRS (đã xong hôm nay!)",
      xp: 15,
      href: "/flashcards",
      completed: srsDone,
    },
    {
      id: "quiz",
      kind: "task",
      label: input.quizDoneToday
        ? "Quiz từ vựng (đã xong!)"
        : "Quiz từ vựng — 5 câu",
      xp: 15,
      href: "/quiz",
      completed: input.quizDoneToday,
    },
    {
      id: "speaking",
      kind: "task",
      label: input.speakingDoneToday
        ? "Luyện nói (đã xong!)"
        : "Luyện nói — 5 phút",
      xp: 15,
      href: "/speaking",
      completed: input.speakingDoneToday,
    },
    {
      id: "challenge",
      kind: "bonus",
      label: "Thử thách hàng ngày — 5 câu từ vựng",
      detail: "Hoàn thành daily challenge",
      xp: 50,
      href: "/challenge",
      completed: input.challengeDoneToday ?? false,
    },
  ];
}

export function countCompletedMissions(missions: DailyMission[]): number {
  return missions.filter((m) => m.completed).length;
}
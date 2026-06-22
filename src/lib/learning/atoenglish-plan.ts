export type LearningStageId =
  | "foundation"
  | "survival"
  | "elementary"
  | "independent"
  | "ielts_bridge"
  | "ielts_65";

export type SkillKey = "listening" | "reading" | "writing" | "speaking";

export interface LearningStage {
  id: LearningStageId;
  order: number;
  title: string;
  levelRange: string;
  unitLevels: string[];
  hoursRange: string;
  productGoal: string;
  learnerCanDo: string[];
  skillFocus: Record<SkillKey, string>;
  qualityGate: string;
}

export interface LessonQualityCriterion {
  id: string;
  label: string;
  points: number;
  description: string;
}

export interface SelfStudyRisk {
  title: string;
  mitigation: string;
}

export const IELTS_TARGET_BAND = 6.5;

export const TOTAL_HOURS_REALISTIC_RANGE = "800-1,200 gio";

export const ATOENGLISH_LEARNING_STAGES: LearningStage[] = [
  {
    id: "foundation",
    order: 1,
    title: "A0 Foundation",
    levelRange: "A0 / Pre-A1",
    unitLevels: ["A0"],
    hoursRange: "80-120 gio",
    productGoal: "Xoa mat goc: am, chu cai, tu sinh ton, cau cuc ngan.",
    learnerCanDo: [
      "Nghe va lap lai tu/cum tu cuc ngan.",
      "Noi ten, tuoi, loi chao va nhu cau co ban.",
      "Bat dau giu am cuoi thay vi doc theo thoi quen tieng Viet.",
    ],
    skillFocus: {
      listening: "Nhan dien am, tu ngan, cau 3-6 tu.",
      reading: "Doc tu/cum/cau ngan kem hinh va nghia Viet.",
      writing: "Sap xep cau, dien tu, go cau mau.",
      speaking: "Repeat, read-aloud, substitution drill.",
    },
    qualityGate: "Moi bai phai co can-do, nghe, output co kiem soat, error tag va SRS.",
  },
  {
    id: "survival",
    order: 2,
    title: "A1 Survival",
    levelRange: "A1",
    unitLevels: ["A1"],
    hoursRange: "120-180 gio",
    productGoal: "Giao tiep doi song cuc co ban va tao cau dung hon.",
    learnerCanDo: [
      "Hoi dap thong tin ca nhan, gia dinh, nha cua, thoi quen.",
      "Viet tin nhan ngan va cau mo ta don gian.",
      "Nghe hoi thoai cham, ro ve chu de quen thuoc.",
    ],
    skillFocus: {
      listening: "Hoi thoai ngan, dictation 5-15 giay.",
      reading: "Tin nhan ngan, bien bao, doan van cuc ngan.",
      writing: "Cau don, micro-message, sentence frame.",
      speaking: "Prompted answer 1-3 cau, pronunciation retry.",
    },
    qualityGate: "Khong mo khoa A2 neu A1 core frames va review retention chua on dinh.",
  },
  {
    id: "elementary",
    order: 3,
    title: "A2 Elementary",
    levelRange: "A2",
    unitLevels: ["A2"],
    hoursRange: "180-250 gio",
    productGoal: "Tu hoc cac tinh huong quen thuoc, ke chuyen ngan, nghe doc dai hon.",
    learnerCanDo: [
      "Ke chuyen qua khu don gian va noi ve ke hoach.",
      "Doc doan van ngan co y chinh va chi tiet ro.",
      "Viet email/tin nhan 80-120 tu voi cau truc co ban.",
    ],
    skillFocus: {
      listening: "Hoi thoai 30-60 giay, note-taking co dan.",
      reading: "Graded text, scanning, gist/detail.",
      writing: "Short email, paragraph scaffold.",
      speaking: "1-minute answer co dan y.",
    },
    qualityGate: "A2 phai co checkpoint tong hop, khong chi la hoc them ngu phap.",
  },
  {
    id: "independent",
    order: 4,
    title: "B1 Independent",
    levelRange: "B1",
    unitLevels: ["B1"],
    hoursRange: "220-300 gio",
    productGoal: "Xay nang luc doc/nghe doc lap va noi viet y kien co cau truc.",
    learnerCanDo: [
      "Trinh bay y kien, ly do, vi du ve chu de quen thuoc.",
      "Viet paragraph/short essay co topic sentence va support.",
      "Nghe noi dung dai hon voi chien luoc du doan va ghi chu.",
    ],
    skillFocus: {
      listening: "Doan noi 1-3 phut, gist/detail/inference.",
      reading: "Article graded, tu vung theo chu de.",
      writing: "Paragraph, email formal, problem-solution.",
      speaking: "IELTS Part 1 bridge va short monologue.",
    },
    qualityGate: "Moi unit phai co output task va rubric, khong chi quiz nhan dien.",
  },
  {
    id: "ielts_bridge",
    order: 5,
    title: "B2 IELTS Bridge",
    levelRange: "B2",
    unitLevels: ["B2"],
    hoursRange: "200-280 gio",
    productGoal: "Chuyen tu tieng Anh tong quat sang academic IELTS.",
    learnerCanDo: [
      "Doc bai dai hon, tom tat lap luan va nhan dien quan diem.",
      "Viet Task 1/Task 2 co cau truc, cohesion, lexical control.",
      "Noi 2 phut va tra loi Part 3 voi ly do, vi du, phan doi.",
    ],
    skillFocus: {
      listening: "Lecture/seminar, distractor, map/form/note completion.",
      reading: "Skimming, scanning, heading, T/F/NG, paraphrase.",
      writing: "Task 1 overview, Task 2 argument, revision loop.",
      speaking: "Part 1/2/3, fluency, pronunciation features.",
    },
    qualityGate: "IELTS feedback phai bam 4 tieu chi chinh thuc va co revision cycle.",
  },
  {
    id: "ielts_65",
    order: 6,
    title: "IELTS 6.5 Readiness",
    levelRange: "B2+ / IELTS 6.5",
    unitLevels: [],
    hoursRange: "40-70 gio luyen de",
    productGoal: "Mock test, chuan hoa toc do, chien luoc bai thi, sua loi theo band.",
    learnerCanDo: [
      "Lam de theo thoi gian va phan tich loi lap lai.",
      "Giu Writing/Speaking quanh band 6-7 voi it loi lam mat nghia.",
      "Dat Listening/Reading on dinh gan muc muc tieu.",
    ],
    skillFocus: {
      listening: "Full test strategy va error log.",
      reading: "Timed passages, question-type mastery.",
      writing: "Band 6/7 rubric calibration.",
      speaking: "Mock interview va examiner-style feedback.",
    },
    qualityGate: "Chi hien thi 'ready' khi mock skill scores on dinh, khong dua vao XP.",
  },
];

export const LESSON_QUALITY_CRITERIA: LessonQualityCriterion[] = [
  {
    id: "can_do",
    label: "Can-do outcome",
    points: 10,
    description: "Nguoi hoc biet sau bai nay minh lam duoc viec gi.",
  },
  {
    id: "comprehensible_input",
    label: "Input vua suc",
    points: 15,
    description: "Tu moi, audio, ngu canh va L1 support phu hop cap do.",
  },
  {
    id: "retrieval_output",
    label: "Retrieval + output",
    points: 15,
    description: "Co nhan dien, goi nho, tao cau/noi/viet co kiem soat.",
  },
  {
    id: "feedback",
    label: "Feedback hanh dong",
    points: 15,
    description: "Sua 1-3 loi quan trong bang tieng Viet, co next action.",
  },
  {
    id: "srs",
    label: "SRS item hoa",
    points: 10,
    description: "Tu, phrase, frame, pronunciation target duoc dua vao review.",
  },
  {
    id: "vietnamese_errors",
    label: "Loi nguoi Viet",
    points: 10,
    description: "Target ro final sound, word order, be omission, plural -s, stress.",
  },
  {
    id: "cognitive_load",
    label: "Tai nhan thuc",
    points: 10,
    description: "Moi lesson chi day it muc tieu, khong nhoi grammar dai.",
  },
  {
    id: "assessment",
    label: "Assessment khop muc tieu",
    points: 10,
    description: "Mastery check do dung can-do, khong chi do nhan dien.",
  },
  {
    id: "safety",
    label: "An toan & rieng tu",
    points: 5,
    description: "Audio, feedback, analytics khong gay xau ho hay lo du lieu.",
  },
];

export const LESSON_QUALITY_MAX_SCORE = LESSON_QUALITY_CRITERIA.reduce(
  (sum, criterion) => sum + criterion.points,
  0
);

export const LESSON_QUALITY_PASS_SCORE = 80;

export const SELF_STUDY_RISKS: SelfStudyRisk[] = [
  {
    title: "Qua lac quan ve thoi gian",
    mitigation: "Hien timeline 800-1,200 gio va chia thanh checkpoint nho.",
  },
  {
    title: "Hoc nhan dien nhung khong san sinh",
    mitigation: "Moi lesson phai co speaking/writing output co kiem soat.",
  },
  {
    title: "AI feedback sai hoac qua dai",
    mitigation: "Dung structured rubric, confidence threshold va human QA cho lesson.",
  },
  {
    title: "Bo cuoc truoc A2",
    mitigation: "Daily plan ngan, review debt nho, feedback rieng tu va tien do can-do.",
  },
];

export function getStageForLevel(level: string): LearningStage {
  return (
    ATOENGLISH_LEARNING_STAGES.find((stage) =>
      stage.unitLevels.includes(level)
    ) ?? ATOENGLISH_LEARNING_STAGES[0]
  );
}

export function getStageIndexForLevel(level: string): number {
  return ATOENGLISH_LEARNING_STAGES.findIndex((stage) =>
    stage.unitLevels.includes(level)
  );
}

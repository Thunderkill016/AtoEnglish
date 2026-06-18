export type CEFRLevel = import("./database").CEFRLevel;

export type IPORPhase = "input" | "processing" | "output" | "review";

export type {
  Card,
  CardInsert,
  CardUpdate,
  Database,
  LessonHistory,
  LessonHistoryInsert,
  LessonHistoryUpdate,
  User,
  UserInsert,
  UserProgress,
  UserProgressInsert,
  UserProgressUpdate,
  UserSentence,
  UserSentenceInsert,
  UserSentenceUpdate,
  UserUpdate,
} from "./database";

// Legacy alias
export type UserProfile = import("./database").User;
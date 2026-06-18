export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Row types (SELECT)
// ---------------------------------------------------------------------------

export type User = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  user_id: string;
  current_level: CEFRLevel;
  streak: number;
  total_xp: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Card = {
  id: string;
  user_id: string;
  word: string;
  phonetic: string | null;
  meaning_vn: string;
  example_en: string | null;
  topic: string | null;
  level: CEFRLevel;
  interval: number;
  ease_factor: number;
  due_date: string;
  repetitions: number;
  last_reviewed: string | null;
  created_at: string;
  updated_at: string;
  state: number;
  difficulty: number;
  stability: number;
  last_review: string | null;
  next_review: string | null;
};

export type LessonHistory = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
  score: number | null;
  created_at: string;
};

export type UserSentence = {
  id: string;
  user_id: string;
  sentence_en: string;
  meaning_vn: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type UserLessonProgress = {
  id: string;
  user_id: string;
  unit_id: string;
  completed_at: string;
  xp_earned: number;
  created_at: string;
};

export type SpeakingSession = {
  id: string;
  user_id: string;
  practice_type: string;
  duration: number;
  transcript: string | null;
  accuracy_score: number | null;
  scenario_id: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Insert types (omit auto-generated fields)
// ---------------------------------------------------------------------------

export type UserInsert = {
  id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type UserProgressInsert = {
  user_id: string;
  current_level?: CEFRLevel;
  streak?: number;
  total_xp?: number;
  last_active_date?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CardInsert = {
  id?: string;
  user_id: string;
  word: string;
  phonetic?: string | null;
  meaning_vn: string;
  example_en?: string | null;
  topic?: string | null;
  level?: CEFRLevel;
  interval?: number;
  ease_factor?: number;
  due_date?: string;
  repetitions?: number;
  last_reviewed?: string | null;
  created_at?: string;
  updated_at?: string;
  state?: number;
  difficulty?: number;
  stability?: number;
  last_review?: string | null;
  next_review?: string | null;
};

export type LessonHistoryInsert = {
  id?: string;
  user_id: string;
  lesson_id: string;
  completed_at?: string;
  score?: number | null;
  created_at?: string;
};

export type UserSentenceInsert = {
  id?: string;
  user_id: string;
  sentence_en: string;
  meaning_vn: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
};

export type UserLessonProgressInsert = {
  id?: string;
  user_id: string;
  unit_id: string;
  completed_at?: string;
  xp_earned?: number;
  created_at?: string;
};

export type SpeakingSessionInsert = {
  id?: string;
  user_id: string;
  practice_type: string;
  duration: number;
  transcript?: string | null;
  accuracy_score?: number | null;
  scenario_id?: string | null;
  created_at?: string;
};

// ---------------------------------------------------------------------------
// Update types (all fields optional except identifiers)
// ---------------------------------------------------------------------------

export type UserUpdate = Partial<
  Omit<User, "id" | "created_at" | "updated_at">
>;

export type UserProgressUpdate = Partial<
  Omit<UserProgress, "user_id" | "created_at" | "updated_at">
>;

export type CardUpdate = Partial<
  Omit<Card, "id" | "user_id" | "created_at" | "updated_at">
>;

export type LessonHistoryUpdate = Partial<
  Omit<LessonHistory, "id" | "user_id" | "created_at">
>;

export type UserSentenceUpdate = Partial<
  Omit<UserSentence, "id" | "user_id" | "created_at" | "updated_at">
>;

export type UserLessonProgressUpdate = Partial<
  Omit<UserLessonProgress, "id" | "user_id" | "created_at">
>;

export type SpeakingSessionUpdate = Partial<
  Omit<SpeakingSession, "id" | "user_id" | "created_at">
>;

// ---------------------------------------------------------------------------
// Supabase Database generic (for typed client)
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
        Relationships: [];
      };
      user_progress: {
        Row: UserProgress;
        Insert: UserProgressInsert;
        Update: UserProgressUpdate;
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      cards: {
        Row: Card;
        Insert: CardInsert;
        Update: CardUpdate;
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_history: {
        Row: LessonHistory;
        Insert: LessonHistoryInsert;
        Update: LessonHistoryUpdate;
        Relationships: [
          {
            foreignKeyName: "lesson_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_sentences: {
        Row: UserSentence;
        Insert: UserSentenceInsert;
        Update: UserSentenceUpdate;
        Relationships: [
          {
            foreignKeyName: "user_sentences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_lesson_progress: {
        Row: UserLessonProgress;
        Insert: UserLessonProgressInsert;
        Update: UserLessonProgressUpdate;
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      speaking_sessions: {
        Row: SpeakingSession;
        Insert: SpeakingSessionInsert;
        Update: SpeakingSessionUpdate;
        Relationships: [
          {
            foreignKeyName: "speaking_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      cefr_level: CEFRLevel;
    };
    CompositeTypes: Record<string, never>;
  };
};
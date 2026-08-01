export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description_vn: string
          emoji: string
          id: string
          threshold: number | null
          title_en: string
          title_vn: string
          xp_reward: number
        }
        Insert: {
          category: string
          created_at?: string
          description_vn: string
          emoji?: string
          id: string
          threshold?: number | null
          title_en: string
          title_vn: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description_vn?: string
          emoji?: string
          id?: string
          threshold?: number | null
          title_en?: string
          title_vn?: string
          xp_reward?: number
        }
        Relationships: []
      }
      card_review_logs: {
        Row: {
          card_id: string
          created_at: string
          difficulty: number
          due: string
          elapsed_days: number
          id: string
          rating: number
          review: string
          scheduled_days: number
          stability: number
          state: number
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          difficulty?: number
          due: string
          elapsed_days?: number
          id?: string
          rating: number
          review?: string
          scheduled_days?: number
          stability?: number
          state: number
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          difficulty?: number
          due?: string
          elapsed_days?: number
          id?: string
          rating?: number
          review?: string
          scheduled_days?: number
          stability?: number
          state?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_review_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          created_at: string
          difficulty: number
          due_date: string
          example_en: string | null
          id: string
          interval: number
          last_review: string | null
          level: string
          meaning_vn: string
          next_review: string | null
          phonetic: string | null
          repetitions: number
          stability: number
          state: number
          topic: string | null
          updated_at: string
          user_id: string
          word: string
        }
        Insert: {
          created_at?: string
          difficulty?: number
          due_date?: string
          example_en?: string | null
          id?: string
          interval?: number
          last_review?: string | null
          level?: string
          meaning_vn: string
          next_review?: string | null
          phonetic?: string | null
          repetitions?: number
          stability?: number
          state?: number
          topic?: string | null
          updated_at?: string
          user_id: string
          word: string
        }
        Update: {
          created_at?: string
          difficulty?: number
          due_date?: string
          example_en?: string | null
          id?: string
          interval?: number
          last_review?: string | null
          level?: string
          meaning_vn?: string
          next_review?: string | null
          phonetic?: string | null
          repetitions?: number
          stability?: number
          state?: number
          topic?: string | null
          updated_at?: string
          user_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_results: {
        Row: {
          challenge_date: string
          created_at: string
          id: string
          score: number
          total: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          challenge_date: string
          created_at?: string
          id?: string
          score: number
          total: number
          user_id: string
          xp_earned: number
        }
        Update: {
          challenge_date?: string
          created_at?: string
          id?: string
          score?: number
          total?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      league_memberships: {
        Row: {
          joined_at: string
          league_id: string
          user_id: string
          xp_this_week: number
        }
        Insert: {
          joined_at?: string
          league_id: string
          user_id: string
          xp_this_week?: number
        }
        Update: {
          joined_at?: string
          league_id?: string
          user_id?: string
          xp_this_week?: number
        }
        Relationships: [
          {
            foreignKeyName: "league_memberships_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          id: string
          tier: Database["public"]["Enums"]["league_tier"]
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          tier: Database["public"]["Enums"]["league_tier"]
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          tier?: Database["public"]["Enums"]["league_tier"]
          week_start?: string
        }
        Relationships: []
      }
      learning_attempts: {
        Row: {
          activity_id: string
          created_at: string
          error_tags: string[]
          evaluator: string
          evaluator_version: string
          id: number
          latency_ms: number | null
          lesson_id: string
          modality: string
          score: number | null
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          error_tags?: string[]
          evaluator: string
          evaluator_version: string
          id?: never
          latency_ms?: number | null
          lesson_id: string
          modality: string
          score?: number | null
          session_id: string
          status: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          error_tags?: string[]
          evaluator?: string
          evaluator_version?: string
          id?: never
          latency_ms?: number | null
          lesson_id?: string
          modality?: string
          score?: number | null
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_history: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          lesson_id: string
          score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id: string
          score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
          url: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type: string
          url?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_memories: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          project: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: never
          metadata?: Json | null
          project?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: never
          metadata?: Json | null
          project?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          keys: Json
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          keys: Json
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          keys?: Json
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          created_at: string
          id: string
          pct: number
          quiz_date: string
          score: number
          total: number
          unit_id: string
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          id?: string
          pct: number
          quiz_date: string
          score: number
          total: number
          unit_id: string
          updated_at?: string
          user_id: string
          xp_earned: number
        }
        Update: {
          created_at?: string
          id?: string
          pct?: number
          quiz_date?: string
          score?: number
          total?: number
          unit_id?: string
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      speaking_sessions: {
        Row: {
          accuracy_score: number | null
          created_at: string
          duration: number
          id: string
          practice_type: string
          scenario_id: string | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          duration: number
          id?: string
          practice_type: string
          scenario_id?: string | null
          transcript?: string | null
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          duration?: number
          id?: string
          practice_type?: string
          scenario_id?: string | null
          transcript?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unit_content: {
        Row: {
          content: Json
          created_at: string
          is_active: boolean
          unit_id: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          is_active?: boolean
          unit_id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          is_active?: boolean
          unit_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          notified: boolean
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          notified?: boolean
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          notified?: boolean
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_flashcard_progress: {
        Row: {
          best_streak: number
          cards_reviewed_today: number
          created_at: string
          last_session_at: string | null
          last_session_date: string | null
          streak_days: number
          total_cards_reviewed: number
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          cards_reviewed_today?: number
          created_at?: string
          last_session_at?: string | null
          last_session_date?: string | null
          streak_days?: number
          total_cards_reviewed?: number
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          cards_reviewed_today?: number
          created_at?: string
          last_session_at?: string | null
          last_session_date?: string | null
          streak_days?: number
          total_cards_reviewed?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          unit_id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          unit_id: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          unit_id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      user_onboarding_profile: {
        Row: {
          created_at: string
          daily_minutes: number
          goal: string
          obstacle: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_minutes: number
          goal: string
          obstacle: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_minutes?: number
          goal?: string
          obstacle?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          best_streak: number
          created_at: string
          current_level: string
          daily_xp_goal: number
          email_notifications: boolean | null
          last_active_date: string | null
          notification_hour: number | null
          placement_completed_at: string | null
          starting_unit_index: number
          streak: number
          streak_freeze_count: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          created_at?: string
          current_level?: string
          daily_xp_goal?: number
          email_notifications?: boolean | null
          last_active_date?: string | null
          notification_hour?: number | null
          placement_completed_at?: string | null
          starting_unit_index?: number
          streak?: number
          streak_freeze_count?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          created_at?: string
          current_level?: string
          daily_xp_goal?: number
          email_notifications?: boolean | null
          last_active_date?: string | null
          notification_hour?: number | null
          placement_completed_at?: string | null
          starting_unit_index?: number
          streak?: number
          streak_freeze_count?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sentences: {
        Row: {
          created_at: string
          id: string
          meaning_vn: string
          sentence_en: string
          tags: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meaning_vn: string
          sentence_en: string
          tags?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meaning_vn?: string
          sentence_en?: string
          tags?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sentences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_league_for_user: { Args: { p_user_id: string }; Returns: string }
      award_user_xp: {
        Args: {
          p_today: string
          p_user_id: string
          p_xp_amount: number
          p_yesterday: string
        }
        Returns: {
          last_active_date: string
          streak: number
          total_xp: number
        }[]
      }
      bump_league_xp: {
        Args: { p_user_id: string; p_xp_delta: number }
        Returns: undefined
      }
      complete_unit_transaction: {
        Args: {
          p_stars: number
          p_today: string
          p_unit_id: string
          p_user_id: string
          p_xp_earned: number
        }
        Returns: Json
      }
      grant_streak_freeze: {
        Args: { p_count?: number; p_user_id: string }
        Returns: undefined
      }
      match_memories: {
        Args: {
          filter_category?: string
          filter_project?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          created_at: string
          id: number
          metadata: Json
          project: string
          similarity: number
        }[]
      }
      next_cefr_level: { Args: { level: string }; Returns: string }
      units_required_for_level: { Args: { level: string }; Returns: number }
      use_streak_freeze: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1"
      league_tier: "bronze" | "silver" | "gold" | "emerald" | "diamond"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cefr_level: ["A1", "A2", "B1", "B2", "C1"],
      league_tier: ["bronze", "silver", "gold", "emerald", "diamond"],
    },
  },
} as const

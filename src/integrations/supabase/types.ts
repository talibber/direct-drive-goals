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
          badge_name: string
          client_id: string
          earned_at: string
          id: string
        }
        Insert: {
          badge_name: string
          client_id: string
          earned_at?: string
          id?: string
        }
        Update: {
          badge_name?: string
          client_id?: string
          earned_at?: string
          id?: string
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          client_id: string
          coach_notes: string | null
          completed_at: string
          created_at: string
          disc_scores: Json
          disc_type: string
          execution_consistency_score: number
          execution_motivation_score: number
          execution_planning_score: number
          execution_risk_score: number
          id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          coach_notes?: string | null
          completed_at?: string
          created_at?: string
          disc_scores?: Json
          disc_type: string
          execution_consistency_score?: number
          execution_motivation_score?: number
          execution_planning_score?: number
          execution_risk_score?: number
          id?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          coach_notes?: string | null
          completed_at?: string
          created_at?: string
          disc_scores?: Json
          disc_type?: string
          execution_consistency_score?: number
          execution_motivation_score?: number
          execution_planning_score?: number
          execution_risk_score?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_points: {
        Row: {
          client_id: string
          current_level: number
          id: string
          last_updated: string
          monthly_points: number
          total_points: number
        }
        Insert: {
          client_id: string
          current_level?: number
          id?: string
          last_updated?: string
          monthly_points?: number
          total_points?: number
        }
        Update: {
          client_id?: string
          current_level?: number
          id?: string
          last_updated?: string
          monthly_points?: number
          total_points?: number
        }
        Relationships: []
      }
      coach_activity: {
        Row: {
          activity_description: string
          activity_type: string
          client_id: string
          coach_id: string
          created_at: string
          id: string
        }
        Insert: {
          activity_description: string
          activity_type: string
          client_id: string
          coach_id: string
          created_at?: string
          id?: string
        }
        Update: {
          activity_description?: string
          activity_type?: string
          client_id?: string
          coach_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          is_moderated: boolean
          photo_url: string | null
          post_id: string
        }
        Insert: {
          client_id: string
          content?: string
          created_at?: string
          id?: string
          is_moderated?: boolean
          photo_url?: string | null
          post_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          is_moderated?: boolean
          photo_url?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          client_id: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          is_moderated: boolean
          likes_count: number
          photo_urls: string[] | null
          post_type: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          is_moderated?: boolean
          likes_count?: number
          photo_urls?: string[] | null
          post_type?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          is_moderated?: boolean
          likes_count?: number
          photo_urls?: string[] | null
          post_type?: string
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_assignments: {
        Row: {
          assigned_by: string
          assigned_note: string | null
          client_id: string
          client_reflection: string | null
          completed: boolean
          completed_at: string | null
          content_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_note?: string | null
          client_id: string
          client_reflection?: string | null
          completed?: boolean
          completed_at?: string | null
          content_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_note?: string | null
          client_id?: string
          client_reflection?: string | null
          completed?: boolean
          completed_at?: string | null
          content_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_assignments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_library"
            referencedColumns: ["id"]
          },
        ]
      }
      content_library: {
        Row: {
          body: string
          category: string
          content_type: string
          created_at: string
          created_by: string
          id: string
          is_core: boolean
          key_takeaway: string | null
          read_time_minutes: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          category?: string
          content_type?: string
          created_at?: string
          created_by: string
          id?: string
          is_core?: boolean
          key_takeaway?: string | null
          read_time_minutes?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          content_type?: string
          created_at?: string
          created_by?: string
          id?: string
          is_core?: boolean
          key_takeaway?: string | null
          read_time_minutes?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          coach_id: string
          created_at: string
          id: string
          last_message_at: string
        }
        Insert: {
          client_id: string
          coach_id: string
          created_at?: string
          id?: string
          last_message_at?: string
        }
        Update: {
          client_id?: string
          coach_id?: string
          created_at?: string
          id?: string
          last_message_at?: string
        }
        Relationships: []
      }
      goal_approval_history: {
        Row: {
          action: Database["public"]["Enums"]["goal_approval_action"]
          coach_id: string
          created_at: string
          goal_id: string
          id: string
          notes: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["goal_approval_action"]
          coach_id: string
          created_at?: string
          goal_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["goal_approval_action"]
          coach_id?: string
          created_at?: string
          goal_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_approval_history_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_proof_submissions: {
        Row: {
          client_id: string
          coach_decision: string | null
          coach_note: string | null
          completion_description: string
          decided_at: string | null
          file_urls: string[] | null
          goal_id: string
          id: string
          self_assessment: string
          submitted_at: string
        }
        Insert: {
          client_id: string
          coach_decision?: string | null
          coach_note?: string | null
          completion_description: string
          decided_at?: string | null
          file_urls?: string[] | null
          goal_id: string
          id?: string
          self_assessment: string
          submitted_at?: string
        }
        Update: {
          client_id?: string
          coach_decision?: string | null
          coach_note?: string | null
          completion_description?: string
          decided_at?: string | null
          file_urls?: string[] | null
          goal_id?: string
          id?: string
          self_assessment?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_proof_submissions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          approved_at: string | null
          category: string
          coach_approved: boolean
          coach_id: string | null
          coach_notes: string | null
          coach_verification_note: string | null
          created_at: string
          current_value: number
          description: string | null
          due_date: string
          id: string
          metric_type: string
          proof_description: string | null
          proof_file_url: string | null
          proof_requirement: string | null
          proof_submitted_at: string | null
          resubmission_count: number
          self_completed: boolean | null
          stake: number
          status: Database["public"]["Enums"]["goal_status"]
          target: string
          target_value: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          category?: string
          coach_approved?: boolean
          coach_id?: string | null
          coach_notes?: string | null
          coach_verification_note?: string | null
          created_at?: string
          current_value?: number
          description?: string | null
          due_date: string
          id?: string
          metric_type?: string
          proof_description?: string | null
          proof_file_url?: string | null
          proof_requirement?: string | null
          proof_submitted_at?: string | null
          resubmission_count?: number
          self_completed?: boolean | null
          stake?: number
          status?: Database["public"]["Enums"]["goal_status"]
          target: string
          target_value?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          category?: string
          coach_approved?: boolean
          coach_id?: string | null
          coach_notes?: string | null
          coach_verification_note?: string | null
          created_at?: string
          current_value?: number
          description?: string | null
          due_date?: string
          id?: string
          metric_type?: string
          proof_description?: string | null
          proof_file_url?: string | null
          proof_requirement?: string | null
          proof_submitted_at?: string | null
          resubmission_count?: number
          self_completed?: boolean | null
          stake?: number
          status?: Database["public"]["Enums"]["goal_status"]
          target?: string
          target_value?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      help_radar_items: {
        Row: {
          addressed_at: string | null
          category: string
          client_id: string
          coach_note: string | null
          coach_status: Database["public"]["Enums"]["help_radar_status"]
          context: string | null
          created_at: string
          custom_description: string | null
          flagged_at: string
          id: string
          resolved_at: string | null
          resolved_by_client: boolean
          updated_at: string
        }
        Insert: {
          addressed_at?: string | null
          category: string
          client_id: string
          coach_note?: string | null
          coach_status?: Database["public"]["Enums"]["help_radar_status"]
          context?: string | null
          created_at?: string
          custom_description?: string | null
          flagged_at?: string
          id?: string
          resolved_at?: string | null
          resolved_by_client?: boolean
          updated_at?: string
        }
        Update: {
          addressed_at?: string | null
          category?: string
          client_id?: string
          coach_note?: string | null
          coach_status?: Database["public"]["Enums"]["help_radar_status"]
          context?: string | null
          created_at?: string
          custom_description?: string | null
          flagged_at?: string
          id?: string
          resolved_at?: string | null
          resolved_by_client?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_urls: string[] | null
          content: string
          conversation_id: string
          id: string
          read_at: string | null
          sender_id: string
          sender_role: string
          sent_at: string
        }
        Insert: {
          attachment_urls?: string[] | null
          content: string
          conversation_id: string
          id?: string
          read_at?: string | null
          sender_id: string
          sender_role?: string
          sent_at?: string
        }
        Update: {
          attachment_urls?: string[] | null
          content?: string
          conversation_id?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          sender_role?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      missed_goal_charges: {
        Row: {
          amount: number
          charge_date: string
          coach_verification_note: string | null
          coach_verified: boolean
          created_at: string
          goal_id: string
          id: string
          pattern_call_scheduled: boolean
          user_id: string
        }
        Insert: {
          amount?: number
          charge_date?: string
          coach_verification_note?: string | null
          coach_verified?: boolean
          created_at?: string
          goal_id: string
          id?: string
          pattern_call_scheduled?: boolean
          user_id: string
        }
        Update: {
          amount?: number
          charge_date?: string
          coach_verification_note?: string | null
          coach_verified?: boolean
          created_at?: string
          goal_id?: string
          id?: string
          pattern_call_scheduled?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "missed_goal_charges_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      missed_goal_reports: {
        Row: {
          client_id: string
          full_explanation: string
          goal_id: string
          id: string
          is_familiar_pattern: boolean
          next_commitment: string
          pattern_description: string | null
          root_cause_category: string
          submitted_at: string
        }
        Insert: {
          client_id: string
          full_explanation: string
          goal_id: string
          id?: string
          is_familiar_pattern?: boolean
          next_commitment: string
          pattern_description?: string | null
          root_cause_category: string
          submitted_at?: string
        }
        Update: {
          client_id?: string
          full_explanation?: string
          goal_id?: string
          id?: string
          is_familiar_pattern?: boolean
          next_commitment?: string
          pattern_description?: string | null
          root_cause_category?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missed_goal_reports_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          client_id: string
          coaching_track: string
          completed_at: string | null
          created_at: string
          id: string
          reminder_sent: boolean
          step_name: string
          step_order: number
          unlocked_at: string
          updated_at: string
        }
        Insert: {
          client_id: string
          coaching_track?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          reminder_sent?: boolean
          step_name: string
          step_order?: number
          unlocked_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          coaching_track?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          reminder_sent?: boolean
          step_name?: string
          step_order?: number
          unlocked_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      perfect_month_calls: {
        Row: {
          call_completed_at: string | null
          call_scheduled_at: string | null
          call_title: string | null
          client_id: string
          coach_notes: string | null
          created_at: string
          id: string
          month: string
          next_goals_set: boolean
          triggered_at: string
          updated_at: string
        }
        Insert: {
          call_completed_at?: string | null
          call_scheduled_at?: string | null
          call_title?: string | null
          client_id: string
          coach_notes?: string | null
          created_at?: string
          id?: string
          month: string
          next_goals_set?: boolean
          triggered_at?: string
          updated_at?: string
        }
        Update: {
          call_completed_at?: string | null
          call_scheduled_at?: string | null
          call_title?: string | null
          client_id?: string
          coach_notes?: string | null
          created_at?: string
          id?: string
          month?: string
          next_goals_set?: boolean
          triggered_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          client_id: string
          created_at: string
          id: string
          points_earned: number
          reason: string
          reference_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          points_earned: number
          reason: string
          reference_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          points_earned?: number
          reason?: string
          reference_id?: string | null
        }
        Relationships: []
      }
      reset_session_engagement: {
        Row: {
          client_id: string
          coach_acknowledged: boolean
          commitment_submitted: boolean
          commitment_submitted_at: string | null
          commitment_text: string | null
          created_at: string
          id: string
          recording_watched: boolean
          session_id: string
          updated_at: string
          watched_at: string | null
        }
        Insert: {
          client_id: string
          coach_acknowledged?: boolean
          commitment_submitted?: boolean
          commitment_submitted_at?: string | null
          commitment_text?: string | null
          created_at?: string
          id?: string
          recording_watched?: boolean
          session_id: string
          updated_at?: string
          watched_at?: string | null
        }
        Update: {
          client_id?: string
          coach_acknowledged?: boolean
          commitment_submitted?: boolean
          commitment_submitted_at?: string | null
          commitment_text?: string | null
          created_at?: string
          id?: string
          recording_watched?: boolean
          session_id?: string
          updated_at?: string
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reset_session_engagement_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "reset_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      reset_sessions: {
        Row: {
          completed: boolean
          created_at: string
          enrolled_clients: string[]
          id: string
          month: string
          recording_sent_at: string | null
          recording_uploaded_at: string | null
          recording_url: string | null
          session_date: string
          session_notes: string | null
          session_recap: string | null
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          enrolled_clients?: string[]
          id?: string
          month: string
          recording_sent_at?: string | null
          recording_uploaded_at?: string | null
          recording_url?: string | null
          session_date: string
          session_notes?: string | null
          session_recap?: string | null
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          enrolled_clients?: string[]
          id?: string
          month?: string
          recording_sent_at?: string | null
          recording_uploaded_at?: string | null
          recording_url?: string | null
          session_date?: string
          session_notes?: string | null
          session_recap?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_challenges: {
        Row: {
          completed: boolean
          created_at: string
          description: string
          due_date: string
          id: string
          target_metric: string
          target_value: number
          team_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description: string
          due_date: string
          id?: string
          target_metric: string
          target_value?: number
          team_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          target_metric?: string
          target_value?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_challenges_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          client_id: string
          id: string
          is_admin: boolean
          joined_at: string
          team_id: string
        }
        Insert: {
          client_id: string
          id?: string
          is_admin?: boolean
          joined_at?: string
          team_id: string
        }
        Update: {
          client_id?: string
          id?: string
          is_admin?: boolean
          joined_at?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_open: boolean
          max_members: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_open?: boolean
          max_members?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_open?: boolean
          max_members?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      goal_approval_action: "approved" | "revision_requested" | "rejected"
      goal_status:
        | "pending_approval"
        | "revision_requested"
        | "active"
        | "at_risk"
        | "missed"
        | "completed"
        | "rejected"
        | "proof_pending"
        | "proof_submitted"
        | "waived"
      help_radar_status: "seen" | "on_deck" | "addressed"
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
      goal_approval_action: ["approved", "revision_requested", "rejected"],
      goal_status: [
        "pending_approval",
        "revision_requested",
        "active",
        "at_risk",
        "missed",
        "completed",
        "rejected",
        "proof_pending",
        "proof_submitted",
        "waived",
      ],
      help_radar_status: ["seen", "on_deck", "addressed"],
    },
  },
} as const

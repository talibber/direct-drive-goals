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
      reset_sessions: {
        Row: {
          completed: boolean
          created_at: string
          enrolled_clients: string[]
          id: string
          month: string
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
          session_date?: string
          session_notes?: string | null
          session_recap?: string | null
          updated_at?: string
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
    },
  },
} as const

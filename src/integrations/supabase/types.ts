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
      achievement_group_sessions: {
        Row: {
          coach_notes: string | null
          completed: boolean
          created_at: string
          enrolled_clients: string[]
          id: string
          month: string
          recording_url: string | null
          session_date: string
          updated_at: string
        }
        Insert: {
          coach_notes?: string | null
          completed?: boolean
          created_at?: string
          enrolled_clients?: string[]
          id?: string
          month: string
          recording_url?: string | null
          session_date: string
          updated_at?: string
        }
        Update: {
          coach_notes?: string | null
          completed?: boolean
          created_at?: string
          enrolled_clients?: string[]
          id?: string
          month?: string
          recording_url?: string | null
          session_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      achievement_group_submissions: {
        Row: {
          client_id: string
          commitment_submitted_at: string | null
          created_at: string
          id: string
          next_bar: string
          next_commitment: string | null
          proud_goal: string
          session_id: string
          submitted_at: string
          updated_at: string
          what_made_difference: string
        }
        Insert: {
          client_id: string
          commitment_submitted_at?: string | null
          created_at?: string
          id?: string
          next_bar: string
          next_commitment?: string | null
          proud_goal: string
          session_id: string
          submitted_at?: string
          updated_at?: string
          what_made_difference: string
        }
        Update: {
          client_id?: string
          commitment_submitted_at?: string | null
          created_at?: string
          id?: string
          next_bar?: string
          next_commitment?: string | null
          proud_goal?: string
          session_id?: string
          submitted_at?: string
          updated_at?: string
          what_made_difference?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_group_submissions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "achievement_group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      action_queue_items: {
        Row: {
          assigned_owner: string | null
          client_id: string
          context_summary: Json
          created_at: string
          id: string
          internal_due_at: string | null
          priority: number
          resolved_at: string | null
          resolved_by: string | null
          risk_level: string
          source_id: string | null
          source_type: string
          status: string
          suggested_action: string | null
          suggested_response_draft_id: string | null
          trigger: string
          updated_at: string
        }
        Insert: {
          assigned_owner?: string | null
          client_id: string
          context_summary?: Json
          created_at?: string
          id?: string
          internal_due_at?: string | null
          priority?: number
          resolved_at?: string | null
          resolved_by?: string | null
          risk_level?: string
          source_id?: string | null
          source_type: string
          status?: string
          suggested_action?: string | null
          suggested_response_draft_id?: string | null
          trigger: string
          updated_at?: string
        }
        Update: {
          assigned_owner?: string | null
          client_id?: string
          context_summary?: Json
          created_at?: string
          id?: string
          internal_due_at?: string | null
          priority?: number
          resolved_at?: string | null
          resolved_by?: string | null
          risk_level?: string
          source_id?: string | null
          source_type?: string
          status?: string
          suggested_action?: string | null
          suggested_response_draft_id?: string | null
          trigger?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          accountability_style: string | null
          additional_notes: string | null
          avoided_decision: string | null
          avoiding: string | null
          breach_fee_acknowledged: boolean | null
          breach_terms_agreed: boolean | null
          business_name: string | null
          cancellation_terms_agreed: boolean | null
          challenge: string | null
          coaching_interest: string
          community_motivation: string | null
          created_at: string
          decision_outcome: string | null
          email: string
          goal_area: string | null
          goals_30_day: string | null
          id: string
          in_crisis: boolean | null
          industry: string | null
          name: string
          not_therapy_agreed: boolean | null
          occupation: string | null
          pod_visibility_ok: string | null
          prior_coaching: string | null
          readiness: string | null
          revenue_range: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string
          subscription_terms_agreed: boolean | null
          support_level: string | null
          team_size: string | null
          track: string
          tried_before: string | null
          truth_readiness: string | null
          understands_not_therapy: boolean | null
          updated_at: string
          willing_checkins: string | null
          willing_evidence: string | null
        }
        Insert: {
          accountability_style?: string | null
          additional_notes?: string | null
          avoided_decision?: string | null
          avoiding?: string | null
          breach_fee_acknowledged?: boolean | null
          breach_terms_agreed?: boolean | null
          business_name?: string | null
          cancellation_terms_agreed?: boolean | null
          challenge?: string | null
          coaching_interest?: string
          community_motivation?: string | null
          created_at?: string
          decision_outcome?: string | null
          email: string
          goal_area?: string | null
          goals_30_day?: string | null
          id?: string
          in_crisis?: boolean | null
          industry?: string | null
          name: string
          not_therapy_agreed?: boolean | null
          occupation?: string | null
          pod_visibility_ok?: string | null
          prior_coaching?: string | null
          readiness?: string | null
          revenue_range?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          subscription_terms_agreed?: boolean | null
          support_level?: string | null
          team_size?: string | null
          track?: string
          tried_before?: string | null
          truth_readiness?: string | null
          understands_not_therapy?: boolean | null
          updated_at?: string
          willing_checkins?: string | null
          willing_evidence?: string | null
        }
        Update: {
          accountability_style?: string | null
          additional_notes?: string | null
          avoided_decision?: string | null
          avoiding?: string | null
          breach_fee_acknowledged?: boolean | null
          breach_terms_agreed?: boolean | null
          business_name?: string | null
          cancellation_terms_agreed?: boolean | null
          challenge?: string | null
          coaching_interest?: string
          community_motivation?: string | null
          created_at?: string
          decision_outcome?: string | null
          email?: string
          goal_area?: string | null
          goals_30_day?: string | null
          id?: string
          in_crisis?: boolean | null
          industry?: string | null
          name?: string
          not_therapy_agreed?: boolean | null
          occupation?: string | null
          pod_visibility_ok?: string | null
          prior_coaching?: string | null
          readiness?: string | null
          revenue_range?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          subscription_terms_agreed?: boolean | null
          support_level?: string | null
          team_size?: string | null
          track?: string
          tried_before?: string | null
          truth_readiness?: string | null
          understands_not_therapy?: boolean | null
          updated_at?: string
          willing_checkins?: string | null
          willing_evidence?: string | null
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
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after_value: Json | null
          before_value: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          occurred_at: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_value?: Json | null
          before_value?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          occurred_at?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_value?: Json | null
          before_value?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          occurred_at?: string
        }
        Relationships: []
      }
      client_automation_settings: {
        Row: {
          automation_level: number
          client_id: string
          created_at: string
          human_in_loop: boolean
          human_in_loop_end_date: string | null
          human_in_loop_start_date: string | null
          id: string
          onboarded_at: string
          per_trigger_overrides: Json
          send_status: string
          updated_at: string
        }
        Insert: {
          automation_level?: number
          client_id: string
          created_at?: string
          human_in_loop?: boolean
          human_in_loop_end_date?: string | null
          human_in_loop_start_date?: string | null
          id?: string
          onboarded_at?: string
          per_trigger_overrides?: Json
          send_status?: string
          updated_at?: string
        }
        Update: {
          automation_level?: number
          client_id?: string
          created_at?: string
          human_in_loop?: boolean
          human_in_loop_end_date?: string | null
          human_in_loop_start_date?: string | null
          id?: string
          onboarded_at?: string
          per_trigger_overrides?: Json
          send_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_points: {
        Row: {
          client_id: string
          current_level: number
          environment: string
          id: string
          is_demo: boolean
          last_updated: string
          monthly_points: number
          total_points: number
        }
        Insert: {
          client_id: string
          current_level?: number
          environment?: string
          id?: string
          is_demo?: boolean
          last_updated?: string
          monthly_points?: number
          total_points?: number
        }
        Update: {
          client_id?: string
          current_level?: number
          environment?: string
          id?: string
          is_demo?: boolean
          last_updated?: string
          monthly_points?: number
          total_points?: number
        }
        Relationships: []
      }
      client_timeline_events: {
        Row: {
          client_facing_note: string | null
          client_id: string
          client_visible: boolean
          id: string
          internal_note: string | null
          kind: string
          occurred_at: string
          owner_id: string | null
          source_id: string | null
          source_type: string | null
        }
        Insert: {
          client_facing_note?: string | null
          client_id: string
          client_visible?: boolean
          id?: string
          internal_note?: string | null
          kind: string
          occurred_at?: string
          owner_id?: string | null
          source_id?: string | null
          source_type?: string | null
        }
        Update: {
          client_facing_note?: string | null
          client_id?: string
          client_visible?: boolean
          id?: string
          internal_note?: string | null
          kind?: string
          occurred_at?: string
          owner_id?: string | null
          source_id?: string | null
          source_type?: string | null
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
      coach_message_drafts: {
        Row: {
          ai_draft: string
          approved_at: string | null
          approved_by: string | null
          automation_eligible: boolean
          confidence_score: number
          created_at: string
          environment: string
          event_id: string | null
          final_message: string | null
          goal_id: string | null
          id: string
          is_demo: boolean
          response_due_at: string | null
          risk_level: string
          scheduled_send_at: string | null
          sent_at: string | null
          status: string
          suggested_tone: string | null
          tone_match_score: number
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_draft: string
          approved_at?: string | null
          approved_by?: string | null
          automation_eligible?: boolean
          confidence_score?: number
          created_at?: string
          environment?: string
          event_id?: string | null
          final_message?: string | null
          goal_id?: string | null
          id?: string
          is_demo?: boolean
          response_due_at?: string | null
          risk_level?: string
          scheduled_send_at?: string | null
          sent_at?: string | null
          status?: string
          suggested_tone?: string | null
          tone_match_score?: number
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_draft?: string
          approved_at?: string | null
          approved_by?: string | null
          automation_eligible?: boolean
          confidence_score?: number
          created_at?: string
          environment?: string
          event_id?: string | null
          final_message?: string | null
          goal_id?: string | null
          id?: string
          is_demo?: boolean
          response_due_at?: string | null
          risk_level?: string
          scheduled_send_at?: string | null
          sent_at?: string | null
          status?: string
          suggested_tone?: string | null
          tone_match_score?: number
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_message_drafts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "coaching_events"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_message_templates: {
        Row: {
          body: string
          client_specific_for: string | null
          coach_id: string
          created_at: string
          id: string
          is_reusable: boolean
          title: string
          trigger_type: string | null
          updated_at: string
        }
        Insert: {
          body: string
          client_specific_for?: string | null
          coach_id: string
          created_at?: string
          id?: string
          is_reusable?: boolean
          title: string
          trigger_type?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          client_specific_for?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          is_reusable?: boolean
          title?: string
          trigger_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      coach_style_learning: {
        Row: {
          coach_id: string
          created_at: string
          directness_level: number | null
          draft_id: string | null
          encouragement_level: number | null
          example_context: Json
          humor_level: number | null
          id: string
          phrase_added: string | null
          phrase_removed: string | null
          pressure_level: number | null
          tone_shift: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string
          directness_level?: number | null
          draft_id?: string | null
          encouragement_level?: number | null
          example_context?: Json
          humor_level?: number | null
          id?: string
          phrase_added?: string | null
          phrase_removed?: string | null
          pressure_level?: number | null
          tone_shift?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          directness_level?: number | null
          draft_id?: string | null
          encouragement_level?: number | null
          example_context?: Json
          humor_level?: number | null
          id?: string
          phrase_added?: string | null
          phrase_removed?: string | null
          pressure_level?: number | null
          tone_shift?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_style_learning_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "coach_message_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_events: {
        Row: {
          admin_notes: string | null
          assigned_owner: string | null
          client_visible: boolean | null
          created_at: string
          environment: string
          event_payload: Json
          event_type: string
          goal_id: string | null
          id: string
          internal_due_at: string | null
          is_demo: boolean
          priority: number | null
          risk_level: string | null
          status: string | null
          suggested_action: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_owner?: string | null
          client_visible?: boolean | null
          created_at?: string
          environment?: string
          event_payload?: Json
          event_type: string
          goal_id?: string | null
          id?: string
          internal_due_at?: string | null
          is_demo?: boolean
          priority?: number | null
          risk_level?: string | null
          status?: string | null
          suggested_action?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          assigned_owner?: string | null
          client_visible?: boolean | null
          created_at?: string
          environment?: string
          event_payload?: Json
          event_type?: string
          goal_id?: string | null
          id?: string
          internal_due_at?: string | null
          is_demo?: boolean
          priority?: number | null
          risk_level?: string | null
          status?: string | null
          suggested_action?: string | null
          user_id?: string
        }
        Relationships: []
      }
      commitment_breaches: {
        Row: {
          amount: number
          auto_charge_disabled: boolean
          breach_reason: string
          charge_completed_at: string | null
          charge_scheduled_at: string | null
          charged: boolean
          created_at: string
          decision: string | null
          environment: string
          evidence: Json | null
          goal_id: string | null
          id: string
          is_demo: boolean
          notes: string | null
          reset_call_enrolled: boolean
          suggested_decision: string | null
          updated_at: string
          user_id: string
          waived: boolean
          waived_by: string | null
          waiver_reason: string | null
        }
        Insert: {
          amount?: number
          auto_charge_disabled?: boolean
          breach_reason: string
          charge_completed_at?: string | null
          charge_scheduled_at?: string | null
          charged?: boolean
          created_at?: string
          decision?: string | null
          environment?: string
          evidence?: Json | null
          goal_id?: string | null
          id?: string
          is_demo?: boolean
          notes?: string | null
          reset_call_enrolled?: boolean
          suggested_decision?: string | null
          updated_at?: string
          user_id: string
          waived?: boolean
          waived_by?: string | null
          waiver_reason?: string | null
        }
        Update: {
          amount?: number
          auto_charge_disabled?: boolean
          breach_reason?: string
          charge_completed_at?: string | null
          charge_scheduled_at?: string | null
          charged?: boolean
          created_at?: string
          decision?: string | null
          environment?: string
          evidence?: Json | null
          goal_id?: string | null
          id?: string
          is_demo?: boolean
          notes?: string | null
          reset_call_enrolled?: boolean
          suggested_decision?: string | null
          updated_at?: string
          user_id?: string
          waived?: boolean
          waived_by?: string | null
          waiver_reason?: string | null
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          client_id: string
          content: string
          created_at: string
          environment: string
          id: string
          is_demo: boolean
          is_moderated: boolean
          photo_url: string | null
          pod_id: string | null
          post_id: string
        }
        Insert: {
          client_id: string
          content?: string
          created_at?: string
          environment?: string
          id?: string
          is_demo?: boolean
          is_moderated?: boolean
          photo_url?: string | null
          pod_id?: string | null
          post_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          environment?: string
          id?: string
          is_demo?: boolean
          is_moderated?: boolean
          photo_url?: string | null
          pod_id?: string | null
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
          environment: string
          id: string
          is_demo: boolean
          is_moderated: boolean
          likes_count: number
          photo_urls: string[] | null
          pod_id: string | null
          post_type: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          environment?: string
          id?: string
          is_demo?: boolean
          is_moderated?: boolean
          likes_count?: number
          photo_urls?: string[] | null
          pod_id?: string | null
          post_type?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          environment?: string
          id?: string
          is_demo?: boolean
          is_moderated?: boolean
          likes_count?: number
          photo_urls?: string[] | null
          pod_id?: string | null
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
      direct_access_messages: {
        Row: {
          category: string
          client_id: string
          coach_id: string
          context_text: string | null
          created_at: string
          environment: string
          id: string
          is_demo: boolean
          message_type: string
          question_text: string | null
          read_at: string | null
          responded_at: string | null
          response_text: string | null
          response_voice_url: string | null
          sent_at: string
          voice_url: string | null
        }
        Insert: {
          category?: string
          client_id: string
          coach_id: string
          context_text?: string | null
          created_at?: string
          environment?: string
          id?: string
          is_demo?: boolean
          message_type?: string
          question_text?: string | null
          read_at?: string | null
          responded_at?: string | null
          response_text?: string | null
          response_voice_url?: string | null
          sent_at?: string
          voice_url?: string | null
        }
        Update: {
          category?: string
          client_id?: string
          coach_id?: string
          context_text?: string | null
          created_at?: string
          environment?: string
          id?: string
          is_demo?: boolean
          message_type?: string
          question_text?: string | null
          read_at?: string | null
          responded_at?: string | null
          response_text?: string | null
          response_voice_url?: string | null
          sent_at?: string
          voice_url?: string | null
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
          environment: string
          id: string
          is_demo: boolean
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
          environment?: string
          id?: string
          is_demo?: boolean
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
          environment?: string
          id?: string
          is_demo?: boolean
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
          assigned_owner: string | null
          category: string
          client_id: string
          client_status: string
          coach_note: string | null
          coach_status: Database["public"]["Enums"]["help_radar_status"]
          context: string | null
          created_at: string
          custom_description: string | null
          environment: string
          flagged_at: string
          follow_up_at: string | null
          id: string
          is_demo: boolean
          resolved_at: string | null
          resolved_by_client: boolean
          updated_at: string
        }
        Insert: {
          addressed_at?: string | null
          assigned_owner?: string | null
          category: string
          client_id: string
          client_status?: string
          coach_note?: string | null
          coach_status?: Database["public"]["Enums"]["help_radar_status"]
          context?: string | null
          created_at?: string
          custom_description?: string | null
          environment?: string
          flagged_at?: string
          follow_up_at?: string | null
          id?: string
          is_demo?: boolean
          resolved_at?: string | null
          resolved_by_client?: boolean
          updated_at?: string
        }
        Update: {
          addressed_at?: string | null
          assigned_owner?: string | null
          category?: string
          client_id?: string
          client_status?: string
          coach_note?: string | null
          coach_status?: Database["public"]["Enums"]["help_radar_status"]
          context?: string | null
          created_at?: string
          custom_description?: string | null
          environment?: string
          flagged_at?: string
          follow_up_at?: string | null
          id?: string
          is_demo?: boolean
          resolved_at?: string | null
          resolved_by_client?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      message_learning_outcomes: {
        Row: {
          created_at: string
          draft_id: string | null
          engagement_score: number
          goal_status_after_message: string | null
          id: string
          next_action_completed: boolean
          user_id: string
          user_replied: boolean
          user_reply_text: string | null
        }
        Insert: {
          created_at?: string
          draft_id?: string | null
          engagement_score?: number
          goal_status_after_message?: string | null
          id?: string
          next_action_completed?: boolean
          user_id: string
          user_replied?: boolean
          user_reply_text?: string | null
        }
        Update: {
          created_at?: string
          draft_id?: string | null
          engagement_score?: number
          goal_status_after_message?: string | null
          id?: string
          next_action_completed?: boolean
          user_id?: string
          user_replied?: boolean
          user_reply_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_learning_outcomes_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "coach_message_drafts"
            referencedColumns: ["id"]
          },
        ]
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
      operator_call_questions: {
        Row: {
          agenda_order: number | null
          call_id: string
          category: string
          client_id: string
          coach_note: string | null
          id: string
          is_urgent: boolean
          question_text: string
          status: Database["public"]["Enums"]["operator_question_status"]
          submitted_at: string
          updated_at: string
        }
        Insert: {
          agenda_order?: number | null
          call_id: string
          category?: string
          client_id: string
          coach_note?: string | null
          id?: string
          is_urgent?: boolean
          question_text: string
          status?: Database["public"]["Enums"]["operator_question_status"]
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          agenda_order?: number | null
          call_id?: string
          category?: string
          client_id?: string
          coach_note?: string | null
          id?: string
          is_urgent?: boolean
          question_text?: string
          status?: Database["public"]["Enums"]["operator_question_status"]
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_call_questions_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "operator_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_call_wins: {
        Row: {
          call_id: string
          client_id: string
          id: string
          submitted_at: string
          win_text: string
        }
        Insert: {
          call_id: string
          client_id: string
          id?: string
          submitted_at?: string
          win_text: string
        }
        Update: {
          call_id?: string
          client_id?: string
          id?: string
          submitted_at?: string
          win_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_call_wins_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "operator_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_calls: {
        Row: {
          call_date: string
          created_at: string
          guest_name: string | null
          guest_title: string | null
          guest_topic: string | null
          id: string
          join_link: string | null
          recap_notes: string | null
          recording_url: string | null
          updated_at: string
        }
        Insert: {
          call_date: string
          created_at?: string
          guest_name?: string | null
          guest_title?: string | null
          guest_topic?: string | null
          id?: string
          join_link?: string | null
          recap_notes?: string | null
          recording_url?: string | null
          updated_at?: string
        }
        Update: {
          call_date?: string
          created_at?: string
          guest_name?: string | null
          guest_title?: string | null
          guest_topic?: string | null
          id?: string
          join_link?: string | null
          recap_notes?: string | null
          recording_url?: string | null
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
      profiles: {
        Row: {
          client_type: string
          coaching_track: string
          created_at: string
          display_name: string | null
          email: string | null
          environment: string
          is_demo: boolean
          paid_at: string | null
          pod_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_type?: string
          coaching_track?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          environment?: string
          is_demo?: boolean
          paid_at?: string | null
          pod_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_type?: string
          coaching_track?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          environment?: string
          is_demo?: boolean
          paid_at?: string | null
          pod_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qa_published: {
        Row: {
          anonymized_question: string
          answer_format: string
          answer_media_url: string | null
          answer_text: string | null
          category: string
          created_at: string
          id: string
          publish_date: string
          published_by: string
          source_question_ids: string[] | null
          track_visibility: string
          updated_at: string
          week_of: string
        }
        Insert: {
          anonymized_question: string
          answer_format?: string
          answer_media_url?: string | null
          answer_text?: string | null
          category?: string
          created_at?: string
          id?: string
          publish_date?: string
          published_by: string
          source_question_ids?: string[] | null
          track_visibility?: string
          updated_at?: string
          week_of: string
        }
        Update: {
          anonymized_question?: string
          answer_format?: string
          answer_media_url?: string | null
          answer_text?: string | null
          category?: string
          created_at?: string
          id?: string
          publish_date?: string
          published_by?: string
          source_question_ids?: string[] | null
          track_visibility?: string
          updated_at?: string
          week_of?: string
        }
        Relationships: []
      }
      qa_questions: {
        Row: {
          category: string
          client_id: string
          created_at: string
          id: string
          question_text: string
          status: string
          track: string
          updated_at: string
          week_of: string
        }
        Insert: {
          category?: string
          client_id: string
          created_at?: string
          id?: string
          question_text: string
          status?: string
          track?: string
          updated_at?: string
          week_of?: string
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string
          id?: string
          question_text?: string
          status?: string
          track?: string
          updated_at?: string
          week_of?: string
        }
        Relationships: []
      }
      qa_reactions: {
        Row: {
          client_id: string
          created_at: string
          id: string
          is_mine: boolean
          qa_id: string
          resonated: boolean
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          is_mine?: boolean
          qa_id: string
          resonated?: boolean
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          is_mine?: boolean
          qa_id?: string
          resonated?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "qa_reactions_qa_id_fkey"
            columns: ["qa_id"]
            isOneToOne: false
            referencedRelation: "qa_published"
            referencedColumns: ["id"]
          },
        ]
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
      response_target_settings: {
        Row: {
          created_at: string
          id: string
          internal_target_minutes: number
          message_type: string
          priority: number
          track: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          internal_target_minutes?: number
          message_type?: string
          priority?: number
          track?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          internal_target_minutes?: number
          message_type?: string
          priority?: number
          track?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      staff_permissions: {
        Row: {
          id: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          permission?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      style_phrase_bank: {
        Row: {
          client_id: string | null
          coach_id: string
          created_at: string
          id: string
          kind: string
          phrase: string
        }
        Insert: {
          client_id?: string | null
          coach_id: string
          created_at?: string
          id?: string
          kind: string
          phrase: string
        }
        Update: {
          client_id?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          kind?: string
          phrase?: string
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
      user_coaching_profiles: {
        Row: {
          at_risk_count: number
          avoidance_pattern: string | null
          breach_count: number
          coaching_notes: Json
          common_blockers: Json
          completion_rate: number
          id: string
          last_engagement_at: string | null
          missed_goal_count: number
          motivation_pattern: string | null
          preferred_tone: string
          reply_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          at_risk_count?: number
          avoidance_pattern?: string | null
          breach_count?: number
          coaching_notes?: Json
          common_blockers?: Json
          completion_rate?: number
          id?: string
          last_engagement_at?: string | null
          missed_goal_count?: number
          motivation_pattern?: string | null
          preferred_tone?: string
          reply_rate?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          at_risk_count?: number
          avoidance_pattern?: string | null
          breach_count?: number
          coaching_notes?: Json
          common_blockers?: Json
          completion_rate?: number
          id?: string
          last_engagement_at?: string | null
          missed_goal_count?: number
          motivation_pattern?: string | null
          preferred_tone?: string
          reply_rate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_checkins: {
        Row: {
          avoiding: string | null
          business_commitment: string | null
          client_id: string
          coaching_track: string
          commitment: string | null
          completion_status: string | null
          confidence: number
          confidence_score: number | null
          created_at: string
          decision_avoided: string | null
          decision_made: string | null
          energy: number
          environment: string
          failures: string | null
          fear_cost: string | null
          focus: number
          goal_id: string | null
          goal_statuses: Json
          habit_completion: number | null
          id: string
          is_demo: boolean
          needs_help: boolean | null
          notes: string | null
          revenue_actions_count: number | null
          sleep: number
          story: string | null
          stress: number
          updated_at: string
          week_of: string
          wins: string | null
        }
        Insert: {
          avoiding?: string | null
          business_commitment?: string | null
          client_id: string
          coaching_track?: string
          commitment?: string | null
          completion_status?: string | null
          confidence?: number
          confidence_score?: number | null
          created_at?: string
          decision_avoided?: string | null
          decision_made?: string | null
          energy?: number
          environment?: string
          failures?: string | null
          fear_cost?: string | null
          focus?: number
          goal_id?: string | null
          goal_statuses?: Json
          habit_completion?: number | null
          id?: string
          is_demo?: boolean
          needs_help?: boolean | null
          notes?: string | null
          revenue_actions_count?: number | null
          sleep?: number
          story?: string | null
          stress?: number
          updated_at?: string
          week_of?: string
          wins?: string | null
        }
        Update: {
          avoiding?: string | null
          business_commitment?: string | null
          client_id?: string
          coaching_track?: string
          commitment?: string | null
          completion_status?: string | null
          confidence?: number
          confidence_score?: number | null
          created_at?: string
          decision_avoided?: string | null
          decision_made?: string | null
          energy?: number
          environment?: string
          failures?: string | null
          fear_cost?: string | null
          focus?: number
          goal_id?: string | null
          goal_statuses?: Json
          habit_completion?: number | null
          id?: string
          is_demo?: boolean
          needs_help?: boolean | null
          notes?: string | null
          revenue_actions_count?: number | null
          sleep?: number
          story?: string | null
          stress?: number
          updated_at?: string
          week_of?: string
          wins?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_post: {
        Args: { _post_id: string; _user: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      same_pod: { Args: { _pod: string; _user: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "owner"
        | "lead_coach"
        | "assistant_coach"
        | "client_success"
        | "billing_admin"
        | "viewer"
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
      operator_question_status:
        | "under_review"
        | "on_agenda"
        | "not_this_month"
        | "addressed"
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
      app_role: [
        "owner",
        "lead_coach",
        "assistant_coach",
        "client_success",
        "billing_admin",
        "viewer",
      ],
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
      operator_question_status: [
        "under_review",
        "on_agenda",
        "not_this_month",
        "addressed",
      ],
    },
  },
} as const

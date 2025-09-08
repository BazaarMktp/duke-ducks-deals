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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          ai_suggestion: Json | null
          created_at: string
          id: string
          interaction_type: string
          listing_id: string | null
          user_action: string | null
          user_id: string
        }
        Insert: {
          ai_suggestion?: Json | null
          created_at?: string
          id?: string
          interaction_type: string
          listing_id?: string | null
          user_action?: string | null
          user_id: string
        }
        Update: {
          ai_suggestion?: Json | null
          created_at?: string
          id?: string
          interaction_type?: string
          listing_id?: string | null
          user_action?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      app_stats: {
        Row: {
          id: string
          recorded_at: string | null
          stat_name: string
          stat_value: number
        }
        Insert: {
          id?: string
          recorded_at?: string | null
          stat_name: string
          stat_value: number
        }
        Update: {
          id?: string
          recorded_at?: string | null
          stat_name?: string
          stat_value?: number
        }
        Relationships: []
      }
      banned_users: {
        Row: {
          banned_at: string | null
          banned_by: string
          id: string
          is_active: boolean | null
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_at?: string | null
          banned_by: string
          id?: string
          is_active?: boolean | null
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_at?: string | null
          banned_by?: string
          id?: string
          is_active?: boolean | null
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          created_at: string
          domain: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          archived_by_buyer: boolean | null
          archived_by_seller: boolean | null
          buyer_id: string
          created_at: string | null
          deleted_by_buyer: boolean | null
          deleted_by_seller: boolean | null
          id: string
          listing_id: string | null
          seller_id: string
          updated_at: string | null
        }
        Insert: {
          archived_by_buyer?: boolean | null
          archived_by_seller?: boolean | null
          buyer_id: string
          created_at?: string | null
          deleted_by_buyer?: boolean | null
          deleted_by_seller?: boolean | null
          id?: string
          listing_id?: string | null
          seller_id: string
          updated_at?: string | null
        }
        Update: {
          archived_by_buyer?: boolean | null
          archived_by_seller?: boolean | null
          buyer_id?: string
          created_at?: string | null
          deleted_by_buyer?: boolean | null
          deleted_by_seller?: boolean | null
          id?: string
          listing_id?: string | null
          seller_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_website: string | null
          created_at: string
          created_by: string
          description: string
          discount_percentage: number | null
          discounted_price: number | null
          id: string
          image_url: string | null
          is_active: boolean
          original_price: number | null
          terms_and_conditions: string | null
          title: string
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_website?: string | null
          created_at?: string
          created_by: string
          description: string
          discount_percentage?: number | null
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          original_price?: number | null
          terms_and_conditions?: string | null
          title: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_website?: string | null
          created_at?: string
          created_by?: string
          description?: string
          discount_percentage?: number | null
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          original_price?: number | null
          terms_and_conditions?: string | null
          title?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          address: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          item_description: string
          phone_number: string
          pickup_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          item_description: string
          phone_number: string
          pickup_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          item_description?: string
          phone_number?: string
          pickup_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      image_performance_metrics: {
        Row: {
          created_at: string
          id: string
          image_size_bytes: number | null
          image_url: string
          is_lazy_loaded: boolean | null
          load_time_ms: number
          page_url: string
          user_id: string | null
          viewport_height: number | null
          viewport_width: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_size_bytes?: number | null
          image_url: string
          is_lazy_loaded?: boolean | null
          load_time_ms: number
          page_url: string
          user_id?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          image_size_bytes?: number | null
          image_url?: string
          is_lazy_loaded?: boolean | null
          load_time_ms?: number
          page_url?: string
          user_id?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
        }
        Relationships: []
      }
      listing_engagement: {
        Row: {
          clicks_count: number | null
          created_at: string | null
          engagement_score: number | null
          favorites_count: number | null
          id: string
          last_updated: string | null
          listing_id: string
          messages_count: number | null
          views_count: number | null
        }
        Insert: {
          clicks_count?: number | null
          created_at?: string | null
          engagement_score?: number | null
          favorites_count?: number | null
          id?: string
          last_updated?: string | null
          listing_id: string
          messages_count?: number | null
          views_count?: number | null
        }
        Update: {
          clicks_count?: number | null
          created_at?: string | null
          engagement_score?: number | null
          favorites_count?: number | null
          id?: string
          last_updated?: string | null
          listing_id?: string
          messages_count?: number | null
          views_count?: number | null
        }
        Relationships: []
      }
      listing_recommendations: {
        Row: {
          clicked: boolean | null
          clicked_at: string | null
          created_at: string
          id: string
          listing_id: string
          recommendation_reason: Json | null
          recommended_listing_id: string
          similarity_score: number
        }
        Insert: {
          clicked?: boolean | null
          clicked_at?: string | null
          created_at?: string
          id?: string
          listing_id: string
          recommendation_reason?: Json | null
          recommended_listing_id: string
          similarity_score: number
        }
        Update: {
          clicked?: boolean | null
          clicked_at?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          recommendation_reason?: Json | null
          recommended_listing_id?: string
          similarity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "listing_recommendations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_recommendations_recommended_listing_id_fkey"
            columns: ["recommended_listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          ai_confidence_score: number | null
          ai_features: Json | null
          ai_generated_description: string | null
          ai_suggested_category: string | null
          allow_drop_off: boolean | null
          allow_meet_on_campus: boolean | null
          allow_pickup: boolean | null
          category: Database["public"]["Enums"]["listing_category"]
          college_id: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          featured: boolean | null
          housing_type: Database["public"]["Enums"]["housing_type"] | null
          id: string
          images: string[] | null
          latitude: number | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string | null
          longitude: number | null
          moderation_flags: Json | null
          moderation_status: string | null
          open_to_negotiation: boolean | null
          price: number | null
          similarity_score: number | null
          sold_at: string | null
          sold_elsewhere_location: string | null
          sold_on_bazaar: boolean | null
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_confidence_score?: number | null
          ai_features?: Json | null
          ai_generated_description?: string | null
          ai_suggested_category?: string | null
          allow_drop_off?: boolean | null
          allow_meet_on_campus?: boolean | null
          allow_pickup?: boolean | null
          category: Database["public"]["Enums"]["listing_category"]
          college_id: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          featured?: boolean | null
          housing_type?: Database["public"]["Enums"]["housing_type"] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string | null
          longitude?: number | null
          moderation_flags?: Json | null
          moderation_status?: string | null
          open_to_negotiation?: boolean | null
          price?: number | null
          similarity_score?: number | null
          sold_at?: string | null
          sold_elsewhere_location?: string | null
          sold_on_bazaar?: boolean | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_confidence_score?: number | null
          ai_features?: Json | null
          ai_generated_description?: string | null
          ai_suggested_category?: string | null
          allow_drop_off?: boolean | null
          allow_meet_on_campus?: boolean | null
          allow_pickup?: boolean | null
          category?: Database["public"]["Enums"]["listing_category"]
          college_id?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          featured?: boolean | null
          housing_type?: Database["public"]["Enums"]["housing_type"] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string | null
          longitude?: number | null
          moderation_flags?: Json | null
          moderation_status?: string | null
          open_to_negotiation?: boolean | null
          price?: number | null
          similarity_score?: number | null
          sold_at?: string | null
          sold_elsewhere_location?: string | null
          sold_on_bazaar?: boolean | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean
          message: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          connection_type: string | null
          created_at: string
          id: string
          metric_name: string
          page_url: string
          rating: string
          user_agent: string | null
          user_id: string | null
          value: number
        }
        Insert: {
          connection_type?: string | null
          created_at?: string
          id?: string
          metric_name: string
          page_url: string
          rating: string
          user_agent?: string | null
          user_id?: string | null
          value: number
        }
        Update: {
          connection_type?: string | null
          created_at?: string
          id?: string
          metric_name?: string
          page_url?: string
          rating?: string
          user_agent?: string | null
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          college_id: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone_number: string | null
          points: number
          profile_name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          college_id: string
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          phone_number?: string | null
          points?: number
          profile_name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          college_id?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
          points?: number
          profile_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          listing_id: string
          reason: string
          reporter_id: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          listing_id: string
          reason: string
          reporter_id: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          listing_id?: string
          reason?: string
          reporter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      support_responses: {
        Row: {
          created_at: string | null
          id: string
          is_admin_response: boolean | null
          message: string
          responder_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin_response?: boolean | null
          message: string
          responder_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin_response?: boolean | null
          message?: string
          responder_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_responses_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_ai_preferences: {
        Row: {
          auto_categorize: boolean | null
          auto_generate_descriptions: boolean | null
          auto_moderate: boolean | null
          created_at: string
          enhanced_search: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_categorize?: boolean | null
          auto_generate_descriptions?: boolean | null
          auto_moderate?: boolean | null
          created_at?: string
          enhanced_search?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_categorize?: boolean | null
          auto_generate_descriptions?: boolean | null
          auto_moderate?: boolean | null
          created_at?: string
          enhanced_search?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_feature_desirable_listings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      calculate_engagement_score: {
        Args:
          | {
              clicks?: number
              favorites?: number
              messages?: number
              views?: number
            }
          | {
              p_clicks?: number
              p_favorites?: number
              p_messages?: number
              p_views?: number
            }
        Returns: number
      }
      get_all_donations_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_user_college_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_donation_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_donations_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_platform_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_public_profile: {
        Args: { profile_id: string }
        Returns: {
          avatar_url: string
          college_id: string
          created_at: string
          id: string
          is_verified: boolean
          points: number
          profile_name: string
        }[]
      }
      get_public_seller_info: {
        Args: { profile_id: string }
        Returns: {
          avatar_url: string
          is_verified: boolean
          points: number
          profile_name: string
        }[]
      }
      get_unread_message_count: {
        Args: { _user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_listing_engagement: {
        Args: { listing_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      badge_type:
        | "FIRST_POST"
        | "TOP_TRADER"
        | "COMMUNITY_HELPER"
        | "ECO_WARRIOR"
        | "VERIFIED_BLUE_DEVIL"
      housing_type: "sublease" | "for_rent" | "roommate_wanted"
      listing_category: "marketplace" | "housing" | "services"
      listing_status: "active" | "sold" | "inactive"
      listing_type: "offer" | "wanted"
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
      app_role: ["admin", "user"],
      badge_type: [
        "FIRST_POST",
        "TOP_TRADER",
        "COMMUNITY_HELPER",
        "ECO_WARRIOR",
        "VERIFIED_BLUE_DEVIL",
      ],
      housing_type: ["sublease", "for_rent", "roommate_wanted"],
      listing_category: ["marketplace", "housing", "services"],
      listing_status: ["active", "sold", "inactive"],
      listing_type: ["offer", "wanted"],
    },
  },
} as const

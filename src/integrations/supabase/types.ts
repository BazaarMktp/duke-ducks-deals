export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      conversations: {
        Row: {
          archived_by_buyer: boolean | null
          archived_by_seller: boolean | null
          buyer_id: string
          created_at: string | null
          deleted_by_buyer: boolean | null
          deleted_by_seller: boolean | null
          id: string
          listing_id: string
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
          listing_id: string
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
          listing_id?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      listings: {
        Row: {
          category: Database["public"]["Enums"]["listing_category"]
          created_at: string | null
          description: string | null
          featured: boolean | null
          housing_type: Database["public"]["Enums"]["housing_type"] | null
          id: string
          images: string[] | null
          latitude: number | null
          location: string | null
          longitude: number | null
          price: number | null
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["listing_category"]
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          housing_type?: Database["public"]["Enums"]["housing_type"] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          price?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["listing_category"]
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          housing_type?: Database["public"]["Enums"]["housing_type"] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          price?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
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
          message: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone_number: string | null
          profile_name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          phone_number?: string | null
          profile_name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
          profile_name?: string
          updated_at?: string | null
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
      housing_type: "sublease" | "for_rent" | "roommate_wanted"
      listing_category: "marketplace" | "housing" | "services"
      listing_status: "active" | "sold" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      housing_type: ["sublease", "for_rent", "roommate_wanted"],
      listing_category: ["marketplace", "housing", "services"],
      listing_status: ["active", "sold", "inactive"],
    },
  },
} as const

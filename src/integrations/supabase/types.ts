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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      invoices: {
        Row: {
          amount: number
          cancellation_policy: string | null
          client_address: string | null
          client_email: string
          client_gst: string | null
          client_mobile: string
          client_name: string
          created_at: string
          due_amount: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_no: string
          is_interstate: boolean | null
          items: Json
          lead_id: string | null
          notes: string | null
          paid_amount: number | null
          payment_terms: string | null
          quotation_id: string | null
          status: string | null
          template: string | null
          terms_conditions: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          cancellation_policy?: string | null
          client_address?: string | null
          client_email: string
          client_gst?: string | null
          client_mobile: string
          client_name: string
          created_at?: string
          due_amount?: number | null
          due_date: string
          id?: string
          invoice_date?: string
          invoice_no?: string
          is_interstate?: boolean | null
          items: Json
          lead_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_terms?: string | null
          quotation_id?: string | null
          status?: string | null
          template?: string | null
          terms_conditions?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          cancellation_policy?: string | null
          client_address?: string | null
          client_email?: string
          client_gst?: string | null
          client_mobile?: string
          client_name?: string
          created_at?: string
          due_amount?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_no?: string
          is_interstate?: boolean | null
          items?: Json
          lead_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_terms?: string | null
          quotation_id?: string | null
          status?: string | null
          template?: string | null
          terms_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          lead_id: string | null
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          lead_id?: string | null
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_comments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_documents: {
        Row: {
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          lead_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
          lead_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget: string | null
          comments: string | null
          created_at: string
          destination_type: string | null
          drop_location: string | null
          email: string
          follow_up_date: string | null
          hotel_category: string | null
          id: string
          mobile: string
          name: string
          no_of_adults: number | null
          no_of_children: number | null
          pickup: string | null
          priority: string | null
          source: string | null
          status: string | null
          travel_date_from: string | null
          travel_date_to: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          comments?: string | null
          created_at?: string
          destination_type?: string | null
          drop_location?: string | null
          email: string
          follow_up_date?: string | null
          hotel_category?: string | null
          id?: string
          mobile: string
          name: string
          no_of_adults?: number | null
          no_of_children?: number | null
          pickup?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          travel_date_from?: string | null
          travel_date_to?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          comments?: string | null
          created_at?: string
          destination_type?: string | null
          drop_location?: string | null
          email?: string
          follow_up_date?: string | null
          hotel_category?: string | null
          id?: string
          mobile?: string
          name?: string
          no_of_adults?: number | null
          no_of_children?: number | null
          pickup?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          travel_date_from?: string | null
          travel_date_to?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          agent_contact: string | null
          agent_email: string | null
          agent_name: string | null
          amount: number | null
          client_email: string
          client_mobile: string
          client_name: string
          company_email: string | null
          company_licence: string | null
          company_mobile: string | null
          company_name: string | null
          company_website: string | null
          costing: Json | null
          created_at: string
          id: string
          itinerary: Json | null
          lead_id: string | null
          payment_details: Json | null
          policies: Json | null
          quotation_design: string | null
          quote_id: string
          status: string | null
          trip_overview: string | null
          trip_title: string | null
          trip_type: string | null
          updated_at: string
        }
        Insert: {
          agent_contact?: string | null
          agent_email?: string | null
          agent_name?: string | null
          amount?: number | null
          client_email: string
          client_mobile: string
          client_name: string
          company_email?: string | null
          company_licence?: string | null
          company_mobile?: string | null
          company_name?: string | null
          company_website?: string | null
          costing?: Json | null
          created_at?: string
          id?: string
          itinerary?: Json | null
          lead_id?: string | null
          payment_details?: Json | null
          policies?: Json | null
          quotation_design?: string | null
          quote_id?: string
          status?: string | null
          trip_overview?: string | null
          trip_title?: string | null
          trip_type?: string | null
          updated_at?: string
        }
        Update: {
          agent_contact?: string | null
          agent_email?: string | null
          agent_name?: string | null
          amount?: number | null
          client_email?: string
          client_mobile?: string
          client_name?: string
          company_email?: string | null
          company_licence?: string | null
          company_mobile?: string | null
          company_name?: string | null
          company_website?: string | null
          costing?: Json | null
          created_at?: string
          id?: string
          itinerary?: Json | null
          lead_id?: string | null
          payment_details?: Json | null
          policies?: Json | null
          quotation_design?: string | null
          quote_id?: string
          status?: string | null
          trip_overview?: string | null
          trip_title?: string | null
          trip_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_no: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_quote_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

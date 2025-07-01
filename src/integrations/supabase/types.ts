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
      cafes: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          is_vip: boolean | null
          logo: string | null
          name: string
          phone: string | null
          status: string | null
          subscription_active: boolean | null
          subscription_expiry: string | null
          subscription_plan: string | null
          vip_reason: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_vip?: boolean | null
          logo?: string | null
          name: string
          phone?: string | null
          status?: string | null
          subscription_active?: boolean | null
          subscription_expiry?: string | null
          subscription_plan?: string | null
          vip_reason?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_vip?: boolean | null
          logo?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          subscription_active?: boolean | null
          subscription_expiry?: string | null
          subscription_plan?: string | null
          vip_reason?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          allergies: string[] | null
          birthdate: string | null
          cafe_id: string | null
          created_at: string | null
          email: string | null
          id: string
          join_date: string
          last_visit: string
          loyalty_points: number | null
          marketing_consent: boolean | null
          name: string
          notes: string | null
          phone: string | null
          preferences: string[] | null
          total_spent: number | null
          visit_count: number | null
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          birthdate?: string | null
          cafe_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          join_date: string
          last_visit: string
          loyalty_points?: number | null
          marketing_consent?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          preferences?: string[] | null
          total_spent?: number | null
          visit_count?: number | null
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          birthdate?: string | null
          cafe_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          join_date?: string
          last_visit?: string
          loyalty_points?: number | null
          marketing_consent?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferences?: string[] | null
          total_spent?: number | null
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          cafe_id: string | null
          category: string
          cost: number
          created_at: string | null
          current_stock: number
          expiry_date: string | null
          id: string
          last_restock_date: string
          location: string | null
          minimum_stock: number
          name: string
          supplier: string | null
          unit: string
        }
        Insert: {
          barcode?: string | null
          cafe_id?: string | null
          category: string
          cost: number
          created_at?: string | null
          current_stock: number
          expiry_date?: string | null
          id?: string
          last_restock_date: string
          location?: string | null
          minimum_stock: number
          name: string
          supplier?: string | null
          unit: string
        }
        Update: {
          barcode?: string | null
          cafe_id?: string | null
          category?: string
          cost?: number
          created_at?: string | null
          current_stock?: number
          expiry_date?: string | null
          id?: string
          last_restock_date?: string
          location?: string | null
          minimum_stock?: number
          name?: string
          supplier?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cafe_id: string | null
          created_at: string | null
          customer_id: string | null
          delivery_address: string | null
          delivery_fee: number | null
          discount: number | null
          employee_id: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          served_time: string | null
          status: string | null
          subtotal: number
          table_id: string | null
          tax: number
          total: number
          type: string
          updated_at: string | null
        }
        Insert: {
          cafe_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          discount?: number | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          served_time?: string | null
          status?: string | null
          subtotal: number
          table_id?: string | null
          tax: number
          total: number
          type: string
          updated_at?: string | null
        }
        Update: {
          cafe_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          discount?: number | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          served_time?: string | null
          status?: string | null
          subtotal?: number
          table_id?: string | null
          tax?: number
          total?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          cafe_id: string | null
          category: string
          cost: number
          created_at: string | null
          description: string
          id: string
          image: string | null
          is_special: boolean | null
          name: string
          preparation_time: number
          price: number
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          cafe_id?: string | null
          category: string
          cost: number
          created_at?: string | null
          description: string
          id?: string
          image?: string | null
          is_special?: boolean | null
          name: string
          preparation_time: number
          price: number
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          cafe_id?: string | null
          category?: string
          cost?: number
          created_at?: string | null
          description?: string
          id?: string
          image?: string | null
          is_special?: boolean | null
          name?: string
          preparation_time?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          cafe_id: string | null
          created_at: string | null
          email: string
          hire_date: string
          id: string
          name: string
          phone: string | null
          role: string
          status: string | null
        }
        Insert: {
          avatar?: string | null
          cafe_id?: string | null
          created_at?: string | null
          email: string
          hire_date: string
          id: string
          name: string
          phone?: string | null
          role: string
          status?: string | null
        }
        Update: {
          avatar?: string | null
          cafe_id?: string | null
          created_at?: string | null
          email?: string
          hire_date?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_cafe_id_by_name: {
        Args: { cafe_name: string }
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
    Enums: {},
  },
} as const

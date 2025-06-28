
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cafes: {
        Row: {
          id: string
          name: string
          address: string
          phone: string | null
          email: string | null
          status: 'active' | 'inactive'
          created_at: string
          logo: string | null
          subscription_active: boolean
          subscription_plan: 'basic' | 'premium' | 'enterprise'
          subscription_expiry: string | null
          is_vip: boolean
          vip_reason: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone?: string | null
          email?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          logo?: string | null
          subscription_active?: boolean
          subscription_plan?: 'basic' | 'premium' | 'enterprise'
          subscription_expiry?: string | null
          is_vip?: boolean
          vip_reason?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string | null
          email?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          logo?: string | null
          subscription_active?: boolean
          subscription_plan?: 'basic' | 'premium' | 'enterprise'
          subscription_expiry?: string | null
          is_vip?: boolean
          vip_reason?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'superAdmin' | 'admin' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'barista'
          avatar: string | null
          phone: string | null
          hire_date: string
          status: 'active' | 'inactive' | 'suspended'
          cafe_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'superAdmin' | 'admin' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'barista'
          avatar?: string | null
          phone?: string | null
          hire_date: string
          status?: 'active' | 'inactive' | 'suspended'
          cafe_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'superAdmin' | 'admin' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'barista'
          avatar?: string | null
          phone?: string | null
          hire_date?: string
          status?: 'active' | 'inactive' | 'suspended'
          cafe_id?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          price: number
          cost: number
          image: string | null
          available: boolean
          preparation_time: number
          allergens: string[] | null
          is_special: boolean
          cafe_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          price: number
          cost: number
          image?: string | null
          available?: boolean
          preparation_time: number
          allergens?: string[] | null
          is_special?: boolean
          cafe_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          price?: number
          cost?: number
          image?: string | null
          available?: boolean
          preparation_time?: number
          allergens?: string[] | null
          is_special?: boolean
          cafe_id?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          type: 'dine-in' | 'takeaway' | 'delivery' | 'online'
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled' | 'out-for-delivery' | 'delivered'
          table_id: string | null
          customer_id: string | null
          employee_id: string
          created_at: string
          updated_at: string
          served_time: string | null
          payment_status: 'pending' | 'paid' | 'refunded'
          payment_method: 'cash' | 'card' | 'mobile' | 'online' | null
          subtotal: number
          tax: number
          discount: number | null
          total: number
          notes: string | null
          delivery_address: string | null
          delivery_fee: number | null
          cafe_id: string | null
        }
        Insert: {
          id?: string
          order_number: string
          type: 'dine-in' | 'takeaway' | 'delivery' | 'online'
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled' | 'out-for-delivery' | 'delivered'
          table_id?: string | null
          customer_id?: string | null
          employee_id: string
          created_at?: string
          updated_at?: string
          served_time?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_method?: 'cash' | 'card' | 'mobile' | 'online' | null
          subtotal: number
          tax: number
          discount?: number | null
          total: number
          notes?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          cafe_id?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          type?: 'dine-in' | 'takeaway' | 'delivery' | 'online'
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled' | 'out-for-delivery' | 'delivered'
          table_id?: string | null
          customer_id?: string | null
          employee_id?: string
          created_at?: string
          updated_at?: string
          served_time?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_method?: 'cash' | 'card' | 'mobile' | 'online' | null
          subtotal?: number
          tax?: number
          discount?: number | null
          total?: number
          notes?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          cafe_id?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          loyalty_points: number
          join_date: string
          last_visit: string
          total_spent: number
          visit_count: number
          preferences: string[] | null
          allergies: string[] | null
          notes: string | null
          birthdate: string | null
          address: string | null
          marketing_consent: boolean
          cafe_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          loyalty_points?: number
          join_date: string
          last_visit: string
          total_spent?: number
          visit_count?: number
          preferences?: string[] | null
          allergies?: string[] | null
          notes?: string | null
          birthdate?: string | null
          address?: string | null
          marketing_consent?: boolean
          cafe_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          loyalty_points?: number
          join_date?: string
          last_visit?: string
          total_spent?: number
          visit_count?: number
          preferences?: string[] | null
          allergies?: string[] | null
          notes?: string | null
          birthdate?: string | null
          address?: string | null
          marketing_consent?: boolean
          cafe_id?: string | null
          created_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          unit: string
          current_stock: number
          minimum_stock: number
          cost: number
          supplier: string | null
          location: string | null
          expiry_date: string | null
          last_restock_date: string
          barcode: string | null
          cafe_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          unit: string
          current_stock: number
          minimum_stock: number
          cost: number
          supplier?: string | null
          location?: string | null
          expiry_date?: string | null
          last_restock_date: string
          barcode?: string | null
          cafe_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          unit?: string
          current_stock?: number
          minimum_stock?: number
          cost?: number
          supplier?: string | null
          location?: string | null
          expiry_date?: string | null
          last_restock_date?: string
          barcode?: string | null
          cafe_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

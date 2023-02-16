export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          created_at: string
          id: number
          message: Json
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          user_id?: number
        }
      }
      users: {
        Row: {
          created_at: string
          first_name: string
          id: number
          language: string
          last_name: string | null
          state: string
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name: string
          id: number
          language: string
          last_name?: string | null
          state: string
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: number
          language?: string
          last_name?: string | null
          state?: string
          username?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

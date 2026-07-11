/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
      contacts: {
        Row: {
          id: string
          timestamp: string
          name: string
          email: string
          phone: string | null
          company: string | null
          country: string | null
          subject: string | null
          message: string
          status: 'new' | 'contacted' | 'qualified' | 'archived'
          lead_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'timestamp' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          visitor_id: string | null
          status: 'active' | 'closed' | 'archived'
          lead_score: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      embeddings: {
        Row: {
          id: string
          document_id: string
          chunk_id: string
          vector: number[] // mapped from pgvector
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      contact_status: 'new' | 'contacted' | 'qualified' | 'archived'
      user_role: 'admin' | 'user'
    }
  }
}

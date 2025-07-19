import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'tech' | 'academic' | 'research' | 'business' | 'personal'
          status: 'active' | 'completed' | 'paused'
          progress: number
          start_date: string
          end_date: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'tech' | 'academic' | 'research' | 'business' | 'personal'
          status?: 'active' | 'completed' | 'paused'
          progress?: number
          start_date: string
          end_date?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'tech' | 'academic' | 'research' | 'business' | 'personal'
          status?: 'active' | 'completed' | 'paused'
          progress?: number
          start_date?: string
          end_date?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'todo' | 'in-progress' | 'review' | 'done'
          project_id: string
          due_date: string | null
          progress: number
          tags: string[]
          estimated_hours: number | null
          actual_hours: number | null
          completed: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'todo' | 'in-progress' | 'review' | 'done'
          project_id: string
          due_date?: string | null
          progress?: number
          tags?: string[]
          estimated_hours?: number | null
          actual_hours?: number | null
          completed?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'todo' | 'in-progress' | 'review' | 'done'
          project_id?: string
          due_date?: string | null
          progress?: number
          tags?: string[]
          estimated_hours?: number | null
          actual_hours?: number | null
          completed?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
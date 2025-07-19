import { createClient } from '@supabase/supabase-js'

// Try different possible environment variable names used by Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                   import.meta.env.SUPABASE_URL || 
                   import.meta.env.VITE_SUPABASE_PROJECT_URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                       import.meta.env.SUPABASE_ANON_KEY || 
                       import.meta.env.VITE_SUPABASE_PROJECT_ANON_KEY

// Debug: Log available env vars (remove in production)
console.log('Available env vars:', Object.keys(import.meta.env))
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing')
console.log('Supabase Key:', supabaseAnonKey ? 'Found' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Available vars:', import.meta.env)
  throw new Error('Missing Supabase environment variables. Please check your Supabase integration.')
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
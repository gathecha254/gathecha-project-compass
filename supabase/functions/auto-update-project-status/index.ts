import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all tasks for the project
    const { data: tasks, error: tasksError } = await supabaseClient
      .from('tasks')
      .select('status, completed')
      .eq('project_id', projectId)

    if (tasksError) throw tasksError

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No tasks found for project' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate project status and progress
    const completedTasks = tasks.filter(task => task.completed)
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
    const reviewTasks = tasks.filter(task => task.status === 'review')

    let newStatus: string
    let newProgress: number

    if (completedTasks.length === tasks.length) {
      newStatus = 'completed'
      newProgress = 100
    } else if (reviewTasks.length > 0 || completedTasks.length > 0) {
      newStatus = 'active'
      newProgress = Math.round((completedTasks.length / tasks.length) * 100)
    } else if (inProgressTasks.length > 0) {
      newStatus = 'active'
      newProgress = Math.round((completedTasks.length / tasks.length) * 100)
    } else {
      newStatus = 'active'
      newProgress = 0
    }

    // Update project status and progress
    const { error: updateError } = await supabaseClient
      .from('projects')
      .update({ 
        status: newStatus,
        progress: newProgress,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        message: 'Project status updated successfully',
        status: newStatus,
        progress: newProgress
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
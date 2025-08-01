import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { SupabaseClient } from '@supabase/supabase-js';

// Update Task interface
type TaskStatus = 'not-started' | 'in-progress' | 'complete';
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  projectId: string;
  dueDate?: string;
  progress: number;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  completed: boolean;
  isReviewTask?: boolean;
  started_at?: string | null;
  completed_at?: string | null;
}

// Update Project interface
interface Project {
  id: string;
  name: string;

  description?: string;
  category: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  progress: number;
  startDate: string;
  endDate?: string;
  tasks: Task[];
  priority: 'low' | 'medium' | 'high';
  colorLabel?: string;
  tags: string[];
}

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'tasks'> & { tasks: Array<{ title: string; description?: string; isReviewTask?: boolean }> }) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  beginTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  getProjectTasks: (projectId: string) => Task[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Type casting helper for supabase client
  const db = supabase as any;

  // Load projects and tasks when user is authenticated
  useEffect(() => {
    if (user) {
      loadProjects();
      loadTasks();
    } else {
      setProjects([]);
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await db
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProjects(data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        category: p.category,
        status: p.status,
        progress: p.progress,
        startDate: p.start_date,
        endDate: p.end_date || undefined,
        tasks: [],
        priority: p.priority,
        colorLabel: p.color_label,
        tags: p.tags || [],
      })) || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await db
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTasks(data?.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        priority: t.priority,
        status: t.status,
        projectId: t.project_id,
        dueDate: t.due_date || '',
        progress: t.progress,
        tags: t.tags || [],
        estimatedHours: t.estimated_hours || undefined,
        actualHours: t.actual_hours || undefined,
        completed: t.completed,
        isReviewTask: t.is_review_task,
        started_at: t.started_at,
        completed_at: t.completed_at,
      })) || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Auto-update project status using edge function
  const updateProjectStatus = async (projectId: string) => {
    try {
      const { error } = await db.functions.invoke('auto-update-project-status', {
        body: { projectId }
      });

      if (error) throw error;
      
      // Reload projects to get updated status
      await loadProjects();
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'tasks'> & { tasks: Array<{ title: string; description?: string; isReviewTask?: boolean }> }) => {
    if (!user) return;

    try {
      const { data, error } = await db
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          category: project.category,
          status: project.status,
          progress: project.progress,
          start_date: project.startDate,
          end_date: project.endDate || null,
          user_id: user.id,
          priority: project.priority,
          color_label: project.colorLabel,
          tags: project.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      const newProject = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category,
        status: data.status,
        progress: data.progress,
        startDate: data.start_date,
        endDate: data.end_date || undefined,
        tasks: [],
        priority: data.priority,
        colorLabel: data.color_label,
        tags: data.tags || [],
      };

      setProjects(prev => [newProject, ...prev]);

      // Create all initial tasks (including Review & Comments)
      for (const t of project.tasks) {
        await addTask({
          title: t.title,
          description: t.description || '',
          priority: 'medium', // or allow user to set per task in future
          status: 'todo',
          projectId: data.id,
          dueDate: project.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progress: 0,
          tags: [],
          completed: false,
          isReviewTask: !!t.isReviewTask,
          started_at: null,
          completed_at: null,
        });
      }

      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await db
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          project_id: task.projectId,
          due_date: task.dueDate || null,
          progress: task.progress,
          tags: task.tags,
          estimated_hours: task.estimatedHours || null,
          actual_hours: task.actualHours || null,
          completed: task.completed,
          user_id: user.id,
          is_review_task: task.isReviewTask || false,
          started_at: task.started_at || null,
          completed_at: task.completed_at || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        status: data.status,
        projectId: data.project_id,
        dueDate: data.due_date || '',
        progress: data.progress,
        tags: data.tags || [],
        estimatedHours: data.estimated_hours || undefined,
        actualHours: data.actual_hours || undefined,
        completed: data.completed,
        isReviewTask: data.is_review_task,
        started_at: data.started_at,
        completed_at: data.completed_at,
      };

      setTasks(prev => [newTask, ...prev]);
      
      // Update project status after adding task
      await updateProjectStatus(task.projectId);
      
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { error } = await db
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          priority: updates.priority,
          status: updates.status,
          due_date: updates.dueDate || null,
          progress: updates.progress,
          tags: updates.tags,
          estimated_hours: updates.estimatedHours || null,
          actual_hours: updates.actualHours || null,
          completed: updates.completed,
          started_at: updates.started_at || null,
          completed_at: updates.completed_at || null,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
      
      // Update project status after task update
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateProjectStatus(task.projectId);
      }
      
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { error } = await db
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      
      // Update project status after deleting task
      await updateProjectStatus(task.projectId);
      
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await db
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setProjects(prev => prev.filter(project => project.id !== id));
      setTasks(prev => prev.filter(task => task.projectId !== id));
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const beginTask = async (taskId: string) => {
    await updateTask(taskId, { status: 'in-progress', progress: 10 });
  };

  const completeTask = async (taskId: string) => {
    await updateTask(taskId, { completed: true, status: 'done', progress: 100 });
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      tasks,
      loading,
      addProject,
      addTask,
      updateTask,
      deleteTask,
      deleteProject,
      beginTask,
      completeTask,
      getProjectTasks
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
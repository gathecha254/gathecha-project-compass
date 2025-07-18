
import { createContext, useContext, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  projectId: number;
  dueDate: string;
  progress: number;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  description: string;
  category: 'tech' | 'academic' | 'research' | 'business' | 'personal';
  status: 'active' | 'completed' | 'paused';
  progress: number;
  startDate: string;
  endDate?: string;
  tasks: Task[];
}

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  beginTask: (taskId: number) => void;
  completeTask: (taskId: number) => void;
  getProjectTasks: (projectId: number) => Task[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Auto-update project status based on task completion
  const updateProjectStatus = (projectId: number) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 'todo';

    const completedTasks = projectTasks.filter(task => task.completed);
    const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress');
    const reviewTasks = projectTasks.filter(task => task.status === 'review');

    let newStatus: string;
    let newProgress: number;

    if (completedTasks.length === projectTasks.length) {
      newStatus = 'done';
      newProgress = 100;
    } else if (reviewTasks.length > 0 || completedTasks.length > 0) {
      newStatus = 'review';
      newProgress = Math.round((completedTasks.length / projectTasks.length) * 100);
    } else if (inProgressTasks.length > 0) {
      newStatus = 'in-progress';
      newProgress = Math.round((completedTasks.length / projectTasks.length) * 100);
    } else {
      newStatus = 'todo';
      newProgress = 0;
    }

    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, status: newStatus as any, progress: newProgress }
        : project
    ));
  };

  const addProject = (project: Omit<Project, 'id' | 'tasks'>) => {
    const newProject = {
      ...project,
      id: Date.now(),
      tasks: [], // Will be managed separately in tasks state
    };
    setProjects(prev => [...prev, newProject]);

    // Auto-create "Review & Comments" task
    const reviewTask: Omit<Task, 'id'> = {
      title: 'Review & Comments',
      description: 'Final review and collect feedback on the project',
      priority: 'medium',
      status: 'todo',
      projectId: newProject.id,
      dueDate: project.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      tags: ['review', 'feedback'],
      completed: false,
    };

    const newTask = {
      ...reviewTask,
      id: Date.now() + 1,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
    
    // Update project status after adding task
    setTimeout(() => updateProjectStatus(task.projectId), 0);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    
    // Update project status after task update
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTimeout(() => updateProjectStatus(task.projectId), 0);
    }
  };

  const deleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    // Update project status after deleting task
    if (task) {
      setTimeout(() => updateProjectStatus(task.projectId), 0);
    }
  };

  const beginTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'in-progress', progress: 10 }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTimeout(() => updateProjectStatus(task.projectId), 0);
    }
  };

  const completeTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, status: 'done', progress: 100 }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTimeout(() => updateProjectStatus(task.projectId), 0);
    }
  };

  const getProjectTasks = (projectId: number) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      tasks,
      addProject,
      addTask,
      updateTask,
      deleteTask,
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

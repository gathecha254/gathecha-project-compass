
import { createContext, useContext, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  project: string;
  dueDate: string;
  progress: number;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
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
  addProject: (project: Omit<Project, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      tasks,
      addProject,
      addTask,
      updateTask,
      deleteTask
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

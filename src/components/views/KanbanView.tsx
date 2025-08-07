
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Clock, AlertCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProject } from '@/contexts/ProjectContext';

interface KanbanViewProps {
  onNewProject: () => void;
}

export const KanbanView = ({ onNewProject }: KanbanViewProps) => {
  const { projects, tasks, getProjectTasks, beginTask, completeTask, deleteProject } = useProject();

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/20' },
  ];

  const getProjectsByStatus = (status: string) => {
    // Use real projects from context
    const allProjects = projects;
    return allProjects.filter((project: any) => project.status === status);
  };

  const getProjectTasksCount = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    const completed = projectTasks.filter(task => task.completed).length;
    return { completed, total: projectTasks.length };
  };

  const getProjectProgress = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(task => task.completed).length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Project Dashboard</h2>
        <p className="text-muted-foreground">Manage your projects across different stages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`${column.color} rounded-lg p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary">
                  {getProjectsByStatus(column.id).length}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {getProjectsByStatus(column.id).map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {/* Color label circle */}
                        {project.colorLabel && (
                          <span
                            className="inline-block w-4 h-4 rounded-full border border-border mr-2"
                            style={{ backgroundColor: project.colorLabel }}
                            title="Project color"
                          />
                        )}
                        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                        {/* Priority badge */}
                        <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'} className="ml-2">
                          {project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1)}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-md">
                          <DropdownMenuItem>Add New Task</DropdownMenuItem>
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Archive Project</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={async (e) => {
                            e.preventDefault();
                            if (window.confirm('Are you sure you want to delete this project? This will delete all related tasks.')) {
                              await deleteProject(project.id);
                            }
                          }}>Delete Project</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{getProjectProgress(project.id.toString())}%</span>
                      </div>
                      <Progress value={getProjectProgress(project.id.toString())} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tasks</span>
                        <span className="font-medium">{getProjectTasksCount(project.id.toString()).completed}/{getProjectTasksCount(project.id.toString()).total}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Due {project.endDate || project.dueDate}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {(project.tags || []).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Removed "Add Project" button - only accessible via sidebar */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Clock, AlertCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

interface KanbanViewProps {
  onNewTask: () => void;
}

export const KanbanView = ({ onNewTask }: KanbanViewProps) => {
  const { projects, tasks } = useProject();

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/20' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const mockTasks = [
    {
      id: 1,
      title: 'Implement user authentication system',
      description: 'Build secure login/logout functionality with JWT tokens',
      priority: 'high',
      status: 'in-progress',
      project: 'Tech Project',
      dueDate: '2024-07-20',
      progress: 65,
      tags: ['React', 'Backend', 'Security']
    },
    {
      id: 2,
      title: 'Data analysis for customer segmentation',
      description: 'Analyze customer data to identify key segments for marketing',
      priority: 'medium',
      status: 'todo',
      project: 'Data Science Study',
      dueDate: '2024-07-25',
      progress: 0,
      tags: ['Python', 'Analytics', 'Machine Learning']
    },
    {
      id: 3,
      title: 'Research paper on AI ethics',
      description: 'Write comprehensive paper on ethical implications of AI',
      priority: 'high',
      status: 'review',
      project: 'Research',
      dueDate: '2024-07-22',
      progress: 90,
      tags: ['Research', 'AI', 'Ethics']
    },
    {
      id: 4,
      title: 'Business process optimization report',
      description: 'Analyze current business processes and recommend improvements',
      priority: 'medium',
      status: 'done',
      project: 'Business Analysis',
      dueDate: '2024-07-18',
      progress: 100,
      tags: ['Business', 'Process', 'Optimization']
    }
  ];

  const getTasksByStatus = (status: string) => {
    return mockTasks.filter(task => task.status === status);
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Project Dashboard</h2>
        <p className="text-muted-foreground">Manage your tasks across different projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`${column.color} rounded-lg p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary">
                  {getTasksByStatus(column.id).length}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {getTasksByStatus(column.id).map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Due {task.dueDate}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="dashed"
                className="w-full h-12 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                onClick={onNewTask}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

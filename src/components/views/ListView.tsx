
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Filter,
  SortAsc,
  MoreVertical
} from 'lucide-react';

interface ListViewProps {
  onNewTask: () => void;
}

export const ListView = ({ onNewTask }: ListViewProps) => {
  const mockListData = [
    {
      id: 1,
      title: 'Implement user authentication system',
      description: 'Build secure login/logout functionality with JWT tokens',
      project: 'Tech Project',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Edwin Gathecha',
      dueDate: '2024-07-20',
      progress: 65,
      tags: ['React', 'Backend', 'Security'],
      completed: false
    },
    {
      id: 2,
      title: 'Data analysis for customer segmentation',
      description: 'Analyze customer data to identify key segments for marketing',
      project: 'Data Science Study',
      priority: 'medium',
      status: 'todo',
      assignee: 'Edwin Gathecha',
      dueDate: '2024-07-25',
      progress: 0,
      tags: ['Python', 'Analytics', 'ML'],
      completed: false
    },
    {
      id: 3,
      title: 'Research paper on AI ethics',
      description: 'Write comprehensive paper on ethical implications of AI',
      project: 'Research',
      priority: 'high',
      status: 'review',
      assignee: 'Edwin Gathecha',
      dueDate: '2024-07-22',
      progress: 90,
      tags: ['Research', 'AI', 'Ethics'],
      completed: false
    },
    {
      id: 4,
      title: 'Business process optimization report',
      description: 'Analyze current processes and recommend improvements',
      project: 'Business Analysis',
      priority: 'medium',
      status: 'done',
      assignee: 'Edwin Gathecha',
      dueDate: '2024-07-18',
      progress: 100,
      tags: ['Business', 'Process'],
      completed: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">List View</h2>
          <p className="text-muted-foreground">Detailed view of all tasks and projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SortAsc className="h-4 w-4" />
          </Button>
          <Button onClick={onNewTask} className="bg-gradient-to-r from-blue-600 to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-0">
            {mockListData.map((task, index) => (
              <div
                key={task.id}
                className={`
                  p-6 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors
                  ${task.completed ? 'opacity-75' : ''}
                `}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox 
                    checked={task.completed}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-3 text-sm">
                      <Badge variant="outline">{task.project}</Badge>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Due {task.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

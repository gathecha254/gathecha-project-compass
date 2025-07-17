
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BarChart4 } from 'lucide-react';

interface GanttViewProps {
  onNewTask: () => void;
}

export const GanttView = ({ onNewTask }: GanttViewProps) => {
  const mockGanttData = [
    {
      id: 1,
      title: 'Authentication System',
      project: 'Tech Project',
      startDate: '2024-07-15',
      duration: 5,
      progress: 65,
      dependencies: [],
      priority: 'high'
    },
    {
      id: 2,
      title: 'Customer Analysis',
      project: 'Data Science',
      startDate: '2024-07-18',
      duration: 7,
      progress: 30,
      dependencies: [],
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Research Paper',
      project: 'Research',
      startDate: '2024-07-10',
      duration: 12,
      progress: 90,
      dependencies: [],
      priority: 'high'
    }
  ];

  // Generate days for the gantt chart
  const startDate = new Date('2024-07-10');
  const days = [];
  for (let i = 0; i < 21; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  const getTaskPosition = (taskStartDate: string, duration: number) => {
    const taskStart = new Date(taskStartDate);
    const daysDiff = Math.floor((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return { start: daysDiff, width: duration };
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gantt Chart</h2>
          <p className="text-muted-foreground">Visualize project schedules and dependencies</p>
        </div>
        <Button onClick={onNewTask} className="bg-gradient-to-r from-blue-600 to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart4 className="h-5 w-5 mr-2" />
            Project Gantt Chart
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with dates */}
              <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
                <div className="font-semibold">Tasks</div>
                <div className="grid grid-cols-21 gap-1">
                  {days.map((day, index) => (
                    <div key={index} className="text-xs text-center p-1 font-medium">
                      {day.getDate()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {mockGanttData.map((task) => {
                  const { start, width } = getTaskPosition(task.startDate, task.duration);
                  
                  return (
                    <div key={task.id} className="grid grid-cols-[200px_1fr] gap-4 items-center">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{task.project}</Badge>
                          <Badge variant={task.priority === 'high' ? 'destructive' : 'default'} className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{task.progress}% complete</div>
                      </div>
                      
                      <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded">
                        <div 
                          className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-medium"
                          style={{
                            left: `${(start / 21) * 100}%`,
                            width: `${(width / 21) * 100}%`
                          }}
                        >
                          {task.progress}%
                        </div>
                        <div 
                          className="absolute top-0 h-full bg-gradient-to-r from-blue-300 to-blue-400 rounded opacity-50"
                          style={{
                            left: `${(start / 21) * 100}%`,
                            width: `${((width * task.progress) / 100 / 21) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

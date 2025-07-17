
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Plus } from 'lucide-react';

interface TimelineViewProps {
  onNewTask: () => void;
}

export const TimelineView = ({ onNewTask }: TimelineViewProps) => {
  const mockTimelineData = [
    {
      id: 1,
      title: 'Authentication System Implementation',
      project: 'Tech Project',
      startDate: '2024-07-15',
      endDate: '2024-07-20',
      progress: 65,
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Customer Segmentation Analysis',
      project: 'Data Science Study',
      startDate: '2024-07-18',
      endDate: '2024-07-25',
      progress: 30,
      status: 'in-progress',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'AI Ethics Research Paper',
      project: 'Research',
      startDate: '2024-07-10',
      endDate: '2024-07-22',
      progress: 90,
      status: 'review',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Business Process Analysis',
      project: 'Business Analysis',
      startDate: '2024-07-12',
      endDate: '2024-07-18',
      progress: 100,
      status: 'done',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Timeline View</h2>
          <p className="text-muted-foreground">Track project timelines and dependencies</p>
        </div>
        <Button onClick={onNewTask} className="bg-gradient-to-r from-blue-600 to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add to Timeline
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Project Timeline - July 2024
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {mockTimelineData.map((item, index) => (
              <div key={item.id} className="relative">
                {index !== mockTimelineData.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-border" />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full ${getStatusColor(item.status)} flex items-center justify-center flex-shrink-0`}>
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Badge variant="outline">{item.project}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span>{item.startDate} → {item.endDate}</span>
                      <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                        {item.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
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

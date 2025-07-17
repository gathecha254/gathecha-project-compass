
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarViewProps {
  onNewTask: () => void;
}

export const CalendarView = ({ onNewTask }: CalendarViewProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Generate calendar days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const mockEvents = [
    { date: '2024-07-20', title: 'Authentication System Review', type: 'deadline', priority: 'high' },
    { date: '2024-07-22', title: 'AI Ethics Paper Due', type: 'deadline', priority: 'high' },
    { date: '2024-07-25', title: 'Data Analysis Project', type: 'task', priority: 'medium' },
  ];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEvents.filter(event => event.date === dateStr);
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Calendar View</h2>
          <p className="text-muted-foreground">Schedule and track your project deadlines</p>
        </div>
        <Button onClick={onNewTask} className="bg-gradient-to-r from-blue-600 to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentMonth}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === currentDate.toDateString();
              const events = getEventsForDate(day);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border border-border rounded-lg
                    ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                    ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : ''}
                    hover:bg-accent transition-colors cursor-pointer
                  `}
                >
                  <div className={`text-sm ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'} ${isToday ? 'font-bold text-blue-600' : ''}`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    {events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`
                          text-xs p-1 rounded truncate
                          ${event.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' : 
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'}
                        `}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

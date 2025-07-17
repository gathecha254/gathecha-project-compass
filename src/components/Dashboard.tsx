
import { KanbanView } from './views/KanbanView';
import { CalendarView } from './views/CalendarView';
import { TimelineView } from './views/TimelineView';
import { GanttView } from './views/GanttView';
import { ListView } from './views/ListView';

interface DashboardProps {
  view: string;
  onNewTask: () => void;
}

export const Dashboard = ({ view, onNewTask }: DashboardProps) => {
  const renderView = () => {
    switch (view) {
      case 'kanban':
        return <KanbanView onNewTask={onNewTask} />;
      case 'calendar':
        return <CalendarView onNewTask={onNewTask} />;
      case 'timeline':
        return <TimelineView onNewTask={onNewTask} />;
      case 'gantt':
        return <GanttView onNewTask={onNewTask} />;
      case 'list':
        return <ListView onNewTask={onNewTask} />;
      default:
        return <KanbanView onNewTask={onNewTask} />;
    }
  };

  return (
    <div className="h-full">
      {renderView()}
    </div>
  );
};

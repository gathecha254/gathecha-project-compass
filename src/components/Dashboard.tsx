
import { KanbanView } from './views/KanbanView';
import { CalendarView } from './views/CalendarView';
import { TimelineView } from './views/TimelineView';
import { GanttView } from './views/GanttView';
import { ListView } from './views/ListView';

interface DashboardProps {
  view: string;
  onNewProject: () => void;
}

export const Dashboard = ({ view, onNewProject }: DashboardProps) => {
  const renderView = () => {
    switch (view) {
      case 'kanban':
        return <KanbanView onNewProject={onNewProject} />;
      case 'calendar':
        return <CalendarView onNewTask={() => {}} />;
      case 'timeline':
        return <TimelineView onNewTask={() => {}} />;
      case 'gantt':
        return <GanttView onNewTask={() => {}} />;
      case 'list':
        return <ListView onNewTask={() => {}} />;
      default:
        return <KanbanView onNewProject={onNewProject} />;
    }
  };

  return (
    <div className="h-full">
      {renderView()}
    </div>
  );
};

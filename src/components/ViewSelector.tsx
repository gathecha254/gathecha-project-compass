
import { Button } from '@/components/ui/button';
import { 
  Columns3, 
  Calendar, 
  Clock, 
  BarChart4, 
  List 
} from 'lucide-react';

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const ViewSelector = ({ currentView, onViewChange }: ViewSelectorProps) => {
  const views = [
    { id: 'kanban', label: 'Kanban', icon: Columns3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'gantt', label: 'Gantt', icon: BarChart4 },
    { id: 'list', label: 'List', icon: List },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Views
      </h3>
      {views.map((view) => (
        <Button
          key={view.id}
          variant={currentView === view.id ? "secondary" : "ghost"}
          className="w-full justify-start text-sm"
          onClick={() => onViewChange(view.id)}
        >
          <view.icon className="h-4 w-4 mr-3" />
          {view.label}
        </Button>
      ))}
    </div>
  );
};

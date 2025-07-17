
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PanelLeft, 
  Home,
  Calendar,
  BarChart3,
  Clock,
  Settings,
  Plus,
  FolderOpen,
  Target,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ViewSelector } from './ViewSelector';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onNewProject: () => void;
}

export const Sidebar = ({ collapsed, onToggle, currentView, onViewChange, onNewProject }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'today', label: "Today's Focus", icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'weekly', label: 'Weekly Review', icon: Clock },
  ];

  const mockProjects = [
    { id: 1, name: 'Tech Project', status: 'in-progress', taskCount: 4 },
    { id: 2, name: 'Data Science Study', status: 'todo', taskCount: 6 },
    { id: 3, name: 'Research Paper', status: 'review', taskCount: 3 },
    { id: 4, name: 'Business Analysis', status: 'done', taskCount: 5 },
    { id: 5, name: 'Marketing Campaign', status: 'in-progress', taskCount: 8 },
    { id: 6, name: 'Product Development', status: 'todo', taskCount: 12 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-500';
      case 'in-progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 h-screen flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                G:Project Manager
              </h1>
              <p className="text-xs text-muted-foreground">Edwin Gathecha</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed ? "px-2" : "px-3",
              activeSection === item.id && "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            )}
            onClick={() => setActiveSection(item.id)}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}

        {/* My Projects Section */}
        {!collapsed && (
          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setProjectsExpanded(!projectsExpanded)}
            >
              <div className="flex items-center">
                <FolderOpen className="h-4 w-4 mr-2" />
                My Projects
              </div>
              {projectsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {projectsExpanded && (
              <div className="mt-2">
                <ScrollArea className="h-48">
                  <div className="space-y-1 px-2">
                    {mockProjects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer text-sm"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                          <span className="truncate">{project.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2">
                          {project.taskCount}
                        </Badge>
                      </div>
                    ))}
                    {mockProjects.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                      >
                        View all {mockProjects.length} projects
                      </Button>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* View Selector */}
      {!collapsed && activeSection === 'dashboard' && (
        <div className="p-4 border-t border-border">
          <ViewSelector 
            currentView={currentView}
            onViewChange={onViewChange}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          onClick={onNewProject}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          size={collapsed ? "icon" : "default"}
        >
          <Plus className={cn("h-5 w-5", !collapsed && "mr-2")} />
          {!collapsed && "New Project"}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start"
          size={collapsed ? "icon" : "default"}
        >
          <Settings className={cn("h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && "Settings"}
        </Button>
      </div>
    </div>
  );
};

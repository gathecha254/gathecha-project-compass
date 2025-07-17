
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  Brain
} from 'lucide-react';
import { ViewSelector } from './ViewSelector';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ collapsed, onToggle, currentView, onViewChange }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'today', label: "Today's Focus", icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'weekly', label: 'Weekly Review', icon: Clock },
  ];

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

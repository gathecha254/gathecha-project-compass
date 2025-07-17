
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/components/Dashboard';
import { ProjectModal } from '@/components/ProjectModal';
import { AIAssistant } from '@/components/AIAssistant';
import { useTheme } from '@/hooks/useTheme';
import { ProjectProvider } from '@/contexts/ProjectContext';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('kanban');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex w-full">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentView={currentView}
            onViewChange={setCurrentView}
            onNewProject={() => setShowProjectModal(true)}
          />
          
          <div className="flex-1 flex flex-col">
            <TopBar 
              onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
            />
            
            <main className="flex-1 p-6">
              <Dashboard 
                view={currentView}
                onNewProject={() => setShowProjectModal(true)}
              />
            </main>
          </div>
        </div>

        {showProjectModal && (
          <ProjectModal onClose={() => setShowProjectModal(false)} />
        )}

        {showAIAssistant && (
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        )}
      </div>
    </ProjectProvider>
  );
};

export default Index;

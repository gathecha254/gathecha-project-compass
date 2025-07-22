import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/components/Dashboard';
import { ProjectModal } from '@/components/ProjectModal';
import { AIAssistant } from '@/components/AIAssistant';
import { ProjectProvider } from '@/contexts/ProjectContext';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('kanban');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

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

export default DashboardPage;
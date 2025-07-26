import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { ProjectGrid } from './components/ProjectGrid';
import { LeaderboardTable } from './components/LeaderboardTable';
import { Footer } from './components/Footer';
import { projectList, Project } from './data/projectList';
import { LeaderboardEntry } from './types/leaderboard';
import { ApiService } from './services/api';
import { KaitoPostAnalyzer } from './components/KaitoPostAnalyzer'; // --- IMPORT BARU

type AppView = 'projects' | 'leaderboard' | 'kaito';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // --- handler untuk klik project (buka leaderboard)
  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setCurrentView('leaderboard');
    setLoading(true);

    try {
      const data = await ApiService.fetchLeaderboard(project.name);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- kembali ke halaman project list (Home)
  const handleHomeClick = () => {
    setCurrentView('projects');
    setSelectedProject(null);
    setLeaderboardData([]);
  };

  // --- handler Kaito Post Analyzer
  const handleKaitoClick = () => {
    setCurrentView('kaito');
    setSelectedProject(null);
    setLeaderboardData([]);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
        <Navbar
          onHomeClick={handleHomeClick}
          onKaitoClick={handleKaitoClick}
          currentProject={selectedProject?.display_name}
          currentView={currentView}
        />

        <main className="flex-1">
          {currentView === 'projects' && (
            <ProjectGrid
              projects={projectList}
              onProjectClick={handleProjectClick}
            />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardTable
              data={leaderboardData}
              projectName={selectedProject?.display_name || ''}
              loading={loading}
            />
          )}

          {currentView === 'kaito' && (
            <KaitoPostAnalyzer />
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

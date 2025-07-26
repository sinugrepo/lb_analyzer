import React from 'react';
import { BarChart3, Home, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  onHomeClick: () => void;
  onKaitoClick: () => void;
  currentProject?: string;
  currentView?: string; // 'projects', 'leaderboard', 'kaito'
}

export const Navbar: React.FC<NavbarProps> = ({
  onHomeClick,
  onKaitoClick,
  currentProject,
  currentView
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">LB Yapper</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Leaderboard Analytics</p>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {currentProject && (
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{currentProject}</span>
              </div>
            )}

            {/* Kaito Post Analyzer Button */}
            <button
              onClick={onKaitoClick}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "kaito"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span>Kaito Post Analyzer</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Home Button */}
            <button
              onClick={onHomeClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                (currentView === "projects" || currentView === "leaderboard")
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

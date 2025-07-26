import React from 'react';
import { Project } from '../data/projectList';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1"
      onClick={() => onClick(project)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={project.image}
                alt={project.display_name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-50 dark:ring-gray-700 group-hover:ring-blue-100 dark:group-hover:ring-blue-900 transition-all"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${project.display_name}&background=3B82F6&color=fff&size=64`;
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.display_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{project.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.tge === 'pre'
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                  : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              {project.tge === 'pre' ? 'Pre-TGE' : 'Post-TGE'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">View Leaderboard</span>
          <div className="flex items-center space-x-2 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">
            <span className="text-sm font-medium">Analyze</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
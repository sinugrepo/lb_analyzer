import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { Project } from '../data/projectList';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Project Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Explore comprehensive leaderboard analytics for crypto projects. 
          Click on any project to view detailed community insights and metrics.
        </p>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              onClick={onProjectClick}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No projects found.</p>
      )}
    </div>
  );
};

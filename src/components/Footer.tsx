import React from 'react';
import { BarChart3, Github, Twitter, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">LB Yapper</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Leaderboard Analytics Platform</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Comprehensive analytics platform for crypto project communities. 
              Track engagement, influence, and community metrics in real-time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © 2025 LB Yapper. All rights reserved. | made By @sinugrepo
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
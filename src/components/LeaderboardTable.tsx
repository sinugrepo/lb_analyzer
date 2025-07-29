import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Search, Users, Trophy, MessageCircle, Terminal, Copy, X } from 'lucide-react';
import { LeaderboardEntry } from '../types/leaderboard';
import { format } from 'date-fns';
import Papa from 'papaparse';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  projectName: string;
  loading: boolean;
}

type SortKey = keyof LeaderboardEntry;
type SortDirection = 'asc' | 'desc';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  data, 
  projectName, 
  loading 
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });
  }, [data, sortKey, sortDirection, searchTerm]);

const exportToCSV = () => {
  const csvFields = [
    'Rank',
    'Name',
    'Username',
    'Community Score',
    'Mindshare',
    'Mention Count',
    'Follower Count',
    'Smart Follower Count',
    'Insightfulness Score (7d)',
    'Originality Score (7d)',
    'Created At'
  ];

  const csvData = filteredAndSortedData.map(entry => ({
    'Rank': entry.rank,
    'Name': entry.name,
    'Username': entry.username,
    'Community Score': entry.community_score,
    'Mindshare': entry.mindshare,
    'Mention Count': entry.mention_count,
    'Follower Count': entry.follower_count,
    'Smart Follower Count': entry.smart_follower_count,
    'Insightfulness Score (7d)': entry.insightfulness_score_7d,
    'Originality Score (7d)': entry.originality_score_7d,
    'Created At': entry.created_at
  }));

  const csv = Papa.unparse(csvData, {
    columns: csvFields,
    quotes: true,
    skipEmptyLines: true
  });

  const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${projectName}_leaderboard_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateTwitterCommand = () => {
  const usernames = filteredAndSortedData.map(entry => {
    // Remove @ symbol if present and clean username
    const cleanUsername = entry.username.replace('@', '');
    return `from:${cleanUsername}`;
  });
  
  return `(${usernames.join(', OR ')}) within_time:60min`;
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generateTwitterCommand());
    setCommandCopied(true);
    setTimeout(() => setCommandCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-500" />
      : <ArrowDown className="w-4 h-4 text-blue-500" />;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-lg text-gray-600 dark:text-gray-300">Loading leaderboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {projectName} Leaderboard
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{data.length} contributors</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <span>7-day analytics</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button
              onClick={() => setShowCommandModal(true)}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Terminal className="h-4 w-4" />
              <span>Generate Command</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
  <div className="overflow-x-scroll max-w-full">
    <table className="min-w-fit w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {[
                  { key: 'rank', label: 'Rank' },
                  { key: 'name', label: 'Name' },
                  { key: 'username', label: 'Username' },
                  { key: 'community_score', label: 'Community Score' },
                  { key: 'mindshare', label: 'Mindshare' },
                  { key: 'mention_count', label: 'Mentions' },
                  { key: 'follower_count', label: 'Followers' },
                  { key: 'smart_follower_count', label: 'Smart Followers' },
                  { key: 'insightfulness_score_7d', label: 'Insightfulness (7d)' },
                  { key: 'originality_score_7d', label: 'Originality (7d)' },
                  { key: 'created_at', label: 'Created At' }
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort(key as SortKey)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{label}</span>
                      {getSortIcon(key as SortKey)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAndSortedData.map((entry, index) => (
                <tr key={`${entry.username}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        entry.rank <= 3 
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={entry.avatar_url || `https://ui-avatars.com/api/?name=${entry.name}&background=3B82F6&color=fff&size=32`}
                        alt={entry.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${entry.name}&background=3B82F6&color=fff&size=32`;
                        }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={entry.twitter_url || `https://twitter.com/${entry.username.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      {entry.username}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">
                    {entry.community_score.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {entry.mindshare.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatNumber(entry.mention_count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatNumber(entry.follower_count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatNumber(entry.smart_follower_count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {entry.insightfulness_score_7d.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {entry.originality_score_7d.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm">
                    {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No contributors found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Command Modal */}
      {showCommandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Terminal className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Twitter Search Command
                </h3>
              </div>
              <button
                onClick={() => setShowCommandModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Copy this command to search for tweets from all {filteredAndSortedData.length} contributors in the last 60 minutes:
                </p>
              </div>
              
              <div className="relative">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 p-4 max-h-64 overflow-y-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all font-mono">
                    {generateTwitterCommand()}
                  </code>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className={`absolute top-3 right-3 flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    commandCopied
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  <span>{commandCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCommandModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  commandCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Copy className="h-4 w-4" />
                <span>{commandCopied ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
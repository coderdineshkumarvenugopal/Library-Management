import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookStats } from '../../types/book';
import { BookOpen, Users, CheckCircle, XCircle } from 'lucide-react';

interface AnalyticsDashboardProps {
  stats: BookStats;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const statusData = [
    { name: 'Available', value: stats.availableBooks, color: '#10B981' },
    { name: 'Issued', value: stats.issuedBooks, color: '#EF4444' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Analytics Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Books</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-300">Available</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.availableBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-300">Issued</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.issuedBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Genres</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.genreDistribution.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Books by Genre</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.genreDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="genre" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg)', 
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                  color: 'var(--tooltip-text)'
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Publication Years */}
      {stats.yearDistribution.length > 0 && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Books by Publication Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.yearDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg)', 
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                  color: 'var(--tooltip-text)'
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
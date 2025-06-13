import React from 'react';
import { Search, Filter, Download, BarChart3 } from 'lucide-react';
import { BookFilters as BookFiltersType } from '../../types/book';

interface BookFiltersProps {
  filters: BookFiltersType;
  onFiltersChange: (filters: BookFiltersType) => void;
  genres: string[];
  onExportCSV: () => void;
  onToggleAnalytics: () => void;
  showAnalytics: boolean;
}

const BookFilters: React.FC<BookFiltersProps> = ({
  filters,
  onFiltersChange,
  genres,
  onExportCSV,
  onToggleAnalytics,
  showAnalytics,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.genre}
              onChange={(e) => onFiltersChange({ ...filters, genre: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onToggleAnalytics}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showAnalytics
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          
          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
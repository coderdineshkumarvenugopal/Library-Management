import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
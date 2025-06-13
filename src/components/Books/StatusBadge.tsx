import React from 'react';

interface StatusBadgeProps {
  status: 'Available' | 'Issued';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const statusClasses = {
    Available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Issued: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
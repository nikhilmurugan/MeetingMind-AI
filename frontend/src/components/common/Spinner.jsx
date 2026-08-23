import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  return (
    <Loader2 className={`animate-spin text-indigo-600 dark:text-indigo-400 ${sizes[size] || sizes.md} ${className}`} />
  );
};

export default Spinner;

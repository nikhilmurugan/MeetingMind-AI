import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md'
      } ${
        hover ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-500/30' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

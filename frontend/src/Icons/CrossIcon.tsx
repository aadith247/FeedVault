import React from 'react';

export const CrossIcon = ({ size = 'md', className = '', onClick }: { size?: 'sm' | 'md' | 'lg', className?: string, onClick?: () => void }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };
  return (
    <svg
      className={`${sizes[size]} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overlay?: boolean;
}

const Loading: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (overlay) {
    return (
      <div
        className={`fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur z-50 flex items-center justify-center ${className}`}
      >
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-cyan-600`}
        ></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-cyan-600`}
      ></div>
    </div>
  );
};

export default Loading;

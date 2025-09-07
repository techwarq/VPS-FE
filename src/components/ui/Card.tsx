import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'outlined' | 'glow';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  variant = 'default',
  onClick
}) => {
  const variantClasses = {
    default: 'bg-gray-900 border-gray-700',
    outlined: 'bg-transparent border-green-500 border-2',
    glow: 'bg-gray-900 border-green-500 border glow-green'
  };
  
  return (
    <div 
      className={`rounded-lg shadow-lg border p-6 ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-lg font-semibold text-green-400 mb-4 border-b border-green-500/30 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

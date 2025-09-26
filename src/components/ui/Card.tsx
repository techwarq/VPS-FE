import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'outlined' | 'glow' | 'gradient' | 'glass' | 'elevated';
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  variant = 'default',
  onClick,
  hover = false
}) => {
  const variantClasses = {
    default: 'bg-gray-900 border-gray-700 shadow-lg',
    outlined: 'bg-transparent border-green-500 border-2 shadow-lg',
    glow: 'bg-gray-900 border-green-500 border glow-green shadow-lg',
    gradient: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 shadow-xl',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl',
    elevated: 'bg-gray-900 border-gray-700 shadow-2xl'
  };
  
  const hoverClasses = hover ? 'transform transition-all duration-300 hover:scale-105 hover:shadow-2xl' : '';
  const clickClasses = onClick ? 'cursor-pointer transition-all duration-200 hover:shadow-xl' : '';
  
  return (
    <div 
      className={`rounded-xl border p-6 ${variantClasses[variant]} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-lg font-semibold text-green-400 mb-4 border-b border-green-500/30 pb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

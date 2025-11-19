import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black border border-transparent relative overflow-hidden group';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black hover:from-emerald-500 hover:to-emerald-400 focus:ring-emerald-500 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105',
    secondary: 'bg-gray-800 text-emerald-400 hover:bg-gray-700 focus:ring-gray-500 border-gray-600 hover:border-gray-500',
    outline: 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black focus:ring-emerald-500 shadow-lg hover:shadow-emerald-500/25',
    ghost: 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 focus:ring-emerald-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 focus:ring-red-500 shadow-lg hover:shadow-red-500/25',
    gradient: 'bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white hover:from-purple-500 hover:via-blue-500 hover:to-emerald-500 focus:ring-purple-500 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 focus:ring-white/50 shadow-lg hover:shadow-white/25'
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={`flex items-center justify-center gap-2 ${loading ? 'invisible' : 'visible'}`}>
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </span>
    </button>
  );
};

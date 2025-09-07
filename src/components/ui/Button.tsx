import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black border border-transparent relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-green-600 text-black hover:bg-green-500 focus:ring-green-500 glow-green hover:glow-green-strong',
    secondary: 'bg-gray-800 text-green-400 hover:bg-gray-700 focus:ring-gray-500 border-gray-600',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black focus:ring-green-500 glow-green',
    ghost: 'text-green-400 hover:bg-green-500/10 hover:text-green-300 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`;
  
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {children}
      </span>
    </button>
  );
};

import React from 'react';
import { ButtonVariant } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = ButtonVariant.PRIMARY, 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    [ButtonVariant.PRIMARY]: "border-transparent text-white bg-primary-600 hover:bg-primary-700 shadow-sm",
    [ButtonVariant.SECONDARY]: "border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200",
    [ButtonVariant.OUTLINE]: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
    [ButtonVariant.GHOST]: "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
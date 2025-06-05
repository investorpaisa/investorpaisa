
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// Typography Components
export const Typography = {
  H1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("text-4xl md:text-6xl font-bold text-white font-heading tracking-tight", className)} {...props}>
      {children}
    </h1>
  ),
  H2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-2xl md:text-3xl font-bold text-white font-heading", className)} {...props}>
      {children}
    </h2>
  ),
  H3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-xl md:text-2xl font-semibold text-white font-heading", className)} {...props}>
      {children}
    </h3>
  ),
  Body: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-base text-white/80 font-sans", className)} {...props}>
      {children}
    </p>
  ),
  Small: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn("text-sm text-white/60 font-sans", className)} {...props}>
      {children}
    </span>
  )
};

// Button Components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const SystemButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50";
  
  const variants = {
    primary: "bg-gradient-to-r from-gold to-gold/90 text-black hover:from-gold/90 hover:to-gold shadow-lg hover:shadow-xl",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20",
    outline: "border-2 border-gold text-gold hover:bg-gold hover:text-black",
    ghost: "text-white/70 hover:text-white hover:bg-white/5"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  return (
    <button 
      className={cn(baseClasses, variants[variant], sizes[size], className)} 
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// Card Components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
}

export const SystemCard: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className, 
  ...props 
}) => {
  const variants = {
    default: "bg-black/80 border border-white/10 rounded-2xl p-6",
    glass: "bg-black/40 backdrop-blur-xl border border-gold/20 rounded-2xl p-6",
    elevated: "bg-black/90 border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-gold/10"
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

// Input Components
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const SystemInput: React.FC<InputProps> = ({ 
  label, 
  error, 
  className, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && <Typography.Small className="text-white/80">{label}</Typography.Small>}
      <input
        className={cn(
          "w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/40",
          "focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none transition-all duration-300",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
          className
        )}
        {...props}
      />
      {error && <Typography.Small className="text-red-400">{error}</Typography.Small>}
    </div>
  );
};

// Icon Button Component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'default' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const SystemIconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  variant = 'default', 
  size = 'md',
  className, 
  ...props 
}) => {
  const variants = {
    default: "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white",
    gold: "bg-gold/20 text-gold hover:bg-gold/30",
    ghost: "text-white/60 hover:text-white hover:bg-white/5"
  };
  
  const sizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl"
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50",
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
    </button>
  );
};


import React from 'react';
import { cn } from '@/lib/utils';
import { Flame, Users, TrendingUp, Trophy, Sparkles, ShieldCheck } from 'lucide-react';

interface CircleIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CircleIcon: React.FC<CircleIconProps> = ({ 
  name,
  size = 'md',
  className 
}) => {
  // Generate a consistent color based on the circle name
  const getColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-teal-100 text-teal-600'
    ];
    
    // Use the sum of char codes to pick a color
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };
  
  // Choose an icon based on the circle name
  const getIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('invest') || nameLower.includes('stock')) {
      return <TrendingUp className="h-full w-full" />;
    } else if (nameLower.includes('tax') || nameLower.includes('legal')) {
      return <ShieldCheck className="h-full w-full" />;
    } else if (nameLower.includes('expert') || nameLower.includes('pro')) {
      return <Trophy className="h-full w-full" />;
    } else if (nameLower.includes('trend') || nameLower.includes('hot')) {
      return <Flame className="h-full w-full" />;
    } else if (nameLower.includes('premium') || nameLower.includes('vip')) {
      return <Sparkles className="h-full w-full" />;
    } else {
      return <Users className="h-full w-full" />;
    }
  };
  
  // Get the initials from the circle name
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
  };
  
  // Icon size classes
  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };
  
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        getColor(name),
        sizeClasses[size],
        className
      )}
    >
      {size === 'lg' ? getInitials(name) : <div className={iconSizeClasses[size]}>{getIcon(name)}</div>}
    </div>
  );
};

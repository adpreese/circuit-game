
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface AnimatedArrowProps {
  className?: string;
  direction?: 'right' | 'down';
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ 
  className, 
  direction = 'right',
  size = 'md'
}) => {
  const sizeClass = {
    'sm': 'w-4 h-4',
    'md': 'w-6 h-6',
    'lg': 'w-8 h-8'
  }[size];

  return (
    <div 
      className={cn(
        'text-muted-foreground animate-pulse transition-transform',
        direction === 'down' && 'rotate-90',
        className
      )}
    >
      <ArrowRight className={cn(sizeClass)} />
    </div>
  );
};

export default AnimatedArrow;

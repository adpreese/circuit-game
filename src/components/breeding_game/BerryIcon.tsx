
import React from 'react';
import { BerryColor } from '@/lib/plant-types';
import { cn } from '@/lib/utils';

interface BerryIconProps {
  color: BerryColor;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getBerryColorClass = (color: BerryColor): string => {
  switch (color) {
    case 'Blue': return 'bg-berry-blue';
    case 'Red': return 'bg-berry-red';
    case 'Yellow': return 'bg-berry-yellow';
    case 'Purple': return 'bg-berry-purple';
    case 'Green': return 'bg-berry-green';
    case 'Orange': return 'bg-berry-orange';
    case 'Brown': return 'bg-berry-brown';
    case 'Teal': return 'bg-berry-teal';
    case 'Blurple': return 'bg-berry-blurple';
    default: return 'bg-gray-400';
  }
};

const BerryIcon: React.FC<BerryIconProps> = ({ color, className, size = 'md' }) => {
  const sizeClass = {
    'sm': 'w-4 h-4',
    'md': 'w-6 h-6',
    'lg': 'w-8 h-8'
  }[size];

  return (
    <div 
      className={cn(
        'berry flex items-center justify-center rounded-full border shadow-sm', 
        getBerryColorClass(color),
        sizeClass,
        className
      )}
      aria-label={`${color} berry`}
    >
      <div className="w-1/3 h-1/3 bg-white bg-opacity-50 rounded-full"></div>
    </div>
  );
};

export default BerryIcon;

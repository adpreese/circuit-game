
import React from 'react';
import { Shape } from '@/lib/plant-types';
import { cn } from '@/lib/utils';

interface HeightIconProps {
  height: Shape;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getHeightValue = (height: Shape): number => {
  switch (height) {
    case 'Short': return 1;
    case 'Medium': return 2;
    case 'Tall': return 3;
    default: return 1;
  }
};

const HeightIcon: React.FC<HeightIconProps> = ({ height, className, size = 'md' }) => {
  const heightValue = getHeightValue(height);
  
  const sizeClass = {
    'sm': 'w-3',
    'md': 'w-6',
    'lg': 'w-8'
  }[size];

  const shapeClass = {
    'Tall': 'bg-tallplant',
    'Bushy': 'bg-bushyplant',
    'Short': 'bg-shortplant',
    'Vine': 'bg-vineplant',
    'Twisted': 'bg-twistedplant',
    'Split': 'bg-splitplant',
    'Sprawling': 'bg-sprawlingplant',
    'Medium': 'bg-mediumplant',
    'Drooping': 'bg-droopingplant',
  }[height];
  
  const heightClass = {
      'sm': 'h-5',
      'md': 'h-8',
      'lg': 'h-10'
    };

  return (
    <div className={cn(' relative w-8 h-8 bg-cover bg-center bg-no-repeat ', className, shapeClass)}>
      <div 
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-plant-dark rounded-t',
          heightClass
        )}
      />
    </div>
  );
};

export default HeightIcon;

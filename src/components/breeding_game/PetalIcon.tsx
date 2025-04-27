
import React from 'react';
import { PetalCount } from '@/lib/plant-types';
import { cn } from '@/lib/utils';

interface PetalIconProps {
  petalCount: PetalCount;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PetalIcon: React.FC<PetalIconProps> = ({ petalCount, className, size = 'md' }) => {
  const sizeClass = {
    'sm': 'w-6 h-6',
    'md': 'w-8 h-8',
    'lg': 'w-10 h-10'
  }[size];

  // Generate petals based on count
  const petals = [];
  const centerSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 360) / petalCount;
    petals.push(
      <div 
        key={i}
        className="absolute w-[40%] h-[15%] bg-plant-medium origin-center rounded-full"
        style={{ 
          transformOrigin: '0% 50%', 
          transform: `rotate(${angle}deg) translateX(50%) translateY(-50%)`,
          left: '50%',
          top: '50%'
        }}
      />
    );
  }

  return (
    <div 
      className={cn('relative', sizeClass, className)}
      aria-label={`${petalCount} petals`}
    >
      {petals}
      <div className={cn('absolute rounded-full bg-plant-accent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', centerSize)} />
    </div>
  );
};

export default PetalIcon;

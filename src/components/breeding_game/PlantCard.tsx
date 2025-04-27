
import React from 'react';
import { Plant } from '@/lib/plant-types';
import { cn } from '@/lib/utils';
import BerryIcon from './BerryIcon';
import HeightIcon from './HeightIcon';
import PetalIcon from './PetalIcon';

interface PlantCardProps {
  plant: Plant;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showAnimation?: boolean;
  isTarget?: boolean;
  isSuccess?: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  isSelected = false,
  onClick,
  className,
  showAnimation = false,
  isTarget = false,
  isSuccess = false
}) => {
  return (
    <div
      className={cn(
        'plant-card',
        isSelected && 'botany-selected',
        showAnimation && 'animate-plant-grow',
        isTarget && 'border-dashed border-2',
        isSuccess && 'animate-success-pulse border-plant-accent bg-plant-light',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-1">
        
        <div className="flex items-center justify-between w-full">
        <BerryIcon color={plant.berryColor} className="mb-1" size="sm" />
        <HeightIcon height={plant.shape} className="mb-1" size="sm" />
          <PetalIcon petalCount={plant.petalCount} size="sm" />
        </div>
        <div className="text-xs font-medium text-center ">
        
          <div className="text-[10px]">{plant.berryColor} {plant.shape}</div>
          <div className="text-[10px]">{plant.petalCount} Petals</div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;

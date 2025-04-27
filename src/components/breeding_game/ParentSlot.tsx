
import React from 'react';
import { Plant } from '@/lib/plant-types';
import PlantCard from './PlantCard';
import { cn } from '@/lib/utils';

interface ParentSlotProps {
  label: string;
  plant: Plant | null;
  onRemove: () => void;
  className?: string;
}

const ParentSlot: React.FC<ParentSlotProps> = ({ label, plant, onRemove, className }) => {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <h3 className="text-sm font-medium mb-2">{label}</h3>
      <div className="w-32 h-32 rounded-lg bg-muted/50 border border-border border-dashed flex items-center justify-center p-2 relative">
        {plant ? (
          <>
            <PlantCard plant={plant} isSelected />
            <button
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full border border-border flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
              onClick={onRemove}
              aria-label={`Remove ${label}`}
            >
              ×
            </button>
          </>
        ) : (
          <div className="text-muted-foreground text-sm text-center">
            Select a plant
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentSlot;

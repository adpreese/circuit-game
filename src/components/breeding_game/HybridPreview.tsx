
import React, { useEffect, useState } from 'react';
import { Plant, hybridize, targetPlant, targetPlant2 } from '@/lib/plant-types';
import PlantCard from './PlantCard';

interface HybridPreviewProps {
  parentA: Plant | null;
  parentB: Plant | null;
  onComplete: (status: 'low' | 'high' | 'off') => void;
  firstStageComplete: "incomplete" | "complete";
  combineClicked: boolean;
}

const HybridPreview: React.FC<HybridPreviewProps> = ({ 
  parentA, 
  parentB, 
  onComplete, 
  firstStageComplete,
  combineClicked 
}) => {
  const [hybrid, setHybrid] = useState<Plant | null>(null);
  const [isMatch, setIsMatch] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    if (parentA && parentB && combineClicked) {
      // Only proceed if we haven't already processed this combination
      if (!hybrid || hasNotified === false) {
        setHybrid(null);
        setShowAnimation(true);
        
        const newHybrid = hybridize(parentA, parentB);
        setHybrid(newHybrid);
        
        const match1 = 
          newHybrid.berryColor === targetPlant.berryColor && 
          newHybrid.shape === targetPlant.shape && 
          newHybrid.petalCount === targetPlant.petalCount;

        const match2 = 
          newHybrid.berryColor === targetPlant2.berryColor && 
          newHybrid.shape === targetPlant2.shape && 
          newHybrid.petalCount === targetPlant2.petalCount;
        
        setIsMatch(match1 || match2);
        
        if (match1 && !hasNotified) {
          onComplete("low");
          setHasNotified(true);
        } else if (match2 && !hasNotified) {
          onComplete("high");
          setHasNotified(true);
        }
      }
    } else {
      // Reset when parents change or combine is clicked again
      if (!combineClicked) {
        setHybrid(null);
        setIsMatch(false);
        setHasNotified(false);
      }
    }
  }, [parentA, parentB, combineClicked, onComplete, hybrid, hasNotified]);

  if (!parentA || !parentB) {
    return (
      <div className="w-32 h-32 rounded-lg bg-muted/30 border border-border border-dashed flex items-center justify-center">
        <div className="text-muted-foreground text-sm text-center p-2">
          Select two parent plants to preview hybrid
        </div>
      </div>
    );
  }

  if (!combineClicked) {
    return (
      <div className="w-32 h-32 rounded-lg bg-muted/30 border border-border border-dashed flex items-center justify-center">
        <div className="text-muted-foreground text-sm text-center p-2">
          Press Combine to see hybrid
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium mb-2">Hybrid Preview</h3>
      <div className="w-32 h-32 flex items-center justify-center relative">
        {hybrid ? (
          <PlantCard
            plant={hybrid}
            showAnimation={showAnimation}
            isSuccess={isMatch}
          />
        ) : (
          <div className="w-full h-full rounded-lg bg-muted/30 border border-border border-dashed flex items-center justify-center">
            <div className="text-muted-foreground text-xs text-center p-2">
              Calculating...
            </div>
          </div>
        )}
      </div>
      {hybrid && (
        <div className="mt-2 text-center">
          {isMatch ? (
            <div className="text-plant-dark font-medium animate-fade-in">
              Success! Perfect match!
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Not the right hybrid
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HybridPreview;

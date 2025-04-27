
import React, { useState, useEffect } from 'react';
import PlantCard from '@/components/breeding_game/PlantCard';
import ParentSlot from '@/components/breeding_game/ParentSlot';
import HybridPreview from '@/components/breeding_game/HybridPreview';
import AnimatedArrow from '@/components/breeding_game/AnimatedArrow';
import { Plant, generateInitialPlants, targetPlant } from '@/lib/plant-types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useGameState } from "@/context/GameStateContext";

const Puzzle4 = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [parentA, setParentA] = useState<Plant | null>(null);
  const [parentB, setParentB] = useState<Plant | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [combineClicked, setCombineClicked] = useState(false);
  const navigate = useNavigate();
  const { gameState, updatePuzzleState } = useGameState();

  useEffect(() => {
    // Generate the initial plants
    const initialPlants = generateInitialPlants();
    setPlants(initialPlants);
  }, []);

  const handlePlantClick = (plant: Plant) => {
    // If this plant is already selected, do nothing
    if (parentA?.id === plant.id || parentB?.id === plant.id) return;
    
    // Otherwise, add to the next empty slot
    if (!parentA) {
      setParentA(plant);
      // Reset combine state when changing parents
      setCombineClicked(false);
    } else if (!parentB) {
      setParentB(plant);
      // Reset combine state when changing parents
      setCombineClicked(false);
    }
  };

  const handleRemoveParentA = () => {
    setParentA(null);
    setCombineClicked(false);
  };

  const handleRemoveParentB = () => {
    setParentB(null);
    setCombineClicked(false);
  };

  const handleCombine = () => {
    if (parentA && parentB) {
      setCombineClicked(true);
    }
  };

  const handleSuccess = (status: 'low' | 'high' | 'off') => {
    setShowSuccess(true);
    updatePuzzleState('puzzle4', status);
    toast('Success! You found the perfect hybrid!', {
      description: 'The door to the next area unlocks with a mystical glow...',
      duration: 5000,
    });
  };

  const handleReset = () => {
    setParentA(null);
    setParentB(null);
    setCombineClicked(false);
    setShowSuccess(false);
  };

  return (
    <div className="bg-parchment bg-parchment-texture py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <header className="text-center">
          <h1 className="text-3xl font-bold text-plant-dark">Botanical Brew Quest</h1>
          <p className="text-muted-foreground mt-2">
            Combine plants to create the perfect hybrid
          </p>
        </header>
        <div className="bg-white px-4 py-2 rounded-md shadow-sm">
          Status: <span className="font-semibold">{gameState.puzzle4}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
   
        
        <div className="bg-parchment-light rounded-lg border border-border shadow-md p-2 mb-4">
          <div className="flex flex-wrap justify-center items-start gap-6 mb-2">
            <ParentSlot 
              label="Parent A"
              plant={parentA}
              onRemove={handleRemoveParentA}
              className="scale-90"
            />
            
            <div className="flex flex-col items-center justify-center h-36">
              <div className="w-8 h-px bg-border my-2" />
              <Button 
                onClick={handleCombine} 
                disabled={!parentA || !parentB || combineClicked}
                variant={!parentA || !parentB ? "outline" : "default"}
                className="bg-plant-dark hover:bg-plant-dark/90"
              >
                {combineClicked ? "Combined" : "Combine"}
              </Button>
              <div className="w-8 h-px bg-border my-2" />
            </div>
            
            <ParentSlot 
              label="Parent B"
              plant={parentB}
              onRemove={handleRemoveParentB}
              className="scale-90"
            />
            
            <div className="w-12 flex items-center justify-center h-36">
              <AnimatedArrow />
            </div>
            
            <HybridPreview 
              parentA={parentA} 
              parentB={parentB}
              onComplete={handleSuccess}
              firstStageComplete={gameState.firstStage || "incomplete"}
              combineClicked={combineClicked}
            />
          </div>
          
          <div className="border-t border-border pt-4 text-center">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 bg-muted rounded-md p-3">
              <div className="font-medium">Target Hybrid:</div>
              <div className="flex items-center gap-2 mx-auto">
                <div className="px-2 py-1 bg-plant-dark text-white text-sm rounded">
                  Green Berry
                </div>
                <div className="px-2 py-1 bg-plant-dark text-white text-sm rounded">
                  Bushy Shape
                </div>
                <div className="px-2 py-1 bg-plant-dark text-white text-sm rounded">
                  7 Petals
                </div>
                
              </div>
              {gameState.firstStage === "complete" && (<div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 bg-muted rounded-md p-3">
              <div className="font-medium">Target Hybrid #2:</div>
              <div className="flex items-center gap-2 mx-auto">
                <div className="px-2 py-1 bg-plant-dark text-white text-sm rounded">
                  Blurple Berry
                </div>
                <div className="px-2 py-1 bg-plant-dark text-white text-sm rounded">
                  Twisted Shape
                </div>
                <div className="px-2 py-1 bg-plant-dark text-white text-sm rounded">
                  9 Petals
                </div>
                
              </div></div>)}
            </div>
          </div>
          
          {(showSuccess || combineClicked) && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleReset} variant="outline">Try Again</Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-2">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              isSelected={parentA?.id === plant.id || parentB?.id === plant.id}
              onClick={() => handlePlantClick(plant)}
              className="h-24"
            />
          ))}
        </div>
        
        <footer className="text-center text-muted-foreground text-sm mt-8">
          <p>Botanical Brew Quest - Combine plants to solve the puzzle</p>
        </footer>
      </div>
    </div>
  );
};

export default Puzzle4;

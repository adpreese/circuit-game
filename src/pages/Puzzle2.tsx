
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useGameState } from "@/context/GameStateContext";
import ChordKeypadPuzzle from '@/components/chord_puzzle/ChordKeypadPuzzle';
import { toast } from 'sonner';

const Puzzle2 = () => {
  const navigate = useNavigate();
  const { gameState, updatePuzzleState } = useGameState();
  
  const handleComplete = (status: 'low' | 'high' | 'off') => {
    updatePuzzleState('puzzle2', status);
  };
  return (
    <div className="w-full h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <div className="bg-white px-4 py-2 rounded-md shadow-sm">
            Status: <span className="font-semibold">{gameState.puzzle2}</span>
          </div>
        </div>
        <div className="min-h-screen bg-gradient-to-b from-puzzle-dark to-black py-8">
          <div className="container mx-auto px-4">
            <header className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Resonance Station
              </h1>
              
            </header>
            
            <ChordKeypadPuzzle 
              onComplete={handleComplete} 
              firstStageComplete={gameState.firstStage === 'complete'}
            />
            
            <footer className="text-center mt-8 text-puzzle-neutral text-sm">
              <p>Press keys to find the resonant pattern</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puzzle2;

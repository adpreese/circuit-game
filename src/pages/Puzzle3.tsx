
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import PressureBalancePuzzle from "@/components/pressure_balance_puzzle/PressureBalancePuzzle";
import { useGameState } from "@/context/GameStateContext";
import { toast } from 'sonner';

const Puzzle3 = () => {
  const navigate = useNavigate();
  const { gameState, updatePuzzleState } = useGameState();
  const handleComplete = (status: 'low' | 'high' | 'off') => {
    updatePuzzleState('puzzle3', status);
  };

  return (
    <div className="min-h-screen bg-industrial-bg p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <div className="bg-white px-4 py-2 rounded-md shadow-sm">
          Status: <span className="font-semibold">{gameState.puzzle3}</span>
        </div>
      </div>
      <PressureBalancePuzzle onComplete={handleComplete} firstStage={gameState.firstStage}  />
    </div>
  );
};

export default Puzzle3;

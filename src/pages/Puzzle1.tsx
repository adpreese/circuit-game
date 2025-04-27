
import Game from "@/components/grid_move_game/Game";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useGameState } from "@/context/GameStateContext";

const Puzzle1 = () => {
  const navigate = useNavigate();
  const { gameState, updatePuzzleState } = useGameState();
  
  const handleComplete = (status: 'low' | 'high' | 'off') => {
    updatePuzzleState('puzzle1', status);
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
          Status: <span className="font-semibold">{gameState.puzzle1}</span>
        </div>
      </div>
      <Game onComplete={handleComplete} firstStage={gameState.firstStage} />
    </div>
  );
};

export default Puzzle1;

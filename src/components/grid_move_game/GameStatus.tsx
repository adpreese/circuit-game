
import { GameState } from "@/types/grid_move_game";
import { Button } from "@/components/ui/button";

interface GameStatusProps {
  gameState: GameState;
  onReset: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState, onReset }) => {
  const { gameStatus, currentPosition } = gameState;
  
  return (
    <div className="bg-industrial-metal/10 p-4 rounded-md border border-industrial-grid/30 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-industrial-highlight">Status</h2>
        <Button 
          onClick={onReset} 
          variant="destructive"
          className="bg-industrial-error hover:bg-industrial-error/80"
        >
          Reset Game
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-industrial-grid">Position:</span>
          <span className="font-mono">
            ({currentPosition.x}, {currentPosition.y})
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-industrial-grid">Status:</span>
          <span className={`font-semibold ${gameStatus === 'won' ? 'text-green-500' : gameStatus === 'lost' ? 'text-industrial-error' : 'text-industrial-current'}`}>
            {gameStatus.toUpperCase()}
          </span>
        </div>
      </div>
      
      {gameStatus === 'won' && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-center">
          <p className="text-green-500 font-bold">Congratulations!</p>
          <p className="text-sm">You successfully reached a goal.</p>
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="mt-4 p-3 bg-industrial-error/20 border border-industrial-error rounded-md text-center">
          <p className="text-industrial-error font-bold">Game Over</p>
          <p className="text-sm">You were unable to reach a goal.</p>
        </div>
      )}
    </div>
  );
};

export default GameStatus;

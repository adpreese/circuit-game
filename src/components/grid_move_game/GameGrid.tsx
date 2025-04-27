
import { GameState, Position } from "@/types/grid_move_game";
import { cn } from "@/lib/utils";

interface GameGridProps {
  gameState: GameState;
  onMoveSelect: (position: Position) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ gameState, onMoveSelect }) => {
  const { gridSize, currentPosition, goals, path, startPosition, validMoves } = gameState;
  
  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < gridSize; y++) {
      const row = [];
      for (let x = 0; x < gridSize; x++) {
        const cellPosition: Position = { x, y };
        const isCurrentPos = currentPosition.x === x && currentPosition.y === y;
        const isGoal = goals.some((goal) => goal.x === x && goal.y === y);
        const isPath = path.some((pos) => pos.x === x && pos.y === y);
        const isStart = startPosition.x === x && startPosition.y === y;
        const isValidMove = validMoves.some((move) => move.x === x && move.y === y);
        
        const goalIndex = goals.findIndex((goal) => goal.x === x && goal.y === y);
        
        row.push(
          <div
            key={`cell-${x}-${y}`}
            onClick={() => isValidMove && onMoveSelect(cellPosition)}
            className={cn(
              "border border-industrial-gridLine bg-industrial-bg relative flex items-center justify-center",
              "w-8 h-8 md:w-10 md:h-10 transition-all duration-300",
              isPath && !isCurrentPos && !isGoal && "bg-industrial-grid/20",
              isGoal && "bg-industrial-highlight/40",
              isValidMove && "bg-industrial-current/20 cursor-pointer hover:bg-industrial-current/40",
              !isValidMove && "cursor-not-allowed"
            )}
          >
            {isCurrentPos && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-industrial-current animate-blink" />
              </div>
            )}
            
            {isGoal && (
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs md:text-sm text-black">
                G{goalIndex + 1}
              </div>
            )}
            
            {isStart && !isCurrentPos && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-industrial-grid" />
              </div>
            )}
          </div>
        );
      }
      
      grid.push(
        <div key={`row-${y}`} className="flex">
          {row}
        </div>
      );
    }
    
    return grid;
  };
  
  return (
    <div className="bg-industrial-metal/10 p-1 md:p-2 rounded-md shadow-xl border border-industrial-grid/30">
      <div className="grid-pattern">{renderGrid()}</div>
    </div>
  );
};

export default GameGrid;


import { Move } from "@/types/grid_move_game";
import { cn } from "@/lib/utils";

interface MoveQueueProps {
  moveQueue: Move[];
  currentMoveIndex: number;
}

const MoveQueue: React.FC<MoveQueueProps> = ({ moveQueue, currentMoveIndex }) => {
  return (
    <div className="bg-industrial-metal/10 p-4 rounded-md border border-industrial-grid/30 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-industrial-highlight">Move Queue</h2>
      <div className="space-y-3">
        {moveQueue.map((move, index) => (
          <div 
            key={`move-${index}`}
            className={cn(
              "flex items-center p-2 rounded-md transition-all",
              index === currentMoveIndex && "bg-industrial-current/20 border border-industrial-current",
              index < currentMoveIndex && "opacity-50"
            )}
          >
            <div className="w-8 h-8 flex items-center justify-center font-mono bg-industrial-bg rounded-md mr-3">
              {index + 1}
            </div>
            <div className="font-mono text-lg">
              ({move.x}, {move.y})
            </div>
            {index === currentMoveIndex && (
              <div className="ml-2 text-industrial-current animate-pulse">
                ⟸ Current
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveQueue;

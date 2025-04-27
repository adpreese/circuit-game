
import { Direction } from "@/types/grid_move_game";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface DirectionControlsProps {
  onSelectDirection: (direction: Direction) => void;
  currentMove: { x: number; y: number } | null;
  disabled: boolean;
}

const DirectionControls: React.FC<DirectionControlsProps> = ({
  onSelectDirection,
  currentMove,
  disabled
}) => {
  // Only show valid directions based on the current move
  const showX = currentMove && currentMove.x > 0;
  const showY = currentMove && currentMove.y > 0;
  
  return (
    <div className="bg-industrial-metal/10 p-4 rounded-md border border-industrial-grid/30 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-industrial-highlight">Direction Controls</h2>
      
      <div className="flex flex-col items-center gap-2">
        {/* Up direction */}
        {showY && (
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-industrial-bg hover:bg-industrial-current/20"
            onClick={() => onSelectDirection({ xDir: 0, yDir: -1 })}
            disabled={disabled}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          {/* Left direction */}
          {showX && (
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 bg-industrial-bg hover:bg-industrial-current/20"
              onClick={() => onSelectDirection({ xDir: -1, yDir: 0 })}
              disabled={disabled}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          
          {/* Center position indicator */}
          <div className="w-12 h-12 flex items-center justify-center bg-industrial-current/20 rounded-md">
            <div className="w-4 h-4 rounded-full bg-industrial-current animate-pulse"></div>
          </div>
          
          {/* Right direction */}
          {showX && (
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 bg-industrial-bg hover:bg-industrial-current/20"
              onClick={() => onSelectDirection({ xDir: 1, yDir: 0 })}
              disabled={disabled}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        {/* Down direction */}
        {showY && (
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-industrial-bg hover:bg-industrial-current/20"
            onClick={() => onSelectDirection({ xDir: 0, yDir: 1 })}
            disabled={disabled}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      {/* Diagonal controls */}
      {showX && showY && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="bg-industrial-bg hover:bg-industrial-current/20"
            onClick={() => onSelectDirection({ xDir: -1, yDir: -1 })}
            disabled={disabled}
          >
            <ArrowUp className="h-4 w-4 mr-1 -translate-x-1" />
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="bg-industrial-bg hover:bg-industrial-current/20"
            onClick={() => onSelectDirection({ xDir: 1, yDir: -1 })}
            disabled={disabled}
          >
            <ArrowUp className="h-4 w-4 mr-1 translate-x-1" />
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="bg-industrial-bg hover:bg-industrial-current/20"
            onClick={() => onSelectDirection({ xDir: -1, yDir: 1 })}
            disabled={disabled}
          >
            <ArrowDown className="h-4 w-4 mr-1 -translate-x-1" />
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="bg-industrial-bg hover:bg-industrial-current/20"
            onClick={() => onSelectDirection({ xDir: 1, yDir: 1 })}
            disabled={disabled}
          >
            <ArrowDown className="h-4 w-4 mr-1 translate-x-1" />
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DirectionControls;

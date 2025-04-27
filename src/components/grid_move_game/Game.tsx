
import { useState } from "react";
import { Position } from "@/types/grid_move_game";
import { initializeGame, isGoalPosition, makeMove, resetGame } from "@/utils/grid_move_game_utils";
import GameGrid from "./GameGrid";
import MoveQueue from "./MoveQueue";
import GameStatus from "./GameStatus";
import GameInstructions from "./GameInstructions";

interface GameProps {
  onComplete: (status: 'low' | 'high' | 'off') => void;
  firstStage: string;
}

const Game = ({ onComplete, firstStage }: GameProps) => {
  const [gameState, setGameState] = useState(initializeGame(firstStage));
  const goalToStateLookup = {0: 'low', 1: 'high'} as const;
  
  // Handle move selection by clicking on valid squares
  const handleMoveSelect = (position: Position) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const newGameState = makeMove(gameState, position);
    const isGoalPositionResult = isGoalPosition(position, gameState.goals)
    if(isGoalPositionResult != -1){
      onComplete(goalToStateLookup[isGoalPositionResult])
    } else if (newGameState.gameStatus === 'lost'){
      onComplete('off')
    }
    setGameState(newGameState);
  };
  
  // Handle game reset
  const handleReset = () => {
    setGameState(resetGame(firstStage));
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-industrial-highlight">
          Grid Realignment
        </h1>
        <GameInstructions />
      </div>
      
      <div className="grid md:grid-cols-[1fr_auto] gap-6">
        <div className="flex justify-center">
          <GameGrid 
            gameState={gameState} 
            onMoveSelect={handleMoveSelect}
          />
        </div>
        
        <div className="space-y-6 w-full max-w-md mx-auto">
          <MoveQueue
            moveQueue={gameState.moveQueue}
            currentMoveIndex={gameState.currentMoveIndex}
          />
          
          <GameStatus gameState={gameState} onReset={handleReset} />
        </div>
      </div>
    </div>
  );
};

export default Game;

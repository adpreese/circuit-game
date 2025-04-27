
import { Direction, GameState, Move, Position } from "@/types/grid_move_game";
import { toast } from "@/components/ui/sonner";

// Generate a random integer between min and max (inclusive)
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random position within the grid bounds
export const getRandomPosition = (gridSize: number): Position => {
  return {
    x: getRandomInt(0, gridSize - 1),
    y: getRandomInt(0, gridSize - 1),
  };
};

// Generate a random move (x, y) where x and y are between 0 and 3
export const generateRandomMove = (): Move => {
  return {
    x: getRandomInt(0, 3),
    y: getRandomInt(0, 3),
  };
};

// Generate a queue of random moves
export const generateMoveQueue = (count: number): Move[] => {
  const queue: Move[] = [];
  for (let i = 0; i < count; i++) {
    queue.push(generateRandomMove());
  }
  return queue;
};

// Check if a position is within the grid bounds
export const isValidPosition = (position: Position, gridSize: number): boolean => {
  return (
    position.x >= 0 &&
    position.x < gridSize &&
    position.y >= 0 &&
    position.y < gridSize
  );
};

// Apply a move to a position in the specified direction
export const applyMove = (
  position: Position,
  move: Move,
  direction: Direction
): Position => {
  return {
    x: position.x + move.x * direction.xDir,
    y: position.y + move.y * direction.yDir,
  };
};

// Check if a position is one of the goal positions
export const isGoalPosition = (position: Position, goals: Position[]): number => {
  return goals.findIndex(
    (goal) => goal.x === position.x && goal.y === position.y
  );
};

// Initialize a new game state
export const initializeGame = (firstStage: string): GameState => {
  // Generate a random starting position
  const gridSize: number = 12; 
  const moveQueueSize: number = 6
  const startPosition = getRandomPosition(gridSize);
  
  // Generate a random move queue
  const moveQueue = generateMoveQueue(moveQueueSize);
  
  // Initialize with empty goals
  const initialState: GameState = {
    gridSize,
    currentPosition: { ...startPosition },
    startPosition,
    goals: [],
    moveQueue,
    path: [{ ...startPosition }],
    gameStatus: 'playing',
    currentMoveIndex: 0,
    validMoves: [], // Will be populated after goals are generated
  };

  // Generate reachable goals
  initialState.goals = generateReachableGoals(initialState, moveQueueSize, firstStage === 'complete');
  
  // Calculate valid moves for the first position
  initialState.validMoves = calculateValidMoves(initialState);
  
  return initialState;
};

// Generate goals that are actually reachable with the current move queue
export const generateReachableGoals = (gameState: GameState, movesToCheck: number, firstStageComplete: boolean): Position[] => {
  // We'll generate a set of potential goals by simulating different move combinations
  const potentialGoals: Position[] = [];
  const startPos = gameState.startPosition;
  const moveQueue = gameState.moveQueue;
  const gridSize = gameState.gridSize;
  
  // Helper function to recursively try different move combinations
  const tryMoves = (pos: Position, moveIndex: number, depth: number) => {
    if (depth >= movesToCheck || moveIndex >= moveQueue.length) {
      // We've used enough moves or reached the end of the queue
      const goal = { x: pos.x, y: pos.y };
      
      // Check if the goal is unique and not the starting position
      const isUnique = !potentialGoals.some(g => g.x === goal.x && g.y === goal.y);
      const isNotStart = goal.x !== startPos.x || goal.y !== startPos.y;
      
      if (isUnique && isNotStart) {
        potentialGoals.push(goal);
      }
      return;
    }
    
    const move = moveQueue[moveIndex];
    
    // Try all possible directions for this move
    const directions: Direction[] = [
      { xDir: 1, yDir: 1 },
      { xDir: 1, yDir: -1 },
      { xDir: -1, yDir: 1 },
      { xDir: -1, yDir: -1 },
      { xDir: 1, yDir: 0 },
      { xDir: -1, yDir: 0 },
      { xDir: 0, yDir: 1 },
      { xDir: 0, yDir: -1 },
    ];
    
    for (const dir of directions) {
      // Skip invalid combinations (where both x and y would be zero)
      if (move.x === 0 && move.y === 0) continue;
      if (move.x === 0 && dir.xDir !== 0) continue;
      if (move.y === 0 && dir.yDir !== 0) continue;
      
      const newPos = applyMove(pos, move, dir);
      
      // Only continue if the new position is valid
      if (isValidPosition(newPos, gridSize)) {
        tryMoves(newPos, moveIndex + 1, depth + 1);
      }
    }
  };
  
  // Start the recursive exploration
  tryMoves(startPos, 0, 0);
  
  // Select two reachable goals (or fewer if not enough are found)
  if (potentialGoals.length >= 2) {
    // Shuffle the array to randomize selection
    for (let i = potentialGoals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [potentialGoals[i], potentialGoals[j]] = [potentialGoals[j], potentialGoals[i]];
    }
    return firstStageComplete ? [potentialGoals[0], potentialGoals[1]] :  [potentialGoals[0]]
  } else if (potentialGoals.length === 1) {
    return [potentialGoals[0]];
  } else {
    // If no reachable goals were found, generate two random positions that aren't the start
    const goals: Position[] = [];
    while (goals.length < 2) {
      const goal = getRandomPosition(gridSize);
      const isNotStart = goal.x !== startPos.x || goal.y !== startPos.y;
      const isUnique = !goals.some(g => g.x === goal.x && g.y === goal.y);
      
      if (isNotStart && isUnique) {
        goals.push(goal);
      }
    }
    return firstStageComplete ? [goals[0], goals[1]] :  [goals[0]]
  }
};

// Calculate valid moves for the current position and move
export const calculateValidMoves = (gameState: GameState): Position[] => {
  if (gameState.currentMoveIndex >= gameState.moveQueue.length) {
    return [];
  }

  const currentMove = gameState.moveQueue[gameState.currentMoveIndex];
  const validMoves: Position[] = [];
  const { x: moveX, y: moveY } = currentMove;
  const { x: currentX, y: currentY } = gameState.currentPosition;

  // Generate all possible combinations of the move
  const directions = [
    { x: moveX, y: moveY },
    { x: moveX, y: -moveY },
    { x: -moveX, y: moveY },
    { x: -moveX, y: -moveY },
    // If x and y are different, also allow swapping them
    ...(moveX !== moveY ? [
      { x: moveY, y: moveX },
      { x: moveY, y: -moveX },
      { x: -moveY, y: moveX },
      { x: -moveY, y: -moveX },
    ] : [])
  ];

  // Add all valid positions
  for (const dir of directions) {
    const newPos = {
      x: currentX + dir.x,
      y: currentY + dir.y
    };
    if (isValidPosition(newPos, gameState.gridSize)) {
      validMoves.push(newPos);
    }
  }

  return validMoves;
};

// Make a move to a selected position
export const makeMove = (gameState: GameState, selectedPosition: Position): GameState => {
  if (gameState.gameStatus !== 'playing') {
    return gameState;
  }

  // Verify the selected position is valid
  if (!gameState.validMoves.some(pos => pos.x === selectedPosition.x && pos.y === selectedPosition.y)) {
    toast.error("Invalid move selected!");
    return gameState;
  }

  // Update path and position
  const newPath = [...gameState.path, selectedPosition];
  
  // Check if we reached a goal
  if (isGoalPosition(selectedPosition, gameState.goals) >= 0) {
    toast.success("Goal reached! Puzzle solved!");
    return {
      ...gameState,
      currentPosition: selectedPosition,
      path: newPath,
      currentMoveIndex: gameState.currentMoveIndex + 1,
      validMoves: [],
      gameStatus: 'won',
    };
  }
  
  // Check if we've used all moves without reaching a goal
  if (gameState.currentMoveIndex === gameState.moveQueue.length - 1) {
    toast.error("You've used all moves without reaching a goal!");
    return {
      ...gameState,
      currentPosition: selectedPosition,
      path: newPath,
      currentMoveIndex: gameState.currentMoveIndex + 1,
      validMoves: [],
      gameStatus: 'lost',
    };
  }
  
  // Continue playing
  const nextState = {
    ...gameState,
    currentPosition: selectedPosition,
    path: newPath,
    currentMoveIndex: gameState.currentMoveIndex + 1,
  };
  
  // Calculate valid moves for the next turn
  nextState.validMoves = calculateValidMoves(nextState);
  
  return nextState;
};

// Reset the game to a new state
export const resetGame = (firstStage: string): GameState => {
  return initializeGame(firstStage);
};

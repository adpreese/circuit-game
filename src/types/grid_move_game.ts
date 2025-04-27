
export type Position = {
  x: number;
  y: number;
};

export type Move = {
  x: number;
  y: number;
};

export type Direction = {
  xDir: 1 | -1 | 0;
  yDir: 1 | -1 | 0;
};

export type GameState = {
  gridSize: number;
  currentPosition: Position;
  startPosition: Position;
  goals: Position[];
  moveQueue: Move[];
  path: Position[];
  gameStatus: 'playing' | 'won' | 'lost';
  currentMoveIndex: number;
  validMoves: Position[];
};

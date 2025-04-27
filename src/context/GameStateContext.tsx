
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Edge } from '@xyflow/react';

// Define the type for our game state
export interface GameState {
  puzzle1: 'low' | 'medium' | 'high' | 'off';
  puzzle2: 'low' | 'medium' | 'high' | 'off';
  puzzle3: 'low' | 'medium' | 'high' | 'off';
  puzzle4: 'low' | 'medium' | 'high' | 'off';
  firstStage: 'complete' | 'incomplete';
  secondStage: 'complete' | 'incomplete';
  edges: Edge[];
}

interface GameStateContextType {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState>) => void;
  updatePuzzleState: (puzzle: 'puzzle1' | 'puzzle2' | 'puzzle3' | 'puzzle4', state: 'low' | 'medium' | 'high' | 'off') => void;
  setEdges: (edges: Edge[]) => void;
}

// Initial state
export const initialGameState: GameState = {
  puzzle1: 'off',
  puzzle2: 'off',
  puzzle3: 'off',
  puzzle4: 'off',
  firstStage: 'incomplete',
  secondStage: 'incomplete',
  edges: []
};

// Storage key for localStorage
const STORAGE_KEY = 'puzzle-game-state';

// Create context with default value
const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Create provider component
export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or use initial state
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.error('Error parsing saved game state:', error);
        return initialGameState;
      }
    }
    return initialGameState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  const updatePuzzleState = (
    puzzle: 'puzzle1' | 'puzzle2' | 'puzzle3' | 'puzzle4', 
    state: 'low' | 'medium' | 'high' | 'off'
  ) => {
    setGameState(prevState => ({
      ...prevState,
      [puzzle]: state
    }));
  };

  const setEdges = (edges: Edge[]) => {
    setGameState(prevState => ({
      ...prevState,
      edges
    }));
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState, updatePuzzleState, setEdges }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to use the game state
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

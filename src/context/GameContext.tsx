import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useGame } from '../hooks/useGame';
import type { GameState, GameSettings, GameType, Question } from '../types';

interface GameContextType {
  state: GameState;
  settings: GameSettings;
  currentQuestion: Question | null;
  startGame: (gameType: GameType, settings: GameSettings) => void;
  submitAnswer: (answer: string | number) => void;
  skipQuestion: () => void;
  nextQuestion: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const game = useGame();

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

export default GameContext;

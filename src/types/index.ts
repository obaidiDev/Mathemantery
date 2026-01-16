import type { DifficultyLevel, GameType, QuestionMode, NumberFormat } from '../config/gameConfig';

// Question types
export interface BaseQuestion {
  id: number;
  type: GameType;
}

export interface ArithmeticQuestion extends BaseQuestion {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'additionSubtraction' | 'multiplicationDivision' | 'arithmetic';
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  correctAnswer: number;
  options?: number[];
}

export interface ReadingNumberQuestion extends BaseQuestion {
  type: 'readingNumbers';
  number: number;
  correctAnswers: string[]; // Multiple valid Arabic word forms
}

export interface ComparisonQuestion extends BaseQuestion {
  type: 'comparingNumbers';
  num1: number;
  num2: number;
  correctAnswer: '>' | '<' | '=';
}

export interface FractionQuestion extends BaseQuestion {
  type: 'fractions';
  numerator: number;
  denominator: number;
}

export type Question = ArithmeticQuestion | ReadingNumberQuestion | ComparisonQuestion | FractionQuestion;

// Answer types
export interface Answer {
  questionId: number;
  userAnswer: string | number | null;
  isCorrect: boolean;
  isSkipped: boolean;
  timeSpent: number; // in seconds
}

// Game state
export interface GameState {
  gameType: GameType | null;
  difficulty: DifficultyLevel;
  questionMode: QuestionMode;
  numberFormat: NumberFormat;
  timerEnabled: boolean;
  questionsCount: number;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  score: number;
  isGameStarted: boolean;
  isGameFinished: boolean;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

// Custom range settings
export interface CustomRangeSettings {
  addition?: { min: number; max: number };
  subtraction?: { min: number; max: number };
  multiplication?: { min: number; max: number };
  division?: { min: number; max: number };
  readingNumbers?: { min: number; max: number };
  comparingNumbers?: { min: number; max: number };
  fractions?: {
    denominatorMin: number;
    denominatorMax: number;
    numeratorMin: number;
    numeratorMax: number;
  };
}

// Game settings
export interface GameSettings {
  difficulty: DifficultyLevel;
  questionMode: QuestionMode;
  numberFormat: NumberFormat;
  timerEnabled: boolean;
  questionsCount: number;
  customRanges?: CustomRangeSettings;
}

// Game session result (for localStorage)
export interface GameSession {
  id: string;
  gameType: GameType;
  difficulty: DifficultyLevel;
  questionMode: QuestionMode;
  numberFormat: NumberFormat;
  timerEnabled: boolean;
  questionsCount: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  totalScore: number;
  totalTime: number;
  date: string;
  answers: Answer[];
}

// Props types
export interface GameComponentProps {
  question: Question;
  onAnswer: (answer: string | number) => void;
  onSkip: () => void;
  questionMode: QuestionMode;
  numberFormat: NumberFormat;
  showFeedback: boolean;
  isCorrect: boolean | null;
  correctAnswer?: string | number;
}

export interface OptionButtonProps {
  option: string | number;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  disabled?: boolean;
  numberFormat: NumberFormat;
}

export interface TimerProps {
  timeLimit: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
}

export interface ScoreDisplayProps {
  score: number;
}

export interface ResultsScreenProps {
  session: GameSession;
  onPlayAgain: () => void;
  onHome: () => void;
}

export interface PizzaProps {
  denominator: number;
  filledSlices: number;
  onSliceClick: (index: number) => void;
  showFeedback: boolean;
  correctCount: number;
}

// Context types
export interface GameContextType {
  state: GameState;
  settings: GameSettings;
  startGame: (gameType: GameType, settings: GameSettings) => void;
  submitAnswer: (answer: string | number) => void;
  skipQuestion: () => void;
  nextQuestion: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

// Styles type (from JSON)
export interface Styles {
  containers: Record<string, string>;
  buttons: Record<string, string>;
  inputs: Record<string, string>;
  text: Record<string, string>;
  progress: Record<string, string>;
  timer: Record<string, string>;
  score: Record<string, string>;
  results: Record<string, string>;
  pizza: Record<string, string>;
  comparison: Record<string, string>;
  settings: Record<string, string>;
  gameSelector: Record<string, string>;
  header: Record<string, string>;
  modal: Record<string, string>;
  animations: Record<string, string>;
}

// Re-export config types
export type { DifficultyLevel, GameType, QuestionMode, NumberFormat };

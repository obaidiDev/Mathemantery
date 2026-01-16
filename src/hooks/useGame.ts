import { useState, useCallback, useMemo } from 'react';
import type {
  GameState,
  GameSettings,
  Question,
  Answer,
  ArithmeticQuestion,
  ReadingNumberQuestion,
  ComparisonQuestion,
  FractionQuestion,
  GameType,
  DifficultyLevel,
  CustomRangeSettings,
} from '../types';
import type { DifficultyRanges } from '../config/gameConfig';
import { gameConfig } from '../config/gameConfig';
import {
  generateAdditionNumbers,
  generateSubtractionNumbers,
  generateMultiplicationNumbers,
  generateDivisionNumbers,
  generateComparisonNumbers,
  getComparisonResult,
  generateOptions,
  generateFraction,
  randomInt,
} from '../utils/numberUtils';
import { getAllValidForms } from '../utils/arabicNumbers';
import { isNumberWrittenCorrectly } from '../utils/similarity';
import { saveSession, generateSessionId } from '../utils/storage';

const initialGameState: GameState = {
  gameType: null,
  difficulty: 'low',
  questionMode: 'multipleChoice',
  numberFormat: 'arabic',
  timerEnabled: false,
  questionsCount: gameConfig.defaultQuestionsCount,
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  score: 0,
  isGameStarted: false,
  isGameFinished: false,
  showFeedback: false,
  lastAnswerCorrect: null,
};

const defaultSettings: GameSettings = {
  difficulty: 'low',
  questionMode: 'multipleChoice',
  numberFormat: 'arabic',
  timerEnabled: false,
  questionsCount: gameConfig.defaultQuestionsCount,
};

function getRange(
  gameType: GameType,
  difficulty: DifficultyLevel,
  customRanges?: CustomRangeSettings
): { min: number; max: number } {
  if (difficulty === 'custom' && customRanges) {
    const customRange = customRanges[gameType as keyof CustomRangeSettings];
    if (customRange && 'min' in customRange) {
      return customRange;
    }
  }

  const ranges = gameConfig.ranges[gameType as keyof typeof gameConfig.ranges];
  if (ranges && difficulty !== 'custom') {
    return (ranges as DifficultyRanges)[difficulty];
  }

  // Default range
  return { min: 0, max: 10 };
}

function generateArithmeticQuestion(
  id: number,
  type: 'addition' | 'subtraction' | 'multiplication' | 'division',
  difficulty: DifficultyLevel,
  includeOptions: boolean,
  customRanges?: CustomRangeSettings
): ArithmeticQuestion {
  const range = getRange(type, difficulty, customRanges);

  let num1: number, num2: number, operator: '+' | '-' | '×' | '÷', correctAnswer: number;

  switch (type) {
    case 'addition':
      [num1, num2] = generateAdditionNumbers(range.min, range.max);
      operator = '+';
      correctAnswer = num1 + num2;
      break;
    case 'subtraction':
      [num1, num2] = generateSubtractionNumbers(range.min, range.max);
      operator = '-';
      correctAnswer = num1 - num2;
      break;
    case 'multiplication':
      [num1, num2] = generateMultiplicationNumbers(range.min, range.max);
      operator = '×';
      correctAnswer = num1 * num2;
      break;
    case 'division':
      [num1, num2] = generateDivisionNumbers(range.min, range.max);
      operator = '÷';
      correctAnswer = num1 / num2;
      break;
  }

  return {
    id,
    type,
    num1,
    num2,
    operator,
    correctAnswer,
    options: includeOptions ? generateOptions(correctAnswer) : undefined,
  };
}

function generateMixedArithmeticQuestion(
  id: number,
  types: ('addition' | 'subtraction' | 'multiplication' | 'division')[],
  difficulty: DifficultyLevel,
  includeOptions: boolean,
  customRanges?: CustomRangeSettings
): ArithmeticQuestion {
  const type = types[Math.floor(Math.random() * types.length)];
  return generateArithmeticQuestion(id, type, difficulty, includeOptions, customRanges);
}

function generateReadingQuestion(
  id: number,
  difficulty: DifficultyLevel,
  customRanges?: CustomRangeSettings
): ReadingNumberQuestion {
  const range = getRange('readingNumbers', difficulty, customRanges);
  const number = randomInt(range.min, range.max);

  return {
    id,
    type: 'readingNumbers',
    number,
    correctAnswers: getAllValidForms(number),
  };
}

function generateComparisonQuestion(
  id: number,
  difficulty: DifficultyLevel,
  customRanges?: CustomRangeSettings
): ComparisonQuestion {
  const range = getRange('comparingNumbers', difficulty, customRanges);
  const [num1, num2] = generateComparisonNumbers(range.min, range.max);

  return {
    id,
    type: 'comparingNumbers',
    num1,
    num2,
    correctAnswer: getComparisonResult(num1, num2),
  };
}

function generateFractionQuestion(
  id: number,
  difficulty: DifficultyLevel,
  customRanges?: CustomRangeSettings
): FractionQuestion {
  let denominatorMin = gameConfig.ranges.fractions.default.denominatorMin;
  let denominatorMax = gameConfig.ranges.fractions.default.denominatorMax;
  let numeratorMin = gameConfig.ranges.fractions.default.numeratorMin;
  let numeratorMax = gameConfig.ranges.fractions.default.numeratorMax;

  if (difficulty === 'custom' && customRanges?.fractions) {
    denominatorMin = customRanges.fractions.denominatorMin;
    denominatorMax = customRanges.fractions.denominatorMax;
    numeratorMin = customRanges.fractions.numeratorMin;
    numeratorMax = customRanges.fractions.numeratorMax;
  }

  const { numerator, denominator } = generateFraction(
    denominatorMin,
    denominatorMax,
    numeratorMin,
    numeratorMax
  );

  return {
    id,
    type: 'fractions',
    numerator,
    denominator,
  };
}

function generateQuestions(
  gameType: GameType,
  count: number,
  difficulty: DifficultyLevel,
  questionMode: 'multipleChoice' | 'written',
  customRanges?: CustomRangeSettings
): Question[] {
  const questions: Question[] = [];
  const includeOptions = questionMode === 'multipleChoice';

  for (let i = 0; i < count; i++) {
    let question: Question;

    switch (gameType) {
      case 'addition':
        question = generateArithmeticQuestion(i, 'addition', difficulty, includeOptions, customRanges);
        break;
      case 'subtraction':
        question = generateArithmeticQuestion(i, 'subtraction', difficulty, includeOptions, customRanges);
        break;
      case 'additionSubtraction':
        question = generateMixedArithmeticQuestion(
          i,
          ['addition', 'subtraction'],
          difficulty,
          includeOptions,
          customRanges
        );
        break;
      case 'multiplication':
        question = generateArithmeticQuestion(i, 'multiplication', difficulty, includeOptions, customRanges);
        break;
      case 'division':
        question = generateArithmeticQuestion(i, 'division', difficulty, includeOptions, customRanges);
        break;
      case 'multiplicationDivision':
        question = generateMixedArithmeticQuestion(
          i,
          ['multiplication', 'division'],
          difficulty,
          includeOptions,
          customRanges
        );
        break;
      case 'arithmetic':
        question = generateMixedArithmeticQuestion(
          i,
          ['addition', 'subtraction', 'multiplication', 'division'],
          difficulty,
          includeOptions,
          customRanges
        );
        break;
      case 'readingNumbers':
        question = generateReadingQuestion(i, difficulty, customRanges);
        break;
      case 'comparingNumbers':
        question = generateComparisonQuestion(i, difficulty, customRanges);
        break;
      case 'fractions':
        question = generateFractionQuestion(i, difficulty, customRanges);
        break;
      default:
        question = generateArithmeticQuestion(i, 'addition', difficulty, includeOptions, customRanges);
    }

    questions.push(question);
  }

  return questions;
}

function checkAnswer(question: Question, userAnswer: string | number): boolean {
  switch (question.type) {
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
    case 'additionSubtraction':
    case 'multiplicationDivision':
    case 'arithmetic': {
      const arithmeticQ = question as ArithmeticQuestion;
      const numAnswer = typeof userAnswer === 'string' ? parseFloat(userAnswer) : userAnswer;
      return numAnswer === arithmeticQ.correctAnswer;
    }
    case 'readingNumbers': {
      const readingQ = question as ReadingNumberQuestion;
      return isNumberWrittenCorrectly(String(userAnswer), readingQ.number, 0.7);
    }
    case 'comparingNumbers': {
      const comparisonQ = question as ComparisonQuestion;
      return String(userAnswer) === comparisonQ.correctAnswer;
    }
    case 'fractions': {
      const fractionQ = question as FractionQuestion;
      const numAnswer = typeof userAnswer === 'string' ? parseInt(userAnswer) : userAnswer;
      return numAnswer === fractionQ.numerator;
    }
    default:
      return false;
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(initialGameState);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const currentQuestion = useMemo(() => {
    if (state.questions.length === 0) return null;
    return state.questions[state.currentQuestionIndex] || null;
  }, [state.questions, state.currentQuestionIndex]);

  const startGame = useCallback((gameType: GameType, newSettings: GameSettings) => {
    const questions = generateQuestions(
      gameType,
      newSettings.questionsCount,
      newSettings.difficulty,
      newSettings.questionMode,
      newSettings.customRanges
    );

    setState({
      ...initialGameState,
      gameType,
      difficulty: newSettings.difficulty,
      questionMode: newSettings.questionMode,
      numberFormat: newSettings.numberFormat,
      timerEnabled: newSettings.timerEnabled,
      questionsCount: newSettings.questionsCount,
      questions,
      isGameStarted: true,
    });
    setSettings(newSettings);
    setQuestionStartTime(Date.now());
  }, []);

  const submitAnswer = useCallback((answer: string | number) => {
    if (!currentQuestion || state.showFeedback) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = checkAnswer(currentQuestion, answer);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      isSkipped: false,
      timeSpent,
    };

    // Calculate score
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = gameConfig.scoring.correctAnswer;

      // Check for time bonus
      if (state.timerEnabled) {
        const timeLimit = gameConfig.timers[state.gameType!]?.[state.difficulty] || 30;
        if (timeSpent < timeLimit * gameConfig.scoring.bonusTimeThreshold) {
          pointsEarned = Math.round(pointsEarned * gameConfig.scoring.bonusTimeMultiplier);
        }
      }
    } else {
      pointsEarned = gameConfig.scoring.wrongAnswer;
    }

    setState((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
      score: prev.score + pointsEarned,
      showFeedback: true,
      lastAnswerCorrect: isCorrect,
    }));
  }, [currentQuestion, questionStartTime, state.showFeedback, state.timerEnabled, state.gameType, state.difficulty]);

  const skipQuestion = useCallback(() => {
    if (!currentQuestion || state.showFeedback) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: null,
      isCorrect: false,
      isSkipped: true,
      timeSpent,
    };

    setState((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
      score: prev.score + gameConfig.scoring.skipQuestion,
      showFeedback: true,
      lastAnswerCorrect: null,
    }));
  }, [currentQuestion, questionStartTime, state.showFeedback]);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex >= prev.questions.length) {
        // Game finished - save session
        const session = {
          id: generateSessionId(),
          gameType: prev.gameType!,
          difficulty: prev.difficulty,
          questionMode: prev.questionMode,
          numberFormat: prev.numberFormat,
          timerEnabled: prev.timerEnabled,
          questionsCount: prev.questionsCount,
          correctAnswers: prev.answers.filter((a) => a.isCorrect).length,
          wrongAnswers: prev.answers.filter((a) => !a.isCorrect && !a.isSkipped).length,
          skippedQuestions: prev.answers.filter((a) => a.isSkipped).length,
          totalScore: prev.score,
          totalTime: prev.answers.reduce((sum, a) => sum + a.timeSpent, 0),
          date: new Date().toISOString(),
          answers: prev.answers,
        };

        saveSession(session);

        return {
          ...prev,
          isGameFinished: true,
          showFeedback: false,
          lastAnswerCorrect: null,
        };
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        showFeedback: false,
        lastAnswerCorrect: null,
      };
    });

    setQuestionStartTime(Date.now());
  }, []);

  const endGame = useCallback(() => {
    setState((prev) => {
      // Save session even if game is ended early
      if (prev.answers.length > 0) {
        const session = {
          id: generateSessionId(),
          gameType: prev.gameType!,
          difficulty: prev.difficulty,
          questionMode: prev.questionMode,
          numberFormat: prev.numberFormat,
          timerEnabled: prev.timerEnabled,
          questionsCount: prev.questionsCount,
          correctAnswers: prev.answers.filter((a) => a.isCorrect).length,
          wrongAnswers: prev.answers.filter((a) => !a.isCorrect && !a.isSkipped).length,
          skippedQuestions: prev.answers.filter((a) => a.isSkipped).length,
          totalScore: prev.score,
          totalTime: prev.answers.reduce((sum, a) => sum + a.timeSpent, 0),
          date: new Date().toISOString(),
          answers: prev.answers,
        };

        saveSession(session);
      }

      return {
        ...prev,
        isGameFinished: true,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialGameState);
    setSettings(defaultSettings);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    state,
    settings,
    currentQuestion,
    startGame,
    submitAnswer,
    skipQuestion,
    nextQuestion,
    endGame,
    resetGame,
    updateSettings,
  };
}

export default useGame;

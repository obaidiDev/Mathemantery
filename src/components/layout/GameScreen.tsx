import { useCallback, useMemo } from 'react';
import type {
  Question,
  ArithmeticQuestion,
  ReadingNumberQuestion,
  ComparisonQuestion,
  FractionQuestion,
  NumberFormat,
  QuestionMode,
  GameType,
  DifficultyLevel,
} from '../../types';
import { gameConfig } from '../../config/gameConfig';
import { formatNumber } from '../../utils/numberUtils';
import { Timer, ScoreDisplay, ProgressBar, QuestionFeedback } from '../common';
import { ArithmeticGame, ReadingNumbersGame, ComparingNumbersGame } from '../games';
import { FractionsGame } from '../pizza';
import { Header } from './Header';
import styles from '../../config/styles.json';

interface GameScreenProps {
  gameType: GameType;
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  numberFormat: NumberFormat;
  questionMode: QuestionMode;
  difficulty: DifficultyLevel;
  timerEnabled: boolean;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
  onAnswer: (answer: string | number) => void;
  onSkip: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function GameScreen({
  gameType,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  score,
  numberFormat,
  questionMode,
  difficulty,
  timerEnabled,
  showFeedback,
  lastAnswerCorrect,
  onAnswer,
  onSkip,
  onNext,
  onBack,
}: GameScreenProps) {
  // Get time limit for current game and difficulty
  const timeLimit = useMemo(() => {
    const timers = gameConfig.timers[gameType];
    return timers?.[difficulty] || 30;
  }, [gameType, difficulty]);

  const handleTimeUp = useCallback(() => {
    onSkip();
  }, [onSkip]);

  const getCorrectAnswer = (): string | number | undefined => {
    switch (currentQuestion.type) {
      case 'addition':
      case 'subtraction':
      case 'multiplication':
      case 'division':
      case 'additionSubtraction':
      case 'multiplicationDivision':
      case 'arithmetic':
        return formatNumber((currentQuestion as ArithmeticQuestion).correctAnswer, numberFormat);
      case 'readingNumbers':
        return (currentQuestion as ReadingNumberQuestion).correctAnswers[0];
      case 'comparingNumbers':
        return (currentQuestion as ComparisonQuestion).correctAnswer;
      case 'fractions':
        return formatNumber((currentQuestion as FractionQuestion).numerator, numberFormat);
      default:
        return undefined;
    }
  };

  const renderGame = () => {
    const disabled = showFeedback;

    switch (currentQuestion.type) {
      case 'addition':
      case 'subtraction':
      case 'multiplication':
      case 'division':
      case 'additionSubtraction':
      case 'multiplicationDivision':
      case 'arithmetic':
        return (
          <ArithmeticGame
            question={currentQuestion as ArithmeticQuestion}
            onAnswer={onAnswer}
            onSkip={onSkip}
            questionMode={questionMode}
            numberFormat={numberFormat}
            disabled={disabled}
          />
        );
      case 'readingNumbers':
        return (
          <ReadingNumbersGame
            question={currentQuestion as ReadingNumberQuestion}
            onAnswer={onAnswer}
            onSkip={onSkip}
            numberFormat={numberFormat}
            disabled={disabled}
          />
        );
      case 'comparingNumbers':
        return (
          <ComparingNumbersGame
            question={currentQuestion as ComparisonQuestion}
            onAnswer={onAnswer}
            onSkip={onSkip}
            questionMode={questionMode}
            numberFormat={numberFormat}
            disabled={disabled}
          />
        );
      case 'fractions':
        return (
          <FractionsGame
            question={currentQuestion as FractionQuestion}
            onAnswer={onAnswer}
            onSkip={onSkip}
            numberFormat={numberFormat}
            disabled={disabled}
            showFeedback={showFeedback}
          />
        );
      default:
        return <div>نوع اللعبة غير مدعوم</div>;
    }
  };

  return (
    <div className="w-[90%] max-w-2xl">
      <Header
        showBackButton
        onBack={onBack}
        title={gameConfig.labels.gameNames[gameType]}
      />

      {/* Top bar with score and timer */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <ScoreDisplay score={score} numberFormat={numberFormat} />
        {timerEnabled && (
          <Timer
            timeLimit={timeLimit}
            isRunning={!showFeedback}
            onTimeUp={handleTimeUp}
            numberFormat={numberFormat}
          />
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={totalQuestions}
        numberFormat={numberFormat}
      />

      {/* Game content */}
      <div className={`${styles.containers.card} mt-8 sm:mt-10 py-8 sm:py-10 md:py-12`}>
        <div className={styles.containers.gameArea}>{renderGame()}</div>
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <QuestionFeedback
          isCorrect={lastAnswerCorrect}
          correctAnswer={getCorrectAnswer()}
          onContinue={onNext}
        />
      )}
    </div>
  );
}

export default GameScreen;

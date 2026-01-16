import { useState, useEffect } from 'react';
import type { ComparisonQuestion, NumberFormat, QuestionMode } from '../../types';
import { formatNumber } from '../../utils/numberUtils';
import { gameConfig } from '../../config/gameConfig';
import { Button } from '../common';
import styles from '../../config/styles.json';

interface ComparingNumbersGameProps {
  question: ComparisonQuestion;
  onAnswer: (answer: '>' | '<' | '=') => void;
  onSkip: () => void;
  questionMode: QuestionMode;
  numberFormat: NumberFormat;
  disabled?: boolean;
}

export function ComparingNumbersGame({
  question,
  onAnswer,
  onSkip,
  numberFormat,
  disabled = false,
}: ComparingNumbersGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<'>' | '<' | '=' | null>(null);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.id]);

  const handleSelect = (answer: '>' | '<' | '=') => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const comparisonOptions: { symbol: '>' | '<' | '='; label: string }[] = [
    { symbol: '>', label: gameConfig.labels.comparison.greaterThan },
    { symbol: '<', label: gameConfig.labels.comparison.lessThan },
    { symbol: '=', label: gameConfig.labels.comparison.equalTo },
  ];

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg px-2 sm:px-0">
      {/* Question text */}
      <p className={styles.text.question}>
        {gameConfig.labels.questions.comparingNumbers}
      </p>

      {/* Numbers display */}
      <div className={styles.comparison.container}>
        {/* First number */}
        <div className={styles.comparison.number}>
          {formatNumber(question.num1, numberFormat)}
        </div>

        {/* Comparison operator placeholder */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {comparisonOptions.map(({ symbol }) => (
            <button
              key={symbol}
              onClick={() => handleSelect(symbol)}
              disabled={disabled}
              className={`${styles.comparison.operatorBtn} ${
                selectedAnswer === symbol
                  ? 'bg-indigo-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-indigo-100 border-2 border-gray-200'
              }`}
            >
              <span className="text-lg sm:text-2xl">{symbol}</span>
            </button>
          ))}
        </div>

        {/* Second number */}
        <div className={styles.comparison.number}>
          {formatNumber(question.num2, numberFormat)}
        </div>
      </div>

      {/* Labels for comparison options */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
        {comparisonOptions.map(({ symbol, label }) => (
          <div key={symbol} className="flex items-center gap-1">
            <span className="font-bold">{symbol}</span>
            <span>= {label}</span>
          </div>
        ))}
      </div>

      {/* Skip button */}
      <Button variant="skip" onClick={onSkip} disabled={disabled}>
        {gameConfig.labels.buttons.skip}
      </Button>
    </div>
  );
}

export default ComparingNumbersGame;

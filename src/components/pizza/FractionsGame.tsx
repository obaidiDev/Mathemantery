import { useState, useEffect } from 'react';
import type { FractionQuestion, NumberFormat } from '../../types';
import { formatNumber } from '../../utils/numberUtils';
import { gameConfig } from '../../config/gameConfig';
import { Button } from '../common';
import { PizzaVisual } from './PizzaVisual';
import styles from '../../config/styles.json';

interface FractionsGameProps {
  question: FractionQuestion;
  onAnswer: (filledCount: number) => void;
  onSkip: () => void;
  numberFormat: NumberFormat;
  disabled?: boolean;
  showFeedback?: boolean;
}

export function FractionsGame({
  question,
  onAnswer,
  onSkip,
  numberFormat,
  disabled = false,
  showFeedback = false,
}: FractionsGameProps) {
  const [filledSlices, setFilledSlices] = useState<number[]>([]);

  // Reset state when question changes
  useEffect(() => {
    setFilledSlices([]);
  }, [question.id]);

  const handleSliceClick = (index: number) => {
    if (disabled) return;

    setFilledSlices((prev) => {
      if (prev.includes(index)) {
        // Remove slice
        return prev.filter((i) => i !== index);
      } else {
        // Add slice
        return [...prev, index];
      }
    });
  };

  const handleSubmit = () => {
    if (disabled) return;
    onAnswer(filledSlices.length);
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg px-2 sm:px-0">
      {/* Question text */}
      <p className={styles.text.question}>
        {gameConfig.labels.questions.fractions}
      </p>

      {/* Fraction display */}
      <div className="flex flex-col items-center gap-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-bold text-indigo-600">
            {formatNumber(question.numerator, numberFormat)}
          </span>
          <div className="w-12 sm:w-16 h-1 bg-indigo-600 my-1.5 sm:my-2 rounded-full" />
          <span className="text-4xl sm:text-5xl font-bold text-indigo-600">
            {formatNumber(question.denominator, numberFormat)}
          </span>
        </div>
      </div>

      {/* Pizza visual */}
      <PizzaVisual
        denominator={question.denominator}
        filledSlices={filledSlices}
        onSliceClick={handleSliceClick}
        disabled={disabled}
        showCorrectAnswer={showFeedback}
        correctNumerator={question.numerator}
      />

      {/* Counter */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg">
        <span className="text-gray-600">الشرائح الملونة:</span>
        <span className="font-bold text-indigo-600">
          {formatNumber(filledSlices.length, numberFormat)}
        </span>
        <span className="text-gray-600">من</span>
        <span className="font-bold text-indigo-600">
          {formatNumber(question.denominator, numberFormat)}
        </span>
      </div>

      {/* Submit button */}
      <Button onClick={handleSubmit} disabled={disabled}>
        {gameConfig.labels.buttons.submit}
      </Button>

      {/* Skip button */}
      <Button variant="skip" onClick={onSkip} disabled={disabled}>
        {gameConfig.labels.buttons.skip}
      </Button>
    </div>
  );
}

export default FractionsGame;

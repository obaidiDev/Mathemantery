import { useState, useEffect } from 'react';
import type { ReadingNumberQuestion, NumberFormat } from '../../types';
import { formatNumber } from '../../utils/numberUtils';
import { gameConfig } from '../../config/gameConfig';
import { TextInput, Button } from '../common';
import styles from '../../config/styles.json';

interface ReadingNumbersGameProps {
  question: ReadingNumberQuestion;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  numberFormat: NumberFormat;
  disabled?: boolean;
}

export function ReadingNumbersGame({
  question,
  onAnswer,
  onSkip,
  numberFormat,
  disabled = false,
}: ReadingNumbersGameProps) {
  const [writtenAnswer, setWrittenAnswer] = useState('');

  // Reset state when question changes
  useEffect(() => {
    setWrittenAnswer('');
  }, [question.id]);

  const handleSubmit = () => {
    if (disabled || !writtenAnswer.trim()) return;
    onAnswer(writtenAnswer.trim());
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg px-2 sm:px-0">
      {/* Question text */}
      <p className={styles.text.question}>
        {gameConfig.labels.questions.readingNumbers}
      </p>

      {/* Number display */}
      <div className="flex items-center justify-center py-4 sm:py-8">
        <span className="text-5xl sm:text-6xl md:text-8xl font-bold text-indigo-600 animate-bounce-in">
          {formatNumber(question.number, numberFormat)}
        </span>
      </div>

      {/* Hint */}
      <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
        اكتب الرقم بالحروف العربية (مثال: واحد وعشرون)
      </p>

      {/* Answer input */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        <TextInput
          value={writtenAnswer}
          onChange={setWrittenAnswer}
          onSubmit={handleSubmit}
          placeholder="اكتب الرقم بالحروف هنا"
          disabled={disabled}
          autoFocus
        />
        <Button onClick={handleSubmit} disabled={disabled || !writtenAnswer.trim()}>
          {gameConfig.labels.buttons.submit}
        </Button>
      </div>

      {/* Skip button */}
      <Button variant="skip" onClick={onSkip} disabled={disabled}>
        {gameConfig.labels.buttons.skip}
      </Button>
    </div>
  );
}

export default ReadingNumbersGame;

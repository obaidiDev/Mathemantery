import { useState, useEffect } from 'react';
import type { ArithmeticQuestion, NumberFormat, QuestionMode } from '../../types';
import { formatNumber, parseUserInput } from '../../utils/numberUtils';
import { gameConfig } from '../../config/gameConfig';
import { OptionButton, TextInput, Button } from '../common';
import styles from '../../config/styles.json';

interface ArithmeticGameProps {
  question: ArithmeticQuestion;
  onAnswer: (answer: number) => void;
  onSkip: () => void;
  questionMode: QuestionMode;
  numberFormat: NumberFormat;
  disabled?: boolean;
}

export function ArithmeticGame({
  question,
  onAnswer,
  onSkip,
  questionMode,
  numberFormat,
  disabled = false,
}: ArithmeticGameProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setWrittenAnswer('');
  }, [question.id]);

  const handleOptionClick = (option: number) => {
    if (disabled) return;
    setSelectedOption(option);
    onAnswer(option);
  };

  const handleWrittenSubmit = () => {
    if (disabled || !writtenAnswer.trim()) return;
    const numAnswer = parseUserInput(writtenAnswer);
    if (!isNaN(numAnswer)) {
      onAnswer(numAnswer);
    }
  };

  const getQuestionText = () => {
    const operationLabels: Record<string, string> = {
      '+': gameConfig.labels.questions.addition,
      '-': gameConfig.labels.questions.subtraction,
      '×': gameConfig.labels.questions.multiplication,
      '÷': gameConfig.labels.questions.division,
    };

    return operationLabels[question.operator] || 'ما ناتج';
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg px-2 sm:px-0">
      {/* Question text */}
      <p className={styles.text.question}>{getQuestionText()}</p>

      {/* Numbers and operator display */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-2 sm:py-4 flex-wrap">
        <span className={styles.text.number}>
          {formatNumber(question.num1, numberFormat)}
        </span>
        <span className={styles.text.operator}>{question.operator}</span>
        <span className={styles.text.number}>
          {formatNumber(question.num2, numberFormat)}
        </span>
        <span className={styles.text.operator}>=</span>
        <span className={styles.text.operator}>?</span>
      </div>

      {/* Answer input */}
      {questionMode === 'multipleChoice' && question.options ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
          {question.options.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              isSelected={selectedOption === option}
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
              numberFormat={numberFormat}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          <TextInput
            value={writtenAnswer}
            onChange={setWrittenAnswer}
            onSubmit={handleWrittenSubmit}
            placeholder="اكتب الإجابة هنا"
            disabled={disabled}
            autoFocus
          />
          <Button onClick={handleWrittenSubmit} disabled={disabled || !writtenAnswer.trim()}>
            {gameConfig.labels.buttons.submit}
          </Button>
        </div>
      )}

      {/* Skip button */}
      <Button variant="skip" onClick={onSkip} disabled={disabled}>
        {gameConfig.labels.buttons.skip}
      </Button>
    </div>
  );
}

export default ArithmeticGame;

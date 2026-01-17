import { useState } from 'react';
import type {
  GameType,
  GameSettings as GameSettingsType,
  DifficultyLevel,
  QuestionMode,
  NumberFormat,
  CustomRangeSettings,
} from '../../types';
import { gameConfig } from '../../config/gameConfig';
import { Button, Toggle } from '../common';
import styles from '../../config/styles.json';

interface GameSettingsProps {
  gameType: GameType;
  onStart: (settings: GameSettingsType) => void;
  onBack: () => void;
}

export function GameSettings({ gameType, onStart, onBack }: GameSettingsProps) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('low');
  const [questionMode, setQuestionMode] = useState<QuestionMode>('multipleChoice');
  const [numberFormat, setNumberFormat] = useState<NumberFormat>('arabic');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [questionsCount, setQuestionsCount] = useState(gameConfig.defaultQuestionsCount);
  const [customRanges, setCustomRanges] = useState<CustomRangeSettings>({});

  const gameName = gameConfig.labels.gameNames[gameType];

  // Check if the game supports multiple choice
  const supportsMultipleChoice = !['readingNumbers'].includes(gameType);

  // Get appropriate difficulties based on game type
  const difficulties: DifficultyLevel[] = ['low', 'medium', 'high', 'custom'];

  const handleStart = () => {
    onStart({
      difficulty,
      questionMode: supportsMultipleChoice ? questionMode : 'written',
      numberFormat,
      timerEnabled,
      questionsCount,
      customRanges: difficulty === 'custom' ? customRanges : undefined,
    });
  };

  const handleCustomRangeChange = (
    field: keyof CustomRangeSettings,
    key: string,
    value: number
  ) => {
    setCustomRanges((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as object),
        [key]: value,
      },
    }));
  };

  // Render custom range inputs based on game type
  const renderCustomRangeInputs = () => {
    if (difficulty !== 'custom') return null;

    const rangeInputs: Record<string, { label: string; fields: string[] }[]> = {
      addition: [{ label: gameConfig.labels.customRange.additionRange, fields: ['min', 'max'] }],
      subtraction: [{ label: gameConfig.labels.customRange.subtractionRange, fields: ['min', 'max'] }],
      additionSubtraction: [
        { label: gameConfig.labels.customRange.additionRange, fields: ['min', 'max'] },
      ],
      multiplication: [{ label: gameConfig.labels.customRange.multiplicationRange, fields: ['min', 'max'] }],
      division: [{ label: gameConfig.labels.customRange.divisionRange, fields: ['min', 'max'] }],
      multiplicationDivision: [
        { label: gameConfig.labels.customRange.multiplicationRange, fields: ['min', 'max'] },
      ],
      arithmetic: [
        { label: gameConfig.labels.customRange.additionRange, fields: ['min', 'max'] },
      ],
      readingNumbers: [{ label: 'نطاق الأرقام', fields: ['min', 'max'] }],
      comparingNumbers: [{ label: 'نطاق الأرقام', fields: ['min', 'max'] }],
      fractions: [
        { label: gameConfig.labels.customRange.denominatorRange, fields: ['denominatorMin', 'denominatorMax'] },
        { label: gameConfig.labels.customRange.numeratorRange, fields: ['numeratorMin', 'numeratorMax'] },
      ],
    };

    const inputs = rangeInputs[gameType] || [];
    const fieldKey = gameType === 'fractions' ? 'fractions' : gameType;

    return (
      <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-medium text-gray-700">إعدادات النطاق المخصص</h4>
        {inputs.map((input, idx) => (
          <div key={idx} className="space-y-2">
            <label className="text-sm text-gray-600">{input.label}</label>
            <div className="flex gap-4">
              {input.fields.map((field) => (
                <div key={field} className="flex-1">
                  <label className="text-xs text-gray-500">
                    {field.includes('min') || field.includes('Min')
                      ? gameConfig.labels.customRange.min
                      : gameConfig.labels.customRange.max}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={
                      (customRanges[fieldKey as keyof CustomRangeSettings] as Record<string, number>)?.[field] || 0
                    }
                    onChange={(e) =>
                      handleCustomRangeChange(
                        fieldKey as keyof CustomRangeSettings,
                        field,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className={styles.inputs.number}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[90%] max-w-sm">
      <div className={`${styles.containers.card} py-8 sm:py-10 md:py-12 px-6 sm:px-8`}>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-700 mb-6 sm:mb-8">
          {gameName}
        </h2>

        <div className="space-y-6 sm:space-y-8">
          {/* Difficulty */}
          <div className={styles.settings.container}>
            <label className={styles.settings.label}>مستوى الصعوبة</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base ${
                    difficulty === d
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {gameConfig.labels.difficulties[d]}
                </button>
              ))}
            </div>
            {renderCustomRangeInputs()}
          </div>

          {/* Question Mode */}
          {supportsMultipleChoice && (
            <div className={styles.settings.container}>
              <label className={styles.settings.label}>نوع الأسئلة</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => setQuestionMode('multipleChoice')}
                  className={`px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base ${
                    questionMode === 'multipleChoice'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {gameConfig.labels.modes.multipleChoice}
                </button>
                <button
                  onClick={() => setQuestionMode('written')}
                  className={`px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base ${
                    questionMode === 'written'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {gameConfig.labels.modes.written}
                </button>
              </div>
            </div>
          )}

          {/* Number Format */}
          <div className={styles.settings.container}>
            <label className={styles.settings.label}>شكل الأرقام</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setNumberFormat('arabic')}
                className={`px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base ${
                  numberFormat === 'arabic'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {gameConfig.labels.numberFormats.arabic} (١٢٣)
              </button>
              <button
                onClick={() => setNumberFormat('english')}
                className={`px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base ${
                  numberFormat === 'english'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {gameConfig.labels.numberFormats.english} (123)
              </button>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between py-3 sm:py-4 px-4 bg-gray-50 rounded-xl">
            <label className={styles.settings.label}>
              {gameConfig.labels.timer.enabled}
            </label>
            <Toggle enabled={timerEnabled} onChange={setTimerEnabled} />
          </div>

          {/* Questions Count */}
          <div className={styles.settings.container}>
            <label className={styles.settings.label}>
              {gameConfig.labels.questionsCount.label}
            </label>
            <div className="flex items-center gap-3 sm:gap-4 py-2">
              <input
                type="range"
                min={5}
                max={30}
                value={questionsCount}
                onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                className="flex-1 h-3 bg-gray-200 rounded-lg appearance cursor-pointer accent-indigo-500"
              />
              <span className="text-lg sm:text-xl font-bold text-indigo-600 min-w-[3rem] sm:min-w-[3.5rem] text-center">
                {questionsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-8 sm:mt-10">
          <Button onClick={handleStart}>{gameConfig.labels.buttons.start}</Button>
          <Button variant="secondary" onClick={onBack}>
            {gameConfig.labels.buttons.back}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GameSettings;

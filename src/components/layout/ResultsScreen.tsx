import type { NumberFormat } from '../../types';
import { formatNumber } from '../../utils/numberUtils';
import { gameConfig } from '../../config/gameConfig';
import { Button } from '../common';
import styles from '../../config/styles.json';

interface ResultsScreenProps {
  session: {
    correctAnswers: number;
    wrongAnswers: number;
    skippedQuestions: number;
    totalScore: number;
    totalTime: number;
    questionsCount: number;
  };
  numberFormat: NumberFormat;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function ResultsScreen({
  session,
  numberFormat,
  onPlayAgain,
  onHome,
}: ResultsScreenProps) {
  const percentage = (session.correctAnswers / session.questionsCount) * 100;

  const getResultMessage = () => {
    if (percentage >= gameConfig.resultThresholds.excellent) {
      return gameConfig.labels.results.excellent;
    }
    if (percentage >= gameConfig.resultThresholds.good) {
      return gameConfig.labels.results.good;
    }
    if (percentage >= gameConfig.resultThresholds.average) {
      return gameConfig.labels.results.average;
    }
    return gameConfig.labels.results.needsPractice;
  };

  const getResultEmoji = () => {
    if (percentage >= gameConfig.resultThresholds.excellent) return '🏆';
    if (percentage >= gameConfig.resultThresholds.good) return '⭐';
    if (percentage >= gameConfig.resultThresholds.average) return '👍';
    return '💪';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins > 0) {
      return `${formatNumber(mins, numberFormat)} دقيقة و ${formatNumber(secs, numberFormat)} ثانية`;
    }
    return `${formatNumber(secs, numberFormat)} ثانية`;
  };

  const stats = [
    {
      label: gameConfig.labels.results.correct,
      value: session.correctAnswers,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: gameConfig.labels.results.wrong,
      value: session.wrongAnswers,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: gameConfig.labels.results.skipped,
      value: session.skippedQuestions,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <div className="w-[90%] max-w-md">
      <div className={`${styles.results.container} animate-slide-up`}>
        {/* Trophy/Result emoji */}
        <div className="text-6xl animate-bounce-in">{getResultEmoji()}</div>

        {/* Title */}
        <h2 className={styles.results.title}>{gameConfig.labels.results.title}</h2>

        {/* Result message */}
        <p className="text-xl font-semibold text-indigo-600">{getResultMessage()}</p>

        {/* Score circle */}
        <div className={styles.results.scoreCircle}>
          {formatNumber(session.totalScore, numberFormat)}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`${styles.results.statCard} ${stat.bgColor}`}>
              <span className={`${styles.results.statValue} ${stat.color}`}>
                {formatNumber(stat.value, numberFormat)}
              </span>
              <span className={styles.results.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Percentage bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>نسبة النجاح</span>
            <span className="font-bold text-indigo-600">
              {formatNumber(Math.round(percentage), numberFormat)}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Time */}
        <div className="text-gray-600">
          <span>{gameConfig.labels.results.time}: </span>
          <span className="font-semibold">{formatTime(session.totalTime)}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={onPlayAgain}>{gameConfig.labels.buttons.playAgain}</Button>
          <Button variant="secondary" onClick={onHome}>
            {gameConfig.labels.buttons.home}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;

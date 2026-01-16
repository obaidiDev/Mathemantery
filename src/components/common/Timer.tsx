import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { formatNumber } from '../../utils/numberUtils';
import type { NumberFormat } from '../../types';
import styles from '../../config/styles.json';

interface TimerProps {
  timeLimit: number;
  isRunning: boolean;
  onTimeUp: () => void;
  numberFormat: NumberFormat;
}

export function Timer({ timeLimit, isRunning, onTimeUp, numberFormat }: TimerProps) {
  const { timeRemaining, start, pause, reset } = useTimer({
    initialTime: timeLimit,
    onTimeUp,
    autoStart: false,
  });

  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      pause();
    }
  }, [isRunning, start, pause]);

  useEffect(() => {
    reset(timeLimit);
  }, [timeLimit, reset]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minsStr = formatNumber(mins, numberFormat).padStart(2, '0');
    const secsStr = formatNumber(secs, numberFormat).padStart(2, '0');
    return `${minsStr}:${secsStr}`;
  };

  // Determine color based on time remaining
  const getTimerColor = () => {
    const percentage = timeRemaining / timeLimit;
    if (percentage <= 0.25) return styles.timer.danger;
    if (percentage <= 0.5) return styles.timer.warning;
    return styles.timer.text;
  };

  return (
    <div className={styles.timer.container}>
      <svg
        className={`w-5 h-5 ${styles.timer.icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className={`text-lg ${getTimerColor()}`}>{formatTime(timeRemaining)}</span>
    </div>
  );
}

export default Timer;

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  autoStart?: boolean;
}

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isTimeUp: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  getElapsedTime: () => number;
}

export function useTimer({
  initialTime,
  onTimeUp,
  autoStart = false,
}: UseTimerProps): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef(0);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsTimeUp(true);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const start = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
    }
  }, [timeRemaining]);

  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current) {
      elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      startTimeRef.current = null;
    }
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback((newTime?: number) => {
    const time = newTime ?? initialTime;
    setTimeRemaining(time);
    setIsRunning(false);
    setIsTimeUp(false);
    startTimeRef.current = null;
    elapsedBeforePauseRef.current = 0;
  }, [initialTime]);

  const getElapsedTime = useCallback(() => {
    let elapsed = elapsedBeforePauseRef.current;
    if (isRunning && startTimeRef.current) {
      elapsed += (Date.now() - startTimeRef.current) / 1000;
    }
    return Math.round(elapsed);
  }, [isRunning]);

  return {
    timeRemaining,
    isRunning,
    isTimeUp,
    start,
    pause,
    reset,
    getElapsedTime,
  };
}

export default useTimer;

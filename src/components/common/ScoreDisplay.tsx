import { formatNumber } from '../../utils/numberUtils';
import type { NumberFormat } from '../../types';
import styles from '../../config/styles.json';

interface ScoreDisplayProps {
  score: number;
  numberFormat: NumberFormat;
}

export function ScoreDisplay({ score, numberFormat }: ScoreDisplayProps) {
  return (
    <div className={styles.score.container}>
      <svg
        className={`w-5 h-5 ${styles.score.icon}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className={`text-lg ${styles.score.text}`}>
        {formatNumber(score, numberFormat)}
      </span>
    </div>
  );
}

export default ScoreDisplay;

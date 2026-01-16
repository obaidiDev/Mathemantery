import { formatNumber } from '../../utils/numberUtils';
import type { NumberFormat } from '../../types';
import styles from '../../config/styles.json';

interface ProgressBarProps {
  current: number;
  total: number;
  numberFormat: NumberFormat;
}

export function ProgressBar({ current, total, numberFormat }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          السؤال {formatNumber(current, numberFormat)} من {formatNumber(total, numberFormat)}
        </span>
        <span className="text-sm font-medium text-indigo-600">
          {formatNumber(Math.round(percentage), numberFormat)}%
        </span>
      </div>
      <div className={styles.progress.container}>
        <div
          className={styles.progress.bar}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

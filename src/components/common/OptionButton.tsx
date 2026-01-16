import { formatNumber } from '../../utils/numberUtils';
import type { NumberFormat } from '../../types';
import styles from '../../config/styles.json';

interface OptionButtonProps {
  option: string | number;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  disabled?: boolean;
  numberFormat: NumberFormat;
}

export function OptionButton({
  option,
  isSelected,
  isCorrect,
  isWrong,
  onClick,
  disabled,
  numberFormat,
}: OptionButtonProps) {
  const getButtonStyle = () => {
    if (isCorrect) {
      return `${styles.buttons.option} ${styles.buttons.optionCorrect} animate-bounce-in`;
    }
    if (isWrong) {
      return `${styles.buttons.option} ${styles.buttons.optionWrong} animate-shake`;
    }
    if (isSelected) {
      return `${styles.buttons.option} ${styles.buttons.optionSelected}`;
    }
    return `${styles.buttons.option} ${styles.buttons.optionDefault}`;
  };

  const displayValue =
    typeof option === 'number' ? formatNumber(option, numberFormat) : option;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonStyle()}
    >
      {displayValue}
    </button>
  );
}

export default OptionButton;

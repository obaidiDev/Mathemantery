import type { KeyboardEvent } from 'react';
import styles from '../../config/styles.json';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'number';
  className?: string;
  autoFocus?: boolean;
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  placeholder = '',
  disabled = false,
  type = 'text',
  className = '',
  autoFocus = false,
}: TextInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`${styles.inputs.text} ${className}`}
      dir="rtl"
    />
  );
}

export default TextInput;

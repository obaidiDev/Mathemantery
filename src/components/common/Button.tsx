import type { ReactNode } from 'react';
import styles from '../../config/styles.json';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'skip' | 'icon';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = {
    primary: styles.buttons.primary,
    secondary: styles.buttons.secondary,
    skip: styles.buttons.skip,
    icon: styles.buttons.icon,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;

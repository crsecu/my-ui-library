import { type LabelHTMLAttributes, type ReactNode } from 'react';
import styles from './Label.module.css';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  htmlFor: string;
  disabled?: boolean;
}

export const Label = ({ children, htmlFor, disabled, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={`${styles.label} ${disabled ? styles.disabled : ''}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

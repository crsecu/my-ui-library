import { type LabelHTMLAttributes, type ReactNode } from 'react';
import styles from './Label.module.css';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: ReactNode;
}

export const Label = ({ children, htmlFor, ...props }: LabelProps) => {
  return (
    <label {...props} className={styles.label} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

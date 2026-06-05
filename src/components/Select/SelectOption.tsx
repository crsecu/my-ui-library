import styles from './Select.module.css';
import type { MouseEventHandler } from 'react';

export interface Option {
  value: string;
  label: string;
}
export interface SelectOptionProps {
  option: Option;
  disabled?: boolean;
  key: number;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const SelectOption = ({ option, onClick, ...props }: SelectOptionProps) => {
  return (
    <div className={styles.option} onClick={onClick}>
      {option.label}
    </div>
  );
};
